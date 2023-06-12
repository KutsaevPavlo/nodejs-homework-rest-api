const express = require('express')

const {validateBody, isValidId, authenticate} = require('../../middlewares');
const {validateRequestBody, validateRequestBodyPatch} = require('../../helpers')

const {shemas} = require('../../models/contact')
const router = express.Router()

const ctrl = require("../../controllers/contacts");

router.use(authenticate);

router.get('/', ctrl.getAll)

router.get('/:contactId', isValidId, ctrl.getById)

router.post('/', validateBody(shemas.addShema), ctrl.add)

router.delete('/:contactId', isValidId,ctrl.deleteById)

router.put('/:contactId', isValidId, validateRequestBody, validateBody(shemas.addShema), ctrl.updateById)

router.patch('/:contactId/favorite', isValidId, validateRequestBodyPatch, validateBody(shemas.updateFavoriteShema), ctrl.updateStatusContact )


module.exports = router
