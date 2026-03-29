import React from "react";

/**
 * ErrorBoundary Component
 * Catches rendering errors in child components
 * Displays fallback UI and logs errors
 */
class ErrorBoundary extends React.Component {
  constructor(props) {
    super(props);
    this.state = { 
      hasError: false, 
      error: null,
      errorInfo: null,
    };
  }

  static getDerivedStateFromError(error) {
    return { hasError: true, error };
  }

  componentDidCatch(error, errorInfo) {
    console.error("Error caught by ErrorBoundary:", error, errorInfo);
    this.setState({ errorInfo });
    // TODO: Log to error reporting service (e.g., Sentry, LogRocket)
  }

  handleReset = () => {
    this.setState({ hasError: false, error: null, errorInfo: null });
  };

  render() {
    if (this.state.hasError) {
      return (
        <div
          style={{
            padding: "2rem",
            textAlign: "center",
            minHeight: "100vh",
            display: "flex",
            flexDirection: "column",
            justifyContent: "center",
            alignItems: "center",
            backgroundColor: "#f5f5f5",
          }}
        >
          <div style={{ maxWidth: "500px" }}>
            <h1 style={{ fontSize: "2rem", marginBottom: "1rem" }}>
              ⚠️ Oops! Something went wrong
            </h1>
            
            <p 
              style={{ 
                color: "#d32f2f", 
                fontSize: "1rem",
                marginBottom: "1.5rem",
                padding: "1rem",
                backgroundColor: "#ffebee",
                borderRadius: "8px",
                wordWrap: "break-word",
              }}
            >
              {this.state.error?.message || "An unexpected error occurred"}
            </p>

            {process.env.NODE_ENV === "development" && this.state.errorInfo && (
              <details
                style={{
                  marginBottom: "1.5rem",
                  textAlign: "left",
                  backgroundColor: "#fff",
                  padding: "1rem",
                  borderRadius: "8px",
                  border: "1px solid #ddd",
                }}
              >
                <summary style={{ cursor: "pointer", fontWeight: "bold" }}>
                  Error Details (Development Only)
                </summary>
                <pre
                  style={{
                    marginTop: "1rem",
                    overflow: "auto",
                    fontSize: "0.85rem",
                    backgroundColor: "#f5f5f5",
                    padding: "1rem",
                    borderRadius: "4px",
                  }}
                >
                  {this.state.errorInfo.componentStack}
                </pre>
              </details>
            )}

            <div style={{ display: "flex", gap: "1rem", justifyContent: "center" }}>
              <button
                onClick={this.handleReset}
                style={{
                  padding: "0.75rem 1.5rem",
                  backgroundColor: "#2196f3",
                  color: "white",
                  border: "none",
                  borderRadius: "6px",
                  cursor: "pointer",
                  fontSize: "1rem",
                  fontWeight: "600",
                  transition: "background-color 0.3s ease",
                }}
                onMouseEnter={(e) => e.target.style.backgroundColor = "#1976d2"}
                onMouseLeave={(e) => e.target.style.backgroundColor = "#2196f3"}
              >
                Try Again
              </button>

              <button
                onClick={() => window.location.href = "/"}
                style={{
                  padding: "0.75rem 1.5rem",
                  backgroundColor: "#4caf50",
                  color: "white",
                  border: "none",
                  borderRadius: "6px",
                  cursor: "pointer",
                  fontSize: "1rem",
                  fontWeight: "600",
                  transition: "background-color 0.3s ease",
                }}
                onMouseEnter={(e) => e.target.style.backgroundColor = "#45a049"}
                onMouseLeave={(e) => e.target.style.backgroundColor = "#4caf50"}
              >
                Go Home
              </button>
            </div>
          </div>
        </div>
      );
    }

    return this.props.children;
  }
}

export default ErrorBoundary;
