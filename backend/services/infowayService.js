import WebSocket from 'ws'
import dotenv from 'dotenv'

dotenv.config()

const INFOWAY_API_KEY = process.env.INFOWAY_API_KEY

// WebSocket URLs
const WS_FOREX_URL = `wss://data.infoway.io/ws?business=common&apikey=${INFOWAY_API_KEY}`
const WS_CRYPTO_URL = `wss://data.infoway.io/ws?business=crypto&apikey=${INFOWAY_API_KEY}`

// Symbol mappings - Infoway uses different format
const FOREX_SYMBOLS = [
  'EURUSD', 'GBPUSD', 'USDJPY', 'USDCHF', 'AUDUSD', 'NZDUSD', 'USDCAD',
  'EURGBP', 'EURJPY', 'GBPJPY', 'EURCHF', 'EURAUD', 'EURCAD', 'GBPAUD',
  'GBPCAD', 'AUDCAD', 'AUDJPY', 'CADJPY', 'CHFJPY', 'NZDJPY', 'AUDNZD',
  'XAUUSD', 'XAGUSD'
]

const CRYPTO_SYMBOLS = [
  'BTCUSD', 'ETHUSD', 'BNBUSD', 'XRPUSD', 'SOLUSD', 'ADAUSD', 'DOGEUSD',
  'DOTUSD', 'MATICUSD', 'LTCUSD', 'LINKUSD', 'AVAXUSD', 'ATOMUSD'
]

// Infoway symbol format mapping
const toInfowaySymbol = (symbol) => {
  if (CRYPTO_SYMBOLS.includes(symbol)) {
    return symbol.replace('USD', 'USDT')
  }
  return symbol
}

const fromInfowaySymbol = (infowaySymbol) => {
  if (infowaySymbol.endsWith('USDT')) {
    return infowaySymbol.replace('USDT', 'USD')
  }
  return infowaySymbol
}

const SUPPORTED_SYMBOLS = [...FOREX_SYMBOLS, ...CRYPTO_SYMBOLS]

// Fallback prices
const FALLBACK_PRICES = {
  'EURUSD': { bid: 1.0850, ask: 1.0852 },
  'GBPUSD': { bid: 1.2650, ask: 1.2652 },
  'USDJPY': { bid: 149.50, ask: 149.52 },
  'XAUUSD': { bid: 2870.00, ask: 2870.50 },
  'BTCUSD': { bid: 97000.00, ask: 97050.00 },
  'ETHUSD': { bid: 2650.00, ask: 2652.00 }
}

class InfowayService {
  constructor() {
    this.forexWs = null
    this.cryptoWs = null
    this.isConnected = false
    this.prices = new Map()
    this.subscribers = new Set()
    this.reconnectInterval = null
  }

  async connect() {
    if (!INFOWAY_API_KEY) {
      console.error('[Infoway] No INFOWAY_API_KEY configured')
      return false
    }

    try {
      console.log('[Infoway] Connecting to WebSocket...')
      await this.connectForex()
      await this.connectCrypto()
      this.startHeartbeat()
      this.isConnected = true
      console.log('[Infoway] Connected successfully!')
      return true
    } catch (error) {
      console.error('[Infoway] Connection error:', error.message)
      return false
    }
  }

  connectForex() {
    return new Promise((resolve, reject) => {
      this.forexWs = new WebSocket(WS_FOREX_URL)
      
      this.forexWs.on('open', () => {
        console.log('[Infoway] Forex WebSocket connected')
        this.subscribeToDepth(this.forexWs, FOREX_SYMBOLS)
        resolve()
      })

      this.forexWs.on('message', (data) => this.handleMessage(data))
      this.forexWs.on('error', (err) => console.error('[Infoway] Forex WS error:', err.message))
      this.forexWs.on('close', () => {
        console.log('[Infoway] Forex WS closed, reconnecting...')
        setTimeout(() => this.connectForex(), 5000)
      })

      setTimeout(() => reject(new Error('Forex connection timeout')), 10000)
    })
  }

  connectCrypto() {
    return new Promise((resolve, reject) => {
      this.cryptoWs = new WebSocket(WS_CRYPTO_URL)
      
      this.cryptoWs.on('open', () => {
        console.log('[Infoway] Crypto WebSocket connected')
        this.subscribeToDepth(this.cryptoWs, CRYPTO_SYMBOLS.map(toInfowaySymbol))
        resolve()
      })

      this.cryptoWs.on('message', (data) => this.handleMessage(data))
      this.cryptoWs.on('error', (err) => console.error('[Infoway] Crypto WS error:', err.message))
      this.cryptoWs.on('close', () => {
        console.log('[Infoway] Crypto WS closed, reconnecting...')
        setTimeout(() => this.connectCrypto(), 5000)
      })

      setTimeout(() => reject(new Error('Crypto connection timeout')), 10000)
    })
  }

  subscribeToDepth(ws, symbols) {
    const msg = {
      code: 10003,
      trace: Date.now().toString(),
      data: { codes: symbols.join(',') }
    }
    ws.send(JSON.stringify(msg))
    console.log(`[Infoway] Subscribed to ${symbols.length} symbols`)
  }

  handleMessage(data) {
    try {
      const msg = JSON.parse(data.toString())
      
      // Depth push (code 10005) contains bid/ask
      if (msg.code === 10005 && msg.data) {
        const infowaySymbol = msg.data.s
        const symbol = fromInfowaySymbol(infowaySymbol)
        
        // a = ask side, b = bid side
        // a[0] = ask prices array, b[0] = bid prices array
        const askPrice = msg.data.a?.[0]?.[0]
        const bidPrice = msg.data.b?.[0]?.[0]
        
        if (bidPrice && askPrice) {
          const priceData = {
            bid: parseFloat(bidPrice),
            ask: parseFloat(askPrice),
            time: msg.data.t || Date.now()
          }
          
          this.prices.set(symbol, priceData)
          
          // Notify subscribers
          this.subscribers.forEach(callback => {
            try { callback(symbol, priceData) } catch (e) {}
          })
        }
      }
    } catch (e) {
      // Ignore parse errors
    }
  }

  startHeartbeat() {
    setInterval(() => {
      const ping = { code: 10010, trace: Date.now().toString() }
      if (this.forexWs?.readyState === WebSocket.OPEN) {
        this.forexWs.send(JSON.stringify(ping))
      }
      if (this.cryptoWs?.readyState === WebSocket.OPEN) {
        this.cryptoWs.send(JSON.stringify(ping))
      }
    }, 30000)
  }

  getPrice(symbol) {
    return this.prices.get(symbol) || FALLBACK_PRICES[symbol] || null
  }

  getAllPrices() {
    const prices = {}
    this.prices.forEach((price, symbol) => { prices[symbol] = price })
    return prices
  }

  subscribe(callback) {
    this.subscribers.add(callback)
    return () => this.subscribers.delete(callback)
  }

  async fetchBatchPrices(symbols) {
    const prices = {}
    symbols.forEach(symbol => {
      const price = this.getPrice(symbol)
      if (price) prices[symbol] = price
    })
    return prices
  }

  getSymbols() { return SUPPORTED_SYMBOLS }
  isCrypto(symbol) { return CRYPTO_SYMBOLS.includes(symbol) }

  async disconnect() {
    if (this.forexWs) this.forexWs.close()
    if (this.cryptoWs) this.cryptoWs.close()
    this.isConnected = false
  }
}

const infowayService = new InfowayService()
export default infowayService
export { SUPPORTED_SYMBOLS, CRYPTO_SYMBOLS, FALLBACK_PRICES }
