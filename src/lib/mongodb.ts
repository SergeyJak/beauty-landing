import { MongoClient } from 'mongodb'

declare global {
  // eslint-disable-next-line no-var
  var __beautyMongoClientPromise: Promise<MongoClient> | undefined
}

export function getMongoClient(): Promise<MongoClient> {
  const uri = process.env.MONGODB_URI
  if (!uri) throw new Error('MONGODB_URI is not configured')

  if (!global.__beautyMongoClientPromise) {
    const client = new MongoClient(uri)
    const attempt = client.connect().catch((error: unknown) => {
      // Only clear this failed attempt; concurrent readers share its rejection.
      if (global.__beautyMongoClientPromise === attempt) {
        global.__beautyMongoClientPromise = undefined
      }
      throw error
    })
    global.__beautyMongoClientPromise = attempt
  }

  return global.__beautyMongoClientPromise
}
