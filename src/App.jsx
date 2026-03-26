import { useEffect, useState } from "react";

function App() {
  const [data, setData] = useState("Loading...");

  useEffect(() => {
    // Handle sessionStorage redirect from 404.html for GitHub Pages
    if (typeof window !== "undefined" && typeof sessionStorage !== "undefined") {
      var redirect = sessionStorage.redirect;
      delete sessionStorage.redirect;
      if (redirect && redirect !== window.location.pathname) {
        window.history.replaceState(null, null, redirect);
      }
    }

    // Fetch backend data only if backend is available (localhost development)
    const backendUrl = process.env.NODE_ENV === "development" 
      ? "http://localhost:5000" 
      : "/api"; // Change to your production backend URL

    fetch(backendUrl, { mode: "cors" })
      .then(res => res.json())
      .then(res => {
        console.log(res);
        setData(res.message);
      })
      .catch(err => {
        console.log("Backend error:", err);
        // Don't block the app if backend is unavailable
        setData("App is working! (Backend unavailable)");
      });
  }, []);

  return (
    <div style={{ textAlign: "center", marginTop: "100px" }}>
      <h1>{data}</h1>
      <p style={{ color: "#666", fontSize: "14px" }}>
        GitHub Pages: {process.env.PUBLIC_URL}
      </p>
    </div>
  );
}

export default App;
