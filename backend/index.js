import dotenv from "dotenv"
import ConnectDb from "./src/db/db.js";
import app from "./src/app.js";
dotenv.config()



 
ConnectDb()
.then(() =>{
    app.listen(process.env.PORT || 400, () =>{
        console.log(`server is runnning at port: ${process.env.PORT}`)
    })
})
.catch((err) =>{
    console.log(`MONGO DB CONNECTION FAILED`, err)
})

 