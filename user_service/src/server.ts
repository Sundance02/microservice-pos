import app from "./app.js";

app.listen(process.env.PORT, async ()  =>{
    console.log('User service running at', process.env.PORT)
})