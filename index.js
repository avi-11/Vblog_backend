import express from 'express';
import dotenv from 'dotenv';
dotenv.config();
import cookieParser from 'cookie-parser';
import userRoutes from './routes/userRoutes.js';

import connectDB from './config/db.js';
connectDB();

const PORT = process.env.PORT || 8000;
const app = express();

app.use(express.json());
app.use(express.urlencoded({extended:true}));
app.use(cookieParser());
app.use('/api/users',userRoutes);

app.get('/',(req,res)=>{
    res.send('server started')
});

app.listen(PORT,()=>{
    console.log(`server is running on port ${PORT}`)
});