import { useState } from 'react';

export default function Home() {
  const [file, setFile] = useState(null);
  const [message, setMessage] = useState('');
  const [fileUrl, setFileUrl] = useState('');

  const handleFileChange = (e) => {
    setFile(e.target.files[0]);
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    if (!file) {
      setMessage('Please select a file');
      return;
    }

    try {
      // Get presigned URL
      const res = await fetch('/api/upload', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ filename: file.name, contentType: file.type }),
      });
      const { signedUrl } = await res.json();

      if (!res.ok) {
        setMessage('Failed to get upload URL');
        return;
      }

      // Upload file to Backblaze
      await fetch(signedUrl, {
        method: 'PUT',
        body: file,
        headers: { 'Content-Type': file.type },
      });

      setMessage('File uploaded successfully');
      setFileUrl(signedUrl.split('?')[0]); // Clean URL
    } catch (error) {
      console.error('Upload error:', error);
      setMessage('Failed to upload file: ' + error.message);
    }
  };

  return (
    <div style={{ padding: '20px', maxWidth: '600px', margin: 'auto' }}>
      <h1>DropAI File Upload</h1>
      <form onSubmit={handleSubmit}>
        <input type="file" onChange={handleFileChange} />
        <button type="submit" disabled={!file}>Upload</button>
      </form>
      {message && <p>{message}</p>}
      {fileUrl && (
        <p>
          File uploaded! Access it <a href={fileUrl} target="_blank">here</a>.
        </p>
      )}
    </div>
  );
}
