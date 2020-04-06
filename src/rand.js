// Returns number chosen uniform randomly from the specified range
export function randRange(min, max) {
  return Math.random() * (max - min) + min
}

// Returns number chosen from normal distribution with mean mu
// and variance sigma
export function randNormal({ mu, sigma }) {
  // Adjust from boxMuller's unit normal distribution
  return boxMuller() * sigma + mu
}

// Returns number taken from normal distribution
// with zero mean and unit variance
function boxMuller() {
  let u = Math.random()
  let v = Math.random()
  return Math.sqrt(-2.0 * Math.log(u)) * Math.cos(Math.PI * 2 * v)
}

// Returns -1 or 1
export function randSign() {
  return Math.random() > 0.5 ? 1 : -1
}

// Random hex string
export function randHex(len) {
  let codes = []
  let zero = '0'.charCodeAt(0)
  let a = 'a'.charCodeAt(0)
  for (let i = 0; i < len; i++) {
    let val = Math.floor(Math.random() * 16)
    if (val < 10) {
      codes.push(zero + val)
    } else {
      codes.push(a + val)
    }
  }
  return String.fromCharCode(...codes)
}
