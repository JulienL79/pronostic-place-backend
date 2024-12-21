import 'dotenv/config';
import express from 'express';
import mongoose from 'mongoose';
import cors from 'cors'
import dataRouter from './routes/dataRouter.js';
import './cronJob.js'; // Import de cronJob.js pour lancer les tâches

const app = express();
const PORT = process.env.PORT || 3005
const MONGO_URI = process.env.MONGO_URI

app.get('/api/', (req, res) => {
    res.send('Welcome to my API')
})

app.use(cors())
app.use(express.json())
app.use(express.urlencoded({extended: false}))
app.use('/api', dataRouter)

mongoose.connect(MONGO_URI)
const db = mongoose.connection
db.on('connected', () => {
    console.log('Connected to the database')
})
db.on("error" , console .error.bind(console , "MongoDB connection error:" ));

app.listen(PORT, () => {
    console.log(`Server is running on PORT ${PORT}`)
})