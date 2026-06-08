import mongoose from 'mongoose';
import fs from 'fs';
import path from 'path';
import Kural from '@/models/Kural';

const MONGODB_URI = process.env.MONGO_URI;

if (!MONGODB_URI) {
  throw new Error('Please define the MONGO_URI environment variable inside .env');
}

let cached = global.mongoose;

if (!cached) {
  cached = global.mongoose = { conn: null, promise: null };
}

async function seedDatabase() {
  try {
    const count = await Kural.countDocuments();
    if (count === 0) {
      console.log('Seeding Database with Kurals...');
      const dataPath = path.join(process.cwd(), 'kural.json');
      const kuralData = JSON.parse(fs.readFileSync(dataPath, 'utf8'));
      
      if (kuralData && kuralData.kural && Array.isArray(kuralData.kural)) {
        await Kural.insertMany(kuralData.kural);
        console.log(`Successfully seeded ${kuralData.kural.length} kurals.`);
      }
    }
  } catch (error) {
    console.error('Error seeding database:', error);
  }
}

async function dbConnect() {
  if (cached.conn) {
    return cached.conn;
  }

  if (!cached.promise) {
    const opts = {
      bufferCommands: false,
    };

    cached.promise = mongoose.connect(MONGODB_URI, opts).then((mongoose) => {
      console.log("MongoDB connected");
      seedDatabase();
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

export default dbConnect;
