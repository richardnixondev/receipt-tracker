import { useNavigate } from "react-router-dom";

const NotFound = () => {
  const navigate = useNavigate();

  return (
    <div style={{ textAlign: "center", marginTop: "50px" }}>
      <h1>Houston, we have a problem. 🚀 </h1>
      <p>The page you are looking for was not found.</p>
      <button 
        onClick={() => navigate("/")} 
        style={{ padding: "10px", fontSize: "16px", cursor: "pointer" }}
      >
        🔙 Back to home page
      </button>
    </div>
  );
};

export default NotFound;