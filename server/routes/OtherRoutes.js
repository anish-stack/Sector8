const express = require('express');
const { createContact, getAllContacts, deleteContact, toggleReadStatus } = require('../controllers/Contact.controller');
const { SearchByAnyThing } = require('../utils/Searching');
const { updateImage } = require('../controllers/ListingControllers');
const router = express.Router();
const multer = require('multer');
const { createFreePage, getAllFreePages, updateFreePage, deleteFreePage } = require('../controllers/Free_Space_page');
const { addBussinessHours } = require('../controllers/Listinguser.controller');
const { protect } = require('../middlewares/Protect');
const storage = multer.memoryStorage();
const upload = multer({ storage });

router.post('/Contact', createContact)
router.get('/get-contacts', getAllContacts)
router.delete('/delete-contacts/:id', deleteContact);
router.patch('/contacts/:id/toggle-read', toggleReadStatus);


router.get('/search_min', SearchByAnyThing);

router.post('/update_img', upload.single('image'), updateImage);



router.post('/create-page', createFreePage);
router.get('/get-free-page', getAllFreePages);
router.put('/update_page/:id', updateFreePage);
router.delete('/delete_page:/id', deleteFreePage);
router.post('/add-bussiness-hours', protect, addBussinessHours);


module.exports = router;