import mongoose from 'mongoose';

const MONGO_URI = process.env.MONGO_URI

export const connectDB = () => {
    mongoose.connect(MONGO_URI)
    const db = mongoose.connection
    db.on('connected', () => {
        console.log('Connected to the database')
    })
    db.on("error" , console .error.bind(console , "MongoDB connection error:" ));
};