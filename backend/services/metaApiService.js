import WebSocket from 'ws'
import dotenv from 'dotenv'

dotenv.config()

// MetaApi Configuration
const META_API_TOKEN = process.env.META_API_TOKEN
const META_API_ACCOUNT_ID = process.env.META_API_ACCOUNT_ID

// MetaApi WebSocket endpoints
const META_API_WS_URL = `wss://mt-client-api-v1.agiliumtrade.agiliumtrade.ai/ws`
const META_API_REST_URL = 'https://mt-client-api-v1.agiliumtrade.agiliumtrade.ai'

// Symbol mapping for MetaApi (MT5 format)
const META_API_SYMBOL_MAP = {
  // Forex Majors
  'EURUSD': 'EURUSD', 'GBPUSD': 'GBPUSD', 'USDJPY': 'USDJPY', 'USDCHF': 'USDCHF',
  'AUDUSD': 'AUDUSD', 'NZDUSD': 'NZDUSD', 'USDCAD': 'USDCAD',
  
  // Forex Crosses
  'EURGBP': 'EURGBP', 'EURJPY': 'EURJPY', 'GBPJPY': 'GBPJPY', 'EURCHF': 'EURCHF',
  'EURAUD': 'EURAUD', 'EURCAD': 'EURCAD', 'GBPAUD': 'GBPAUD', 'GBPCAD': 'GBPCAD',
  'AUDCAD': 'AUDCAD', 'AUDJPY': 'AUDJPY', 'CADJPY': 'CADJPY', 'CHFJPY': 'CHFJPY',
  'NZDJPY': 'NZDJPY', 'AUDNZD': 'AUDNZD', 'CADCHF': 'CADCHF', 'GBPCHF': 'GBPCHF',
  'GBPNZD': 'GBPNZD', 'EURNZD': 'EURNZD', 'NZDCAD': 'NZDCAD', 'NZDCHF': 'NZDCHF',
  'AUDCHF': 'AUDCHF',
  
  // Forex Exotics
  'USDSGD': 'USDSGD', 'EURSGD': 'EURSGD', 'GBPSGD': 'GBPSGD', 'AUDSGD': 'AUDSGD',
  'SGDJPY': 'SGDJPY', 'USDHKD': 'USDHKD', 'USDZAR': 'USDZAR', 'EURZAR': 'EURZAR',
  'GBPZAR': 'GBPZAR', 'ZARJPY': 'ZARJPY', 'USDTRY': 'USDTRY', 'EURTRY': 'EURTRY',
  'TRYJPY': 'TRYJPY', 'USDMXN': 'USDMXN', 'EURMXN': 'EURMXN', 'MXNJPY': 'MXNJPY',
  'USDPLN': 'USDPLN', 'EURPLN': 'EURPLN', 'GBPPLN': 'GBPPLN', 'USDSEK': 'USDSEK',
  'EURSEK': 'EURSEK', 'GBPSEK': 'GBPSEK', 'SEKJPY': 'SEKJPY', 'USDNOK': 'USDNOK',
  'EURNOK': 'EURNOK', 'GBPNOK': 'GBPNOK', 'NOKJPY': 'NOKJPY', 'USDDKK': 'USDDKK',
  'EURDKK': 'EURDKK', 'DKKJPY': 'DKKJPY', 'USDCNH': 'USDCNH', 'CNHJPY': 'CNHJPY',
  'USDHUF': 'USDHUF', 'EURHUF': 'EURHUF', 'USDCZK': 'USDCZK', 'EURCZK': 'EURCZK',
  
  // Metals
  'XAUUSD': 'XAUUSD', 'XAGUSD': 'XAGUSD', 'XPTUSD': 'XPTUSD', 'XPDUSD': 'XPDUSD',
  
  // Commodities
  'USOIL': 'USOIL', 'UKOIL': 'UKOIL', 'NGAS': 'NGAS', 'COPPER': 'COPPER',
  
  // Crypto (common MT5 broker symbols)
  'BTCUSD': 'BTCUSD', 'ETHUSD': 'ETHUSD', 'LTCUSD': 'LTCUSD', 'XRPUSD': 'XRPUSD',
  'BCHUSD': 'BCHUSD', 'BNBUSD': 'BNBUSD', 'ADAUSD': 'ADAUSD', 'DOTUSD': 'DOTUSD',
  'SOLUSD': 'SOLUSD', 'DOGEUSD': 'DOGEUSD', 'MATICUSD': 'MATICUSD', 'AVAXUSD': 'AVAXUSD',
  'LINKUSD': 'LINKUSD', 'UNIUSD': 'UNIUSD', 'ATOMUSD': 'ATOMUSD', 'XLMUSD': 'XLMUSDT',
  'ALGOUSD': 'ALGOUSD', 'VETUSD': 'VETUSD', 'ICPUSD': 'ICPUSD', 'FILUSD': 'FILUSD',
  'TRXUSD': 'TRXUSD', 'ETCUSD': 'ETCUSD', 'XMRUSD': 'XMRUSD', 'EOSUSD': 'EOSUSD',
  'AAVEUSD': 'AAVEUSD', 'MKRUSD': 'MKRUSD', 'COMPUSD': 'COMPUSD', 'SNXUSD': 'SNXUSD',
  'YFIUSD': 'YFIUSD', 'SUSHIUSD': 'SUSHIUSD', 'NEARUSD': 'NEARUSD', 'FTMUSD': 'FTMUSD',
  'SANDUSD': 'SANDUSD', 'MANAUSD': 'MANAUSD', 'AXSUSD': 'AXSUSD', 'GALAUSD': 'GALAUSD',
  'APEUSD': 'APEUSD', 'GMTUSD': 'GMTUSD', 'OPUSD': 'OPUSD', 'ARBUSD': 'ARBUSD',
  'PEPEUSD': 'PEPEUSD', 'SHIBUSD': 'SHIBUSD', 'TONUSD': 'TONUSD', 'HBARUSD': 'HBARUSDT'
}

