import MetaApi, { SynchronizationListener } from 'metaapi.cloud-sdk/esm-node'
import dotenv from 'dotenv'

dotenv.config()

// MetaApi Configuration
const META_API_TOKEN = process.env.META_API_TOKEN
const META_API_ACCOUNT_ID = process.env.META_API_ACCOUNT_ID

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

// Fallback static prices for ALL 116 supported symbols
// NOTE: These are USED ONLY when LP doesn't supply a symbol.
// Updated to ~2026-Q2 levels so fallback isn't grossly outdated.
const FALLBACK_PRICES = {
  // ========== FOREX MAJORS (7) ==========
  'EURUSD': { bid: 1.1320, ask: 1.1322 },
  'GBPUSD': { bid: 1.3450, ask: 1.3452 },
  'USDJPY': { bid: 145.50, ask: 145.52 },
  'USDCHF': { bid: 0.8050, ask: 0.8052 },
  'AUDUSD': { bid: 0.6450, ask: 0.6452 },
  'NZDUSD': { bid: 0.5980, ask: 0.5982 },
  'USDCAD': { bid: 1.3950, ask: 1.3952 },

  // ========== FOREX CROSSES (21) ==========
  'EURGBP': { bid: 0.8420, ask: 0.8422 },
  'EURJPY': { bid: 164.80, ask: 164.82 },
  'GBPJPY': { bid: 195.80, ask: 195.82 },
  'EURCHF': { bid: 0.9120, ask: 0.9122 },
  'EURAUD': { bid: 1.7550, ask: 1.7552 },
  'EURCAD': { bid: 1.5790, ask: 1.5792 },
  'GBPAUD': { bid: 2.0850, ask: 2.0852 },
  'GBPCAD': { bid: 1.8770, ask: 1.8772 },
  'AUDCAD': { bid: 0.9000, ask: 0.9002 },
  'AUDJPY': { bid: 93.85, ask: 93.87 },
  'CADJPY': { bid: 104.30, ask: 104.32 },
  'CHFJPY': { bid: 180.70, ask: 180.72 },
  'NZDJPY': { bid: 87.05, ask: 87.07 },
  'AUDNZD': { bid: 1.0785, ask: 1.0787 },
  'CADCHF': { bid: 0.5770, ask: 0.5772 },
  'GBPCHF': { bid: 1.0825, ask: 1.0827 },
  'GBPNZD': { bid: 2.2490, ask: 2.2492 },
  'EURNZD': { bid: 1.8930, ask: 1.8932 },
  'NZDCAD': { bid: 0.8340, ask: 0.8342 },
  'NZDCHF': { bid: 0.4820, ask: 0.4822 },
  'AUDCHF': { bid: 0.5195, ask: 0.5197 },

  // ========== FOREX EXOTICS (36) ==========
  'USDSGD': { bid: 1.2920, ask: 1.2922 },
  'EURSGD': { bid: 1.4625, ask: 1.4627 },
  'GBPSGD': { bid: 1.7378, ask: 1.7380 },
  'AUDSGD': { bid: 0.8333, ask: 0.8335 },
  'SGDJPY': { bid: 112.60, ask: 112.62 },
  'USDHKD': { bid: 7.7820, ask: 7.7822 },
  'USDZAR': { bid: 18.20, ask: 18.22 },
  'EURZAR': { bid: 20.60, ask: 20.62 },
  'GBPZAR': { bid: 24.48, ask: 24.50 },
  'ZARJPY': { bid: 8.00, ask: 8.01 },
  'USDTRY': { bid: 38.50, ask: 38.55 },
  'EURTRY': { bid: 43.58, ask: 43.62 },
  'TRYJPY': { bid: 3.78, ask: 3.79 },
  'USDMXN': { bid: 19.40, ask: 19.42 },
  'EURMXN': { bid: 21.96, ask: 21.98 },
  'MXNJPY': { bid: 7.50, ask: 7.51 },
  'USDPLN': { bid: 3.75, ask: 3.752 },
  'EURPLN': { bid: 4.24, ask: 4.242 },
  'GBPPLN': { bid: 5.04, ask: 5.042 },
  'USDSEK': { bid: 9.55, ask: 9.552 },
  'EURSEK': { bid: 10.81, ask: 10.812 },
  'GBPSEK': { bid: 12.85, ask: 12.852 },
  'SEKJPY': { bid: 15.23, ask: 15.24 },
  'USDNOK': { bid: 10.20, ask: 10.202 },
  'EURNOK': { bid: 11.55, ask: 11.552 },
  'GBPNOK': { bid: 13.72, ask: 13.722 },
  'NOKJPY': { bid: 14.26, ask: 14.27 },
  'USDDKK': { bid: 6.58, ask: 6.582 },
  'EURDKK': { bid: 7.45, ask: 7.452 },
  'DKKJPY': { bid: 22.10, ask: 22.11 },
  'USDCNH': { bid: 7.20, ask: 7.202 },
  'CNHJPY': { bid: 20.20, ask: 20.21 },
  'USDHUF': { bid: 348.50, ask: 348.70 },
  'EURHUF': { bid: 394.30, ask: 394.50 },
  'USDCZK': { bid: 21.90, ask: 21.92 },
  'EURCZK': { bid: 24.79, ask: 24.81 },

  // ========== METALS (4) ==========
  'XAUUSD': { bid: 3245.00, ask: 3245.50 },
  'XAGUSD': { bid: 32.85, ask: 32.87 },
  'XPTUSD': { bid: 1075.00, ask: 1076.00 },
  'XPDUSD': { bid: 980.00, ask: 981.00 },

  // ========== COMMODITIES (4) ==========
  'USOIL': { bid: 62.30, ask: 62.35 },
  'UKOIL': { bid: 65.80, ask: 65.85 },
  'NGAS': { bid: 3.45, ask: 3.46 },
  'COPPER': { bid: 4.65, ask: 4.66 },

  // ========== CRYPTO (44) - Binance provides live prices ==========
  'BTCUSD': { bid: 103500.00, ask: 103550.00 },
  'ETHUSD': { bid: 2480.00, ask: 2482.00 },
  'LTCUSD': { bid: 96.00, ask: 96.20 },
  'XRPUSD': { bid: 2.42, ask: 2.43 },
  'BCHUSD': { bid: 412.00, ask: 412.50 },
  'BNBUSD': { bid: 645.00, ask: 645.50 },
  'ADAUSD': { bid: 0.78, ask: 0.782 },
  'DOTUSD': { bid: 4.50, ask: 4.52 },
  'SOLUSD': { bid: 168.00, ask: 168.20 },
  'DOGEUSD': { bid: 0.22, ask: 0.221 },
  'MATICUSD': { bid: 0.24, ask: 0.242 },
  'AVAXUSD': { bid: 23.50, ask: 23.55 },
  'LINKUSD': { bid: 16.50, ask: 16.52 },
  'UNIUSD': { bid: 7.80, ask: 7.82 },
  'ATOMUSD': { bid: 4.60, ask: 4.62 },
  'XLMUSD': { bid: 0.30, ask: 0.301 },
  'ALGOUSD': { bid: 0.22, ask: 0.221 },
  'VETUSD': { bid: 0.030, ask: 0.0301 },
  'ICPUSD': { bid: 5.80, ask: 5.82 },
  'FILUSD': { bid: 3.20, ask: 3.22 },
  'TRXUSD': { bid: 0.26, ask: 0.261 },
  'ETCUSD': { bid: 17.20, ask: 17.25 },
  'XMRUSD': { bid: 325.00, ask: 325.50 },
  'EOSUSD': { bid: 0.58, ask: 0.582 },
  'AAVEUSD': { bid: 240.00, ask: 240.50 },
  'MKRUSD': { bid: 1620.00, ask: 1622.00 },
  'COMPUSD': { bid: 45.00, ask: 45.20 },
  'SNXUSD': { bid: 1.20, ask: 1.22 },
  'YFIUSD': { bid: 5800.00, ask: 5810.00 },
  'SUSHIUSD': { bid: 0.78, ask: 0.79 },
  'NEARUSD': { bid: 2.85, ask: 2.87 },
  'FTMUSD': { bid: 0.78, ask: 0.782 },
  'SANDUSD': { bid: 0.32, ask: 0.322 },
  'MANAUSD': { bid: 0.32, ask: 0.322 },
  'AXSUSD': { bid: 3.20, ask: 3.22 },
  'GALAUSD': { bid: 0.022, ask: 0.0222 },
  'APEUSD': { bid: 0.78, ask: 0.79 },
  'GMTUSD': { bid: 0.085, ask: 0.086 },
  'OPUSD': { bid: 0.85, ask: 0.86 },
  'ARBUSD': { bid: 0.38, ask: 0.382 },
  'PEPEUSD': { bid: 0.0000115, ask: 0.0000116 },
  'SHIBUSD': { bid: 0.0000142, ask: 0.0000143 },
  'TONUSD': { bid: 3.20, ask: 3.22 },
  'HBARUSD': { bid: 0.19, ask: 0.191 }
}

