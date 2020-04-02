// Get current time in ms in Node.JS
function hrtimeNow() {
  return Number(process.hrtime.bigint() / 1000000n)
}

// Get current time in ms in browser
function performanceNow() {
  return performance.now()
}

// Detect with ...Now() function to use
const now = typeof performance !== 'undefined' ? performanceNow : hrtimeNow

// The time when the module was loaded
const startTime = now()

/**
 * Returns the time in ms since the given time.
 */
export function elapsed(since = 0) {
  return now() - (startTime + since)
}
