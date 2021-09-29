require("dotenv").config();
const Pool = require("pg").Pool;

// const pool = new Pool({
//     user: "postgres",
//     password: process.env.DB_PASSWORD,
//     database: "project",
//     host: "localhost",
//     port: 5432,
// });

// module.exports = pool;
//connect to database using heroku postgres
const pool = new Pool({
    user: process.env.DB_USER,
    password: process.env.DB_PASSWORD,
    database: process.env.DB_NAME,
    host: process.env.DB_HOST,
    port: process.env.DB_PORT,
    ssl: {
        rejectUnauthorized: false,
    },
});

module.exports = pool;