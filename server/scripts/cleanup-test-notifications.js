import mongoose from 'mongoose';
import dotenv from 'dotenv';
import Notification from '../models/Notification.js';

dotenv.config();

const cleanupTestNotifications = async () => {
  try {
    console.log('🧹 Cleaning up test notifications...\n');
    
    // Connect to database
    console.log('📡 Connecting to MongoDB...');
    await mongoose.connect(process.env.MONGODB_URI);
    console.log('✅ Connected\n');

    // Delete all "System Test Notification" notifications
    const result = await Notification.deleteMany({
      title: 'System Test Notification'
    });

    console.log(`✅ Deleted ${result.deletedCount} test notifications\n`);

    // Show remaining notifications
    const remaining = await Notification.countDocuments({});
    console.log(`📊 Remaining notifications: ${remaining}\n`);

    process.exit(0);
  } catch (error) {
    console.error('❌ Error:', error.message);
    process.exit(1);
  }
};

cleanupTestNotifications();
