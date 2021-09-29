const express = require("express")
const cors = require("cors")
const app = express()

app.use(cors({ origin: "https://appointment202.herokuapp.com/" }))
app.use(express.json())
app.use(express.urlencoded({ extended: true }))


require("./routes")(app)

app.listen(3000, () => {
    console.log("Server running on port 3000")
})