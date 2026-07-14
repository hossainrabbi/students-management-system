import mongoose from 'mongoose';

const MONGODB_URI = process.env.MONGODB_URI;

interface MongooseCache {
  conn: typeof mongoose | null;
  promise: Promise<typeof mongoose> | null;
  mongoServer?: any;
}

declare global {
  // eslint-disable-next-line no-var
  var mongoose: MongooseCache | undefined;
}

let cached = global.mongoose;

if (!cached) {
  cached = global.mongoose = { conn: null, promise: null };
}

// Create a non-nullable reference to satisfy TypeScript type checking
const mongooseCache: MongooseCache = cached;

async function dbConnect(): Promise<typeof mongoose> {
  if (mongooseCache.conn) {
    return mongooseCache.conn;
  }

  if (!mongooseCache.promise) {
    const opts = {
      bufferCommands: false,
    };

    mongooseCache.promise = (async () => {
      let conn: typeof mongoose | null = null;

      // 1. Try connecting to the configured MONGODB_URI
      if (MONGODB_URI) {
        try {
          console.log(`Connecting to MongoDB at: ${MONGODB_URI}`);
          conn = await mongoose.connect(MONGODB_URI, {
            ...opts,
            serverSelectionTimeoutMS: 3000,
          });
          console.log('MongoDB connected successfully.');
        } catch (error) {
          console.warn(`Failed to connect to MONGODB_URI: ${MONGODB_URI}. Falling back to in-memory database...`);
        }
      }

      // 2. Fallback to MongoMemoryServer in development/test
      if (!conn && process.env.NODE_ENV !== 'production') {
        try {
          console.log('Starting in-memory MongoDB server...');
          const { MongoMemoryServer } = await import('mongodb-memory-server');
          if (!mongooseCache.mongoServer) {
            mongooseCache.mongoServer = await MongoMemoryServer.create({
              instance: {
                dbName: 'school-management',
              }
            });
          }
          const uri = mongooseCache.mongoServer.getUri();
          console.log(`In-memory MongoDB started at: ${uri}`);
          conn = await mongoose.connect(uri, opts);
          console.log('Connected to in-memory MongoDB.');
        } catch (memError) {
          console.error('Failed to start in-memory MongoDB:', memError);
          throw memError;
        }
      }

      if (!conn) {
        throw new Error('Please define the MONGODB_URI environment variable inside .env.local');
      }

      // Auto-seed the default super admin user if empty
      try {
        const { seedDefaultAdmin } = await import('./dbSeed');
        await seedDefaultAdmin();
      } catch (seedError) {
        console.error('Error running automatic seeder:', seedError);
      }

      return conn;
    })();
  }

  try {
    mongooseCache.conn = await mongooseCache.promise;
  } catch (e) {
    mongooseCache.promise = null;
    throw e;
  }

  return mongooseCache.conn;
}

export default dbConnect;
