const express = require('express')
const authController = require('../../controllers/auth-controller')

const shemas = require("../../schemas/users");
const {validateBody, authenticate} = require('../../middlewares');

const router = express.Router()

router.post("/singup", validateBody(shemas.userRegisterShema), authController.singup);

router.post("/singin", validateBody(shemas.userLoginShema), authController.singin);

router.get("/current", authenticate, authController.getCurrent);

router.post("/logout", authenticate, authController.logout);

module.exports = router