const express = require("express");
const app = express();
const bodyParser = require("body-parser");
const { createPool } = require("mysql");

app.use(bodyParser.json());

// MySQL Database POOL connection
const pool = createPool({
    host: "localhost",
    user: "root",
    password: "",
    database: "loginservicedb",
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

app.listen(5000, (req, res)=>{
    console.log("Server is listening on Port 5000");
});