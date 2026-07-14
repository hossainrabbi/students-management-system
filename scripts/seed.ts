import fs from 'fs';
import path from 'path';
import mongoose from 'mongoose';

// 1. Manually parse and load .env.local to process.env
try {
  const envPath = path.resolve(process.cwd(), '.env.local');
  if (fs.existsSync(envPath)) {
    const envConfig = fs.readFileSync(envPath, 'utf-8');
    for (const line of envConfig.split('\n')) {
      const trimmed = line.trim();
      if (!trimmed || trimmed.startsWith('#')) continue;
      
      const parts = trimmed.split('=');
      if (parts.length >= 2) {
        const key = parts[0].trim();
        let value = parts.slice(1).join('=').trim();
        
        // Remove leading/trailing quotes
        if ((value.startsWith('"') && value.endsWith('"')) || 
            (value.startsWith("'") && value.endsWith("'"))) {
          value = value.substring(1, value.length - 1);
        }
        
        process.env[key] = value;
      }
    }
    console.log('✓ Loaded environment variables from .env.local');
  } else {
    console.log('! No .env.local found, using standard system environment');
  }
} catch (err) {
  console.error('Error loading .env.local:', err);
}

// 2. Connect to Database and run Seeder
import dbConnect from '../lib/dbConnect';
import { seedDemoData } from '../lib/dbSeed';

async function run() {
  try {
    // Connect to database
    console.log('Connecting to database for seeding...');
    await dbConnect();
    
    // Seed
    await seedDemoData();
    
    console.log('✓ Seeding process finished successfully.');
  } catch (error) {
    console.error('✗ Seeding process failed:', error);
    process.exit(1);
  } finally {
    // Close the connection
    await mongoose.connection.close();
    console.log('Database connection closed.');
    process.exit(0);
  }
}

run();
