const express = require('express')
const authController = require('../../controllers/auth-controller')

const shemas = require("../../schemas/users");
const {validateBody} = require('../../middlewares');

const router = express.Router()

router.post("/singup", validateBody(shemas.userRegisterShema), authController.singup)

router.post("/singin", validateBody(shemas.userLoginShema), authController.singin)

module.exports = router