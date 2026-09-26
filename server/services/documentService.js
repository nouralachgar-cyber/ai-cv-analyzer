const fs = require('fs');
const pdfParse = require('pdf-parse');
const mammoth = require('mammoth');
const Tesseract = require('tesseract.js');

const extractTextFromFile = async (filePath, mimeType) => {
  try {
    let extractedText = '';

    // 1. إذا كان الملف PDF
    if (mimeType === 'application/pdf') {
      const dataBuffer = fs.readFileSync(filePath);
      const data = await pdfParse(dataBuffer);
      extractedText = data.text;
    }
    // 2. إذا كان الملف Word (.docx)
    else if (
      mimeType ===
      'application/vnd.openxmlformats-officedocument.wordprocessingml.document'
    ) {
      const result = await mammoth.extractRawText({ path: filePath });
      extractedText = result.value;
    }
    // 3. إذا كان الملف صورة (OCR)
    else if (mimeType.startsWith('image/')) {
      const {
        data: { text },
      } = await Tesseract.recognize(filePath, 'eng');
      extractedText = text;
    }

    // تنظيف النص من الفراغات الزائدة
    return extractedText.replace(/\s+/g, ' ').trim();
  } catch (error) {
    console.error('خطأ أثناء استخراج النص:', error);
    throw new Error('فشل في قراءة واستخراج النص من الملف');
  }
};

module.exports = { extractTextFromFile };