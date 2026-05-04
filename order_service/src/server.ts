import app from "./app.js"
app.listen(process.env.PORT, async () =>{
    console.log('Order Service running at', process.env.PORT);
})
