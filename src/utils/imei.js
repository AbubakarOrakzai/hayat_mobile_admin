// Luhn check: every IMEI is 15 digits and the last digit is a checksum.
export function isValidImei(value) {
  const s = String(value || '')
  if (!/^\d{15}$/.test(s)) return false
  let sum = 0
  for (let i = 0; i < 15; i++) {
    let d = Number(s[14 - i])
    if (i % 2 === 1) { d *= 2; if (d > 9) d -= 9 }
    sum += d
  }
  return sum % 10 === 0
}

// Used only to build valid fake IMEIs for the mock data.
export function withCheck(base14) {
  let sum = 0
  for (let i = 0; i < 14; i++) {
    let d = Number(base14[13 - i])
    if (i % 2 === 0) { d *= 2; if (d > 9) d -= 9 }
    sum += d
  }
  return base14 + ((10 - (sum % 10)) % 10)
}