// Reverse mapping
const META_API_REVERSE_MAP = Object.fromEntries(
  Object.entries(META_API_SYMBOL_MAP).map(([k, v]) => [v, k])
)

// All supported symbols
const SUPPORTED_SYMBOLS = Object.keys(META_API_SYMBOL_MAP)

// Crypto symbols for categorization
const CRYPTO_SYMBOLS = SUPPORTED_SYMBOLS.filter(s => 
  s.endsWith('USD') && !['EURUSD', 'GBPUSD', 'USDJPY', 'USDCHF', 'AUDUSD', 'NZDUSD', 'USDCAD',
    'XAUUSD', 'XAGUSD', 'XPTUSD', 'XPDUSD', 'USOIL', 'UKOIL'].includes(s) &&
  !s.includes('JPY') && !s.includes('CHF') && !s.includes('CAD') && !s.includes('AUD') &&
  !s.includes('NZD') && !s.includes('GBP') && !s.includes('EUR') && !s.includes('SGD') &&
  !s.includes('HKD') && !s.includes('ZAR') && !s.includes('TRY') && !s.includes('MXN') &&
  !s.includes('PLN') && !s.includes('SEK') && !s.includes('NOK') && !s.includes('DKK') &&
  !s.includes('CNH') && !s.includes('HUF') && !s.includes('CZK')
)

// Fallback static prices
const FALLBACK_PRICES = {
  'EURUSD': { bid: 1.0850, ask: 1.0852 },
  'GBPUSD': { bid: 1.2650, ask: 1.2652 },
  'USDJPY': { bid: 149.50, ask: 149.52 },
  'USDCHF': { bid: 0.8820, ask: 0.8822 },
  'AUDUSD': { bid: 0.6550, ask: 0.6552 },
  'NZDUSD': { bid: 0.6150, ask: 0.6152 },
  'USDCAD': { bid: 1.3550, ask: 1.3552 },
  'XAUUSD': { bid: 2870.00, ask: 2870.50 },
  'XAGUSD': { bid: 32.10, ask: 32.12 },
  'BTCUSD': { bid: 97000.00, ask: 97050.00 },
  'ETHUSD': { bid: 2650.00, ask: 2652.00 }
}

class MetaApiService {
  constructor() {
    this.ws = null
    this.isConnected = false
    this.prices = new Map()
    this.subscribers = new Set()
    this.reconnectAttempts = 0
    this.maxReconnectAttempts = 10
    this.reconnectDelay = 1000
    this.pingInterval = null
    this.subscribedSymbols = new Set()
    this.authToken = null
  }

