const formidable = require('formidable');
const { uploadToB2 } = require('../utils/b2.js');

module.exports = async function (req, res) {
  if (req.method !== 'POST') {
    return res.status(405).send('Method Not Allowed');
  }

  const form = formidable({ multiples: false });

  form.parse(req, async (err, fields, files) => {
    if (err) {
      console.error('Form parse error:', err);
      return res.status(500).send('Error parsing the form');
    }

    try {
      const file = files.file;
      const result = await uploadToB2(file);
      res.status(200).json({ url: result.downloadUrl });
    } catch (error) {
      console.error('Upload error:', error);
      res.status(500).send('Failed to upload file');
    }
  });
};
