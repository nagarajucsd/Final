import mongoose from 'mongoose';
import bcrypt from 'bcryptjs';
import User from '../models/User.js';
import Employee from '../models/Employee.js';
import Department from '../models/Department.js';

// MongoDB Atlas connection string
const ATLAS_URI = 'mongodb+srv://Naveen:Naveenroy@hrbackend.bmeyguz.mongodb.net/hrbackend?retryWrites=true&w=majority&appName=hrbackend';

const seedAtlas = async () => {
  try {
    console.log('🌱 Seeding MongoDB Atlas Database...\n');
    
    // Connect to Atlas
    console.log('📡 Connecting to MongoDB Atlas...');
    await mongoose.connect(ATLAS_URI);
    console.log('✅ Connected to Atlas\n');

    // Clear existing data
    console.log('🗑️  Clearing existing data...');
    await User.deleteMany({});
    await Employee.deleteMany({});
    await Department.deleteMany({});
    console.log('✅ Existing data cleared\n');

    // Create Departments
    console.log('📁 Creating departments...');
    const departments = await Department.insertMany([
      {
        name: 'Engineering',
        description: 'Software development and technical operations',
        managerId: null
      },
      {
        name: 'Human Resources',
        description: 'Employee management and recruitment',
        managerId: null
      },
      {
        name: 'Sales',
        description: 'Sales and business development',
        managerId: null
      },
      {
        name: 'Marketing',
        description: 'Marketing and brand management',
        managerId: null
      }
    ]);
    console.log(`✅ Created ${departments.length} departments\n`);

    // Create Users and Employees
    console.log('👥 Creating users and employees...');

    const usersData = [
      {
        name: 'Alex Admin',
        email: 'admin@hrms.com',
        password: 'admin123',
        role: 'Admin',
        department: departments[1]._id, // HR
        position: 'System Administrator',
        salary: 120000,
        joinDate: new Date('2020-01-15')
      },
      {
        name: 'Harriet HR',
        email: 'hr@hrms.com',
        password: 'admin123',
        role: 'HR',
        department: departments[1]._id, // HR
        position: 'HR Manager',
        salary: 90000,
        joinDate: new Date('2020-03-01')
      },
      {
        name: 'Mandy Manager',
        email: 'manager@hrms.com',
        password: 'admin123',
        role: 'Manager',
        department: departments[0]._id, // Engineering
        position: 'Engineering Manager',
        salary: 110000,
        joinDate: new Date('2020-06-15')
      },
      {
        name: 'Eva Employee',
        email: 'employee@hrms.com',
        password: 'admin123',
        role: 'Employee',
        department: departments[0]._id, // Engineering
        position: 'Software Engineer',
        salary: 80000,
        joinDate: new Date('2021-01-10')
      },
      {
        name: 'Sarah Sales',
        email: 'sarah@hrms.com',
        password: 'admin123',
        role: 'Employee',
        department: departments[2]._id, // Sales
        position: 'Sales Representative',
        salary: 70000,
        joinDate: new Date('2021-05-20')
      }
    ];

    for (const userData of usersData) {
      // Create User
      const hashedPassword = await bcrypt.hash(userData.password, 10);
      const user = await User.create({
        name: userData.name,
        email: userData.email,
        password: hashedPassword,
        role: userData.role,
        isActive: true,
        isMfaSetup: false
      });

      // Create Employee
      await Employee.create({
        employeeId: `EMP${String(usersData.indexOf(userData) + 1).padStart(3, '0')}`,
        userId: user._id,
        name: userData.name,
        email: userData.email,
        phone: `+1-555-${Math.floor(Math.random() * 9000) + 1000}`,
        departmentId: userData.department,
        role: userData.position,
        salary: userData.salary,
        joinDate: userData.joinDate,
        status: 'Active',
        employeeType: 'Permanent',
        currentPassword: userData.password
      });

      console.log(`✅ Created: ${userData.name} (${userData.email})`);
    }

    console.log('\n═══════════════════════════════════════════════════════');
    console.log('✅ MongoDB Atlas Seeding Complete!');
    console.log('═══════════════════════════════════════════════════════');
    console.log('\n📊 Summary:');
    console.log(`   Departments: ${departments.length}`);
    console.log(`   Users: ${usersData.length}`);
    console.log(`   Employees: ${usersData.length}`);
    console.log('\n🔐 Login Credentials:');
    console.log('   Admin:    admin@hrms.com / admin123');
    console.log('   HR:       hr@hrms.com / admin123');
    console.log('   Manager:  manager@hrms.com / admin123');
    console.log('   Employee: employee@hrms.com / admin123');
    console.log('\n🔑 MFA Code (Development): 123456');
    console.log('\n🌐 Your Atlas Database: hrbackend.bmeyguz.mongodb.net');
    console.log('═══════════════════════════════════════════════════════\n');

    process.exit(0);
  } catch (error) {
    console.error('❌ Error seeding Atlas:', error);
    process.exit(1);
  }
};

seedAtlas();
