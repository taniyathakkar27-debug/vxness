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
const FALLBACK_PRICES = {
  // ========== FOREX MAJORS (7) ==========
  'EURUSD': { bid: 1.0850, ask: 1.0852 },
  'GBPUSD': { bid: 1.2650, ask: 1.2652 },
  'USDJPY': { bid: 149.50, ask: 149.52 },
  'USDCHF': { bid: 0.8820, ask: 0.8822 },
  'AUDUSD': { bid: 0.6550, ask: 0.6552 },
  'NZDUSD': { bid: 0.6150, ask: 0.6152 },
  'USDCAD': { bid: 1.3550, ask: 1.3552 },
  
  // ========== FOREX CROSSES (21) ==========
  'EURGBP': { bid: 0.8580, ask: 0.8582 },
  'EURJPY': { bid: 162.20, ask: 162.22 },
  'GBPJPY': { bid: 189.10, ask: 189.12 },
  'EURCHF': { bid: 0.9570, ask: 0.9572 },
  'EURAUD': { bid: 1.6560, ask: 1.6562 },
  'EURCAD': { bid: 1.4700, ask: 1.4702 },
  'GBPAUD': { bid: 1.9320, ask: 1.9322 },
  'GBPCAD': { bid: 1.7150, ask: 1.7152 },
  'AUDCAD': { bid: 0.8880, ask: 0.8882 },
  'AUDJPY': { bid: 97.90, ask: 97.92 },
  'CADJPY': { bid: 110.30, ask: 110.32 },
  'CHFJPY': { bid: 169.50, ask: 169.52 },
  'NZDJPY': { bid: 91.80, ask: 91.82 },
  'AUDNZD': { bid: 1.0650, ask: 1.0652 },
  'CADCHF': { bid: 0.6510, ask: 0.6512 },
  'GBPCHF': { bid: 1.1150, ask: 1.1152 },
  'GBPNZD': { bid: 2.0550, ask: 2.0552 },
  'EURNZD': { bid: 1.7620, ask: 1.7622 },
  'NZDCAD': { bid: 0.8340, ask: 0.8342 },
  'NZDCHF': { bid: 0.5420, ask: 0.5422 },
  'AUDCHF': { bid: 0.5780, ask: 0.5782 },
  
  // ========== FOREX EXOTICS (36) ==========
  'USDSGD': { bid: 1.3420, ask: 1.3422 },
  'EURSGD': { bid: 1.4560, ask: 1.4562 },
  'GBPSGD': { bid: 1.6980, ask: 1.6982 },
  'AUDSGD': { bid: 0.8790, ask: 0.8792 },
  'SGDJPY': { bid: 111.40, ask: 111.42 },
  'USDHKD': { bid: 7.8150, ask: 7.8152 },
  'USDZAR': { bid: 18.50, ask: 18.52 },
  'EURZAR': { bid: 20.08, ask: 20.10 },
  'GBPZAR': { bid: 23.40, ask: 23.42 },
  'ZARJPY': { bid: 8.08, ask: 8.09 },
  'USDTRY': { bid: 32.50, ask: 32.52 },
  'EURTRY': { bid: 35.26, ask: 35.28 },
  'TRYJPY': { bid: 4.60, ask: 4.61 },
  'USDMXN': { bid: 17.20, ask: 17.22 },
  'EURMXN': { bid: 18.66, ask: 18.68 },
  'MXNJPY': { bid: 8.69, ask: 8.70 },
  'USDPLN': { bid: 4.02, ask: 4.022 },
  'EURPLN': { bid: 4.36, ask: 4.362 },
  'GBPPLN': { bid: 5.08, ask: 5.082 },
  'USDSEK': { bid: 10.45, ask: 10.452 },
  'EURSEK': { bid: 11.34, ask: 11.342 },
  'GBPSEK': { bid: 13.22, ask: 13.222 },
  'SEKJPY': { bid: 14.31, ask: 14.32 },
  'USDNOK': { bid: 10.85, ask: 10.852 },
  'EURNOK': { bid: 11.77, ask: 11.772 },
  'GBPNOK': { bid: 13.72, ask: 13.722 },
  'NOKJPY': { bid: 13.78, ask: 13.79 },
  'USDDKK': { bid: 6.92, ask: 6.922 },
  'EURDKK': { bid: 7.51, ask: 7.512 },
  'DKKJPY': { bid: 21.61, ask: 21.62 },
  'USDCNH': { bid: 7.25, ask: 7.252 },
  'CNHJPY': { bid: 20.62, ask: 20.63 },
  'USDHUF': { bid: 365.50, ask: 365.70 },
  'EURHUF': { bid: 396.60, ask: 396.80 },
  'USDCZK': { bid: 23.45, ask: 23.47 },
  'EURCZK': { bid: 25.44, ask: 25.46 },
  
  // ========== METALS (4) ==========
  'XAUUSD': { bid: 2870.00, ask: 2870.50 },
  'XAGUSD': { bid: 32.10, ask: 32.12 },
  'XPTUSD': { bid: 1020.00, ask: 1021.00 },
  'XPDUSD': { bid: 980.00, ask: 981.00 },
  
  // ========== COMMODITIES (4) ==========
  'USOIL': { bid: 72.50, ask: 72.55 },
  'UKOIL': { bid: 76.80, ask: 76.85 },
  'NGAS': { bid: 2.85, ask: 2.86 },
  'COPPER': { bid: 4.25, ask: 4.26 },
  
  // ========== CRYPTO (44) - Binance provides live prices ==========
  'BTCUSD': { bid: 97000.00, ask: 97050.00 },
  'ETHUSD': { bid: 2650.00, ask: 2652.00 },
  'LTCUSD': { bid: 105.00, ask: 105.20 },
  'XRPUSD': { bid: 2.45, ask: 2.46 },
  'BCHUSD': { bid: 420.00, ask: 420.50 },
  'BNBUSD': { bid: 580.00, ask: 580.50 },
  'ADAUSD': { bid: 0.95, ask: 0.952 },
  'DOTUSD': { bid: 7.50, ask: 7.52 },
  'SOLUSD': { bid: 195.00, ask: 195.20 },
  'DOGEUSD': { bid: 0.32, ask: 0.321 },
  'MATICUSD': { bid: 0.45, ask: 0.452 },
  'AVAXUSD': { bid: 38.50, ask: 38.55 },
  'LINKUSD': { bid: 18.50, ask: 18.52 },
  'UNIUSD': { bid: 12.50, ask: 12.52 },
  'ATOMUSD': { bid: 9.80, ask: 9.82 },
  'XLMUSD': { bid: 0.42, ask: 0.421 },
  'ALGOUSD': { bid: 0.38, ask: 0.381 },
  'VETUSD': { bid: 0.045, ask: 0.0451 },
  'ICPUSD': { bid: 12.80, ask: 12.82 },
  'FILUSD': { bid: 5.80, ask: 5.82 },
  'TRXUSD': { bid: 0.24, ask: 0.241 },
  'ETCUSD': { bid: 28.50, ask: 28.55 },
  'XMRUSD': { bid: 185.00, ask: 185.50 },
  'EOSUSD': { bid: 0.85, ask: 0.852 },
  'AAVEUSD': { bid: 280.00, ask: 280.50 },
  'MKRUSD': { bid: 1850.00, ask: 1852.00 },
  'COMPUSD': { bid: 85.00, ask: 85.20 },
  'SNXUSD': { bid: 3.20, ask: 3.22 },
  'YFIUSD': { bid: 8500.00, ask: 8510.00 },
  'SUSHIUSD': { bid: 1.45, ask: 1.46 },
  'NEARUSD': { bid: 5.20, ask: 5.22 },
  'FTMUSD': { bid: 0.72, ask: 0.722 },
  'SANDUSD': { bid: 0.58, ask: 0.582 },
  'MANAUSD': { bid: 0.52, ask: 0.522 },
  'AXSUSD': { bid: 8.20, ask: 8.22 },
  'GALAUSD': { bid: 0.042, ask: 0.0422 },
  'APEUSD': { bid: 1.35, ask: 1.36 },
  'GMTUSD': { bid: 0.22, ask: 0.221 },
  'OPUSD': { bid: 2.15, ask: 2.16 },
  'ARBUSD': { bid: 0.85, ask: 0.852 },
  'PEPEUSD': { bid: 0.000018, ask: 0.0000181 },
  'SHIBUSD': { bid: 0.000022, ask: 0.0000221 },
  'TONUSD': { bid: 5.50, ask: 5.52 },
  'HBARUSD': { bid: 0.28, ask: 0.281 }
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
    for (const symbol of newSymbols) {
      try {
        const metaSymbol = META_API_SYMBOL_MAP[symbol] || symbol
        await this.connection.subscribeToMarketData(metaSymbol, [{ type: 'quotes' }])
        this.subscribedSymbols.add(symbol)
        subscribed++
      } catch (e) {
        // Symbol may not be available on this broker
        if (!e.message?.includes('TooManyRequests')) {
          // Silent for unavailable symbols
        } else {
          console.error('[MetaApi] Rate limited while subscribing, pausing...')
          await new Promise(r => setTimeout(r, 5000))
        }
      }
    }

    console.log(`[MetaApi] Subscribed to ${subscribed}/${newSymbols.length} symbols via SDK streaming`)
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

    return FALLBACK_PRICES[symbol] || null
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

    // For forex/metals: read from SDK terminal state (no API calls!)
    forexSymbols.forEach(symbol => {
      const price = this.getPrice(symbol)
      if (price) {
        prices[symbol] = price
      }
    })

    // Fill remaining missing with fallback
    symbols.forEach(symbol => {
      if (!prices[symbol] && FALLBACK_PRICES[symbol]) {
        prices[symbol] = { ...FALLBACK_PRICES[symbol], time: now, fallback: true }
      }
    })

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
