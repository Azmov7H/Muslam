import mongoose from 'mongoose';
import { config } from 'dotenv';
config();

const connectDB = async () => {
  try {
    const uri = process.env.MONGODB_URI;

    await mongoose.connect(uri, {
      useNewUrlParser: true,
      useUnifiedTopology: true,
    });

    console.log(' Connected to MongoDB');
  } catch (err) {
    console.error(' MongoDB connection failed:', err.message);
    process.exit(1);
  }
};

export default connectDB;
