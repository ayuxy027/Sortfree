// Interfaces for data structures
interface CellData {
  text: string;
  words: number;
}

interface ProcessedTableData {
  headers: string[];
  chunks: string[][][];
  totalChunks: number;
}

interface DataMetadata {
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
}

interface ProcessData {
  metadata: DataMetadata;
  data: CellData[][] | string;
}

interface BackgroundMessageRequest {
  action: string;
  data?: ProcessData;
  userPrompt?: string;
}

interface APIResponse {
  candidates?: Array<{
    content?: {
      parts?: Array<{
        text?: string;
      }>;
    };
  }>;
  error?: {
    message?: string;
  };
}

// Utility functions for content processing
const ContentProcessor = {
  processLargeTable(data: CellData[][]): ProcessedTableData {
    // Convert table data to a more manageable format
    const headers = data[0].map((cell: CellData) => cell.text);
    const rows = data.slice(1).map((row: CellData[]) => 
      row.map((cell: CellData) => cell.text)
    );

    // Group rows into chunks of 1000
    const chunkSize = 1000;
    const chunks: string[][][] = [];
    for (let i = 0; i < rows.length; i += chunkSize) {
      chunks.push(rows.slice(i, i + chunkSize));
    }

    return {
      headers,
      chunks,
      totalChunks: chunks.length
    };
  },

  generateTablePrompt(data: ProcessData, userPrompt: string, chunk?: string[][]): string {
    if (data.metadata.exceedsLimit) {
      const processed = this.processLargeTable(data.data as CellData[][]);
      const currentChunk = chunk || processed.chunks[0];
      
      return `As a data organization expert, create an HTML table with this data, sorted according to: "${userPrompt}"

Table Headers: ${JSON.stringify(processed.headers)}
Table Data: ${JSON.stringify(currentChunk)}

Requirements:
1. Return ONLY valid HTML table code
2. Include <table>, <thead>, and <tbody> tags
3. Use <th> tags for headers in <thead>
4. Use <td> tags for data in <tbody>
5. Sort/organize according to the criteria
6. Preserve all data fields
7. No text or elements outside the table

Example format:
<table>
  <thead>
    <tr><th>Header1</th><th>Header2</th></tr>
  </thead>
  <tbody>
    <tr><td>Data1</td><td>Data2</td></tr>
  </tbody>
</table>`;
    }

    return `As a data organization expert, create an HTML table with this data, sorted according to: "${userPrompt}"

Table Data: ${JSON.stringify(data.data)}

Requirements:
1. Return ONLY valid HTML table code
2. Include <table>, <thead>, and <tbody> tags
3. Use <th> tags for headers in <thead>
4. Use <td> tags for data in <tbody>
5. Sort/organize according to the criteria
6. Preserve all data fields
7. No text or elements outside the table

Example format:
<table>
  <thead>
    <tr><th>Header1</th><th>Header2</th></tr>
  </thead>
  <tbody>
    <tr><td>Data1</td><td>Data2</td></tr>
  </tbody>
</table>`;
  },

  generateTextPrompt(data: ProcessData, userPrompt: string): string {
    return `As a content organization expert, create semantic HTML with this content, organized according to: "${userPrompt}"

Content: ${data.data}

Requirements:
1. Return ONLY valid HTML
2. Use semantic elements (<section>, <article>, <h1>-<h6>, <p>, etc.)
3. Create clear sections and hierarchy
4. Sort/organize according to the criteria
5. No explanatory text outside the content
6. Include all original content`;
  },

  async callAPI(promptText: string): Promise<string> {
    const API_KEY = '';
    const response = await fetch(
      `https://generativelanguage.googleapis.com/v1beta/models/gemini-1.5-flash:generateContent?key=${API_KEY}`,
      {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          contents: [{ role: 'user', parts: [{ text: promptText }] }],
          generationConfig: {
            temperature: 0.2,
            topK: 40,
            topP: 0.95,
            maxOutputTokens: 8192,
          },
        }),
      }
    );

    if (!response.ok) {
      const error = await response.json().catch(() => ({})) as APIResponse;
      throw new Error(error.error?.message || 'API request failed');
    }

    const result = await response.json() as APIResponse;
    return result.candidates?.[0]?.content?.parts?.[0]?.text || '';
  },

  validateTableHTML(html: string): boolean {
    // Check for basic table structure
    const hasTable = html.includes('<table') && html.includes('</table>');
    const hasThead = html.includes('<thead') && html.includes('</thead>');
    const hasTbody = html.includes('<tbody') && html.includes('</tbody>');
    const hasHeaders = html.includes('<th') && html.includes('</th>');
    const hasData = html.includes('<td') && html.includes('</td>');

    return hasTable && hasThead && hasTbody && hasHeaders && hasData;
  },

  async processLargeTableContent(data: ProcessData, userPrompt: string): Promise<string> {
    const processed = this.processLargeTable(data.data as CellData[][]);
    let combinedContent = '';

    for (let i = 0; i < processed.chunks.length; i++) {
              const chunkPrompt = this.generateTablePrompt(data, userPrompt, processed.chunks[i]);
      const chunkContent = await this.callAPI(chunkPrompt);
      
      // Validate and clean table HTML
      if (!this.validateTableHTML(chunkContent)) {
        throw new Error('Invalid table format in chunk ' + (i + 1));
      }

      if (i === 0) {
        // Keep the full table structure for the first chunk
        combinedContent = chunkContent;
      } else {
        // Extract only tbody rows for subsequent chunks
        const bodyContent = chunkContent.match(/<tbody[^>]*>([\s\S]*?)<\/tbody>/i);
        if (bodyContent && bodyContent[1]) {
          // Insert new rows before the closing tbody tag
          combinedContent = combinedContent.replace('</tbody>', 
            `${bodyContent[1]}</tbody>`);
        }
      }
    }

    return combinedContent;
  },

  generateHTML(content: string, data: ProcessData, userPrompt: string): string {
    const { styles, sourceUrl, title } = data.metadata;
    
    return `<!DOCTYPE html>
<html lang="en">
<head>
    <meta charset="UTF-8">
    <meta name="viewport" content="width=device-width, initial-scale=1.0">
    <link rel="icon" type="image/svg+xml" href="data:image/svg+xml,<svg xmlns='http://www.w3.org/2000/svg' viewBox='0 0 24 24' fill='currentColor'><path d='M3 7c0-1.1.9-2 2-2h14c1.1 0 2 .9 2 2v2c0 1.1-.9 2-2 2h-14c-1.1 0-2-.9-2-2v-2zm0 8c0-1.1.9-2 2-2h14c1.1 0 2 .9 2 2v2c0 1.1-.9 2-2 2h-14c-1.1 0-2-.9-2-2v-2z'/></svg>" />
    <title>SortFree - ${title}</title>
    <style>
        :root {
            --primary-color: #2563eb;
            --bg-color: ${styles.backgroundColor || '#f8fafc'};
            --text-color: ${styles.color || '#1e293b'};
            --card-bg: white;
            --border-color: rgba(0,0,0,0.1);
            --hover-bg: rgba(0,0,0,0.02);
        }
        
        @media (prefers-color-scheme: dark) {
            :root {
                --card-bg: #1e293b;
                --bg-color: #0f172a;
                --text-color: #e2e8f0;
                --border-color: rgba(255,255,255,0.1);
                --hover-bg: rgba(255,255,255,0.02);
            }
        }
        
        body {
            font-family: ${styles.fontFamily || 'system-ui, -apple-system, sans-serif'};
            line-height: 1.5;
            color: var(--text-color);
            background: var(--bg-color);
            margin: 0;
            padding: 0;
        }
        
        .navbar {
            background: var(--card-bg);
            border-bottom: 1px solid var(--border-color);
            padding: 1rem 0;
            box-shadow: 0 1px 3px rgba(0, 0, 0, 0.05);
        }

        .nav-content {
            max-width: 1200px;
            margin: 0 auto;
            padding: 0 1rem;
            display: flex;
            align-items: center;
            justify-content: space-between;
        }

        .brand {
            display: flex;
            align-items: center;
            gap: 0.5rem;
            text-decoration: none;
            color: var(--text-color);
            font-weight: 600;
        }

        .source-link {
            color: var(--primary-color);
            text-decoration: none;
            font-size: 0.875rem;
            padding: 0.5rem 1rem;
            border-radius: 0.5rem;
            background: var(--hover-bg);
            transition: all 0.2s;
        }

        .source-link:hover {
            background: var(--hover-bg);
            transform: translateY(-1px);
        }
        
        .container {
            max-width: 1200px;
            margin: 2rem auto;
            padding: 0 1rem;
        }
        
        .content-card {
            background: var(--card-bg);
            padding: 2rem;
            border-radius: 1rem;
            box-shadow: 0 4px 6px rgba(0, 0, 0, 0.05);
        }
        
        .header {
            margin-bottom: 2rem;
            padding-bottom: 1rem;
            border-bottom: 1px solid var(--border-color);
        }
        
        .prompt {
            color: #64748b;
            font-size: 0.875rem;
            margin-bottom: 1.5rem;
            padding: 0.5rem 1rem;
            background: var(--hover-bg);
            border-radius: 0.5rem;
            display: inline-block;
        }
        
        table {
            width: 100%;
            border-collapse: collapse;
            margin: 1rem 0;
            font-size: 0.875rem;
        }
        
        th, td {
            padding: 0.75rem 1rem;
            text-align: left;
            border: 1px solid var(--border-color);
        }
        
        th {
            background: var(--hover-bg);
            font-weight: 600;
            white-space: nowrap;
        }
        
        tr:nth-child(even) {
            background: var(--hover-bg);
        }
        
        tr:hover {
            background: var(--hover-bg);
        }
        
        a {
            color: var(--primary-color);
            text-decoration: none;
            transition: all 0.2s;
        }
        
        a:hover {
            text-decoration: underline;
            opacity: 0.9;
        }

        @media (max-width: 768px) {
            .container {
                padding: 1rem;
            }
            
            .content-card {
                padding: 1rem;
            }
            
            table {
                display: block;
                overflow-x: auto;
                white-space: nowrap;
            }
        }
    </style>
</head>
<body>
    <nav class="navbar">
        <div class="nav-content">
            <a href="/" class="brand">
                <svg width="20" height="20" viewBox="0 0 24 24" fill="currentColor">
                    <path d="M3 7c0-1.1.9-2 2-2h14c1.1 0 2 .9 2 2v2c0 1.1-.9 2-2 2h-14c-1.1 0-2-.9-2-2v-2zm0 8c0-1.1.9-2 2-2h14c1.1 0 2 .9 2 2v2c0 1.1-.9 2-2 2h-14c-1.1 0-2-.9-2-2v-2z"/>
                </svg>
                SortFree
            </a>
            <a href="${sourceUrl}" class="source-link" target="_blank">View Original →</a>
        </div>
    </nav>
    <div class="container">
        <div class="content-card">
            <div class="header">
                <h1>${title}</h1>
                <div class="prompt">Organized by: ${userPrompt}</div>
            </div>
            ${content}
        </div>
    </div>
</body>
</html>`;
  }
};

