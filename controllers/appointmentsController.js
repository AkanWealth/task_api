const pool = require("../models/db");
require("dotenv").config();
const { tokenGenerator } = require("../utils/tokenGen");
// const nodemailer = require("nodemailer");

module.exports = {
    async getAllAppointment(req, res) {
        try {
            if (req.user.data.role_id === 1) {
                const page = parseInt(req.query.page || 1);
                const limit = parseInt(req.query.limit || 10);
                const offset = (page - 1) * limit;
                const query = `SELECT * FROM appointment LIMIT ${limit} OFFSET ${offset}`;
                const appointment = await pool.query(query);

                const total = await pool.query("SELECT COUNT(*)::integer FROM appointment");
                const next = page < Math.ceil(total.rows[0].count / limit) ? `/appointment?page=${page + 1}&limit=${limit}` : null;
                const previous = page > 1 ? `/appointment?page=${page - 1}&limit=${limit}` : null;
                const meta = {
                    total: total.rows[0].count,
                    limit: limit,
                    page: page,
                    next: next,
                    previous: previous,
                    data: appointment.rows
                };
                res.status(200).json({
                    meta,
                });
            } else {
                res.status(403).json({
                    message: "Forbidden"
                });
            }
        } catch (error) {
            console.log(error.message);
            return res.status(500).send({ message: "Server error" });
        }
    },

    async createAppointment(req, res) {
        try {
            const { fname, email, mobile, book_appoint } = req.body;
            const newAppoint = await pool.query("INSERT INTO appointment (fname, email, mobile, book_appoint) VALUES ($1,$2,$3,$4) RETURNING *", [fname, email, mobile, book_appoint])
            const token = tokenGenerator(newAppoint.rows[0]);
            // const transporter = nodemailer.createTransport({
            //     service: "gmail",
            //     auth: {
            //         user: process.env.EMAIL,
            //         pass: process.env.PASSWORD
            //     }
            // });
            // const mailOptions = {
            //     from: process.env.EMAIL,
            //     to: email,
            //     subject: "Appointment Confirmation",
            //     text: `Hello ${fname},\n\nThank you for booking an appointment with us.\n\nPlease click on the following link, or paste this into your browser to complete the process:\n\nhttp://localhost:3000/appointment/confirmation/${token}\n\nIf you did not request this, please ignore this email and your password will remain unchanged.\n\nThank you,\n\nThe Team`
            // };
            // transporter.sendMail(mailOptions, function (err, info) {
            //     if (err) {
            //         console.log(err);
            //     } else {
            //         console.log(info);
            //     }
            // });
            res.status(201).json({
                message: "Appointment created",
                data: newAppoint.rows[0],
                token
            });
            // return res.send(newAppoint.rows[0])
        } catch (error) {
            console.log(error.message)
            return res.status(500).send({ message: "Server error" })
        }
    },
    async deleAppointment(req, res) {
        try {
            // delete appointment by id 
            if (req.user.data.role_id === 1) {
                const { id } = req.params;
                const deleteAppoint = await pool.query("DELETE FROM appointment WHERE id = $1", [id]);
                return res.send({ message: "Appointment deleted" })
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