  async getAuthToken() {
    if (!META_API_TOKEN) {
      console.error('[MetaApi] No META_API_TOKEN configured')
      return null
    }
    return META_API_TOKEN
  }

  async connect() {
    if (this.isConnected && this.ws?.readyState === WebSocket.OPEN) {
      return true
    }

    const token = await this.getAuthToken()
    if (!token) {
      console.error('[MetaApi] Cannot connect without auth token')
      return false
    }

    return new Promise((resolve) => {
      try {
        // MetaApi WebSocket connection with auth
        const wsUrl = `${META_API_WS_URL}?auth-token=${token}`
        this.ws = new WebSocket(wsUrl)

        this.ws.on('open', () => {
          console.log('[MetaApi] WebSocket connected')
          this.isConnected = true
          this.reconnectAttempts = 0
          
          // Start ping interval to keep connection alive
          this.pingInterval = setInterval(() => {
            if (this.ws?.readyState === WebSocket.OPEN) {
              this.ws.ping()
            }
          }, 30000)

          // Subscribe to account if configured
          if (META_API_ACCOUNT_ID) {
            this.subscribeToAccount(META_API_ACCOUNT_ID)
          }

          resolve(true)
        })

        this.ws.on('message', (data) => {
          try {
            const message = JSON.parse(data.toString())
            this.handleMessage(message)
          } catch (e) {
            console.error('[MetaApi] Error parsing message:', e.message)
          }
        })

        this.ws.on('error', (error) => {
          console.error('[MetaApi] WebSocket error:', error.message)
        })

        this.ws.on('close', () => {
          console.log('[MetaApi] WebSocket disconnected')
          this.isConnected = false
          
          if (this.pingInterval) {
            clearInterval(this.pingInterval)
            this.pingInterval = null
          }

          // Attempt reconnection
          if (this.reconnectAttempts < this.maxReconnectAttempts) {
            this.reconnectAttempts++
            const delay = this.reconnectDelay * Math.pow(2, this.reconnectAttempts - 1)
            console.log(`[MetaApi] Reconnecting in ${delay}ms (attempt ${this.reconnectAttempts})`)
            setTimeout(() => this.connect(), delay)
          }
        })

        // Timeout for connection
        setTimeout(() => {
          if (!this.isConnected) {
            console.log('[MetaApi] Connection timeout')
            resolve(false)
          }
        }, 10000)

      } catch (error) {
        console.error('[MetaApi] Connection error:', error.message)
        resolve(false)
      }
    })
  }

  subscribeToAccount(accountId) {
    if (!this.ws || this.ws.readyState !== WebSocket.OPEN) return

    // Subscribe to account synchronization
    this.ws.send(JSON.stringify({
      type: 'subscribe',
      accountId: accountId,
      subscriptions: ['quotes']
    }))

    console.log(`[MetaApi] Subscribed to account ${accountId}`)
  }

  subscribeToSymbols(symbols) {
    if (!this.ws || this.ws.readyState !== WebSocket.OPEN) return

    const newSymbols = symbols.filter(s => !this.subscribedSymbols.has(s))
    if (newSymbols.length === 0) return

    // Subscribe to market data for symbols
    newSymbols.forEach(symbol => {
      const metaSymbol = META_API_SYMBOL_MAP[symbol] || symbol
      this.ws.send(JSON.stringify({
        type: 'subscribeToMarketData',
        accountId: META_API_ACCOUNT_ID,
        symbol: metaSymbol,
        subscriptions: ['quotes']
      }))
      this.subscribedSymbols.add(symbol)
    })

    console.log(`[MetaApi] Subscribed to ${newSymbols.length} symbols`)
  }

  handleMessage(message) {
    // Handle different message types from MetaApi
    switch (message.type) {
      case 'quote':
      case 'tick':
        this.handleQuote(message)
        break
      case 'prices':
        this.handlePrices(message)
        break
      case 'synchronization':
        console.log('[MetaApi] Synchronization:', message.synchronizationId)
        break
      case 'authenticated':
        console.log('[MetaApi] Authenticated successfully')
        break
      case 'error':
        console.error('[MetaApi] Error:', message.error)
        break
    }
  }