async function processContent(data: ProcessData, userPrompt: string, retryCount: number = 0): Promise<string> {
  const MAX_RETRIES = 3;

  try {
    if (!data?.data) {
      throw new Error('Invalid data format');
    }

    let formattedContent: string;

    if (data.metadata.hasTable && data.metadata.exceedsLimit) {
      // Process large table in chunks
      formattedContent = await ContentProcessor.processLargeTableContent(data, userPrompt);
    } else {
      // Process normal content or small tables
      const apiPrompt = data.metadata.hasTable
        ? ContentProcessor.generateTablePrompt(data, userPrompt)
        : ContentProcessor.generateTextPrompt(data, userPrompt);

      formattedContent = await ContentProcessor.callAPI(apiPrompt);
    }

    if (!formattedContent || formattedContent.trim().length < 100) {
      if (retryCount < MAX_RETRIES) {
        console.log(`Retrying due to invalid content (attempt ${retryCount + 1})`);
        return processContent(data, userPrompt, retryCount + 1);
      }
      throw new Error('Generated content is invalid or too short');
    }

    // Validate table content if necessary
    if (data.metadata.hasTable && !ContentProcessor.validateTableHTML(formattedContent)) {
      if (retryCount < MAX_RETRIES) {
        return processContent(data, userPrompt, retryCount + 1);
      }
      throw new Error('Invalid table format received');
    }

    // Generate final HTML
    return ContentProcessor.generateHTML(formattedContent, data, userPrompt);
  } catch (error) {
    if (retryCount < MAX_RETRIES) {
      console.log(`Processing failed, retrying (attempt ${retryCount + 1}): ${error instanceof Error ? error.message : 'Unknown error'}`);
      return processContent(data, userPrompt, retryCount + 1);
    }
    throw new Error(`Failed to process content: ${error instanceof Error ? error.message : 'Unknown error'}`);
  }
}

// Message handler
chrome.runtime.onMessage.addListener((request: BackgroundMessageRequest, sender: chrome.runtime.MessageSender, sendResponse: (response?: any) => void): boolean => {
  if (request.action === 'generateSortedContent') {
    if (!request.data || !request.userPrompt) {
      sendResponse({ error: 'Missing required data or prompt' });
      return false;
    }

    processContent(request.data, request.userPrompt)
      .then((html: string): void => {
        if (!html || html.trim().length < 100) {
          sendResponse({ error: 'Generated content is empty or invalid' });
          return;
        }
        chrome.tabs.create({
          url: 'data:text/html,' + encodeURIComponent(html),
        });
        sendResponse({ success: true });
      })
      .catch((error: Error): void => {
        console.error('Processing error:', error);
        sendResponse({ error: error.message });
      });
    return true;
  }
  return false;
});
