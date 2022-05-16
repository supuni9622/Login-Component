require('dotenv').config();
const express = require("express");
const app = express();
const bodyParser = require("body-parser");
const { createPool } = require("mysql");
const bcrypt = require("bcryptjs");

// app.use(express.json());
// app.use(bodyParser.urlencoded({
// extended: true
// }));

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

app.post("/register", (req, res)=> {
    const salt = bcrypt.genSaltSync(10);
    const hashedPassword = bcrypt.hashSync(req.body.password, salt);

    pool.query("INSERT INTO users(UserName, Password) values('"+req.body.userName+"', '"+hashedPassword+"')", (err, result, field)=>{
        if(err){
            console.log(err);
        }else{
            console.log("User successfully registered");
            res.send("User successfully registered");
        }
    }); 
});

app.post("/login", (req, res)=> {

    pool.query("SELECT * FROM users WHERE UserName = '"+req.body.userName+"'", (err, result, field)=>{
        if(err){
            console.log(err);
        }else{
            if(result.length > 0){
                if(bcrypt.compareSync(req.body.password, result[0].Password)){
                    res.send("User authenticated");
                }else{
                    res.send("Incorrect credentials!");
                }
            }else{
                res.send("User can't find");
            }
           
        }
       
    }); 
});

app.listen(PORT, (req, res)=>{
    console.log(`Server is listening on Port ${PORT}`);
});