import { Client } from 'pg';
import { config } from '../config';

// Async function to create PostgreSQL database
const createDatabase = async () => {
  // Connect to PostgreSQL server (without specifying the target database)
  const client = new Client({
    host: config.db.host,
    user: config.db.username,
    password: config.db.password,
    port: config.db.port || 5432, // Default Postgres port
    database: 'postgres', // Connect to default postgres database for administrative tasks
  });

  try {
    await client.connect();
    console.log('Connected to Postgres.');

    // Check if the database already exists
    const checkQuery = `SELECT 1 FROM pg_database WHERE datname = '${config.db.database}'`;
    const checkResult = await client.query(checkQuery);

    if (checkResult.rows.length > 0) {
      console.log(`Database "${config.db.database}" already exists.`);
    } else {
      // Create the database if it doesn't exist
      const createQuery = `CREATE DATABASE "${config.db.database}"`;
      await client.query(createQuery);
      console.log(`Database "${config.db.database}" created successfully.`);
    }
  } catch (error) {
    console.error('Error creating database:', error);
  } finally {
    await client.end();
    console.log('Disconnected from Postgres.');
  }
};

// Run the createDatabase function and handle errors
createDatabase().catch((error) => console.error('Error creating database:', error));
