import mongoose from 'mongoose';
import dotenv from 'dotenv';
import Attendance from './models/Attendance.js';
import Employee from './models/Employee.js';

dotenv.config();

const checkTodayAttendance = async () => {
    try {
        console.log('Connecting to MongoDB...');
        await mongoose.connect(process.env.MONGODB_URI);
        console.log('✅ Connected to MongoDB\n');

        const now = new Date();
        const today = new Date(now.getFullYear(), now.getMonth(), now.getDate(), 0, 0, 0, 0);
        const todayString = `${now.getFullYear()}-${String(now.getMonth() + 1).padStart(2, '0')}-${String(now.getDate()).padStart(2, '0')}`;

        console.log(`📅 Today's date (local): ${todayString}`);
        console.log(`📅 Today's date (stored): ${today.toISOString().split('T')[0]}\n`);

        const todayAttendance = await Attendance.find({
            date: today
        }).populate('employeeId');

        console.log(`📋 Found ${todayAttendance.length} attendance records for today:\n`);

        todayAttendance.forEach((record, index) => {
            const empName = record.employeeId?.name || 'Unknown';
            const empEmail = record.employeeId?.email || 'Unknown';
            console.log(`${index + 1}. ${empName} (${empEmail})`);
            console.log(`   Status: ${record.status}`);
            console.log(`   Clock-in: ${record.clockIn || 'N/A'}`);
            console.log(`   Clock-out: ${record.clockOut || 'N/A'}`);
            console.log(`   Date: ${new Date(record.date).toISOString().split('T')[0]}\n`);
        });

        // Check for admin specifically
        const adminEmployee = await Employee.findOne({ email: 'admin@hrms.com' });
        if (adminEmployee) {
            console.log(`\n🔍 Admin employee found: ${adminEmployee.name} (ID: ${adminEmployee._id})`);
            
            const adminAttendance = await Attendance.findOne({
                employeeId: adminEmployee._id,
                date: today
            });

            if (adminAttendance) {
                console.log('✅ Admin attendance record exists for today');
                console.log(`   Status: ${adminAttendance.status}`);
                console.log(`   Clock-in: ${adminAttendance.clockIn}`);
            } else {
                console.log('❌ No attendance record found for admin today');
            }
        } else {
            console.log('❌ Admin employee not found in database');
        }

        await mongoose.connection.close();
        console.log('\n✅ Database connection closed');
    } catch (error) {
        console.error('❌ Error:', error);
        process.exit(1);
    }
};

checkTodayAttendance();
