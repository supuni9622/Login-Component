require('dotenv').config();
const express = require("express");
const app = express();
const bodyParser = require("body-parser");
const { createPool } = require("mysql");

app.use(bodyParser.json());
const PORT = process.env.PORT || 5000;

// MySQL Database POOL connection
const pool = createPool({
    host: process.env.HOST,
    user: process.env.MYSQL_USER,
    password: process.env.MYSQL_PASSWORD,
    database: process.env.MYSQL_DB,
    connectionLimit: 10
    });

app.get("/", (req, res)=>{
    console.log("Root route get request");
    pool.query("SELECT * FROM users", (err, result, field)=>{
        if(err){
            console.log(err);
        }
        else{
            res.send(result);
        }
    });
});

app.listen(PORT, (req, res)=>{
    console.log(`Server is listening on Port ${PORT}`);
});