const express = require('express');
const { createContact,getAllContacts,deleteContact,toggleReadStatus } = require('../controllers/Contact.controller');
const { SearchByAnyThing } = require('../utils/Searching');
const { updateImage } = require('../controllers/ListingControllers');
const router = express.Router();
const multer = require('multer');
const storage = multer.memoryStorage();
const upload = multer({ storage });

router.post('/Contact',createContact)
router.get('/get-contacts', getAllContacts)
router.delete('/delete-contacts/:id', deleteContact);
router.patch('/contacts/:id/toggle-read', toggleReadStatus);


router.get('/search_min', SearchByAnyThing);

router.post('/update_img',upload.single('image'), updateImage);






module.exports = router;