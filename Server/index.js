const express = require('express');
const connectToDB = require('./db');
require('dotenv').config();
const cors = require('cors');

connectToDB();

const app = express();
const port = process.env.PORT || 5000;

app.use(cors({
    origin: ['http://localhost:5173'],
    methods: ['GET','POST','PUT','DELETE'],
    credentials: true
}));

app.use(express.json());

app.listen(port)