const RATIO = 1e18
const DECIMAL = 9

export default (value: number | string, symbol?: string) =>
  +(+value / RATIO).toFixed(DECIMAL).toLocaleString() +
  (symbol ? ` ${symbol}` : '')
