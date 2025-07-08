const express  = require('express');
const cors = require('cors')
const dotenv = require('dotenv');
const connectDB = require('./db/db');
const userRoutes = require('./routers/user.router');
dotenv.config();

const app = express();
connectDB();

 app.use(express.json());
 app.use(express.urlencoded({extended:true}));
 app.use(cors())



app.get('/', (req, res) =>{
    res.send('hello world')
})

app.use('/users', userRoutes);




module.exports = app; 