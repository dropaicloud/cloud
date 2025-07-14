import B2 from 'backblaze-b2';
import formidable from 'formidable';
import fs from 'fs';
import stats from '../utils/stats.js';

export const config = {
  api: {
    bodyParser: false,
  },
};

export default async function handler(req, res) {
  if (req.method !== 'POST') {
    return res.status(405).json({ error: 'Method Not Allowed' });
  }

  const form = new formidable.IncomingForm();

  form.parse(req, async (err, fields, files) => {
    if (err || !files.file) {
      return res.status(400).json({ error: 'File upload failed' });
    }

    const b2 = new B2({
      applicationKeyId: process.env.B2_KEY_ID,
      applicationKey: process.env.B2_APP_KEY,
    });

    await b2.authorize();

    const fileStream = fs.createReadStream(files.file[0].filepath);
    const timestamp = `${Date.now()}_${files.file[0].originalFilename}`;

    const uploadUrl = await b2.getUploadUrl({ bucketId: process.env.B2_BUCKET_ID });

    await b2.uploadFile({
      uploadUrl: uploadUrl.data.uploadUrl,
      uploadAuthToken: uploadUrl.data.authorizationToken,
      fileName: timestamp,
      data: fileStream,
    });

    const fileUrl = `https://f002.backblazeb2.com/file/${process.env.B2_BUCKET_NAME}/${encodeURIComponent(timestamp)}`;
    stats.record('uploads');

    res.status(200).json({ url: fileUrl });
  });
}
