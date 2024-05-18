const mammoth = require('mammoth');

const fs = require('fs');
const path = require('path');
// Import GoogleAIFileManager from the correct path
const { GoogleAIFileManager } = require('@google/generative-ai/files');

// Define the async function to test the file upload
export async function uploadFile(file: Express.Multer.File, apiKey: string) {
  // Initialize GoogleAIFileManager with your API_KEY
  const fileManager = new GoogleAIFileManager(apiKey);
  const { buffer } = file;
  const result = await mammoth.convertToHtml({ buffer: buffer });
  //và thực hiện ghi vào file html path.join(__dirname, 'output.html')
  await fs.writeFileSync(path.join(__dirname, 'output.html'), result.value);
  // Upload the file and specify a display name
  const uploadResult = await fileManager.uploadFile(
    path.join(__dirname, 'output.html'),
    {
      mimeType: 'text/html',
      displayName: 'Documents',
    },
  );
  const getResult = await fileManager.getFile(uploadResult.file.name);
  return {
    file: getResult.mimeType,
    uri: getResult.uri,
  };
}
