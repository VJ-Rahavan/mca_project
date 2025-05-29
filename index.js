import { config } from 'dotenv';
import express from 'express';
import cors from "cors"
import mongoose from 'mongoose';
import { authRouter } from './routes/authRoute.js';
import { productRouter } from './routes/productsRoute.js';
import { verifyToken } from './middlewares/verifyToken.js';
import { cartRouter } from './routes/cartRoute.js';

// initialize a new express application instance
const app = express();
config()
// middlewares
app.use(express.json())
app.use(cors())

// routes
app.use("/api/auth", authRouter)
app.use("/api/products", verifyToken, productRouter);
app.use("/api/cart", verifyToken, cartRouter)

// connect to DataBase (MONGODB)

const PORT = process.env.PORT // http://localhost:4000/api/products/ -> POST
const MONGODB_URI = process.env.MONGODB_URI;

mongoose.connect(MONGODB_URI)
    .then(() => app.listen(PORT, () => console.log(`Connected to DB, and running on http://localhost:${PORT}/`)))
    .catch((error) => console.log(`Error:`, error.message))



