const B2 = require('backblaze-b2');
const fs = require('fs');
const path = require('path');

const b2 = new B2({
  applicationKeyId: process.env.B2_KEY_ID,
  applicationKey: process.env.B2_APP_KEY,
});

const bucketName = process.env.B2_BUCKET_NAME;

async function uploadToB2(file) {
  await b2.authorize();

  const fileName = `${Date.now()}-${file.originalFilename}`;
  const fileData = fs.readFileSync(file.filepath);

  const uploadUrlResponse = await b2.getUploadUrl({ bucketId: process.env.B2_BUCKET_ID });

  const uploadResponse = await b2.uploadFile({
    uploadUrl: uploadUrlResponse.data.uploadUrl,
    uploadAuthToken: uploadUrlResponse.data.authorizationToken,
    fileName: fileName,
    data: fileData,
  });

  const downloadUrl = `https://f000.backblazeb2.com/file/${bucketName}/${fileName}`;

  return { downloadUrl };
}

module.exports = { uploadToB2 };
