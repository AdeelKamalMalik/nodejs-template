import "reflect-metadata";
import express, { Request, Response } from "express";
import cors from "cors";
import http from "http";
import { initializeDataSource, closeDataSource } from "./data-source";
import { Server } from "socket.io";
import { authRoutes, blogRoutes, commentRoutes, userRoutes, notificationRoutes } from "./routes";
import { authenticateToken } from "./middleware";

const app = express();
const server = http.createServer(app);

const corsOptions = {
  origin: '*',
  methods: ['GET', 'POST', 'PUT', 'DELETE', 'PATCH', 'OPTIONS'],
  allowedHeaders: ['Content-Type', 'Authorization', 'Origin', 'Accept'],
};

app.use(express.json());
app.use(cors(corsOptions));

const io = new Server(server, {
  cors: corsOptions,
});

(async () => {
  try {
    console.log("Starting ...");
    await initializeDataSource();
    console.log('Database connection established');

    // Initialize routes
    app.use('/api/auth', authRoutes);
    app.use('/api/users', authenticateToken, userRoutes);
    app.use('/api/blogs', blogRoutes);
    app.use('/api/notifications', notificationRoutes);
    app.use('/api', commentRoutes);

    app.get('/', (req: Request, res: Response) => {
      return res.status(200).json({ message: "PONG" });
    });

    io.on('connection', (socket) => {
      console.log(`New client connected: ${socket.id}`);

      socket.on('disconnect', () => {
        console.log(`Client disconnected: ${socket.id}`);
      });

      socket.on('join-room', (userId) => {
        socket.join(userId);
        console.log(`User ${userId} joined room ${userId}`);
      });
    });

    const PORT = process.env.PORT || 3000;
    server.listen(PORT, () => {
      console.log(`Server running on port ${PORT}`);
    });

    process.on('SIGINT', async () => {
      console.log('SIGINT signal received: closing HTTP server');
      await closeDataSource();
      process.exit(0);
    });
  } catch (error) {
    console.error('Error connecting to database:', error);
    process.exit(1);
  }
})();

export { io };
