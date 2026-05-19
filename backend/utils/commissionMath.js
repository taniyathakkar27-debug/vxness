// Commission math shared by tradeEngine and propTradingEngine.
// Admin enters commissionValue as an asset-class-scaled number that mirrors how spread is scaled,
// so a $5 commission produces a visible price markup on every instrument (not 0.001 like cv/contractSize would).
//
// Per-lot price delta scaling by asset class:
//   crypto/indices   -> cv          (USD / index point)
//   metals/JPY/cmdty -> cv * 0.01   (cents)
//   other forex      -> cv * 0.0001 (pips)

const CRYPTO_SYMBOLS = new Set([
  'BTCUSD', 'ETHUSD', 'LTCUSD', 'XRPUSD', 'BCHUSD', 'BNBUSD', 'SOLUSD', 'ADAUSD', 'DOGEUSD',
  'DOTUSD', 'MATICUSD', 'AVAXUSD', 'LINKUSD', 'TRXUSD', 'SHIBUSD',
])

const INDEX_SYMBOLS = new Set([
  'US30', 'US500', 'NAS100', 'US100', 'GER40', 'UK100', 'DJ30', 'DAX', 'FTSE', 'SPX', 'NDX',
  'JPN225', 'AUS200', 'HK50', 'FRA40', 'EU50',
])

const COMMODITY_SYMBOLS = new Set([
  'OIL', 'BRENT', 'WTI', 'NGAS', 'COPPER', 'USOIL', 'UKOIL',
])

function classify(symbol) {
  const sym = (symbol || '').toUpperCase()
  if (CRYPTO_SYMBOLS.has(sym)) return 'crypto'
  if (INDEX_SYMBOLS.has(sym)) return 'index'
  if (COMMODITY_SYMBOLS.has(sym)) return 'commodity'
  if (sym.includes('XAU') || sym.includes('XAG') || sym.includes('XPT') || sym.includes('XPD')) return 'metal'
  if (sym.includes('JPY')) return 'jpy'
  return 'forex'
}

export function commissionPerLotDelta(symbol, commissionValue) {
  const cv = Number(commissionValue)
  if (!Number.isFinite(cv) || cv <= 0) return 0
  switch (classify(symbol)) {
    case 'crypto':
    case 'index':
      return cv
    case 'metal':
    case 'jpy':
    case 'commodity':
      return cv * 0.01
    default:
      return cv * 0.0001
  }
}

// Price delta to ADD to BUY execution price (embeds commission into the fill).
export function commissionPriceDelta(symbol, commissionValue, commissionType, quantity, currentPrice) {
  const ct = String(commissionType || 'PER_LOT')
  const qty = Number(quantity) > 0 ? Number(quantity) : 1
  if (ct === 'PER_LOT') return commissionPerLotDelta(symbol, commissionValue)
  if (ct === 'PER_TRADE') return commissionPerLotDelta(symbol, commissionValue) / qty
  if (ct === 'PERCENTAGE') {
    const cv = Number(commissionValue)
    if (!Number.isFinite(cv) || cv <= 0) return 0
    return Number(currentPrice) * (cv / 100)
  }
  return 0
}

// Dollar amount to charge as a separate commission line (used for SELL open and on-close).
// Equals priceDelta * contractSize * quantity so it stays consistent with the embedded-in-price path.
export function commissionDollarAmount(symbol, quantity, openPrice, commissionType, commissionValue, contractSize) {
  const ct = String(commissionType || 'PER_LOT')
  const cv = Number(commissionValue)
  if (!Number.isFinite(cv) || cv <= 0) return 0
  if (ct === 'PERCENTAGE') {
    const tradeValue = Number(quantity) * Number(contractSize) * Number(openPrice)
    return tradeValue * (cv / 100)
  }
  const delta = commissionPriceDelta(symbol, cv, ct, quantity, openPrice)
  return delta * Number(contractSize) * Number(quantity)
}
