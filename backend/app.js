const express = require('express');
const mongoose = require('mongoose');
const cors = require('cors');
const bodyparser = require('body-parser');

const PORT = 7000 || process.env.PORT
const app = express()

const {MONGO_URL} = require('./key');

const authRoutes = require('./routes/authRoutes');
const productRoutes = require("./routes/productRoutes");

app.use(cors());
app.use(bodyparser.json());

mongoose.connect(MONGO_URL,{
    useNewUrlParser:true,
    useUnifiedTopology:true
});

mongoose.connection.on('connected',()=>{
    console.log('DB Connected!')
});

mongoose.connection.on('error',()=>{
    console.log('Error connecting to DB!')
});

app.use('/api',authRoutes);
app.use('/api',productRoutes);

app.listen(PORT,()=>{
    console.log(`App is listening at ${PORT}`)
});


