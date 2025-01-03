import 'dotenv/config';
import express from 'express';

import cors from 'cors'
import dataRouter from './routes/dataRouter.js';
import { connectDB } from './config/connectDB.js';
// import './cronJob.js'; // Import de cronJob.js pour lancer les tâches

const app = express();
const PORT = process.env.PORT || 3005

app.get('/api/', (req, res) => {
    res.send('Welcome to my API')
})

app.use(cors())
app.use(express.json())
app.use(express.urlencoded({extended: false}))
app.use('/api', dataRouter)

connectDB()

app.get('/ping', (req, res) => {
    const now = new Date()
    console.log(`Ping at ${now}`)
    return res.status(200).json({message: 'Server still running'})
})

app.listen(PORT, () => {
    console.log(`Server is running on PORT ${PORT}`)
})