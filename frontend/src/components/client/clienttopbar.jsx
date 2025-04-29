const TopBar = ({ sidebarOpen, setSidebarOpen, client }) => {
    return (
      <div style={{
        height: "60px",
        background: "#2563eb",
        color: "white",
        display: "flex",
        alignItems: "center",
        justifyContent: "space-between",
        padding: "0 20px"
      }}>
        <h1 style={{ fontSize: "22px" }}>Client Dashboard</h1>
        <div style={{ display: "flex", alignItems: "center" }}>
          <span style={{ marginRight: "15px" }}>Welcome, {client?.name || "Client"}!</span>
          <button style={{
            padding: "8px 12px",
            border: "none",
            borderRadius: "5px",
            backgroundColor: "white",
            color: "#2563eb",
            cursor: "pointer",
            fontSize: "16px",
            transition: "0.3s"
          }}
          onMouseEnter={(e) => e.currentTarget.style.backgroundColor = "#1e3a8a"}
          onMouseLeave={(e) => e.currentTarget.style.backgroundColor = "white"}
          >
            Profile
          </button>
        </div>
      </div>
    );
  };
  
  export default TopBar;
  