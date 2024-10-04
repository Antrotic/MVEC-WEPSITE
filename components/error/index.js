import React, { Component } from "react";

class ErrorBoundary extends Component {
  constructor(props) {
    super(props);
    this.state = { hasError: false };
  }

  static getDerivedStateFromError(error) {
    // Update state so the next render will show the fallback UI.
    return { hasError: true };
  }

  componentDidCatch(error, errorInfo) {
    // You can also log the error to an error reporting service
    console.error(error, errorInfo);
  }

  render() {
    if (this.props.error) {
      // You can render any custom fallback UI here
      return (
        <div className="error-page">
          <h1>{this.props.text || "Something went wrong."}</h1>
          <p>{this.props.description || "Please try again later."}</p>
        </div>
      );
    }

    return this.props.children;
  }
}

export default ErrorBoundary;
