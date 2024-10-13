
const express = require('express');
const mongoose = require('mongoose');
const cors = require('cors');
const dbConnect = require('./config/dbConnection')
const dotenv = require("dotenv");
dotenv.config({ path: "./config/.env" });
const cookieParser = require("cookie-parser");
const authRoute = require('./routes/authRoutes')
const friendRout = require('./routes/friendRutes')
const postRout  = require('./routes/postRoutes')
const userRout  = require('./routes/userRoutes')
const errorHandler = require('./middleware/errorHandler')

const app = express();
app.use(     
    cors({})
  );     
app.use(express.json())
app.use(cookieParser());

app.use('/api',authRoute)
app.use('/api',userRout )
app.use('/api',friendRout)
app.use('/api',postRout )

dbConnect()
app.use(errorHandler)

const PORT = process.env.PORT ;
app.listen(PORT, () => console.log(`Server running on port ${PORT}`));
