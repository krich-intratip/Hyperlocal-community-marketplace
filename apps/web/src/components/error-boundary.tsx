'use client'

import { Component, type ReactNode } from 'react'
import { AlertTriangle, RefreshCw, Home } from 'lucide-react'

interface Props {
  children: ReactNode
  fallback?: ReactNode
}

interface State {
  hasError: boolean
  error: Error | null
}

export class ErrorBoundary extends Component<Props, State> {
  constructor(props: Props) {
    super(props)
    this.state = { hasError: false, error: null }
  }

  static getDerivedStateFromError(error: Error): State {
    return { hasError: true, error }
  }

  componentDidCatch(error: Error, info: { componentStack: string }) {
    console.error('[ErrorBoundary]', error, info.componentStack)
  }

  render() {
    if (this.state.hasError) {
      if (this.props.fallback) return this.props.fallback

      return (
        <div className="min-h-screen flex items-center justify-center bg-white dark:bg-slate-950 px-4">
          <div className="max-w-md w-full text-center space-y-6">
            <div className="w-20 h-20 rounded-full bg-red-50 dark:bg-red-900/20 flex items-center justify-center mx-auto">
              <AlertTriangle className="h-10 w-10 text-red-500" />
            </div>
            <div>
              <h1 className="text-2xl font-extrabold text-slate-900 dark:text-white mb-2">
                เกิดข้อผิดพลาด
              </h1>
              <p className="text-slate-500 dark:text-slate-400 text-sm">
                หน้านี้เจอปัญหาบางอย่าง กรุณาลองใหม่อีกครั้ง
              </p>
              {this.state.error && (
                <p className="mt-2 text-xs text-slate-400 dark:text-slate-500 font-mono bg-slate-50 dark:bg-slate-800 rounded-xl px-3 py-2 break-all">
                  {this.state.error.message}
                </p>
              )}
            </div>
            <div className="flex flex-col sm:flex-row gap-3 justify-center">
              <button
                onClick={() => this.setState({ hasError: false, error: null })}
                className="flex items-center justify-center gap-2 rounded-xl bg-blue-600 px-5 py-3 text-sm font-bold text-white hover:bg-blue-700 transition-colors shadow-lg shadow-blue-200 dark:shadow-none"
              >
                <RefreshCw className="h-4 w-4" /> ลองใหม่
              </button>
              <a
                href="/"
                className="flex items-center justify-center gap-2 rounded-xl border border-slate-200 dark:border-slate-700 bg-white dark:bg-slate-800 px-5 py-3 text-sm font-bold text-slate-700 dark:text-slate-200 hover:border-blue-300 dark:hover:border-blue-600 transition-colors"
              >
                <Home className="h-4 w-4" /> หน้าหลัก
              </a>
            </div>
          </div>
        </div>
      )
    }

    return this.props.children
  }
}
