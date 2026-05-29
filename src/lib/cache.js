const cache = new Map()
const pending = new Map()

export function getCached(key, ttl = 5000) {
  const entry = cache.get(key)
  if (entry && Date.now() - entry.timestamp < ttl) {
    return entry.data
  }
  return null
}

export function setCache(key, data) {
  cache.set(key, { data, timestamp: Date.now() })
}

export function getPending(key) {
  return pending.get(key)
}

export function setPending(key, promise) {
  pending.set(key, promise)
  promise.finally(() => pending.delete(key))
}

export function invalidateCache(key) {
  if (key) {
    cache.delete(key)
  } else {
    cache.clear()
  }
}
