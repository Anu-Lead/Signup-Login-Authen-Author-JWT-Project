const express = require("express");
const auth = require("./routes/auth")
const post = require("./routes/post")


const app = express();

app.use(express.json())

app.use("/auth", auth);
app.use("/post", post);

app.get("/", (req, res) => {
    res.send("Currently working on JWT Authentication")
})

app.listen(8050, () => {
    console.log("Your Server is Running on Port 8050!")
})