import mongoose from 'mongoose';
import dotenv from 'dotenv';
import Attendance from './models/Attendance.js';

dotenv.config();

const cleanupFutureAttendance = async () => {
    try {
        console.log('Connecting to MongoDB...');
        await mongoose.connect(process.env.MONGODB_URI);
        console.log('✅ Connected to MongoDB\n');

        const today = new Date();
        today.setHours(0, 0, 0, 0);

        console.log('🔍 Searching for future attendance records...');
        const futureRecords = await Attendance.find({
            date: { $gt: today }
        });

        console.log(`Found ${futureRecords.length} future attendance records`);

        if (futureRecords.length > 0) {
            console.log('\n📋 Future records to be deleted:');
            futureRecords.forEach(record => {
                console.log(`  - Date: ${record.date.toISOString().split('T')[0]}, Status: ${record.status}`);
            });

            const result = await Attendance.deleteMany({
                date: { $gt: today }
            });

            console.log(`\n✅ Deleted ${result.deletedCount} future attendance records`);
        } else {
            console.log('✅ No future attendance records found');
        }

        await mongoose.connection.close();
        console.log('\n✅ Database connection closed');
    } catch (error) {
        console.error('❌ Error:', error);
        process.exit(1);
    }
};

cleanupFutureAttendance();
