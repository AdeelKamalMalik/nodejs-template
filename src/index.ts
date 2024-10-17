import "reflect-metadata";
import express from "express";
import cors from "cors";
import multer from "multer"; // Import Multer
import { initializeDataSource, closeDataSource } from "./data-source";
import { authRoutes, blogRoutes, userRoutes } from "./routes";
import { Request, Response } from 'express';

import { authenticateToken } from "./middleware";

const app = express();

app.use(express.json());

const corsOptions = {
  origin: '*',
  methods: ['GET', 'POST', 'PUT', 'DELETE', 'PATCH', 'OPTIONS'],
  allowedHeaders: ['Content-Type', 'Authorization', 'Origin', 'Accept'],
};

app.use(cors(corsOptions));

(async () => {
  try {
    console.log("Starting ...");
    await initializeDataSource();
    console.log('Database connection established');

    app.use('/api/auth', authRoutes);
    app.use('/api/users', authenticateToken, userRoutes);
    app.use('/api/blogs', blogRoutes);

    app.get('/', (req: Request, res: Response) => {
      return res.status(200).json({ message: "PONG" });
    });

    const PORT = process.env.PORT || 3000;
    app.listen(PORT, () => {
      console.log(`Server running on port ${PORT}`);
    });

    process.on('SIGINT', async () => {
      console.log('SIGINT signal received: closing HTTP server');
      await closeDataSource();
      process.exit(0);
    });
  } catch (error) {
    console.error('Error connecting to database:', error);
    process.exit(1); // Exit with failure code
  }
})();
