import mongoose from 'mongoose';

// Source: Local MongoDB
const LOCAL_URI = 'mongodb://127.0.0.1:27017/hr_management_system';

// Destination: MongoDB Atlas
const ATLAS_URI = 'mongodb+srv://Naveen:Naveenroy@hrbackend.bmeyguz.mongodb.net/hrbackend?retryWrites=true&w=majority&appName=hrbackend';

const migrateData = async () => {
  try {
    console.log('🔄 Starting Data Migration from Local to Atlas...\n');

    // Connect to LOCAL database
    console.log('📡 Connecting to LOCAL MongoDB...');
    const localConn = await mongoose.createConnection(LOCAL_URI).asPromise();
    console.log('✅ Connected to LOCAL database\n');

    // Connect to ATLAS database
    console.log('📡 Connecting to ATLAS MongoDB...');
    const atlasConn = await mongoose.createConnection(ATLAS_URI).asPromise();
    console.log('✅ Connected to ATLAS database\n');

    // Get all collections from local database
    const collections = await localConn.db.listCollections().toArray();
    console.log(`📋 Found ${collections.length} collections to migrate:\n`);

    let totalDocuments = 0;

    for (const collectionInfo of collections) {
      const collectionName = collectionInfo.name;
      console.log(`📦 Migrating collection: ${collectionName}`);

      // Get data from local collection
      const localCollection = localConn.db.collection(collectionName);
      const documents = await localCollection.find({}).toArray();

      if (documents.length === 0) {
        console.log(`   ℹ️  No documents found, skipping...\n`);
        continue;
      }

      // Clear existing data in atlas collection
      const atlasCollection = atlasConn.db.collection(collectionName);
      await atlasCollection.deleteMany({});

      // Insert data into atlas collection
      if (documents.length > 0) {
        await atlasCollection.insertMany(documents);
        console.log(`   ✅ Migrated ${documents.length} documents\n`);
        totalDocuments += documents.length;
      }
    }

    console.log('═══════════════════════════════════════════════════════');
    console.log('✅ Migration Complete!');
    console.log('═══════════════════════════════════════════════════════');
    console.log(`📊 Summary:`);
    console.log(`   Collections migrated: ${collections.length}`);
    console.log(`   Total documents: ${totalDocuments}`);
    console.log('\n🌐 Data is now in Atlas: hrbackend.bmeyguz.mongodb.net');
    console.log('═══════════════════════════════════════════════════════\n');

    // Close connections
    await localConn.close();
    await atlasConn.close();

    process.exit(0);
  } catch (error) {
    console.error('❌ Migration Error:', error);
    process.exit(1);
  }
};

migrateData();
