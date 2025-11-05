/**
 * Connection Test Script
 * Run this to verify your backend configuration
 * Usage: node utils/test-connection.js
 */

import dotenv from 'dotenv';
import mongoose from 'mongoose';

dotenv.config();

console.log('═══════════════════════════════════════════════════════');
console.log('🔍 Backend Configuration Test');
console.log('═══════════════════════════════════════════════════════\n');

// Check environment variables
console.log('📋 Environment Variables:');
console.log(`   NODE_ENV: ${process.env.NODE_ENV || '❌ NOT SET'}`);
console.log(`   PORT: ${process.env.PORT || '❌ NOT SET'}`);
console.log(`   FRONTEND_URL: ${process.env.FRONTEND_URL || '❌ NOT SET'}`);
console.log(`   MONGODB_URI: ${process.env.MONGODB_URI ? '✅ SET' : '❌ NOT SET'}`);
console.log(`   JWT_SECRET: ${process.env.JWT_SECRET ? '✅ SET' : '❌ NOT SET'}`);
console.log(`   JWT_EXPIRE: ${process.env.JWT_EXPIRE || '❌ NOT SET'}`);
console.log(`   MFA_ISSUER: ${process.env.MFA_ISSUER || '❌ NOT SET'}\n`);

// Test MongoDB connection
console.log('🗄️  Testing MongoDB Connection...');

if (!process.env.MONGODB_URI) {
  console.log('❌ MONGODB_URI is not set!\n');
  process.exit(1);
}

try {
  await mongoose.connect(process.env.MONGODB_URI);
  console.log('✅ MongoDB Connected Successfully!\n');
  
  // Check collections
  const collections = await mongoose.connection.db.listCollections().toArray();
  console.log('📦 Available Collections:');
  collections.forEach(col => {
    console.log(`   - ${col.name}`);
  });
  
  // Check if users exist
  const usersCount = await mongoose.connection.db.collection('users').countDocuments();
  console.log(`\n👥 Users in database: ${usersCount}`);
  
  if (usersCount === 0) {
    console.log('⚠️  WARNING: No users found! Run seed script: node utils/seed.js\n');
  } else {
    console.log('✅ Users exist in database\n');
    
    // Show sample user emails
    const sampleUsers = await mongoose.connection.db.collection('users')
      .find({}, { projection: { email: 1, role: 1 } })
      .limit(5)
      .toArray();
    
    console.log('📧 Sample User Emails:');
    sampleUsers.forEach(user => {
      console.log(`   - ${user.email} (${user.role})`);
    });
  }
  
  console.log('\n═══════════════════════════════════════════════════════');
  console.log('✅ All Tests Passed!');
  console.log('═══════════════════════════════════════════════════════\n');
  
  await mongoose.connection.close();
  process.exit(0);
  
} catch (error) {
  console.log('❌ MongoDB Connection Failed!');
  console.log('Error:', error.message);
  console.log('\n💡 Possible Solutions:');
  console.log('   1. Check if MONGODB_URI is correct');
  console.log('   2. Verify MongoDB Atlas Network Access allows 0.0.0.0/0');
  console.log('   3. Check if MongoDB cluster is running (not paused)\n');
  
  process.exit(1);
}
