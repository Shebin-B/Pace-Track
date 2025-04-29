import React, { useState, useEffect } from "react";
import axios from "axios";

const API_BASE_URL = "http://localhost:5004";

const DailyLogs = () => {
    const [media, setMedia] = useState({ progress: [], bills: [], completed: [] });
    const [selectedFiles, setSelectedFiles] = useState({ progress: null, bills: null, completed: null });
    const [hoveredIndex, setHoveredIndex] = useState({ progress: null, bills: null, completed: null });

    useEffect(() => {
        const fetchMedia = async () => {
            try {
                const categories = ["progress", "bills", "completed"];
                const mediaData = { progress: [], bills: [], completed: [] };

                for (const category of categories) {
                    const response = await axios.get(`${API_BASE_URL}/api/images/category/${category}`);
                    if (response.data && response.data.images) {
                        mediaData[category] = response.data.images;
                    }
                }
                setMedia(mediaData);
            } catch (error) {
                console.error("Error fetching media:", error);
            }
        };

        fetchMedia();
    }, []);

    const handleFileChange = (event, category) => {
        setSelectedFiles((prev) => ({ ...prev, [category]: event.target.files[0] }));
    };

    const handleUpload = async (category) => {
        if (!selectedFiles[category]) {
            alert(`Please select a file for ${category} upload.`);
            return;
        }

        const formData = new FormData();
        formData.append("image", selectedFiles[category]);

        try {
            const response = await axios.post(`${API_BASE_URL}/api/images/upload/${category}`, formData, {
                headers: { "Content-Type": "multipart/form-data" }
            });

            if (response.data.success) {
                alert(`${category} image uploaded successfully!`);
                setSelectedFiles((prev) => ({ ...prev, [category]: null }));
                window.location.reload();
            }
        } catch (error) {
            console.error(`Error uploading ${category} file:`, error);
            alert(`Failed to upload ${category} image.`);
        }
    };

    return (
        <div style={styles.container}>
            <h2 style={styles.heading}>Media Uploads</h2>

            <div style={styles.wrapper}>
                {["progress", "bills", "completed"].map((category) => (
                    <div key={category} style={styles.section}>
                        <h3>{category.charAt(0).toUpperCase() + category.slice(1)} Media</h3>
                        <input type="file" accept="image/*" onChange={(e) => handleFileChange(e, category)} style={styles.fileInput} />
                        <button onClick={() => handleUpload(category)} style={styles.uploadButton}>
                            Upload {category.charAt(0).toUpperCase() + category.slice(1)}
                        </button>

                        <div style={styles.mediaGrid}>
                            {media[category].length > 0 ? (
                                media[category].map((item, index) => (
                                    <div
                                        key={index}
                                        style={{
                                            ...styles.imageContainer,
                                            transform: hoveredIndex[category] === index ? "scale(1.1)" : "scale(0.85)",
                                            borderRadius: hoveredIndex[category] === index ? "12px" : "50px",
                                            transition: "transform 0.2s ease-out, border-radius 0.2s ease-out"
                                        }}
                                        onMouseEnter={() => setHoveredIndex((prev) => ({ ...prev, [category]: index }))}
                                        onMouseLeave={() => setHoveredIndex((prev) => ({ ...prev, [category]: null }))}
                                    >
                                        <img
                                            src={`${API_BASE_URL}${item.filepath}`}
                                            alt={item.filename}
                                            style={styles.image}
                                            onError={(e) => { e.target.src = "/placeholder-image.jpg"; }}
                                        />
                                    </div>
                                ))
                            ) : (
                                <p style={{ color: "#ddd", fontStyle: "italic" }}>No {category} media uploaded.</p>
                            )}
                        </div>
                    </div>
                ))}
            </div>
        </div>
    );
};

// ✅ **Faster Hover & Smooth UI**
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
        color: "#fff",
        fontSize: "28px",
        fontWeight: "bold"
    },
    wrapper: {
        display: "flex",
        flexDirection: "column",
        gap: "20px",
        width: "90%",
        maxWidth: "1200px"
    },
    section: {
        width: "100%",
        maxWidth: "900px",
        textAlign: "center",
        padding: "15px",
        borderRadius: "12px",
        background: "rgba(255, 255, 255, 0.1)",
        backdropFilter: "blur(6px)",
        boxShadow: "0 6px 12px rgba(0, 0, 0, 0.2)",
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
        padding: "12px 24px",
        margin: "10px",
        borderRadius: "10px",
        border: "none",
        background: "#007bff",
        color: "white",
        cursor: "pointer",
        transition: "background 0.2s ease-in-out, transform 0.15s ease-in-out",
        boxShadow: "0 4px 10px rgba(0, 0, 0, 0.3)"
    },
    mediaGrid: {
        display: "flex",
        gap: "15px",
        padding: "10px",
        justifyContent: "center",
        flexWrap: "wrap"
    },
    imageContainer: {
        width: "160px",
        height: "220px",
        borderRadius: "50px",
        overflow: "hidden",
        display: "flex",
        justifyContent: "center",
        alignItems: "center",
        cursor: "pointer",
        boxShadow: "0 4px 10px rgba(0, 0, 0, 0.3)",
        transform: "scale(0.85)",
        transition: "transform 0.2s ease-out, border-radius 0.2s ease-out"
    },
    image: {
        width: "100%",
        height: "100%",
        objectFit: "cover"
    }
};

export default DailyLogs;
