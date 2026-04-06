import mongoose from "mongoose";

/**
 * Global is used here to maintain a cached connection across hot reloads
 * in development. This prevents connections growing exponentially
 * during API Route usage.
 */
interface GlobalMongoose {
   conn: typeof mongoose | null;
   promise: Promise<typeof mongoose> | null;
}

declare global {
   var mongoose: GlobalMongoose | undefined;
}

let cached: GlobalMongoose = global.mongoose || { conn: null, promise: null };

if (!global.mongoose) {
   global.mongoose = cached;
}

async function connectDB(): Promise<typeof mongoose> {
   const mongoUri =
      process.env.MONGODB_URI ||
      process.env.MONGO_URI ||
      process.env.DATABASE_URL;

   // Validate MONGODB_URI at runtime, not at module load time
   // This allows Next.js build to succeed without database credentials
   if (!mongoUri) {
      throw new Error(
         "Missing MongoDB URI. Set one of: MONGODB_URI, MONGO_URI, DATABASE_URL"
      );
   }

   if (cached.conn) {
      return cached.conn;
   }

   if (!cached.promise) {
      const opts = {
         bufferCommands: false,
      };

      cached.promise = mongoose.connect(mongoUri, opts).then((mongoose) => {
         return mongoose;
      });
   }

   try {
      cached.conn = await cached.promise;
   } catch (e) {
      cached.promise = null;
      throw e;
   }

   return cached.conn;
}

export default connectDB;
