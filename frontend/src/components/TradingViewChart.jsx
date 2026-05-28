// TradingView Charting Library container.
//
// Expects the licensed library files at /charting_library/charting_library.js
// (drop the contents of TradingView's distribution into frontend/public/charting_library/).
//
// Loads the script on demand, mounts widget with our custom UDF datafeed, and
// rebuilds when the symbol/theme changes.
import { useEffect, useRef } from 'react'
import datafeed from '../services/chartDatafeed'

const LIBRARY_SCRIPT_SRC = '/charting_library/charting_library.js'

let libraryScriptPromise = null

function loadChartingLibrary() {
  if (typeof window === 'undefined') return Promise.reject(new Error('no window'))
  if (window.TradingView?.widget) return Promise.resolve(window.TradingView)
  if (libraryScriptPromise) return libraryScriptPromise

  libraryScriptPromise = new Promise((resolve, reject) => {
    const existing = document.querySelector(`script[src="${LIBRARY_SCRIPT_SRC}"]`)
    if (existing) {
      existing.addEventListener('load', () => resolve(window.TradingView))
      existing.addEventListener('error', () => reject(new Error('Failed to load charting_library.js')))
      return
    }
    const script = document.createElement('script')
    script.src = LIBRARY_SCRIPT_SRC
    script.async = true
    script.onload = () => {
      if (window.TradingView?.widget) resolve(window.TradingView)
      else reject(new Error('charting_library.js loaded but window.TradingView.widget is missing'))
    }
    script.onerror = () => reject(new Error(`Failed to load ${LIBRARY_SCRIPT_SRC} — copy TradingView Charting Library files into frontend/public/charting_library/`))
    document.head.appendChild(script)
  })
  return libraryScriptPromise
}

export default function TradingViewChart({ symbol = 'XAUUSD', interval = '5', theme = 'dark' }) {
  const containerRef = useRef(null)
  const widgetRef = useRef(null)
  const containerIdRef = useRef(`tv_chart_${Math.random().toString(36).slice(2)}`)

  useEffect(() => {
    let cancelled = false

    loadChartingLibrary()
      .then((TV) => {
        if (cancelled || !containerRef.current) return
        // Tear down previous widget instance if any (symbol/theme changed)
        if (widgetRef.current) {
          try { widgetRef.current.remove() } catch (e) {}
          widgetRef.current = null
        }

        const widget = new TV.widget({
          symbol,
          datafeed,
          interval,
          container: containerRef.current,
          library_path: '/charting_library/',
          locale: 'en',
          timezone: 'Etc/UTC',
          theme,
          fullscreen: false,
          autosize: true,
          debug: false,
          // Charting Library hides the symbol search by default — keep it visible.
          disabled_features: [
            'use_localstorage_for_settings',
            'header_compare',
          ],
          enabled_features: [
            'side_toolbar_in_fullscreen_mode',
          ],
          overrides: theme === 'dark'
            ? {
                'paneProperties.background': '#0d0d0d',
                'paneProperties.backgroundType': 'solid',
              }
            : {},
          loading_screen: { backgroundColor: theme === 'dark' ? '#0d0d0d' : '#ffffff' },
        })
        widgetRef.current = widget
      })
      .catch((err) => {
        if (!cancelled) console.error('[TradingViewChart] load failed:', err.message)
      })

    return () => {
      cancelled = true
      if (widgetRef.current) {
        try { widgetRef.current.remove() } catch (e) {}
        widgetRef.current = null
      }
    }
  }, [symbol, interval, theme])

  return (
    <div
      ref={containerRef}
      id={containerIdRef.current}
      style={{ width: '100%', height: '100%' }}
    />
  )
}
