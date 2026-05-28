import { useState, useEffect, useCallback } from 'react'

/**
 * Hook to detect if user is scrolling
 */
export function useScrolled(): boolean {
  const [isScrolled, setIsScrolled] = useState(false)

  useEffect(() => {
    const handleScroll = () => {
      setIsScrolled(window.scrollY > 50)
    }

    window.addEventListener('scroll', handleScroll)
    return () => window.removeEventListener('scroll', handleScroll)
  }, [])

  return isScrolled
}

/**
 * Hook to detect if element is in viewport
 */
export function useInView(ref: React.RefObject<HTMLElement>): boolean {
  const [isInView, setIsInView] = useState(false)

  useEffect(() => {
    const observer = new IntersectionObserver(
      ([entry]) => {
        if (entry.isIntersecting) {
          setIsInView(true)
          observer.unobserve(entry.target)
        }
      },
      { threshold: 0.1 }
    )

    if (ref.current) {
      observer.observe(ref.current)
    }

    return () => observer.disconnect()
  }, [ref])

  return isInView
}

/**
 * Hook for responsive breakpoints
 */
export function useBreakpoint(breakpoint: 'sm' | 'md' | 'lg' | 'xl'): boolean {
  const [isMobile, setIsMobile] = useState(false)

  const breakpoints = {
    sm: 640,
    md: 768,
    lg: 1024,
    xl: 1280,
  }

  useEffect(() => {
    const handleResize = () => {
      setIsMobile(window.innerWidth < breakpoints[breakpoint])
    }

    handleResize()
    window.addEventListener('resize', handleResize)
    return () => window.removeEventListener('resize', handleResize)
  }, [breakpoint])

  return isMobile
}

/**
 * Hook for mobile detection
 */
export function useIsMobile(): boolean {
  return useBreakpoint('md')
}

/**
 * Hook for local storage
 */
export function useLocalStorage<T>(key: string, initialValue: T): [T, (value: T) => void] {
  const [storedValue, setStoredValue] = useState<T>(initialValue)

  useEffect(() => {
    try {
      const item = window.localStorage.getItem(key)
      if (item) {
        setStoredValue(JSON.parse(item))
      }
    } catch (error) {
      console.error(`Error reading localStorage key "${key}":`, error)
    }
  }, [key])

  const setValue = useCallback(
    (value: T) => {
      try {
        setStoredValue(value)
        window.localStorage.setItem(key, JSON.stringify(value))
      } catch (error) {
        console.error(`Error setting localStorage key "${key}":`, error)
      }
    },
    [key]
  )

  return [storedValue, setValue]
}

/**
 * Hook for debounced value
 */
export function useDebouncedValue<T>(value: T, delay: number): T {
  const [debouncedValue, setDebouncedValue] = useState(value)

  useEffect(() => {
    const handler = setTimeout(() => {
      setDebouncedValue(value)
    }, delay)

    return () => clearTimeout(handler)
  }, [value, delay])

  return debouncedValue
}

/**
 * Hook for async operations with loading and error states
 */
export function useAsync<T>(
  asyncFunction: () => Promise<T>,
  immediate: boolean = true
): {
  status: 'idle' | 'pending' | 'success' | 'error'
  data: T | null
  error: Error | null
} {
  const [status, setStatus] = useState<'idle' | 'pending' | 'success' | 'error'>('idle')
  const [data, setData] = useState<T | null>(null)
  const [error, setError] = useState<Error | null>(null)

  useEffect(() => {
    if (!immediate) return

    const execute = async () => {
      setStatus('pending')
      try {
        const response = await asyncFunction()
        setData(response)
        setStatus('success')
      } catch (err) {
        setError(err instanceof Error ? err : new Error(String(err)))
        setStatus('error')
      }
    }

    execute()
  }, [asyncFunction, immediate])

  return { status, data, error }
}
