const mammoth = require('mammoth');
const path = require('path');

/**
 * Robust helper to parse PDF buffers with any version of pdf-parse
 */
const parsePdfSafe = async (buffer) => {
  const pdfModule = require('pdf-parse');
  
  if (typeof pdfModule === 'function') {
    const res = await pdfModule(buffer);
    return res.text;
  }
  
  if (pdfModule.default && typeof pdfModule.default === 'function') {
    const res = await pdfModule.default(buffer);
    return res.text;
  }

  if (pdfModule.PDFParse) {
    const parser = new pdfModule.PDFParse({ data: buffer });
    await parser.load();
    const text = await parser.getText();
    if (typeof parser.destroy === 'function') {
      await parser.destroy();
    }
    return text;
  }

  throw new Error('PDF parse method not identified.');
};

/**
 * Extracts plain text from a file buffer (PDF, DOCX, TXT)
 * @param {Buffer} buffer 
 * @param {string} originalname 
 * @param {string} mimetype 
 * @returns {Promise<string>}
 */
const extractTextFromBuffer = async (buffer, originalname = '', mimetype = '') => {
  const ext = path.extname(originalname).toLowerCase();

  try {
    if (ext === '.pdf' || mimetype === 'application/pdf') {
      let rawText = '';
      try {
        rawText = await parsePdfSafe(buffer);
      } catch (pdfErr) {
        console.warn('Standard PDF parse failed, attempting stream extraction fallback:', pdfErr.message);
        const rawStr = buffer.toString('latin1');
        const words = rawStr.match(/[A-Za-z0-9+#.-]{2,}/g) || [];
        const extracted = words.filter((w) => !['obj', 'endobj', 'stream', 'endstream', 'xref', 'trailer', 'startxref'].includes(w)).join(' ');
        if (extracted && extracted.length > 25) {
          rawText = extracted;
        } else {
          throw pdfErr;
        }
      }
      const text = cleanText(rawText);
      if (!text || text.length < 20) {
        throw new Error('Could not extract legible text from this PDF. It may be scanned or image-based.');
      }
      return text;
    }

    if (
      ext === '.docx' ||
      mimetype === 'application/vnd.openxmlformats-officedocument.wordprocessingml.document'
    ) {
      const result = await mammoth.extractRawText({ buffer });
      const text = cleanText(result.value);
      if (!text || text.length < 20) {
        throw new Error('Could not extract legible text from this DOCX file.');
      }
      return text;
    }

    if (ext === '.txt' || mimetype === 'text/plain') {
      const text = cleanText(buffer.toString('utf-8'));
      return text;
    }

    // Fallback: try PDF parse then DOCX
    try {
      const pdfText = await parsePdfSafe(buffer);
      const cleaned = cleanText(pdfText);
      if (cleaned.length > 20) return cleaned;
    } catch (_) {}

    try {
      const docxData = await mammoth.extractRawText({ buffer });
      const cleaned = cleanText(docxData.value);
      if (cleaned.length > 20) return cleaned;
    } catch (_) {}

    // Fallback: raw UTF-8 string
    const rawStr = buffer.toString('utf-8');
    const cleaned = cleanText(rawStr);
    if (cleaned.length > 30) {
      return cleaned;
    }

    throw new Error('Unsupported or unreadable file content. Please upload a standard text-based PDF or DOCX file.');
  } catch (error) {
    console.error('Text extraction error:', error.message);
    throw error;
  }
};

/**
 * Cleans and formats extracted raw text
 * @param {string} text 
 * @returns {string}
 */
const cleanText = (text) => {
  if (!text) return '';
  return text
    .replace(/\r\n/g, '\n')
    .replace(/\r/g, '\n')
    .replace(/[\x00-\x09\x0B-\x0C\x0E-\x1F\x7F]/g, ' ')
    .replace(/[ \t]+/g, ' ')
    .replace(/\n\s*\n\s*\n+/g, '\n\n')
    .trim();
};

module.exports = {
  extractTextFromBuffer,
  cleanText,
};
