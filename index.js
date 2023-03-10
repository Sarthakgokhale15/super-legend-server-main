const express=require("express");
const {google}=require("googleapis");
var cors = require('cors');
const { query } = require("express");



const router=require("./user");
const app =express();
app.use(express.json());
var PORT = process.env.PORT || 3003;
app.use(router);
app.use(express.urlencoded({ extended: true }));

const corsOptions = {
    // origin: "http://localhost:3000",

    // allow from anywhere
    origin: "*",
  };
app.use(cors(corsOptions));
require('dotenv').config();

app.get("/",async (req,res)=>{
    res.send("API Working");
});

app.listen(PORT,(req,res)=>console.log(`running on port ${PORT}`))