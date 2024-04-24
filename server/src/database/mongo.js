const { MongoMemoryServer } = require('mongodb-memory-server');
const { MongoClient } = require('mongodb');

let database = null;

async function startDatabase() {
  const mongo = new MongoMemoryServer();
  await mongo.start(); // Ensure the server is started before obtaining the connection string
  const mongoDBURL = await mongo.getUri(); // Use getUri() instead of getConnectionString()
  const connection = await MongoClient.connect(mongoDBURL); // Remove useNewUrlParser option
  database = connection.db();
}

async function getDatabase() {
  if (!database) await startDatabase();
  return database;
}

module.exports = {
  getDatabase,
  startDatabase,
};