// Price listener that extends SynchronizationListener from MetaAPI SDK
class PriceListener extends SynchronizationListener {
  constructor(service) {
    super()
    this.service = service
  }

  // Called by SDK on every price tick
  async onSymbolPriceUpdated(instanceIndex, price) {
    const symbol = META_API_REVERSE_MAP[price.symbol] || price.symbol
    if (price.bid && price.ask) {
      const priceData = {
        bid: price.bid,
        ask: price.ask,
        time: Date.now()
      }
      this.service.prices.set(symbol, priceData)
      this.service.tickCount++

      // Notify subscribers (server.js broadcasts to frontend)
      this.service.subscribers.forEach(callback => {
        try {
          callback(symbol, priceData)
        } catch (e) {
          console.error('[MetaApi] Subscriber error:', e.message)
        }
      })
    }
  }

  async onConnected(instanceIndex, replicas) {
    console.log('[MetaApi] SDK connected to broker, instance:', instanceIndex)
  }

  async onDisconnected(instanceIndex) {
    console.log('[MetaApi] SDK disconnected from broker, instance:', instanceIndex)
  }

  async onBrokerConnectionStatusChanged(instanceIndex, connected) {
    console.log('[MetaApi] Broker connection status:', connected ? 'CONNECTED' : 'DISCONNECTED')
  }
}

