


import React, { useState, useEffect } from "react";
import axios from "axios";
import "bootstrap/dist/css/bootstrap.min.css";

const API_URL = "http://localhost:5004/api/images";

const DailyLogs = () => {
  const [media, setMedia] = useState({
    progress: [],
    bills: [],
    completed: []
  });

  useEffect(() => {
    fetchMedia();
  }, []);

  const fetchMedia = async () => {
    try {
      const categories = ["progress", "bills", "completed"];
      const mediaData = { progress: [], bills: [], completed: [] };

      for (const category of categories) {
        const response = await axios.get(`${API_URL}/category/${category}`);
        if (response.data && response.data.images) {
          mediaData[category] = response.data.images;
        }
      }

      setMedia(mediaData);
    } catch (error) {
      console.error("Error fetching media:", error);
    }
  };

  return (
    <div style={styles.container}>
      <h2 style={styles.heading}>Daily Logs</h2>
      <div style={styles.wrapper}>
        {["progress", "bills", "completed"].map((category) => (
          <UploadSection
            key={category}
            title={
              category === "progress"
                ? "Progress Media"
                : category === "bills"
                ? "Bill Uploads"
                : "Completed Work Media"
            }
            mediaList={media[category] || []}
            setMedia={(updatedList) => {
              setMedia((prev) => ({
                ...prev,
                [category]: updatedList,
              }));
            }}
            category={category}
          />
        ))}
      </div>
    </div>
  );
};

const UploadSection = ({ title, mediaList, setMedia, category }) => {
  const [selectedFile, setSelectedFile] = useState(null);
  const [uploading, setUploading] = useState(false);

  const handleUpload = async () => {
    if (!selectedFile) {
      alert("Please select a file first!");
      return;
    }

    const formData = new FormData();
    formData.append("image", selectedFile);
    formData.append("category", category);

    setUploading(true);

    try {
      const response = await axios.post(`${API_URL}/upload`, formData, {
        headers: { "Content-Type": "multipart/form-data" },
      });

      if (response.data.success) {
        setMedia([...mediaList, { filename: response.data.image.filename }]);
        setSelectedFile(null);
      } else {
        alert("Image upload failed. Please try again.");
      }
    } catch (error) {
      console.error("Image upload failed:", error);
      alert("Upload failed. Check console for details.");
    } finally {
      setUploading(false);
    }
  };

  return (
    <div style={styles.section}>
      <h4>{title}</h4>
      <input
        type="file"
        onChange={(e) => setSelectedFile(e.target.files[0])}
        style={styles.fileInput}
      />
      <button onClick={handleUpload} style={styles.uploadButton} disabled={uploading}>
        {uploading ? "Uploading..." : "Upload"}
      </button>

      <div style={styles.mediaGrid}>
        {mediaList.length > 0 ? (
          mediaList.map((media, index) => (
            <div key={index} style={styles.imageContainer}>
              <img
                src={`http://localhost:5004/uploads/${media.filename}`}
                alt="Uploaded"
                style={styles.image}
                onError={(e) => {
                  e.target.src = "/default-placeholder.png"; // ✅ Local fallback image
                }}
              />
            </div>
          ))
        ) : (
          <p>No media uploaded yet.</p>
        )}
      </div>
    </div>
  );
};

// ✅ Styles
const styles = {
  container: {
    width: "100%",
    margin: "0",
    padding: "20px",
    background: "linear-gradient(to right, rgb(15, 2, 80), rgb(70, 2, 19))",
    minHeight: "100vh",
    display: "flex",
    flexDirection: "column",
    alignItems: "center"
  },
  heading: {
    textAlign: "center",
    marginBottom: "20px",
    color: "#fff"
  },
  wrapper: {
    display: "flex",
    flexDirection: "column",
    gap: "20px",
    width: "90%",
    maxWidth: "800px"
  },
  section: {
    width: "100%",
    maxWidth: "600px",
    textAlign: "center",
    padding: "15px",
    borderRadius: "15px",
    background: "rgba(255, 255, 255, 0.2)",
    backdropFilter: "blur(10px)",
    boxShadow: "0 4px 8px rgba(0, 0, 0, 0.2)",
    color: "#fff",
    margin: "0 auto"
  },
  fileInput: {
    display: "block",
    margin: "10px auto",
    padding: "5px",
    borderRadius: "5px",
    width: "80%"
  },
  uploadButton: {
    padding: "8px 15px",
    margin: "10px",
    borderRadius: "8px",
    border: "none",
    background: "#007bff",
    color: "white",
    cursor: "pointer",
    transition: "0.3s"
  },
  mediaGrid: {
    display: "flex",
    gap: "10px",
    padding: "10px",
    justifyContent: "center",
    flexWrap: "wrap"
  },
  imageContainer: {
    width: "120px",
    height: "160px",
    borderRadius: "15px",
    overflow: "hidden",
    transition: "all 0.4s ease-in-out",
    display: "flex",
    justifyContent: "center",
    alignItems: "center",
    cursor: "pointer",
    boxShadow: "0 2px 10px rgba(0, 0, 0, 0.2)"
  },
  image: {
    width: "100%",
    height: "100%",
    objectFit: "cover",
    transition: "transform 0.4s ease-in-out"
  }
};

export default DailyLogs;
