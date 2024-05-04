import express, { RequestHandler } from 'express';
import bodyParser from 'body-parser';
import dotenv from 'dotenv';
import connectDB from './Config/db.config';
import adminRoutes from "./Routes/adminRoutes"
import { router as chatRoute } from './Routes/conversation';
import { router as messageRoute } from './Routes/messageRoute';
import userRoutes from "./Routes/userRoutes"
import vendorRoutes from "./Routes/vendorRoutes"
import cors from 'cors';
import session from 'express-session';
import cookieParser from "cookie-parser";
import { userEmailVerifyOtp, userOtpExpiration, vendorOtpExpiration } from './Middleware/OtpExpiration';
import path from 'path'
import { Request,Response } from 'express';




const { initializeSocket } = require('./socket')
import {createServer} from 'http';

dotenv.config();

connectDB();

const app = express();

const server = createServer(app)




app.use(cors({
  origin:['http://localhost:5000' ,"https://eventcrest.online"],
  credentials:true
}))

app.use(express.static(path.join(__dirname, 'public')));
app.use(express.static(path.join(__dirname,'../../Frontend/dist')))




const sessionMiddleware :RequestHandler=session({
  secret: process.env.SESSION_SECRET!, 
  resave: false,
  saveUninitialized: true,
  cookie: { secure: false , 
  maxAge:1000 * 60 * 60* 24  , 
  sameSite:'lax'}
})



app.use(sessionMiddleware);
app.use(cookieParser());
app.use(bodyParser.json());
app.use(userOtpExpiration)
app.use(vendorOtpExpiration)
app.use(userEmailVerifyOtp)
app.use('/api/admin' , adminRoutes);
app.use('/api/user' , userRoutes);
app.use('/api/vendor',vendorRoutes)
app.use('/api/conversation' , chatRoute)
app.use('/api/messages', messageRoute)

initializeSocket(server);

app.get('*',(req:Request,res:Response) =>{
  res.sendFile(path.join(__dirname,'../../Frontend/dist/index.html'))
})


const PORT = process.env.PORT;
app.listen(PORT , ()=>{
    console.log(`BACKEND SERVER RUNNING ON ${PORT}...`);
    
});
