import app from './app';
import dotenv from 'dotenv';
import sequelize from './config/database';
import './models/item'; // Import models to register them with Sequelize

dotenv.config();

const PORT = process.env.PORT || 3000;

async function startServer() {
  try {
    // Sync models with database
    await sequelize.sync();
    console.log('Database connection has been established successfully.');
    
    const server = app.listen(PORT, () => {
      console.log(`Server is running on port ${PORT}`);
    });

    // For graceful shutdown
    process.on('SIGTERM', () => {
      console.log('SIGTERM signal received: closing HTTP server');
      server.close(async () => {
        await sequelize.close();
        console.log('HTTP server and database connection closed');
      });
    });
    
    return server;
  } catch (error) {
    console.error('Unable to connect to the database:', error);
    process.exit(1);
  }
}

// Start the server
const server = startServer();

export default server;
