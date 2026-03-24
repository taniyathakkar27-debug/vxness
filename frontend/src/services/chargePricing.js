/**
 * Mirrors backend/services/tradeEngine.js calculateExecutionPrice spread math
 * so UI bid/ask match execution prices (raw feed + admin spread).
 */

const CRYPTO_SYMBOLS = new Set([
  'BTCUSD', 'ETHUSD', 'LTCUSD', 'XRPUSD', 'BCHUSD', 'BNBUSD', 'SOLUSD', 'ADAUSD', 'DOGEUSD',
  'DOTUSD', 'MATICUSD', 'AVAXUSD', 'LINKUSD', 'TRXUSD', 'SHIBUSD',
])

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

/**
 * After admin spread, add commission to the ASK only (BUY price), matching tradeEngine.openTrade:
 * - PER_LOT / PER_TRADE: ask += commission value (e.g. 100 → ask + 100)
 * - PERCENTAGE: ask += ask * (pct / 100)
 */
export function adjustQuotesForTradingDisplay(bid, ask, symbol, spreadEntry, commissionEntry) {
  const step = adjustQuotesForAdminSpread(bid, ask, symbol, spreadEntry)
  let b = step.bid
  let a = step.ask
  if (!Number.isFinite(b) || !Number.isFinite(a) || b <= 0 || a <= 0) return step

  const cv = Number(commissionEntry?.commission ?? commissionEntry?.commissionValue)
  if (!commissionEntry || !Number.isFinite(cv) || cv <= 0) return step

  const ct = commissionEntry.commissionType || 'PER_LOT'
  if (ct === 'PER_LOT' || ct === 'PER_TRADE') {
    a += cv
  } else if (ct === 'PERCENTAGE') {
    a += a * (cv / 100)
  }

  return { bid: b, ask: a }
}
