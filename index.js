import express from "express"
import serverconfig from "./config/serverconfig.js"
import monitorrouter from "./router/monitorrouter.js"

const app = express();

app.use(express.static("public"));


// view engine

app.set("view engine" , "ejs");

const PORT = serverconfig.PORT || 5000;

// routes 
app.use("/" ,monitorrouter );

app.listen(PORT , ()=>{
    console.info(`server is running on port ${PORT}`)
})

