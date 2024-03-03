import mongoose, { ConnectOptions } from 'mongoose';
import dotenv from 'dotenv';

dotenv.config();


// Load MongoDB connection credentials from environment variables
const username = encodeURIComponent(process.env.MONGODB_USERNAME as string);
const password = encodeURIComponent(process.env.MONGODB_PASSWORD as string);
const dbName = process.env.MONGODB_DB_NAME as string;
const host = process.env.MONGODB_HOST || 'localhost:27017'; // Default to localhost if not specified


const mongoUri = `mongodb://${username}:${password}@${host}/${dbName}?authSource=admin`;

console.log('Connecting to MongoDB:', mongoUri);


if (process.env.NODE_ENV !== 'test') {
  const connectWithRetry = () => {
    mongoose.connect(mongoUri).then(() => {
      console.log('Connected to MongoDB');
    }).catch((err) => {
      console.error('Error connecting to MongoDB:', err);
      console.log('Attempting to reconnect to MongoDB in 5 seconds...');
      setTimeout(connectWithRetry, 5000);
    });
  };

  connectWithRetry();
}

export default mongoose.connection;