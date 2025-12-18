import express from 'express';
import mongoose from 'mongoose';
import dotenv from 'dotenv';
import cookieParser from 'cookie-parser';

const app = express();
dotenv.config();


// to use json middleware
app.use(express.json());
app.use(cookieParser());



// MongoDB connection function
const PORT = process.env.PORT || 5000;
const connectDB = async () => {
    try {
        await mongoose.connect(process.env.MONGO_URI, {
            useNewUrlParser: true,
            useUnifiedTopology: true,
        });
        console.log('MongoDB connected successfully');

        const server = app.listen(PORT, () => {
            console.log(`Server is running on port ${PORT}`);
        }   );

        // Handle unhandled promise rejections
        process.on('unhandledRejection', (err, promise) => {
            console.log(`Error: ${err.message}`);
            // Close server & exit process
            server.close(() => process.exit(1));
        }); 
    }

    catch (error) {
        console.error('MongoDB connection error:', error);
        process.exit(1);
    }       
};

connectDB();

// export default connectDB;
