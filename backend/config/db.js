const mongoose = require('mongoose');

const connectDB = async () => {
    try {
        const conn = await mongoose.connect(process.env.MONGODB_URI);
        console.log(`MongoDB Connected: ${conn.connection.host}`);
        
        // Initialize database indexes
        await createIndexes();
    } catch (error) {
        console.error(`Error: ${error.message}`);
        process.exit(1);
    }
};

const createIndexes = async () => {
    try {
        const db = mongoose.connection.getClient().db();
        
        console.log('\n🔄 Creating Database Indexes...\n');

        // ========== JOB COLLECTION INDEXES ==========
        console.log('📍 Job Collection:');
        
        await db.collection('jobs').createIndex(
            { isActive: 1, createdAt: -1 },
            { name: 'idx_jobs_active_createdAt' }
        );
        console.log('   ✓ {isActive: 1, createdAt: -1}');

        await db.collection('jobs').createIndex(
            { employer: 1 },
            { name: 'idx_jobs_employer' }
        );
        console.log('   ✓ {employer: 1}');

        await db.collection('jobs').createIndex(
            { title: 1 },
            { name: 'idx_jobs_title' }
        );
        console.log('   ✓ {title: 1}');

        await db.collection('jobs').createIndex(
            { location: 1 },
            { name: 'idx_jobs_location' }
        );
        console.log('   ✓ {location: 1}');

        // ========== APPLICATION COLLECTION INDEXES ==========
        console.log('\n📍 Application Collection:');

        await db.collection('applications').createIndex(
            { seeker: 1, createdAt: -1 },
            { name: 'idx_applications_seeker_createdAt' }
        );
        console.log('   ✓ {seeker: 1, createdAt: -1}');

        await db.collection('applications').createIndex(
            { job: 1, createdAt: -1 },
            { name: 'idx_applications_job_createdAt' }
        );
        console.log('   ✓ {job: 1, createdAt: -1}');

        await db.collection('applications').createIndex(
            { employer: 1 },
            { name: 'idx_applications_employer' }
        );
        console.log('   ✓ {employer: 1}');

        await db.collection('applications').createIndex(
            { status: 1 },
            { name: 'idx_applications_status' }
        );
        console.log('   ✓ {status: 1}');

        // ========== QUERY COLLECTION INDEXES ==========
        console.log('\n📍 Query Collection:');

        await db.collection('queries').createIndex(
            { email: 1 },
            { name: 'idx_queries_email' }
        );
        console.log('   ✓ {email: 1}');

        await db.collection('queries').createIndex(
            { createdAt: -1 },
            { name: 'idx_queries_createdAt' }
        );
        console.log('   ✓ {createdAt: -1}');

        console.log('\n✅ Database indexes created successfully!\n');
    } catch (error) {
        if (error.codeName === 'IndexAlreadyExists') {
            console.log('✓ Indexes already exist - skipping...\n');
        } else {
            console.error('⚠️  Error creating indexes:', error.message);
        }
    }
};

module.exports = connectDB;
