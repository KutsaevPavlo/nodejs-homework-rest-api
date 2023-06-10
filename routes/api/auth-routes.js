const express = require('express')
const authController = require('../../controllers/auth-controller')

const shemas = require("../../schemas/users");
const {validateBody, authenticate} = require('../../middlewares');

const router = express.Router()

router.post("/register", validateBody(shemas.userRegisterShema), authController.singup);

router.post("/login", validateBody(shemas.userLoginShema), authController.singin);

router.get("/current", authenticate, authController.getCurrent);

router.post("/logout", authenticate, authController.logout);

router.patch("/users", authenticate, authController.subscription);


module.exports = router