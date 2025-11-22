'use client';

import React, { Component, ErrorInfo, ReactNode } from 'react';
import { AlertCircle, RefreshCw, Home } from 'lucide-react';
import { Button } from '@/components/ui/button';

interface Props {
  children: ReactNode;
  fallback?: ReactNode;
}

interface State {
  hasError: boolean;
  error: Error | null;
  errorInfo: ErrorInfo | null;
}

export class ErrorBoundary extends Component<Props, State> {
  public state: State = {
    hasError: false,
    error: null,
    errorInfo: null,
  };

  public static getDerivedStateFromError(error: Error): State {
    return { hasError: true, error, errorInfo: null };
  }

  public componentDidCatch(error: Error, errorInfo: ErrorInfo) {
    console.error('ErrorBoundary caught an error:', error, errorInfo);
    this.setState({ error, errorInfo });
  }

  private handleReset = () => {
    this.setState({ hasError: false, error: null, errorInfo: null });
  };

  private handleGoHome = () => {
    window.location.href = '/';
  };

  public render() {
    if (this.state.hasError) {
      if (this.props.fallback) {
        return this.props.fallback;
      }

      return (
        <div className="min-h-screen flex items-center justify-center bg-gray-50 px-4">
          <div className="max-w-md w-full">
            <div className="bg-white rounded-xl shadow-lg p-8 space-y-6">
              {/* Error Icon */}
              <div className="flex justify-center">
                <div className="bg-red-100 rounded-full p-4">
                  <AlertCircle className="h-12 w-12 text-red-600" />
                </div>
              </div>

              {/* Error Message */}
              <div className="text-center space-y-2">
                <h1 className="text-2xl font-bold text-gray-900">
                  Oops! Something went wrong
                </h1>
                <p className="text-gray-600">
                  We encountered an unexpected error. This has been logged and we&apos;ll look into it.
                </p>
              </div>

              {/* Error Details (Development Only) */}
              {process.env.NODE_ENV === 'development' && this.state.error && (
                <div className="bg-gray-50 rounded-lg p-4 space-y-2">
                  <p className="text-sm font-semibold text-gray-900">Error Details:</p>
                  <p className="text-xs text-red-600 font-mono break-all">
                    {this.state.error.message}
                  </p>
                  {this.state.errorInfo && (
                    <details className="text-xs text-gray-600">
                      <summary className="cursor-pointer font-semibold hover:text-gray-900">
                        Component Stack
                      </summary>
                      <pre className="mt-2 whitespace-pre-wrap overflow-x-auto">
                        {this.state.errorInfo.componentStack}
                      </pre>
                    </details>
                  )}
                </div>
              )}

              {/* Action Buttons */}
              <div className="flex flex-col sm:flex-row gap-3">
                <Button
                  onClick={this.handleReset}
                  className="flex-1 flex items-center justify-center gap-2"
                  variant="default"
                >
                  <RefreshCw className="h-4 w-4" />
                  Try Again
                </Button>
                <Button
                  onClick={this.handleGoHome}
                  className="flex-1 flex items-center justify-center gap-2"
                  variant="outline"
                >
                  <Home className="h-4 w-4" />
                  Go Home
                </Button>
              </div>
            </div>
          </div>
        </div>
      );
    }

    return this.props.children;
  }
}

// Convenience wrapper for route-level error boundaries
export function RouteErrorBoundary({ children }: { children: ReactNode }) {
  return <ErrorBoundary>{children}</ErrorBoundary>;
}
