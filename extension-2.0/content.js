// Check if the content script is already injected
if (!window.contentProcessorInitialized) {
  window.contentProcessorInitialized = true;

  class ContentExtractor {
    constructor() {
      this.maxRows = 100;
      this.wordLimit = 5000;
    }

    cleanText(text) {
      return text
        .trim()
        .replace(/\s+/g, ' ')
        .replace(/[^\w\s,.()-]/g, '')
        .replace(/\s{2,}/g, ' ')
        .replace(/\u00A0/g, ' ')
        .replace(/[""'']/g, '"')
        .replace(/[–—]/g, '-');
    }

    countWords(text) {
      return text.split(/\s+/).length;
    }

    extractTableData() {
      const tables = document.getElementsByTagName('table');
      if (tables.length === 0) return null;

      const allRows = [];
      let totalWords = 0;
      let exceedsLimit = false;

      Array.from(tables).forEach((table) => {
        const headerRow = [];
        const rows = table.getElementsByTagName('tr');

        // Process header row first
        const headerCells = rows[0]?.getElementsByTagName('th').length
          ? rows[0].getElementsByTagName('th')
          : rows[0]?.getElementsByTagName('td');

        if (headerCells) {
          Array.from(headerCells).forEach((cell) => {
            const text = this.cleanText(cell.textContent);
            headerRow.push({
              text,
              words: this.countWords(text)
            });
            totalWords += this.countWords(text);
          });
          allRows.push(headerRow);
        }

        // Process data rows
        Array.from(rows)
          .slice(1, this.maxRows)
          .forEach((row) => {
            const rowData = [];
            const cells = row.getElementsByTagName('td');

            Array.from(cells).forEach((cell) => {
              const text = this.cleanText(cell.textContent);
              rowData.push({
                text,
                words: this.countWords(text)
              });
              totalWords += this.countWords(text);
            });

            if (rowData.length > 0) {
              allRows.push(rowData);
            }
          });
      });

      return {
        rows: allRows,
        totalWords,
        exceedsLimit: totalWords > this.wordLimit
      };
    }

    extractPageContent() {
      const mainElements = document.querySelectorAll('main, article, [role="main"]');
      const container = mainElements.length ? mainElements[0] : document.body;
      const text = this.cleanText(container.innerText);
      return {
        text,
        totalWords: this.countWords(text),
        exceedsLimit: this.countWords(text) > this.wordLimit
      };
    }

    async process() {
      try {
        const tableData = this.extractTableData();
        const hasTable = tableData !== null;
        const contentData = this.extractPageContent();

        return {
          success: true,
          result: {
            metadata: {
              processedAt: new Date().toISOString(),
              hasTable,
              contentType: hasTable ? 'table' : 'text',
              exceedsLimit: hasTable ? tableData.exceedsLimit : contentData.exceedsLimit,
              totalWords: hasTable ? tableData.totalWords : contentData.totalWords,
              styles: this.extractStyles(),
              sourceUrl: window.location.href,
              title: document.title,
            },
            data: hasTable ? tableData.rows : contentData.text,
          },
        };
      } catch (error) {
        return {
          success: false,
          error: error.message,
        };
      }
    }

    extractStyles() {
      const styles = {};
      const computedStyle = window.getComputedStyle(document.body);
      styles.fontFamily = computedStyle.fontFamily;
      styles.backgroundColor = computedStyle.backgroundColor;
      styles.color = computedStyle.color;
      return styles;
    }
  }

  chrome.runtime.onMessage.addListener((request, sender, sendResponse) => {
    if (request.action === 'process') {
      const extractor = new ContentExtractor();
      extractor
        .process()
        .then((result) => {
          chrome.runtime.sendMessage(
            {
              action: 'generateSortedContent',
              data: result.result,
              prompt: request.prompt,
            },
            sendResponse
          );
        })
        .catch((error) => sendResponse({ error: error.message }));
      return true;
    }
  });
}