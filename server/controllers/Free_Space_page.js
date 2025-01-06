const Free_Page = require('../models/Free_Page_Model');


exports.createFreePage = async (req, res) => {
    try {
        const freePage = new Free_Page(req.body);
        await freePage.save();
        res.status(201).send(freePage);
    } catch (error) {
        res.status(400).send({ message: 'Error creating free page.', error });
    }
};


exports.getAllFreePages = async (req, res) => {
    try {
        const freePages = await Free_Page.find();
        // console.log("object",freePages)
        res.status(200).send(freePages);
    } catch (error) {
        res.status(500).send({ message: 'Error retrieving free pages.', error });
    }
};


exports.updateFreePage = async (req, res) => {
    try {
        const freePage = await Free_Page.findByIdAndUpdate(
            req.params.id,
            req.body,
            { new: true, runValidators: true }
        );

        if (!freePage) {
            return res.status(404).send({ message: 'Free page not found.' });
        }

        res.status(200).send(freePage);
    } catch (error) {
        res.status(400).send({ message: 'Error updating free page.', error });
    }
};


exports.deleteFreePage = async (req, res) => {
    try {
        const freePage = await Free_Page.findByIdAndDelete(req.params.id);

        if (!freePage) {
            return res.status(404).send({ message: 'Free page not found.' });
        }

        res.status(200).send({ message: 'Free page deleted successfully.', freePage });
    } catch (error) {
        res.status(500).send({ message: 'Error deleting free page.', error });
    }
};
