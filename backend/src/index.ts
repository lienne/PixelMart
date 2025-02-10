import express, { Request, Response, NextFunction } from 'express';
import cors from 'cors';
// import productRoutes from './routes/productRoutes';
// import authRoutes from './routes/authRoutes';
import dotenv from 'dotenv';
import { testConnection } from './database';
import userRoutes from './routes/userRoutes';
import fileRoutes from './routes/fileRoutes';

console.log('Database module imported.');
testConnection();

dotenv.config();
const app = express();
const port = process.env.PORT || 3000;

app.use(cors());

// Middleware to parse JSON requests
app.use(express.json());

app.use((err: Error, req: Request, res: Response, next: NextFunction) => {
  console.error(err.stack);
  res.status(500).send('Something went wrong!');
});
  

// Use product routes
// app.use('/api/auth', productRoutes);
app.use('/api/users', userRoutes);
app.use('/api/files', fileRoutes);

app.get('/', (req, res) => {
    res.send('Welcome to the Digital Marketplace PixelMart!');
});

app.listen(port, () => {
    console.log(`Server is running on port ${port}`);
});