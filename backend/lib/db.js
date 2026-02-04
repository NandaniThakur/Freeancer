import express from "express"
import mongoose from "mongoose"
import dotenv from "dotenv"
import cookieParser from "cookie-parser"
import cors from "cors"

import authRoutes from "../routes/authRoutes.js"
import userRoutes from "../routes/userRoutes.js"

dotenv.config()

const app = express()

// Middlewares
app.use(express.json())
app.use(cookieParser())
app.use(cors({
  origin: "http://localhost:3000", // Next.js
  credentials: true
}))

// Routes
app.use("/api/auth", authRoutes)
app.use("/api/user", userRoutes)

// DB + Server
const PORT = process.env.PORT || 5000

const startServer = async () => {
  try {
    await mongoose.connect(process.env.MONGO_URI)
    console.log("MongoDB connected successfully")

    app.listen(PORT, () => {
      console.log(`Server running on port ${PORT}`)
    })

  } catch (error) {
    console.error("MongoDB connection failed:", error.message)
    process.exit(1)
  }
}

startServer()





// import express from 'express';
// import mongoose from 'mongoose';
// import dotenv from 'dotenv';
// import cookieParser from 'cookie-parser';
// import authRoutes from './backend/routes/authRoutes.js';
// import userRoutes from './backend/routes/userRoutes.js';

// const app = express();
// dotenv.config();


// // to use json middleware
// app.use(express.json());
// app.use(cookieParser());

// // Routes
// app.use('/api/auth', authRoutes);
// app.use('/api/user', userRoutes);



// // MongoDB connection function
// const PORT = process.env.PORT || 5000;
// const connectDB = async () => {
//     try {
//         await mongoose.connect(process.env.MONGO_URI);
//         console.log('MongoDB connected successfully');

//         const server = app.listen(PORT, () => {
//             console.log(`Server is running on port ${PORT}`);
//         }   );

//         // Handle unhandled promise rejections
//         process.on('unhandledRejection', (err, promise) => {
//             console.log(`Error: ${err.message}`);
//             // Close server & exit process
//             server.close(() => process.exit(1));
//         }); 
//     }

//     catch (error) {
//         console.error('MongoDB connection error:', error);
//         process.exit(1);
//     }       
// };

// connectDB();

// // export default connectDB;
