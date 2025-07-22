import { S3 } from 'aws-sdk';

export default async function handler(req, res) {
  if (req.method !== 'POST') {
    return res.status(405).json({ error: 'Method not allowed' });
  }

  const s3 = new S3({
    endpoint: process.env.BACKBLAZE_ENDPOINT,
    accessKeyId: process.env.BACKBLAZE_KEY_ID,
    secretAccessKey: process.env.BACKBLAZE_APPLICATION_KEY,
    signatureVersion: 'v4',
  });

  const { filename, contentType } = req.body;
  if (!filename || !contentType) {
    return res.status(400).json({ error: 'Filename and contentType required' });
  }

  try {
    const params = {
      Bucket: process.env.BACKBLAZE_BUCKET_NAME,
      Key: `uploads/${Date.now()}_${filename}`,
      ContentType: contentType,
      Expires: 60, // URL expires in 60 seconds
    };

    const signedUrl = await s3.getSignedUrlPromise('putObject', params);
    res.status(200).json({ signedUrl });
  } catch (error) {
    console.error('Error generating signed URL:', error);
    res.status(500).json({ error: 'Failed to generate signed URL', details: error.message });
  }
}
