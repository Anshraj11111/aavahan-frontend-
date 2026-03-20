import React from 'react';

class ErrorBoundary extends React.Component {
  constructor(props) {
    super(props);
    this.state = { hasError: false, error: null, errorInfo: null };
  }

  static getDerivedStateFromError(error) {
    return { hasError: true };
  }

  componentDidCatch(error, errorInfo) {
    this.setState({
      error: error,
      errorInfo: errorInfo
    });
    
    console.error('React Error Boundary caught an error:', error, errorInfo);
  }

  render() {
    if (this.state.hasError) {
      return (
        <div className="min-h-screen pt-20 flex items-center justify-center">
          <div className="text-center max-w-md mx-auto px-4">
            <div className="glass p-8 rounded-2xl">
              <h2 className="text-2xl font-bold text-red-400 mb-4">Something went wrong</h2>
              <p className="text-white/80 mb-6">
                A React error occurred. This might be due to a component issue.
              </p>
              <div className="space-y-3">
                <button 
                  onClick={() => window.location.reload()}
                  className="btn-primary w-full"
                >
                  Reload Page
                </button>
                <button 
                  onClick={() => this.setState({ hasError: false, error: null, errorInfo: null })}
                  className="btn-secondary w-full"
                >
                  Try Again
                </button>
              </div>
              {process.env.NODE_ENV === 'development' && this.state.errorInfo && (
                <details className="mt-6 p-4 bg-red-500/10 border border-red-500/30 rounded-lg text-left">
                  <summary className="text-red-400 text-sm font-medium cursor-pointer">
                    Error Details (Development)
                  </summary>
                  <pre className="text-red-300 text-xs mt-2 overflow-auto">
                    {this.state.error && this.state.error.toString()}
                    <br />
                    {this.state.errorInfo?.componentStack || 'No component stack available'}
                  </pre>
                </details>
              )}
            </div>
          </div>
        </div>
      );
    }

    return this.props.children;
  }
}

export default ErrorBoundary;