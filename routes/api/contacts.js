const express = require('express')

const {validateBody} = require('../../middlewares');
const {validateRequestBody} = require('../../helpers')

const {shemas} = require('../../models/contact')
const router = express.Router()

const ctrl = require("../../controllers/contacts");

router.get('/', ctrl.getAll)

// router.get('/:contactId', ctrl.getById)

router.post('/', validateBody(shemas.addShema), ctrl.add)

// router.delete('/:contactId', ctrl.deleteById)

// router.put('/:contactId', validateRequestBody, validateBody(schema.addShema), ctrl.updateById)

module.exports = router
