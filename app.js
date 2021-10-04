const express = require("express")
const cors = require("cors")
const serveStatic = require("serve-static")
const path = require('path');

const app = express()
app.use(serveStatic(path.join(__dirname, 'dist')));

app.use(cors())
app.use(express.json())
app.use(express.urlencoded({ extended: true }))


corsOptions = {
    origin: "https://appointment202.herokuapp.com/",
    optionsSuccessStatus: 200
}
app.use(function(req, res, next) {
    // Website you wish to allow to connect (CORS) 
    res.setHeader('Access-Control-Allow-Origin', 'https://appointment202.herokuapp.com/');
    // Request methods you wish to allow
    res.setHeader('Access-Control-Allow-Methods', 'GET, POST, OPTIONS, PUT, PATCH, DELETE');
    // Request headers you wish to allow
    res.setHeader('Access-Control-Allow-Headers', 'X-Requested-With,content-type');
    // Set to true if you need the website to include cookies in the requests sent
    // to the API (e.g. in case you use sessions)
    res.setHeader('Access-Control-Allow-Credentials', true);
    // Pass to next layer of middleware
    next();
});

require("./routes")(app)

const PORT = process.env.PORT || 5000;

app.listen(3000, () => {
    console.log(`Server running on port ${PORT}`)
})