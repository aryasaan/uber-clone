const express  = require('express');
const cors = require('cors')
const cookieParser = require('cookie-parser');
const dotenv = require('dotenv');
const connectDB = require('./db/db');
const userRoutes = require('./routers/user.router');
const captainRoutes = require('./routers/captain.router');
dotenv.config();

const app = express();
connectDB();

 app.use(express.json());
 app.use(express.urlencoded({extended:true}));
 app.use(cors())
 app.use(cookieParser());


app.get('/', (req, res) =>{
    res.send('hello world')
})

app.use('/users', userRoutes);
app.use('/captains',captainRoutes);





module.exports = app; 