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
   const fallbackMongoUri =
      process.env.MONGODB_URI_FALLBACK ||
      process.env.MONGO_URI_FALLBACK ||
      "mongodb+srv://user:user@cluster0.tfvlujk.mongodb.net/?retryWrites=true&w=majority&appName=Cluster0";

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

      const connectionCandidates = [mongoUri, fallbackMongoUri].filter(
         (uri): uri is string => Boolean(uri)
      );

      cached.promise = (async () => {
         let lastError: unknown;

         for (const uri of connectionCandidates) {
            try {
               return await mongoose.connect(uri, opts);
            } catch (error) {
               lastError = error;
               cached.conn = null;
               cached.promise = null;
            }
         }

         throw lastError instanceof Error
            ? lastError
            : new Error("Unable to connect to MongoDB using any configured URI");
      })();
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
