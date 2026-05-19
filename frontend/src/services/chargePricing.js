/**
 * Mirrors backend/services/tradeEngine.js calculateExecutionPrice spread math
 * so UI bid/ask match execution prices (raw feed + admin spread).
 */

const CRYPTO_SYMBOLS = new Set([
  'BTCUSD', 'ETHUSD', 'LTCUSD', 'XRPUSD', 'BCHUSD', 'BNBUSD', 'SOLUSD', 'ADAUSD', 'DOGEUSD',
  'DOTUSD', 'MATICUSD', 'AVAXUSD', 'LINKUSD', 'TRXUSD', 'SHIBUSD',
])

// Mirrors backend/services/tradeEngine.js getContractSize
function getContractSize(symbol) {
  const sym = (symbol || '').toUpperCase()
  if (sym === 'XAUUSD') return 100
  if (sym === 'XAGUSD') return 5000
  if (['BTCUSD', 'ETHUSD', 'LTCUSD', 'XRPUSD', 'BCHUSD'].includes(sym)) return 1
  return 100000
}

function spreadToPriceDelta(spreadValue, spreadType, symbol, bid, ask) {
  const sym = (symbol || '').toUpperCase()
  const b = Number(bid)
  const a = Number(ask)
  if (!Number.isFinite(spreadValue) || spreadValue <= 0) return 0
  if (spreadType === 'PERCENTAGE') {
    if (!Number.isFinite(a - b)) return 0
    return (a - b) * (spreadValue / 100)
  }
  const isJPYPair = sym.includes('JPY')
  const isMetal = sym.includes('XAU') || sym.includes('XAG') || sym.includes('XPT') || sym.includes('XPD')
  const isCrypto = CRYPTO_SYMBOLS.has(sym)
  if (isCrypto) return spreadValue
  if (isMetal) return spreadValue * 0.01
  if (isJPYPair) return spreadValue * 0.01
  return spreadValue * 0.0001
}

/**
 * @param {number} bid — raw market bid
 * @param {number} ask — raw market ask
 * @param {string} symbol
 * @param {{ spread: number, spreadType?: string } | null | undefined} spreadEntry — from /api/charges/spreads
 */
export function adjustQuotesForAdminSpread(bid, ask, symbol, spreadEntry) {
  const b = Number(bid)
  const a = Number(ask)
  if (!Number.isFinite(b) || !Number.isFinite(a) || b <= 0 || a <= 0) {
    return { bid: b, ask: a }
  }
  const spreadRaw = Number(spreadEntry?.spread ?? spreadEntry?.spreadValue)
  if (!spreadEntry || !Number.isFinite(spreadRaw) || spreadRaw <= 0) {
    return { bid: b, ask: a }
  }
  const d = spreadToPriceDelta(
    spreadRaw,
    spreadEntry.spreadType || 'FIXED',
    symbol,
    b,
    a
  )
  if (!Number.isFinite(d) || d <= 0) return { bid: b, ask: a }
  return { bid: b - d, ask: a + d }
}

// Mirrors backend/utils/commissionMath.js — commission scales per asset class so the markup is visible
// across all asset classes, matching the spread scaling used in calculateExecutionPrice.
const INDEX_SYMBOLS = new Set([
  'US30', 'US500', 'NAS100', 'US100', 'GER40', 'UK100', 'DJ30', 'DAX', 'FTSE', 'SPX', 'NDX',
  'JPN225', 'AUS200', 'HK50', 'FRA40', 'EU50',
])
const COMMODITY_SYMBOLS = new Set([
  'OIL', 'BRENT', 'WTI', 'NGAS', 'COPPER', 'USOIL', 'UKOIL',
])

function commissionPerLotDelta(symbol, cv) {
  const sym = (symbol || '').toUpperCase()
  if (CRYPTO_SYMBOLS.has(sym) || INDEX_SYMBOLS.has(sym)) return cv
  const isMetal = sym.includes('XAU') || sym.includes('XAG') || sym.includes('XPT') || sym.includes('XPD')
  if (isMetal || COMMODITY_SYMBOLS.has(sym) || sym.includes('JPY')) return cv * 0.01
  return cv * 0.0001
}

function commissionToPriceDelta(commissionEntry, symbol, bidRef, quantity = 1) {
  const cv = Number(commissionEntry?.commission ?? commissionEntry?.commissionValue)
  if (!commissionEntry || !Number.isFinite(cv) || cv <= 0) return 0
  const ct = commissionEntry.commissionType || 'PER_LOT'
  const qty = Number(quantity) > 0 ? Number(quantity) : 1
  if (ct === 'PER_LOT') return commissionPerLotDelta(symbol, cv)
  if (ct === 'PER_TRADE') return commissionPerLotDelta(symbol, cv) / qty
  if (ct === 'PERCENTAGE') return bidRef * (cv / 100)
  return 0
}

/**
 * Displayed BUY/SELL quotes when admin charges may be configured.
 * - If admin commission OR admin spread is configured: the natural MetaAPI spread is
 *   collapsed. bid stays at raw bid, ask = bid + (admin spread delta) + (admin commission delta).
 *   So $4 commission on XAUUSD (contractSize 100) → ask = bid + 0.04.
 * - If neither is configured: pass through the raw MetaAPI bid/ask unchanged.
 */
export function adjustQuotesForTradingDisplay(bid, ask, symbol, spreadEntry, commissionEntry, quantity = 1) {
  const b = Number(bid)
  const aRaw = Number(ask)
  if (!Number.isFinite(b) || !Number.isFinite(aRaw) || b <= 0 || aRaw <= 0) {
    return { bid: b, ask: aRaw }
  }

  const spreadRaw = Number(spreadEntry?.spread ?? spreadEntry?.spreadValue)
  const hasAdminSpread = spreadEntry && Number.isFinite(spreadRaw) && spreadRaw > 0
  const cv = Number(commissionEntry?.commission ?? commissionEntry?.commissionValue)
  const hasAdminCommission = commissionEntry && Number.isFinite(cv) && cv > 0

  if (!hasAdminSpread && !hasAdminCommission) {
    return { bid: b, ask: aRaw }
  }

  let askMarkup = 0
  if (hasAdminSpread) {
    askMarkup += spreadToPriceDelta(spreadRaw, spreadEntry.spreadType || 'FIXED', symbol, b, aRaw)
  }
  if (hasAdminCommission) {
    askMarkup += commissionToPriceDelta(commissionEntry, symbol, b, quantity)
  }

  return { bid: b, ask: b + askMarkup }
}