class MetaApiService {
  constructor() {
    this.api = null
    this.account = null
    this.connection = null
    this.isConnected = false
    this.prices = new Map()
    this.subscribers = new Set()
    this.subscribedSymbols = new Set()
    this.tickCount = 0
    this.priceListener = null
  }

  async connect() {
    if (this.isConnected && this.connection) {
      return true
    }

    if (!META_API_TOKEN || !META_API_ACCOUNT_ID) {
      console.error('[MetaApi] No META_API_TOKEN or META_API_ACCOUNT_ID configured')
      return false
    }

    try {
      console.log('[MetaApi] Initializing SDK...')
      
      // Create MetaApi instance
      this.api = new MetaApi(META_API_TOKEN)
      
      // Get the trading account
      console.log('[MetaApi] Getting account:', META_API_ACCOUNT_ID)
      this.account = await this.api.metatraderAccountApi.getAccount(META_API_ACCOUNT_ID)
      
      // Wait for account to be deployed and connected
      console.log('[MetaApi] Account state:', this.account.state, '| Connection:', this.account.connectionStatus)
      
      if (this.account.state !== 'DEPLOYED') {
        console.log('[MetaApi] Waiting for account to deploy...')
        await this.account.waitDeployed()
      }

      // Get streaming connection
      console.log('[MetaApi] Creating streaming connection...')
      this.connection = this.account.getStreamingConnection()
      
      // Add price listener BEFORE connecting
      this.priceListener = new PriceListener(this)
      this.connection.addSynchronizationListener(this.priceListener)
      
      // Connect
      await this.connection.connect()
      console.log('[MetaApi] Streaming connection opened, waiting for sync...')
      
      // Wait for synchronization (with timeout)
      await this.connection.waitSynchronized({ timeoutInSeconds: 60 })
      
      this.isConnected = true
      console.log('[MetaApi] Synchronized! Ready for live prices.')
      console.log('[MetaApi] Broker connected:', this.connection.terminalState.connected)
      console.log('[MetaApi] Connected to broker:', this.connection.terminalState.connectedToBroker)
      
      return true
    } catch (error) {
      console.error('[MetaApi] Connection error:', error.message)
      this.isConnected = false
      return false
    }
  }

  async subscribeToSymbols(symbols) {
    if (!this.connection || !this.isConnected) {
      console.log('[MetaApi] Cannot subscribe - not connected')
      return
    }

    const newSymbols = symbols.filter(s => !this.subscribedSymbols.has(s))
    if (newSymbols.length === 0) return

    let subscribed = 0
    const failed = []
    for (const symbol of newSymbols) {
      try {
        const metaSymbol = META_API_SYMBOL_MAP[symbol] || symbol
        await this.connection.subscribeToMarketData(metaSymbol, [{ type: 'quotes' }])
        this.subscribedSymbols.add(symbol)
        subscribed++
      } catch (e) {
        if (e.message?.includes('TooManyRequests')) {
          console.error('[MetaApi] Rate limited while subscribing, pausing...')
          await new Promise(r => setTimeout(r, 5000))
        } else {
          failed.push(symbol)
        }
      }
    }

    console.log(`[MetaApi] Subscribed to ${subscribed}/${newSymbols.length} symbols via SDK streaming`)
    if (failed.length > 0) {
      console.log(`[MetaApi] LP does NOT have these symbols (using fallback prices):`, failed.join(', '))
    }

    // After 10s, log diagnostic about which symbols are actually streaming live prices
    setTimeout(() => {
      const liveSymbols = []
      const noPriceSymbols = []
      newSymbols.forEach(s => {
        if (this.prices.has(s)) {
          liveSymbols.push(s)
        } else {
          noPriceSymbols.push(s)
        }
      })
      console.log(`[MetaApi] LIVE prices from LP: ${liveSymbols.length}/${newSymbols.length}`)
      if (noPriceSymbols.length > 0 && noPriceSymbols.length < 20) {
        console.log(`[MetaApi] No live ticks yet for:`, noPriceSymbols.join(', '))
      }
    }, 10000)
  }

