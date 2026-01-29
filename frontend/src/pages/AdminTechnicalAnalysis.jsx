import { useState, useEffect, useRef } from 'react'
import { 
  TrendingUp, 
  TrendingDown, 
  ArrowUpRight,
  ArrowDownRight,
  Minus,
  RefreshCw,
  Bell,
 
} from 'lucide-react'
import AdminLayout from '../components/AdminLayout'
import { useTheme } from '../context/ThemeContext'
import priceStreamService from '../services/priceStream'

const AdminTechnicalAnalysis = () => {
  const { isDarkMode } = useTheme()
  const [selectedSymbol, setSelectedSymbol] = useState('XAUUSD')
  const [selectedTimeframe, setSelectedTimeframe] = useState('1H')
  const [loading, setLoading] = useState(false)
  const [marketData, setMarketData] = useState({})
  const [technicalIndicators, setTechnicalIndicators] = useState({})
  const [signals, setSignals] = useState([])
  const [priceAlerts, setPriceAlerts] = useState([])
  const [showAlertModal, setShowAlertModal] = useState(false)
  const [newAlert, setNewAlert] = useState({ symbol: 'XAUUSD', price: '', condition: 'above' })
  const [priceHistory, setPriceHistory] = useState({})
  const priceHistoryRef = useRef({})

  const symbols = [
    { symbol: 'XAUUSD', name: 'Gold', category: 'Metals' },
    { symbol: 'XAGUSD', name: 'Silver', category: 'Metals' },
    { symbol: 'EURUSD', name: 'EUR/USD', category: 'Forex' },
    { symbol: 'GBPUSD', name: 'GBP/USD', category: 'Forex' },
    { symbol: 'USDJPY', name: 'USD/JPY', category: 'Forex' },
    { symbol: 'AUDUSD', name: 'AUD/USD', category: 'Forex' },
    { symbol: 'USDCAD', name: 'USD/CAD', category: 'Forex' },
    { symbol: 'BTCUSD', name: 'Bitcoin', category: 'Crypto' },
    { symbol: 'ETHUSD', name: 'Ethereum', category: 'Crypto' },
    { symbol: 'SOLUSD', name: 'Solana', category: 'Crypto' },
    { symbol: 'XRPUSD', name: 'Ripple', category: 'Crypto' },
    { symbol: 'BNBUSD', name: 'BNB', category: 'Crypto' },
  ]

  const timeframes = ['1M', '5M', '15M', '30M', '1H', '4H', '1D', '1W']

  // Connect to real-time price stream
  useEffect(() => {
    setLoading(true)
    
    const unsubscribe = priceStreamService.subscribe('technical-analysis', (prices, updated, timestamp) => {
      // Update market data with real prices
      const newMarketData = {}
      
      symbols.forEach(({ symbol }) => {
        const priceData = prices[symbol]
        if (priceData) {
          const currentPrice = (priceData.bid + priceData.ask) / 2
          const spread = priceData.ask - priceData.bid
          
          // Store price history for calculations
          if (!priceHistoryRef.current[symbol]) {
            priceHistoryRef.current[symbol] = []
          }
          priceHistoryRef.current[symbol].push({ price: currentPrice, time: timestamp })
          // Keep last 200 prices for calculations
          if (priceHistoryRef.current[symbol].length > 200) {
            priceHistoryRef.current[symbol].shift()
          }
          
          const history = priceHistoryRef.current[symbol]
          const firstPrice = history.length > 0 ? history[0].price : currentPrice
          const change = currentPrice - firstPrice
          const changePercent = firstPrice > 0 ? ((change / firstPrice) * 100) : 0
          
          // Calculate high/low from history
          const prices24h = history.map(h => h.price)
          const high = prices24h.length > 0 ? Math.max(...prices24h) : currentPrice
          const low = prices24h.length > 0 ? Math.min(...prices24h) : currentPrice
          
          newMarketData[symbol] = {
            price: currentPrice,
            bid: priceData.bid,
            ask: priceData.ask,
            spread: spread,
            change: change,
            changePercent: changePercent,
            high: high,
            low: low,
            open: firstPrice,
            volume: '-',
            lastUpdate: timestamp
          }
        }
      })
      
      setMarketData(prev => ({ ...prev, ...newMarketData }))
      setPriceHistory({ ...priceHistoryRef.current })
      setLoading(false)
      
      // Generate technical indicators based on real data
      if (newMarketData[selectedSymbol]) {
        generateTechnicalIndicators(selectedSymbol, priceHistoryRef.current[selectedSymbol] || [])
      }
    })

    return () => unsubscribe()
  }, [selectedSymbol])

  // Calculate Simple Moving Average
  const calculateSMA = (prices, period) => {
    if (prices.length < period) return null
    const slice = prices.slice(-period)
    return slice.reduce((sum, p) => sum + p.price, 0) / period
  }

  // Calculate Exponential Moving Average
  const calculateEMA = (prices, period) => {
    if (prices.length < period) return null
    const k = 2 / (period + 1)
    let ema = prices.slice(0, period).reduce((sum, p) => sum + p.price, 0) / period
    for (let i = period; i < prices.length; i++) {
      ema = prices[i].price * k + ema * (1 - k)
    }
    return ema
  }

  // Calculate RSI
  const calculateRSI = (prices, period = 14) => {
    if (prices.length < period + 1) return null
    let gains = 0, losses = 0
    for (let i = prices.length - period; i < prices.length; i++) {
      const change = prices[i].price - prices[i - 1].price
      if (change > 0) gains += change
      else losses -= change
    }
    const avgGain = gains / period
    const avgLoss = losses / period
    if (avgLoss === 0) return 100
    const rs = avgGain / avgLoss
    return 100 - (100 / (1 + rs))
  }

  // Calculate MACD
  const calculateMACD = (prices) => {
    const ema12 = calculateEMA(prices, 12)
    const ema26 = calculateEMA(prices, 26)
    if (!ema12 || !ema26) return null
    const macdLine = ema12 - ema26
    // Signal line would need more history, simplified here
    return { value: macdLine, signal: macdLine > 0 ? 'BUY' : 'SELL' }
  }

  // Calculate ATR (Average True Range)
  const calculateATR = (prices, period = 14) => {
    if (prices.length < period + 1) return null
    let trSum = 0
    for (let i = prices.length - period; i < prices.length; i++) {
      const high = prices[i].price * 1.001 // Approximate high
      const low = prices[i].price * 0.999 // Approximate low
      const prevClose = prices[i - 1].price
      const tr = Math.max(high - low, Math.abs(high - prevClose), Math.abs(low - prevClose))
      trSum += tr
    }
    return trSum / period
  }

  // Calculate Stochastic
  const calculateStochastic = (prices, period = 14) => {
    if (prices.length < period) return null
    const slice = prices.slice(-period)
    const priceValues = slice.map(p => p.price)
    const high = Math.max(...priceValues)
    const low = Math.min(...priceValues)
    const current = prices[prices.length - 1].price
    if (high === low) return 50
    return ((current - low) / (high - low)) * 100
  }

  // Calculate CCI (Commodity Channel Index)
  const calculateCCI = (prices, period = 20) => {
    if (prices.length < period) return null
    const slice = prices.slice(-period)
    const tp = slice.map(p => p.price) // Typical price simplified
    const sma = tp.reduce((a, b) => a + b, 0) / period
    const meanDev = tp.reduce((sum, p) => sum + Math.abs(p - sma), 0) / period
    if (meanDev === 0) return 0
    return (prices[prices.length - 1].price - sma) / (0.015 * meanDev)
  }

  // Calculate ADX (simplified)
  const calculateADX = (prices, period = 14) => {
    if (prices.length < period * 2) return null
    // Simplified ADX calculation
    let sumDM = 0
    for (let i = prices.length - period; i < prices.length; i++) {
      const change = Math.abs(prices[i].price - prices[i - 1].price)
      sumDM += change
    }
    const avgDM = sumDM / period
    const atr = calculateATR(prices, period) || 1
    return Math.min(100, (avgDM / atr) * 100)
  }

  const generateTechnicalIndicators = (symbol, history = []) => {
    if (history.length < 20) {
      // Not enough data yet, show loading state
      setTechnicalIndicators({
        ma: {},
        oscillators: {},
        pivots: { classic: {}, fibonacci: {} },
        summary: { overall: 'LOADING', maSignal: 'LOADING', oscillatorSignal: 'LOADING', buyCount: 0, sellCount: 0, neutralCount: 0 }
      })
      return
    }

    const currentPrice = history[history.length - 1]?.price || 0
    
    // Calculate real Moving Averages
    const sma20 = calculateSMA(history, 20)
    const sma50 = calculateSMA(history, Math.min(50, history.length))
    const sma100 = calculateSMA(history, Math.min(100, history.length))
    const sma200 = calculateSMA(history, Math.min(200, history.length))
    const ema20 = calculateEMA(history, 20)
    const ema50 = calculateEMA(history, Math.min(50, history.length))

    const getMASignal = (ma) => {
      if (!ma) return 'NEUTRAL'
      return currentPrice > ma ? 'BUY' : 'SELL'
    }

    // Calculate real Oscillators
    const rsi = calculateRSI(history)
    const macd = calculateMACD(history)
    const stochastic = calculateStochastic(history)
    const cci = calculateCCI(history)
    const atr = calculateATR(history)
    const adx = calculateADX(history)

    const getRSISignal = (rsi) => {
      if (!rsi) return 'NEUTRAL'
      if (rsi > 70) return 'SELL'
      if (rsi < 30) return 'BUY'
      return 'NEUTRAL'
    }

    const getStochSignal = (stoch) => {
      if (!stoch) return 'NEUTRAL'
      if (stoch > 80) return 'SELL'
      if (stoch < 20) return 'BUY'
      return 'NEUTRAL'
    }

    const getCCISignal = (cci) => {
      if (!cci) return 'NEUTRAL'
      if (cci > 100) return 'BUY'
      if (cci < -100) return 'SELL'
      return 'NEUTRAL'
    }

    // Calculate Pivot Points from real data
    const priceValues = history.map(h => h.price)
    const high = Math.max(...priceValues)
    const low = Math.min(...priceValues)
    const close = currentPrice
    const pivot = (high + low + close) / 3

    const r1 = 2 * pivot - low
    const s1 = 2 * pivot - high
    const r2 = pivot + (high - low)
    const s2 = pivot - (high - low)
    const r3 = high + 2 * (pivot - low)
    const s3 = low - 2 * (high - pivot)

    // Fibonacci pivots
    const range = high - low
    const fibR1 = pivot + 0.382 * range
    const fibR2 = pivot + 0.618 * range
    const fibR3 = pivot + range
    const fibS1 = pivot - 0.382 * range
    const fibS2 = pivot - 0.618 * range
    const fibS3 = pivot - range

    // Count signals
    let buyCount = 0, sellCount = 0, neutralCount = 0
    const countSignal = (signal) => {
      if (signal === 'BUY') buyCount++
      else if (signal === 'SELL') sellCount++
      else neutralCount++
    }

    const maSignals = [getMASignal(sma20), getMASignal(sma50), getMASignal(ema20), getMASignal(ema50)]
    maSignals.forEach(countSignal)
    
    const oscSignals = [getRSISignal(rsi), macd?.signal, getStochSignal(stochastic), getCCISignal(cci)]
    oscSignals.forEach(countSignal)

    const getOverallSignal = () => {
      if (buyCount > sellCount + neutralCount) return 'STRONG_BUY'
      if (buyCount > sellCount) return 'BUY'
      if (sellCount > buyCount + neutralCount) return 'STRONG_SELL'
      if (sellCount > buyCount) return 'SELL'
      return 'NEUTRAL'
    }

    const getMASummary = () => {
      const maBuys = maSignals.filter(s => s === 'BUY').length
      if (maBuys >= 3) return 'STRONG_BUY'
      if (maBuys >= 2) return 'BUY'
      if (maBuys === 0) return 'STRONG_SELL'
      return 'NEUTRAL'
    }

    const getOscSummary = () => {
      const oscBuys = oscSignals.filter(s => s === 'BUY').length
      if (oscBuys >= 3) return 'BUY'
      if (oscBuys === 0) return 'SELL'
      return 'NEUTRAL'
    }

    const formatValue = (val, decimals = 2) => {
      if (val === null || val === undefined) return '-'
      if (symbol.includes('JPY')) return val.toFixed(3)
      if (symbol.includes('XAU')) return val.toFixed(2)
      if (symbol.includes('BTC') || symbol.includes('ETH')) return val.toFixed(2)
      return val.toFixed(decimals < 5 ? 5 : decimals)
    }

    const indicators = {
      ma: {
        sma20: { value: formatValue(sma20), signal: getMASignal(sma20) },
        sma50: { value: formatValue(sma50), signal: getMASignal(sma50) },
        sma100: { value: formatValue(sma100), signal: getMASignal(sma100) },
        sma200: { value: formatValue(sma200), signal: getMASignal(sma200) },
        ema20: { value: formatValue(ema20), signal: getMASignal(ema20) },
        ema50: { value: formatValue(ema50), signal: getMASignal(ema50) },
      },
      oscillators: {
        rsi: { value: rsi?.toFixed(2) || '-', signal: getRSISignal(rsi), description: rsi > 70 ? 'Overbought' : rsi < 30 ? 'Oversold' : 'Neutral zone' },
        macd: { value: macd?.value?.toFixed(4) || '-', signal: macd?.signal || 'NEUTRAL', description: macd?.value > 0 ? 'Bullish momentum' : 'Bearish momentum' },
        stochastic: { value: stochastic?.toFixed(2) || '-', signal: getStochSignal(stochastic), description: stochastic > 80 ? 'Overbought' : stochastic < 20 ? 'Oversold' : 'Neutral' },
        cci: { value: cci?.toFixed(2) || '-', signal: getCCISignal(cci), description: cci > 100 ? 'Strong uptrend' : cci < -100 ? 'Strong downtrend' : 'Ranging' },
        atr: { value: formatValue(atr), signal: atr > (currentPrice * 0.01) ? 'HIGH' : 'LOW', description: atr > (currentPrice * 0.01) ? 'High volatility' : 'Low volatility' },
        adx: { value: adx?.toFixed(2) || '-', signal: adx > 25 ? 'TREND' : 'RANGE', description: adx > 25 ? 'Strong trend' : 'Weak/No trend' },
      },
      pivots: {
        classic: {
          r3: formatValue(r3),
          r2: formatValue(r2),
          r1: formatValue(r1),
          pivot: formatValue(pivot),
          s1: formatValue(s1),
          s2: formatValue(s2),
          s3: formatValue(s3),
        },
        fibonacci: {
          r3: formatValue(fibR3),
          r2: formatValue(fibR2),
          r1: formatValue(fibR1),
          pivot: formatValue(pivot),
          s1: formatValue(fibS1),
          s2: formatValue(fibS2),
          s3: formatValue(fibS3),
        }
      },
      summary: {
        overall: getOverallSignal(),
        maSignal: getMASummary(),
        oscillatorSignal: getOscSummary(),
        buyCount,
        sellCount,
        neutralCount
      }
    }
    setTechnicalIndicators(indicators)

    // Generate trading signals based on real data
    const newSignals = []
    
    if (ema20 && ema50 && ema20 > ema50) {
      newSignals.push({ type: 'BUY', symbol, indicator: 'MA Crossover', description: `EMA20 (${formatValue(ema20)}) above EMA50 (${formatValue(ema50)})`, strength: 'Strong', time: 'Now' })
    } else if (ema20 && ema50) {
      newSignals.push({ type: 'SELL', symbol, indicator: 'MA Crossover', description: `EMA20 (${formatValue(ema20)}) below EMA50 (${formatValue(ema50)})`, strength: 'Strong', time: 'Now' })
    }

    if (rsi) {
      if (rsi < 30) {
        newSignals.push({ type: 'BUY', symbol, indicator: 'RSI', description: `RSI at ${rsi.toFixed(1)} - Oversold`, strength: 'Strong', time: 'Now' })
      } else if (rsi > 70) {
        newSignals.push({ type: 'SELL', symbol, indicator: 'RSI', description: `RSI at ${rsi.toFixed(1)} - Overbought`, strength: 'Strong', time: 'Now' })
      } else {
        newSignals.push({ type: 'NEUTRAL', symbol, indicator: 'RSI', description: `RSI at ${rsi.toFixed(1)} - Neutral zone`, strength: 'Weak', time: 'Now' })
      }
    }

    if (currentPrice < s1) {
      newSignals.push({ type: 'BUY', symbol, indicator: 'Support Level', description: `Price below S1 (${formatValue(s1)})`, strength: 'Medium', time: 'Now' })
    } else if (currentPrice > r1) {
      newSignals.push({ type: 'SELL', symbol, indicator: 'Resistance Level', description: `Price above R1 (${formatValue(r1)})`, strength: 'Medium', time: 'Now' })
    }

    if (macd) {
      newSignals.push({ type: macd.signal, symbol, indicator: 'MACD', description: `MACD: ${macd.value.toFixed(4)}`, strength: Math.abs(macd.value) > 0.001 ? 'Medium' : 'Weak', time: 'Now' })
    }

    setSignals(newSignals.slice(0, 5))
  }

  const getSignalColor = (signal) => {
    switch(signal) {
      case 'BUY':
      case 'STRONG_BUY':
        return 'text-green-500'
      case 'SELL':
      case 'STRONG_SELL':
        return 'text-red-500'
      default:
        return 'text-yellow-500'
    }
  }

  const getSignalBg = (signal) => {
    switch(signal) {
      case 'BUY':
      case 'STRONG_BUY':
        return 'bg-green-500/20 border-green-500/30'
      case 'SELL':
      case 'STRONG_SELL':
        return 'bg-red-500/20 border-red-500/30'
      default:
        return 'bg-yellow-500/20 border-yellow-500/30'
    }
  }

  const addPriceAlert = () => {
    if (newAlert.price) {
      setPriceAlerts([...priceAlerts, { ...newAlert, id: Date.now(), active: true }])
      setNewAlert({ symbol: selectedSymbol, price: '', condition: 'above' })
      setShowAlertModal(false)
    }
  }

  const removeAlert = (id) => {
    setPriceAlerts(priceAlerts.filter(alert => alert.id !== id))
  }

  const currentData = marketData[selectedSymbol] || {}

  return (
    <AdminLayout title="Technical Analysis" subtitle="Market analysis and trading signals">
      <div className="space-y-6">
        {/* Symbol & Timeframe Selector */}
        <div className={`rounded-xl p-4 ${isDarkMode ? 'bg-dark-800 border border-gray-700' : 'bg-white border border-gray-200'}`}>
          <div className="flex flex-wrap items-center justify-between gap-4">
            <div className="flex items-center gap-4">
              {/* Symbol Selector */}
              <div className="flex items-center gap-2">
                <span className={`text-sm ${isDarkMode ? 'text-gray-400' : 'text-gray-600'}`}>Symbol:</span>
                <select
                  value={selectedSymbol}
                  onChange={(e) => setSelectedSymbol(e.target.value)}
                  className={`px-4 py-2 rounded-lg border ${isDarkMode ? 'bg-dark-700 border-gray-600 text-white' : 'bg-gray-50 border-gray-300 text-gray-900'}`}
                >
                  {symbols.map(s => (
                    <option key={s.symbol} value={s.symbol}>{s.symbol} - {s.name}</option>
                  ))}
                </select>
              </div>

              {/* Timeframe Selector */}
              <div className="flex items-center gap-1">
                {timeframes.map(tf => (
                  <button
                    key={tf}
                    onClick={() => setSelectedTimeframe(tf)}
                    className={`px-3 py-1.5 rounded-lg text-sm font-medium transition-colors ${
                      selectedTimeframe === tf
                        ? 'bg-gradient-to-r from-cyan-500 to-emerald-500 text-white'
                        : isDarkMode ? 'text-gray-400 hover:bg-dark-700' : 'text-gray-600 hover:bg-gray-100'
                    }`}
                  >
                    {tf}
                  </button>
                ))}
              </div>
            </div>

            <div className="flex items-center gap-2">
              <button
                onClick={() => setShowAlertModal(true)}
                className={`flex items-center gap-2 px-4 py-2 rounded-lg border ${isDarkMode ? 'border-gray-600 text-gray-300 hover:bg-dark-700' : 'border-gray-300 text-gray-700 hover:bg-gray-100'}`}
              >
                <Bell size={16} />
                Set Alert
              </button>
              <button
                onClick={() => generateTechnicalIndicators(selectedSymbol)}
                className={`flex items-center gap-2 px-4 py-2 rounded-lg ${isDarkMode ? 'bg-dark-700 text-gray-300 hover:bg-dark-600' : 'bg-gray-100 text-gray-700 hover:bg-gray-200'}`}
              >
                <RefreshCw size={16} className={loading ? 'animate-spin' : ''} />
                Refresh
              </button>
            </div>
          </div>
        </div>

        {/* Price Overview Card */}
        <div className={`rounded-xl p-6 ${isDarkMode ? 'bg-dark-800 border border-gray-700' : 'bg-white border border-gray-200'}`}>
          <div className="flex flex-wrap items-start justify-between gap-6">
            <div>
              <div className="flex items-center gap-3 mb-2">
                <h2 className={`text-2xl font-bold ${isDarkMode ? 'text-white' : 'text-gray-900'}`}>{selectedSymbol}</h2>
                <span className={`px-2 py-1 rounded text-xs ${isDarkMode ? 'bg-dark-700 text-gray-400' : 'bg-gray-100 text-gray-600'}`}>
                  {symbols.find(s => s.symbol === selectedSymbol)?.category}
                </span>
              </div>
              <div className="flex items-baseline gap-3">
                <span className={`text-4xl font-bold ${isDarkMode ? 'text-white' : 'text-gray-900'}`}>
                  {currentData.price?.toLocaleString() || '---'}
                </span>
                <span className={`flex items-center gap-1 text-lg font-medium ${currentData.change >= 0 ? 'text-green-500' : 'text-red-500'}`}>
                  {currentData.change >= 0 ? <ArrowUpRight size={20} /> : <ArrowDownRight size={20} />}
                  {currentData.change >= 0 ? '+' : ''}{currentData.change} ({currentData.changePercent}%)
                </span>
              </div>
            </div>

            <div className="grid grid-cols-2 sm:grid-cols-4 gap-4">
              <div className={`p-3 rounded-lg ${isDarkMode ? 'bg-dark-700' : 'bg-gray-50'}`}>
                <p className={`text-xs ${isDarkMode ? 'text-gray-400' : 'text-gray-500'}`}>High</p>
                <p className={`text-lg font-semibold text-green-500`}>{currentData.high}</p>
              </div>
              <div className={`p-3 rounded-lg ${isDarkMode ? 'bg-dark-700' : 'bg-gray-50'}`}>
                <p className={`text-xs ${isDarkMode ? 'text-gray-400' : 'text-gray-500'}`}>Low</p>
                <p className={`text-lg font-semibold text-red-500`}>{currentData.low}</p>
              </div>
              <div className={`p-3 rounded-lg ${isDarkMode ? 'bg-dark-700' : 'bg-gray-50'}`}>
                <p className={`text-xs ${isDarkMode ? 'text-gray-400' : 'text-gray-500'}`}>Open</p>
                <p className={`text-lg font-semibold ${isDarkMode ? 'text-white' : 'text-gray-900'}`}>{currentData.open}</p>
              </div>
              <div className={`p-3 rounded-lg ${isDarkMode ? 'bg-dark-700' : 'bg-gray-50'}`}>
                <p className={`text-xs ${isDarkMode ? 'text-gray-400' : 'text-gray-500'}`}>Volume</p>
                <p className={`text-lg font-semibold ${isDarkMode ? 'text-white' : 'text-gray-900'}`}>{currentData.volume}</p>
              </div>
            </div>
          </div>
        </div>

        {/* Technical Summary */}
        <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
          {/* Overall Signal */}
          <div className={`rounded-xl p-6 ${isDarkMode ? 'bg-dark-800 border border-gray-700' : 'bg-white border border-gray-200'}`}>
            <h3 className={`text-lg font-semibold mb-4 ${isDarkMode ? 'text-white' : 'text-gray-900'}`}>Technical Summary</h3>
            
            <div className={`p-4 rounded-xl border ${getSignalBg(technicalIndicators.summary?.overall)}`}>
              <div className="text-center">
                <p className={`text-sm ${isDarkMode ? 'text-gray-400' : 'text-gray-500'}`}>Overall Signal</p>
                <p className={`text-3xl font-bold ${getSignalColor(technicalIndicators.summary?.overall)}`}>
                  {(technicalIndicators.summary?.overall || 'NEUTRAL').replace('_', ' ')}
                </p>
              </div>
            </div>

            <div className="mt-4 space-y-3">
              <div className="flex items-center justify-between">
                <span className={isDarkMode ? 'text-gray-400' : 'text-gray-600'}>Moving Averages</span>
                <span className={`font-medium ${getSignalColor(technicalIndicators.summary?.maSignal)}`}>
                  {technicalIndicators.summary?.maSignal?.replace('_', ' ')}
                </span>
              </div>
              <div className="flex items-center justify-between">
                <span className={isDarkMode ? 'text-gray-400' : 'text-gray-600'}>Oscillators</span>
                <span className={`font-medium ${getSignalColor(technicalIndicators.summary?.oscillatorSignal)}`}>
                  {technicalIndicators.summary?.oscillatorSignal}
                </span>
              </div>
              <div className={`pt-3 border-t ${isDarkMode ? 'border-gray-700' : 'border-gray-200'}`}>
                <div className="flex items-center justify-between text-sm">
                  <span className="text-green-500">Buy: {technicalIndicators.summary?.buyCount || 0}</span>
                  <span className="text-yellow-500">Neutral: {technicalIndicators.summary?.neutralCount || 0}</span>
                  <span className="text-red-500">Sell: {technicalIndicators.summary?.sellCount || 0}</span>
                </div>
              </div>
            </div>
          </div>

          {/* Oscillators */}
          <div className={`rounded-xl p-6 ${isDarkMode ? 'bg-dark-800 border border-gray-700' : 'bg-white border border-gray-200'}`}>
            <h3 className={`text-lg font-semibold mb-4 ${isDarkMode ? 'text-white' : 'text-gray-900'}`}>Oscillators</h3>
            <div className="space-y-4">
              {technicalIndicators.oscillators && Object.entries(technicalIndicators.oscillators).map(([key, data]) => (
                <div key={key} className="flex items-center justify-between">
                  <div>
                    <p className={`font-medium ${isDarkMode ? 'text-white' : 'text-gray-900'}`}>{key.toUpperCase()}</p>
                    <p className={`text-sm ${isDarkMode ? 'text-gray-400' : 'text-gray-500'}`}>{data.value}</p>
                  </div>
                  <span className={`px-3 py-1 rounded-full text-xs font-medium ${getSignalBg(data.signal)} ${getSignalColor(data.signal)}`}>
                    {data.signal}
                  </span>
                </div>
              ))}
            </div>
          </div>

          {/* Moving Averages */}
          <div className={`rounded-xl p-6 ${isDarkMode ? 'bg-dark-800 border border-gray-700' : 'bg-white border border-gray-200'}`}>
            <h3 className={`text-lg font-semibold mb-4 ${isDarkMode ? 'text-white' : 'text-gray-900'}`}>Moving Averages</h3>
            <div className="space-y-4">
              {technicalIndicators.ma && Object.entries(technicalIndicators.ma).map(([key, data]) => (
                <div key={key} className="flex items-center justify-between">
                  <div>
                    <p className={`font-medium ${isDarkMode ? 'text-white' : 'text-gray-900'}`}>{key.toUpperCase()}</p>
                    <p className={`text-sm ${isDarkMode ? 'text-gray-400' : 'text-gray-500'}`}>{data.value}</p>
                  </div>
                  <span className={`px-3 py-1 rounded-full text-xs font-medium ${getSignalBg(data.signal)} ${getSignalColor(data.signal)}`}>
                    {data.signal}
                  </span>
                </div>
              ))}
            </div>
          </div>
        </div>

        {/* Pivot Points */}
        <div className={`rounded-xl p-6 ${isDarkMode ? 'bg-dark-800 border border-gray-700' : 'bg-white border border-gray-200'}`}>
          <h3 className={`text-lg font-semibold mb-4 ${isDarkMode ? 'text-white' : 'text-gray-900'}`}>Pivot Points</h3>
          <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
            {/* Classic Pivots */}
            <div>
              <h4 className={`text-sm font-medium mb-3 ${isDarkMode ? 'text-gray-400' : 'text-gray-600'}`}>Classic</h4>
              <div className="space-y-2">
                {technicalIndicators.pivots?.classic && Object.entries(technicalIndicators.pivots.classic).map(([key, value]) => (
                  <div key={key} className={`flex items-center justify-between p-2 rounded-lg ${
                    key.startsWith('r') ? 'bg-red-500/10' : key.startsWith('s') ? 'bg-green-500/10' : isDarkMode ? 'bg-dark-700' : 'bg-gray-100'
                  }`}>
                    <span className={`font-medium ${
                      key.startsWith('r') ? 'text-red-500' : key.startsWith('s') ? 'text-green-500' : isDarkMode ? 'text-white' : 'text-gray-900'
                    }`}>{key.toUpperCase()}</span>
                    <span className={isDarkMode ? 'text-gray-300' : 'text-gray-700'}>{value}</span>
                  </div>
                ))}
              </div>
            </div>

            {/* Fibonacci Pivots */}
            <div>
              <h4 className={`text-sm font-medium mb-3 ${isDarkMode ? 'text-gray-400' : 'text-gray-600'}`}>Fibonacci</h4>
              <div className="space-y-2">
                {technicalIndicators.pivots?.fibonacci && Object.entries(technicalIndicators.pivots.fibonacci).map(([key, value]) => (
                  <div key={key} className={`flex items-center justify-between p-2 rounded-lg ${
                    key.startsWith('r') ? 'bg-red-500/10' : key.startsWith('s') ? 'bg-green-500/10' : isDarkMode ? 'bg-dark-700' : 'bg-gray-100'
                  }`}>
                    <span className={`font-medium ${
                      key.startsWith('r') ? 'text-red-500' : key.startsWith('s') ? 'text-green-500' : isDarkMode ? 'text-white' : 'text-gray-900'
                    }`}>{key.toUpperCase()}</span>
                    <span className={isDarkMode ? 'text-gray-300' : 'text-gray-700'}>{value}</span>
                  </div>
                ))}
              </div>
            </div>
          </div>
        </div>

        {/* Trading Signals */}
        <div className={`rounded-xl p-6 ${isDarkMode ? 'bg-dark-800 border border-gray-700' : 'bg-white border border-gray-200'}`}>
          <h3 className={`text-lg font-semibold mb-4 ${isDarkMode ? 'text-white' : 'text-gray-900'}`}>Recent Trading Signals</h3>
          <div className="space-y-3">
            {signals.map((signal, index) => (
              <div key={index} className={`flex items-center justify-between p-4 rounded-xl border ${isDarkMode ? 'bg-dark-700 border-gray-600' : 'bg-gray-50 border-gray-200'}`}>
                <div className="flex items-center gap-4">
                  <div className={`w-12 h-12 rounded-xl flex items-center justify-center ${getSignalBg(signal.type)}`}>
                    {signal.type === 'BUY' ? (
                      <TrendingUp className="text-green-500" size={24} />
                    ) : signal.type === 'SELL' ? (
                      <TrendingDown className="text-red-500" size={24} />
                    ) : (
                      <Minus className="text-yellow-500" size={24} />
                    )}
                  </div>
                  <div>
                    <div className="flex items-center gap-2">
                      <span className={`font-semibold ${getSignalColor(signal.type)}`}>{signal.type}</span>
                      <span className={isDarkMode ? 'text-gray-400' : 'text-gray-500'}>•</span>
                      <span className={isDarkMode ? 'text-white' : 'text-gray-900'}>{signal.indicator}</span>
                    </div>
                    <p className={`text-sm ${isDarkMode ? 'text-gray-400' : 'text-gray-500'}`}>{signal.description}</p>
                  </div>
                </div>
                <div className="text-right">
                  <span className={`px-2 py-1 rounded text-xs ${
                    signal.strength === 'Strong' ? 'bg-green-500/20 text-green-500' :
                    signal.strength === 'Medium' ? 'bg-yellow-500/20 text-yellow-500' :
                    'bg-gray-500/20 text-gray-500'
                  }`}>
                    {signal.strength}
                  </span>
                  <p className={`text-xs mt-1 ${isDarkMode ? 'text-gray-500' : 'text-gray-400'}`}>{signal.time}</p>
                </div>
              </div>
            ))}
          </div>
        </div>

        {/* Price Alerts */}
        {priceAlerts.length > 0 && (
          <div className={`rounded-xl p-6 ${isDarkMode ? 'bg-dark-800 border border-gray-700' : 'bg-white border border-gray-200'}`}>
            <h3 className={`text-lg font-semibold mb-4 ${isDarkMode ? 'text-white' : 'text-gray-900'}`}>Active Price Alerts</h3>
            <div className="space-y-2">
              {priceAlerts.map(alert => (
                <div key={alert.id} className={`flex items-center justify-between p-3 rounded-lg ${isDarkMode ? 'bg-dark-700' : 'bg-gray-50'}`}>
                  <div className="flex items-center gap-3">
                    <Bell size={18} className="text-yellow-500" />
                    <span className={isDarkMode ? 'text-white' : 'text-gray-900'}>
                      {alert.symbol} {alert.condition} {alert.price}
                    </span>
                  </div>
                  <button onClick={() => removeAlert(alert.id)} className="text-red-500 hover:text-red-400">
                    Remove
                  </button>
                </div>
              ))}
            </div>
          </div>
        )}

        {/* Alert Modal */}
        {showAlertModal && (
          <div className="fixed inset-0 bg-black/50 flex items-center justify-center z-50">
            <div className={`w-full max-w-md rounded-2xl p-6 ${isDarkMode ? 'bg-dark-800' : 'bg-white'}`}>
              <h3 className={`text-xl font-semibold mb-4 ${isDarkMode ? 'text-white' : 'text-gray-900'}`}>Set Price Alert</h3>
              <div className="space-y-4">
                <div>
                  <label className={`block text-sm mb-1 ${isDarkMode ? 'text-gray-400' : 'text-gray-600'}`}>Symbol</label>
                  <select
                    value={newAlert.symbol}
                    onChange={(e) => setNewAlert({ ...newAlert, symbol: e.target.value })}
                    className={`w-full px-4 py-2 rounded-lg border ${isDarkMode ? 'bg-dark-700 border-gray-600 text-white' : 'bg-gray-50 border-gray-300 text-gray-900'}`}
                  >
                    {symbols.map(s => (
                      <option key={s.symbol} value={s.symbol}>{s.symbol}</option>
                    ))}
                  </select>
                </div>
                <div>
                  <label className={`block text-sm mb-1 ${isDarkMode ? 'text-gray-400' : 'text-gray-600'}`}>Condition</label>
                  <select
                    value={newAlert.condition}
                    onChange={(e) => setNewAlert({ ...newAlert, condition: e.target.value })}
                    className={`w-full px-4 py-2 rounded-lg border ${isDarkMode ? 'bg-dark-700 border-gray-600 text-white' : 'bg-gray-50 border-gray-300 text-gray-900'}`}
                  >
                    <option value="above">Price goes above</option>
                    <option value="below">Price goes below</option>
                  </select>
                </div>
                <div>
                  <label className={`block text-sm mb-1 ${isDarkMode ? 'text-gray-400' : 'text-gray-600'}`}>Price</label>
                  <input
                    type="number"
                    value={newAlert.price}
                    onChange={(e) => setNewAlert({ ...newAlert, price: e.target.value })}
                    placeholder="Enter price"
                    className={`w-full px-4 py-2 rounded-lg border ${isDarkMode ? 'bg-dark-700 border-gray-600 text-white' : 'bg-gray-50 border-gray-300 text-gray-900'}`}
                  />
                </div>
                <div className="flex gap-3 pt-4">
                  <button
                    onClick={() => setShowAlertModal(false)}
                    className={`flex-1 px-4 py-2 rounded-lg border ${isDarkMode ? 'border-gray-600 text-gray-300 hover:bg-dark-700' : 'border-gray-300 text-gray-700 hover:bg-gray-100'}`}
                  >
                    Cancel
                  </button>
                  <button
                    onClick={addPriceAlert}
                    className="flex-1 px-4 py-2 rounded-lg bg-gradient-to-r from-cyan-500 to-emerald-500 text-white hover:from-cyan-600 hover:to-emerald-600"
                  >
                    Set Alert
                  </button>
                </div>
              </div>
            </div>
          </div>
        )}
      </div>
    </AdminLayout>
  )
}

export default AdminTechnicalAnalysis
