
const express = require('express');
const mongoose = require('mongoose');
const cors = require('cors');
const dbConnect = require('./config/dbConnection')
const dotenv = require("dotenv");
dotenv.config({ path: "./config/.env" });
const cookieParser = require("cookie-parser");
const authRout = require('./routes/authRoutes')
const friendRout = require('./routes/friendRutes')
const postRout  = require('./routes/postRoutes')

const app = express();
app.use(     
    cors({})
  );     
app.use(express.json())
app.use(cookieParser());

app.use('/api',authRout)
app.use('/api',friendRout)
app.use('/api',postRout )

dbConnect()

const PORT = process.env.PORT ;
app.listen(PORT, () => console.log(`Server running on port ${PORT}`));
