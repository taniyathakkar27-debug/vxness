// Single source of truth for per-symbol price scaling and contract size.
// Both spread (Charges.spreadValue) and commission (Charges.commissionValue) are entered
// as a count of the smallest visible decimal unit (MT5 "point" convention). Admin's "N"
// always adds +N at the last decimal position of the displayed price:
//   forex non-JPY (5 dec display) → 1 unit = 0.00001 (e.g. EURUSD 1.16313 + 3 → 1.16316)
//   forex JPY     (3 dec display) → 1 unit = 0.001   (e.g. USDJPY 159.494 + 2 → 159.496)
//   metals XAUUSD (2 dec)         → 1 unit = 0.01    (e.g. 4442.93 + 3 → 4442.96)
//   metals XAGUSD (3 dec)         → 1 unit = 0.001
//   commodities  (2 dec)          → 1 unit = 0.01    (e.g. USOIL 62.30 + 5 → 62.35)
//   crypto       (2 dec)          → 1 unit = 0.01    (e.g. BTCUSD 75248.00 + 2 → 75248.02)
//   indices                       → 1 unit = $1 (index point)
//
// pipSize(symbol)      — price delta produced by spreadValue=1 / commissionValue=1
// contractSize(symbol) — quantity * contractSize * price = notional trade value
// classify(symbol)     — asset class string used by commissionMath and engines

const CRYPTO_SYMBOLS = new Set([
  'BTCUSD', 'ETHUSD', 'LTCUSD', 'XRPUSD', 'BCHUSD', 'BNBUSD', 'SOLUSD', 'ADAUSD', 'DOGEUSD',
  'DOTUSD', 'MATICUSD', 'AVAXUSD', 'LINKUSD', 'TRXUSD', 'SHIBUSD', 'TONUSD', 'HBARUSD',
  'XLMUSD', 'ALGOUSD', 'VETUSD', 'ICPUSD', 'FILUSD', 'ETCUSD', 'XMRUSD', 'EOSUSD',
  'AAVEUSD', 'MKRUSD', 'COMPUSD', 'SNXUSD', 'YFIUSD', 'SUSHIUSD', 'NEARUSD', 'FTMUSD',
  'SANDUSD', 'MANAUSD', 'AXSUSD', 'GALAUSD', 'APEUSD', 'GMTUSD', 'OPUSD', 'ARBUSD',
  'PEPEUSD', 'ATOMUSD', 'UNIUSD',
])

const COMMODITY_SYMBOLS = new Set([
  'USOIL', 'UKOIL', 'BRENT', 'WTI', 'NGAS', 'COPPER',
])

const INDEX_SYMBOLS = new Set([
  'US30', 'US500', 'NAS100', 'US100', 'GER40', 'UK100', 'DJ30', 'DAX', 'FTSE', 'SPX', 'NDX',
  'JPN225', 'AUS200', 'HK50', 'FRA40', 'EU50', 'USTEC', 'DE30', 'SPX500',
])

export function classify(symbol) {
  const s = String(symbol || '').toUpperCase()
  if (!s) return 'forex'
  if (CRYPTO_SYMBOLS.has(s)) return 'crypto'
  if (COMMODITY_SYMBOLS.has(s)) return 'commodity'
  if (INDEX_SYMBOLS.has(s)) return 'index'
  if (s.startsWith('XAU') || s.startsWith('XAG') || s.startsWith('XPT') || s.startsWith('XPD')) return 'metal'
  if (s.includes('JPY')) return 'jpy'
  return 'forex'
}

// pipSize = price delta produced by spreadValue=1 / commissionValue=1.
// Matches the smallest visible decimal of the symbol's display digits so admin's "N"
// always lands at the last decimal position the user sees.
export function pipSize(symbol) {
  const s = String(symbol || '').toUpperCase()
  if (!s) return 0.00001
  const cls = classify(symbol)
  if (cls === 'index') return 1
  if (cls === 'crypto') return 0.01                                 // 2-dec display
  if (cls === 'commodity') return 0.01                              // 2-dec display
  if (cls === 'metal') return 0.01                                  // all metals = cents
  if (cls === 'jpy') return 0.001                                   // 3-dec display
  return 0.00001                                                     // 5-dec forex
}

export function contractSize(symbol) {
  const s = String(symbol || '').toUpperCase()
  if (s === 'XAUUSD') return 100
  if (s === 'XAGUSD') return 5000
  if (s === 'XPTUSD' || s === 'XPDUSD') return 100
  if (COMMODITY_SYMBOLS.has(s)) return 1000
  if (CRYPTO_SYMBOLS.has(s)) return 1
  if (INDEX_SYMBOLS.has(s)) return 1
  return 100000
}

export function isCrypto(symbol) { return classify(symbol) === 'crypto' }
export function isMetal(symbol) { return classify(symbol) === 'metal' }
export function isCommodity(symbol) { return classify(symbol) === 'commodity' }
export function isIndex(symbol) { return classify(symbol) === 'index' }
