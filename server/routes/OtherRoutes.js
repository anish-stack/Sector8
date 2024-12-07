const express = require('express');
const { createContact,getAllContacts,deleteContact,toggleReadStatus } = require('../controllers/Contact.controller');
const { SearchByAnyThing } = require('../utils/Searching');
const router = express.Router();


router.post('/Contact',createContact)
router.get('/get-contacts', getAllContacts)
router.delete('/delete-contacts/:id', deleteContact);
router.patch('/contacts/:id/toggle-read', toggleReadStatus);


router.get('/search_min', SearchByAnyThing);





module.exports = router;