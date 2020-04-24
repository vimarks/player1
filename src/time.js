// Get current time in ms in Node.JS
function nodejsNow() {
  return Number(process.hrtime.bigint() / BigInt(1000000))
}

// Get current time in ms in browser
function browserNow() {
  return performance.now()
}

// Detect with ...Now() function to use
const now = typeof performance !== 'undefined' ? browserNow : nodejsNow

// The time when the module was loaded
const startTime = now()

/**
 * Returns the time in ms since the given time.
 */
export function elapsed(since = 0) {
  return now() - (startTime + since)
}
