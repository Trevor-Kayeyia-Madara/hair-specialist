import { useState } from "react";

const useUpload = () => {
  const [uploading, setUploading] = useState(false);
  const [error, setError] = useState(null);
  const [fileUrl, setFileUrl] = useState("");

  const uploadFile = async (file) => {
    if (!file) return;

    setUploading(true);
    setError(null);

    try {
      // Simulating an upload process (replace with actual upload logic)
      const formData = new FormData();
      formData.append("file", file);

      // Example: Upload to a backend API
      const response = await fetch("https://your-api.com/upload", {
        method: "POST",
        body: formData,
      });

      if (!response.ok) {
        throw new Error("File upload failed");
      }

      const data = await response.json();
      setFileUrl(data.url); // Assuming the backend returns a file URL
    } catch (err) {
      setError(err.message);
    } finally {
      setUploading(false);
    }
  };

  return { uploadFile, uploading, error, fileUrl };
};

export default useUpload;
