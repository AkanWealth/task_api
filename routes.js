const usersController = require("./controllers/usersController");
const appiontment = require("./controllers/appointmentsController")
const authorization = require("./middlewares/authorization");

module.exports = (app) => {
    app.get("/users", authorization, usersController.getAllUsers);

    app.post("/login", usersController.login);
    app.post("/register", usersController.register);
    app.delete("/user/:id", authorization, usersController.removeUser);

    app.get("/appointment", authorization, appiontment.getAllAppointment)
    app.post("/appointment", appiontment.createAppointment)
    app.delete("/appointment/:id", authorization, appiontment.deleAppointment)

};