  // Read latest price from SDK's terminal state (instant, no API call)
  getPrice(symbol) {
    // First check our live price cache (updated by PriceListener)
    const cached = this.prices.get(symbol)
    if (cached) return cached

    // Try reading from SDK terminal state directly
    if (this.connection?.terminalState) {
      const metaSymbol = META_API_SYMBOL_MAP[symbol] || symbol
      const sdkPrice = this.connection.terminalState.price(metaSymbol)
      if (sdkPrice && sdkPrice.bid && sdkPrice.ask) {
        const priceData = {
          bid: sdkPrice.bid,
          ask: sdkPrice.ask,
          time: Date.now()
        }
        this.prices.set(symbol, priceData)
        return priceData
      }
    }

    // Only fall back to static prices when LP is NOT connected
    if (!this.isConnected) {
      return FALLBACK_PRICES[symbol] || null
    }
    return null
  }

  getAllPrices() {
    const prices = {}
    this.prices.forEach((price, symbol) => {
      prices[symbol] = price
    })
    return prices
  }

  subscribe(callback) {
    this.subscribers.add(callback)
    return () => this.subscribers.delete(callback)
  }

  // Fetch crypto prices from Binance (MetaAPI doesn't cover crypto well)
  async fetchCryptoPrices(cryptoSymbols) {
    const prices = {}
    if (cryptoSymbols.length === 0) return prices

    try {
      const binanceResponse = await fetch('https://api.binance.com/api/v3/ticker/bookTicker')
      if (binanceResponse.ok) {
        const tickers = await binanceResponse.json()
        const tickerMap = {}
        tickers.forEach(t => { tickerMap[t.symbol] = t })
        
        cryptoSymbols.forEach(symbol => {
          const binanceSymbol = symbol.replace('USD', 'USDT')
          const ticker = tickerMap[binanceSymbol]
          if (ticker) {
            const price = {
              bid: parseFloat(ticker.bidPrice),
              ask: parseFloat(ticker.askPrice),
              time: Date.now()
            }
            prices[symbol] = price
            this.prices.set(symbol, price)
          }
        })
      }
    } catch (e) {
      console.error('[MetaApi] Binance fetch error:', e.message)
    }
    return prices
  }

  // Fetch all prices for a list of symbols (used by streamPrices in server.js)
  async fetchBatchPrices(symbols) {
    const prices = {}
    const now = Date.now()

    // Separate crypto and non-crypto
    const cryptoSymbols = symbols.filter(s => this.isCrypto(s))
    const forexSymbols = symbols.filter(s => !this.isCrypto(s))

    // Fetch crypto from Binance
    if (cryptoSymbols.length > 0) {
      const cryptoPrices = await this.fetchCryptoPrices(cryptoSymbols)
      Object.assign(prices, cryptoPrices)
    }

    // For forex/metals: read ONLY live cache (from PriceListener) or SDK terminal state.
    // NEVER mix fallback prices when LP is connected — that causes price jumps.
    forexSymbols.forEach(symbol => {
      const cached = this.prices.get(symbol)
      if (cached) {
        prices[symbol] = cached
        return
      }
      if (this.isConnected && this.connection?.terminalState) {
        const metaSymbol = META_API_SYMBOL_MAP[symbol] || symbol
        const sdkPrice = this.connection.terminalState.price(metaSymbol)
        if (sdkPrice && sdkPrice.bid && sdkPrice.ask) {
          const priceData = { bid: sdkPrice.bid, ask: sdkPrice.ask, time: Date.now() }
          this.prices.set(symbol, priceData)
          prices[symbol] = priceData
        }
      }
    })

    // Only use fallback when MetaAPI is NOT connected at all
    if (!this.isConnected) {
      symbols.forEach(symbol => {
        if (!prices[symbol] && FALLBACK_PRICES[symbol]) {
          prices[symbol] = { ...FALLBACK_PRICES[symbol], time: now, fallback: true }
        }
      })
    }

    return prices
  }

  async disconnect() {
    if (this.connection) {
      if (this.priceListener) {
        this.connection.removeSynchronizationListener(this.priceListener)
      }
      await this.connection.close()
      this.connection = null
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
