const pool = require("../models/db");
const bcrypt = require("bcrypt");
require("dotenv").config();
const { tokenGenerator } = require("../utils/tokenGen");
// const nodemailer = require("nodemailer");

module.exports = {
    async getAllUsers(req, res) {
        try {
            if (req.user.data.role_id === 1) {
                const users = await pool.query("SELECT * FROM users");
                res.json(users.rows);
            } else {
                res.status(401).json({ message: "Unauthorized" });
            }
        } catch (error) {
            return res.status(500).send({ message: "Server error" });
        }
    },
    async register(req, res) {
        try {
            const { email, first_name, last_name, role_id, password } = req.body;
            const user = await pool.query("SELECT * FROM users WHERE email = $1", [
                email,
            ]);
            if (user.rows.length !== 0) {
                return res.status(401).send({ error: "Email already exist" });
            }
            console.log(req.body);
            const saltRound = 10;
            const salt = await bcrypt.genSalt(saltRound);
            const hashedPassword = await bcrypt.hash(password, salt);
            const newUser = await pool.query(
                "INSERT INTO users (first_name,last_name, email,password) VALUES ($1,$2,$3,$4) RETURNING *", [first_name, last_name, email, hashedPassword]
            );
            const newUserRole = await pool.query(
                "INSERT INTO user_role (user_id,role_id) VALUES ($1,$2) RETURNING *", [newUser.rows[0].user_id, 2]
            );

            console.log(newUserRole.rows[0]);
            return res.status(201).send({ data: newUser.rows[0] });
        } catch (error) {
            return res.status(500).send({ message: "Server error" });
        }
    },
    async login(req, res) {
        try {
            const { email, password } = req.body;
            const user = await pool.query(
                "SELECT first_name,last_name, email, password, user_role.role_id, user_role.user_id FROM users INNER JOIN user_role ON users.user_id = user_role.user_id WHERE users.email = $1", [email]
            );

            /* check for user */
            if (!user.rows[0]) {
                return res
                    .status(401)
                    .send({ error: "Email or password is incorrect" });
            }
            const validPassword = await bcrypt.compare(
                password,
                user.rows[0].password
            );
            if (!validPassword) {
                return res.status(401).send({ error: "Incorrect Email or Password" });
            }
            /*  give the token */
            const token = tokenGenerator(user.rows[0]);
            return res.status(200).json({ data: user.rows[0], token });
        } catch (error) {
            res.status(500).send({ error: "Server Error" });
        }
    },
    async removeUser(req, res) {
        try {
            // delete appointment by id 
            if (req.user.data.role_id === 1) {
                const { id } = req.params;
                const deleteUser = await pool.query("DELETE FROM users WHERE user_id = $1", [id]);
                return res.send({ message: "User deleted" })
            } else {
                res.status(403).json({
                    message: "Forbidden"
                });
            }
        } catch (error) {
            return res.status(500).send({ message: "Server error" })
        }
    },

}