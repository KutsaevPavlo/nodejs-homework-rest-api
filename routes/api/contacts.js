const express = require('express')

const {validateBody, isValidId} = require('../../middlewares');
const {validateRequestBody} = require('../../helpers')

const {shemas} = require('../../models/contact')
const router = express.Router()

const ctrl = require("../../controllers/contacts");

router.get('/', ctrl.getAll)

router.get('/:contactId', isValidId, ctrl.getById)

router.post('/', validateBody(shemas.addShema), ctrl.add)

// router.delete('/:contactId', isValidId,ctrl.deleteById)

// router.put('/:contactId', isValidId, validateRequestBody, validateBody(schema.addShema), ctrl.updateById)

module.exports = router