  handleQuote(data) {
    const symbol = META_API_REVERSE_MAP[data.symbol] || data.symbol
    const price = {
      bid: parseFloat(data.bid),
      ask: parseFloat(data.ask),
      time: data.time || Date.now()
    }
    
    this.prices.set(symbol, price)
    
    // Notify subscribers
    this.subscribers.forEach(callback => {
      try {
        callback(symbol, price)
      } catch (e) {
        console.error('[MetaApi] Subscriber error:', e.message)
      }
    })
  }

  handlePrices(data) {
    if (data.prices && Array.isArray(data.prices)) {
      data.prices.forEach(p => {
        const symbol = META_API_REVERSE_MAP[p.symbol] || p.symbol
        const price = {
          bid: parseFloat(p.bid),
          ask: parseFloat(p.ask),
          time: p.time || Date.now()
        }
        this.prices.set(symbol, price)
      })
    }
  }

  subscribe(callback) {
    this.subscribers.add(callback)
    return () => this.subscribers.delete(callback)
  }

  getPrice(symbol) {
    return this.prices.get(symbol) || FALLBACK_PRICES[symbol] || null
  }

  getAllPrices() {
    const prices = {}
    this.prices.forEach((price, symbol) => {
      prices[symbol] = price
    })
    return prices
  }

  async fetchPrice(symbol) {
    // Try to get from cache first
    const cached = this.prices.get(symbol)
    if (cached && (Date.now() - cached.time) < 5000) {
      return cached
    }

    // If not connected or no cached price, try REST API
    if (!META_API_TOKEN || !META_API_ACCOUNT_ID) {
      return FALLBACK_PRICES[symbol] || null
    }

    try {
      const metaSymbol = META_API_SYMBOL_MAP[symbol] || symbol
      const response = await fetch(
        `${META_API_REST_URL}/users/current/accounts/${META_API_ACCOUNT_ID}/symbols/${metaSymbol}/current-price`,
        {
          headers: {
            'auth-token': META_API_TOKEN
          }
        }
      )

      if (!response.ok) {
        console.error(`[MetaApi] REST error for ${symbol}: ${response.status}`)
        return FALLBACK_PRICES[symbol] || null
      }

      const data = await response.json()
      const price = {
        bid: parseFloat(data.bid),
        ask: parseFloat(data.ask),
        time: Date.now()
      }

      this.prices.set(symbol, price)
      return price
    } catch (error) {
      console.error(`[MetaApi] Error fetching ${symbol}:`, error.message)
      return FALLBACK_PRICES[symbol] || null
    }
  }

  async fetchBatchPrices(symbols) {
    const prices = {}
    
    // First, add any cached prices
    symbols.forEach(symbol => {
      const cached = this.prices.get(symbol)
      if (cached) {
        prices[symbol] = cached
      } else if (FALLBACK_PRICES[symbol]) {
        prices[symbol] = FALLBACK_PRICES[symbol]
      }
    })

    // If connected via WebSocket, prices should already be streaming
    if (this.isConnected) {
      return prices
    }

    // Otherwise, fetch missing prices via REST (limited to avoid rate limits)
    const missingSymbols = symbols.filter(s => !prices[s]).slice(0, 10)
    
    for (const symbol of missingSymbols) {
      const price = await this.fetchPrice(symbol)
      if (price) {
        prices[symbol] = price
      }
    }

    return prices
  }

  disconnect() {
    if (this.pingInterval) {
      clearInterval(this.pingInterval)
      this.pingInterval = null
    }

    if (this.ws) {
      this.ws.close()
      this.ws = null
    }

    this.isConnected = false
    this.subscribedSymbols.clear()
    this.subscribers.clear()
  }

  // Get supported symbols
  getSymbols() {
    return SUPPORTED_SYMBOLS
  }

  // Get symbol map
  getSymbolMap() {
    return META_API_SYMBOL_MAP
  }

  // Check if symbol is crypto
  isCrypto(symbol) {
    return CRYPTO_SYMBOLS.includes(symbol)
  }
}

// Singleton instance
const metaApiService = new MetaApiService()

export default metaApiService
export { SUPPORTED_SYMBOLS, META_API_SYMBOL_MAP, CRYPTO_SYMBOLS, FALLBACK_PRICES }
