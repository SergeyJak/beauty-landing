'use client'

import React, { Component, ErrorInfo, ReactNode } from 'react'
import Button from '@/components/Button'

interface Props {
  children: ReactNode
  fallback?: ReactNode
}

interface State {
  hasError: boolean
  error: Error | null
}

class ErrorBoundary extends Component<Props, State> {
  public state: State = {
    hasError: false,
    error: null,
  }

  public static getDerivedStateFromError(error: Error): State {
    return { hasError: true, error }
  }

  public componentDidCatch(error: Error, errorInfo: ErrorInfo) {
    console.error('Uncaught error:', error, errorInfo)
  }

  public render() {
    if (this.state.hasError) {
      return this.props.fallback || (
        <div className="flex min-h-[400px] flex-col items-center justify-center p-8 text-center bg-soft-beige">
          <h2 className="mb-4 text-3xl font-serif font-bold text-primary">Something went wrong</h2>
          <p className="mb-8 max-w-md text-primary/60">
            We apologize for the inconvenience. Our team has been notified and we are working to fix the issue.
          </p>
          <Button onClick={() => window.location.reload()}>
            Refresh Page
          </Button>
        </div>
      )
    }

    return this.props.children
  }
}

export default ErrorBoundary
