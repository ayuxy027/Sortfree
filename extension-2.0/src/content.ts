/// <reference types="chrome"/>

// Extend the global Window interface
interface WindowWithProcessor extends Window {
  contentProcessorInitialized?: boolean;
}

declare const window: WindowWithProcessor;

interface CellData {
  text: string;
  words: number;
}

interface TableData {
  rows: CellData[][];
  totalWords: number;
  exceedsLimit: boolean;
}

interface ContentData {
  text: string;
  totalWords: number;
  exceedsLimit: boolean;
}

interface ProcessResult {
  success: boolean;
  result?: {
    metadata: {
      processedAt: string;
      hasTable: boolean;
      contentType: 'table' | 'text';
      exceedsLimit: boolean;
      totalWords: number;
      styles: {
        fontFamily?: string;
        backgroundColor?: string;
        color?: string;
      };
      sourceUrl: string;
      title: string;
    };
    data: CellData[][] | string;
  };
  error?: string;
}

interface ContentMessageRequest {
  action: string;
  userPrompt?: string;
}

if (!window.contentProcessorInitialized) {
  window.contentProcessorInitialized = true;

  class ContentExtractor {
    private maxRows: number = 100;
    private wordLimit: number = 5000;

    private cleanText(text: string): string {
      return text
        .trim()
        .replace(/\s+/g, ' ')
        .replace(/[^\w\s,.()-]/g, '')
        .replace(/\s{2,}/g, ' ')
        .replace(/\u00A0/g, ' ')
        .replace(/[""'']/g, '"')
        .replace(/[–—]/g, '-');
    }

    private countWords(text: string): number {
      return text.split(/\s+/).length;
    }

    private extractTableData(): TableData | null {
      const tables = document.getElementsByTagName('table');
      if (tables.length === 0) return null;

      const allRows: CellData[][] = [];
      let totalWords = 0;
      let exceedsLimit = false;

      Array.from(tables).forEach((table: HTMLTableElement): void => {
        const headerRow: CellData[] = [];
        const rows = table.getElementsByTagName('tr');

        // Process header row first
        const headerCells = rows[0]?.getElementsByTagName('th').length
          ? rows[0].getElementsByTagName('th')
          : rows[0]?.getElementsByTagName('td');

        if (headerCells) {
          Array.from(headerCells).forEach((cell: HTMLTableCellElement): void => {
            const text = this.cleanText(cell.textContent || '');
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
          .forEach((row: HTMLTableRowElement): void => {
            const rowData: CellData[] = [];
            const cells = row.getElementsByTagName('td');

            Array.from(cells).forEach((cell: HTMLTableCellElement): void => {
              const text = this.cleanText(cell.textContent || '');
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

    private extractPageContent(): ContentData {
      const mainElements = document.querySelectorAll('main, article, [role="main"]');
      const container = mainElements.length ? mainElements[0] : document.body;
      const text = this.cleanText((container as HTMLElement).innerText || '');
      return {
        text,
        totalWords: this.countWords(text),
        exceedsLimit: this.countWords(text) > this.wordLimit
      };
    }

    private extractStyles(): { fontFamily?: string; backgroundColor?: string; color?: string } {
      const styles: { fontFamily?: string; backgroundColor?: string; color?: string } = {};
      const computedStyle = window.getComputedStyle(document.body);
      styles.fontFamily = computedStyle.fontFamily;
      styles.backgroundColor = computedStyle.backgroundColor;
      styles.color = computedStyle.color;
      return styles;
    }

    public async process(): Promise<ProcessResult> {
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
          error: error instanceof Error ? error.message : 'Unknown error occurred',
        };
      }
    }
  }

  chrome.runtime.onMessage.addListener((request: ContentMessageRequest, sender: chrome.runtime.MessageSender, sendResponse: (response?: any) => void): boolean => {
    if (request.action === 'process') {
      const extractor = new ContentExtractor();
      extractor
        .process()
        .then((result: ProcessResult): void => {
          chrome.runtime.sendMessage(
            {
              action: 'generateSortedContent',
              data: result.result,
              userPrompt: request.userPrompt,
            },
            sendResponse
          );
        })
        .catch((error: Error): void => sendResponse({ error: error.message }));
      return true;
    }
    return false;
  });
}

export {}; // Make this file a module