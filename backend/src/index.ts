import express, { Request, Response, NextFunction } from 'express';
import cors from 'cors';
import dotenv from 'dotenv';
import { testConnection } from './database';
import bodyParser from "body-parser";
import userRoutes from './routes/userRoutes';
import fileRoutes from './routes/fileRoutes';
import stripeRoutes from './routes/stripeRoutes';
import cartRoutes from './routes/cartRoutes';
import wishlistRoutes from './routes/wishlistRoutes';
import contactRoutes from './routes/contactRoutes';
import checkoutRouter from './routes/checkoutRoutes';
import orderRouter from './routes/orderRoutes';
import webhookRouter from './routes/stripeWebhookRoutes';
import searchRouter from './routes/searchRoutes';
import reviewsRouter from './routes/reviewsRoutes';
import reportRouter from './routes/reportRoutes';
import adminRouter from './routes/adminRoutes';
import { stripeWebhook } from './controllers/stripeWebhookController';

console.log('Database module imported.');
testConnection();

dotenv.config();
const app = express();
const port = process.env.PORT || 3000;
const FRONTEND_REGEX = /^https:\/\/(www\.)?pixelmart\.dev$/;
const CORS_OPTIONS = {
  origin: (origin: string | undefined, callback: Function) => {
    // allow non-browser tools like curl (no origin)
    if (!origin || FRONTEND_REGEX.test(origin)) {
      return callback(null, true);
    }
    callback(new Error(`Origin ${origin} not allowed by CORS`));
  },
  credentials: true,
  methods: ["GET","POST","PUT","PATCH","DELETE","OPTIONS"],
  allowedHeaders: ["Content-Type","Authorization"],
};

app.set("trust proxy", 1);
app.use(cors(CORS_OPTIONS));
app.options("*", cors(CORS_OPTIONS));

// For Stripe webhooks, use raw body parser
app.use(
  "/api/webhooks/stripe",
  bodyParser.raw({ type: "application/json" }),
  stripeWebhook
);

// Middleware to parse JSON requests
app.use(express.json());

app.use((err: Error, req: Request, res: Response, next: NextFunction) => {
  console.error(err.stack);
  res.status(500).send('Something went wrong!');
});

app.use('/api/users', userRoutes);
app.use('/api/files', fileRoutes);
app.use('/api/stripe', stripeRoutes);
app.use('/api/users', cartRoutes);
app.use('/api/users', wishlistRoutes);
app.use("/api", contactRoutes);
app.use("/api/checkout", checkoutRouter);
app.use("/api/orders", orderRouter);
app.use("/api", searchRouter);
app.use("/api", reviewsRouter);
app.use("/api", reportRouter);
app.use("/api/admin", adminRouter);

app.get('/', (req, res) => {
    res.send('Welcome to the Digital Marketplace PixelMart!');
});

app.listen(port, () => {
    console.log(`Server is running on port ${port}`);
});