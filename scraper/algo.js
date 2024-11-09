// tableProcessor.js

const cheerio = require('cheerio');
const _ = require('lodash');
const htmlMinifier = require('html-minifier');
const sanitizeHtml = require('sanitize-html');
const stableStringify = require('fast-json-stable-stringify');
const fs = require('fs').promises;
const path = require('path');

class HTMLTableProcessor {
    constructor(options = {}) {
        this.options = {
            maxOutputChars: 5000, // Increased for more comprehensive output
            maxRows: 100,        // Increased max rows
            outputPath: './processed', // Default output directory
            minifyOptions: {
                collapseWhitespace: true,
                removeComments: true,
                removeScripts: true,
                removeStyles: true,
                removeTagWhitespace: true,
                removeEmptyAttributes: true,
                removeRedundantAttributes: true
            },
            sanitizeOptions: {
                allowedTags: ['table', 'thead', 'tbody', 'tr', 'td', 'th'],
                allowedAttributes: {
                    'td': ['colspan', 'rowspan'],
                    'th': ['colspan', 'rowspan']
                },
                textFilter: function(text) {
                    return text.replace(/[\r\n\t]+/g, ' ').trim();
                }
            },
            ...options
        };
    }

    cleanText(text) {
        return _.chain(text)
            .trim()
            .replace(/\s+/g, ' ')
            .replace(/[^\w\s,.()-]/g, '')
            .replace(/\s{2,}/g, ' ')
            .thru(cleaned => {
                // Additional cleaning for common issues
                return cleaned
                    .replace(/\u00A0/g, ' ')  // Replace non-breaking spaces
                    .replace(/[""'']/g, '"')  // Normalize quotes
                    .replace(/[–—]/g, '-');   // Normalize dashes
            })
            .value();
    }

    async ensureOutputDirectory(outputPath) {
        try {
            await fs.mkdir(outputPath, { recursive: true });
        } catch (error) {
            console.error(`Error creating output directory: ${error.message}`);
            throw error;
        }
    }

    extractTableData($, $table) {
        const rows = [];
        const headerCells = new Set();
        
        // First pass: collect header information
        $table.find('th').each((_, cell) => {
            headerCells.add($(cell).text().trim().toLowerCase());
        });

        // Process rows
        $table.find('tr').each((rowIndex, row) => {
            if (rowIndex >= this.options.maxRows) return false;
            
            const rowData = [];
            const $row = $(row);
            
            // Handle both td and th cells
            $row.find('td, th').each((_, cell) => {
                const $cell = $(cell);
                let cellText = $cell.text();
                
                // Handle colspan and rowspan
                const colspan = parseInt($cell.attr('colspan')) || 1;
                const rowspan = parseInt($cell.attr('rowspan')) || 1;
                
                // Collect nested content
                const nestedContent = [];
                $cell.find('*').each((_, el) => {
                    const $el = $(el);
                    if ($el.is('a')) {
                        const href = $el.attr('href');
                        const text = $el.text().trim();
                        if (href && text && href !== text) {
                            nestedContent.push(`${text} (${href})`);
                        }
                    }
                    if ($el.is('img')) {
                        const alt = $el.attr('alt');
                        const src = $el.attr('src');
                        if (alt || src) {
                            nestedContent.push(`[Image: ${alt || src}]`);
                        }
                    }
                });
                
                // Combine text with nested content
                if (nestedContent.length > 0) {
                    cellText = `${cellText.trim()} ${nestedContent.join(' ')}`;
                }
                
                const cleanedText = this.cleanText(cellText);
                if (cleanedText) {
                    // Handle colspan by repeating the cell value
                    for (let i = 0; i < colspan; i++) {
                        rowData.push(cleanedText);
                    }
                }
            });
            
            if (rowData.length > 0) {
                rows.push(rowData);
            }
        });
        
        return rows;
    }

    async processFile(inputPath) {
        try {
            console.log(`Processing file: ${inputPath}`);
            const htmlContent = await fs.readFile(inputPath, 'utf-8');
            
            // Process the HTML
            const result = await this.condense(htmlContent);
            
            // Generate output filename
            const baseName = path.basename(inputPath, '.html');
            const outputPath = path.join(this.options.outputPath, `${baseName}_processed.json`);
            
            // Ensure output directory exists
            await this.ensureOutputDirectory(this.options.outputPath);
            
            // Write the result
            await fs.writeFile(outputPath, result, 'utf-8');
            console.log(`Processing complete. Output saved to: ${outputPath}`);
            
            return {
                success: true,
                outputPath,
                result: JSON.parse(result)
            };
            
        } catch (error) {
            console.error(`Error processing file: ${error.message}`);
            return {
                success: false,
                error: error.message,
                inputPath
            };
        }
    }

    async condense(htmlContent) {
        try {
            const minifiedHtml = htmlMinifier.minify(htmlContent, this.options.minifyOptions);
            const sanitizedHtml = sanitizeHtml(minifiedHtml, this.options.sanitizeOptions);
            
            const $ = cheerio.load(sanitizedHtml, {
                decodeEntities: true,
                normalizeWhitespace: true
            });
            
            const allTableData = [];
            $('table').each((_, table) => {
                const tableData = this.extractTableData($, $(table));
                allTableData.push(...tableData);
            });
            
            const processedData = {
                metadata: {
                    processedAt: new Date().toISOString(),
                    rowCount: allTableData.length,
                    tableCount: $('table').length
                },
                data: allTableData
            };
            
            return stableStringify(processedData, { space: 2 });
            
        } catch (error) {
            return stableStringify({
                error: error.message,
                timestamp: new Date().toISOString()
            }, { space: 2 });
        }
    }
}

// Command-line execution
if (require.main === module) {
    // Helper function to run the processor
    const runProcessor = async (inputPath) => {
        const processor = new HTMLTableProcessor({
            outputPath: './processed'  // Output will go to ./processed directory
        });
        
        try {
            const result = await processor.processFile(inputPath);
            if (result.success) {
                console.log('Processing completed successfully!');
            } else {
                console.error('Processing failed:', result.error);
            }
        } catch (error) {
            console.error('Error:', error.message);
        }
    };

    // Get input file path from command line or use default
    const inputPath = process.argv[2] || './mock.html';
    runProcessor(inputPath);
}

module.exports = HTMLTableProcessor;