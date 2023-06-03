const {Contact} = require('../models/contact');

// const contacts = require('../models/contacts');
const {HttpError, ctrlWrapper} = require('../helpers');



  const getAll = async (req, res) => {
    const result = await Contact.find();
    res.json(result)
     }

const getById = async (req, res) => {
    
      const {contactId} = req.params;
      const result = await Contact.findOne({_id:contactId})
      if (!result) {
        throw HttpError(404, "Not found");
      }
      res.json(result)
    
    
  }

  const add = async (req, res) => {
      const result = await Contact.create(req.body);
      res.status(201).json(result);
    
  }

// const deleteById = async (req, res) => {
    
//       const {contactId} = req.params;
//       const result = await contacts.removeContact(contactId);
//       if (!result) {
//         throw HttpError(404, "Not found");
//       }
//       res.status(200).json({
//         message : "contact deleted"
//       })
    
//   }

//   const updateById = async (req, res) => {
            
//       const {contactId} = req.params;
//       const result = await contacts.updateContact(contactId, req.body);
//       if (!result) {
//         throw HttpError(404, "Not found");
//       }
//       res.json(result);
    
//   }

  module.exports ={
    getAll: ctrlWrapper(getAll),
    getById: ctrlWrapper(getById),
    add: ctrlWrapper(add),
    // deleteById: ctrlWrapper(deleteById),
    // updateById: ctrlWrapper(updateById),
  }