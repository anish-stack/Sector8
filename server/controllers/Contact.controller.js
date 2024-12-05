
const Contact = require('../models/ContactModel');

exports.createContact = async (req, res) => {
    try {
        const { Name, Email, PhoneNumber, Subject, Message } = req.body;

        // Validation
        if (!Name || typeof Name !== 'string' || Name.trim().length < 2) {
            return res.status(400).json({ error: 'Invalid or missing Name. It must be at least 2 characters long.' });
        }

        const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
        if (!Email || !emailRegex.test(Email)) {
            return res.status(400).json({ error: 'Invalid or missing Email.' });
        }

        const phoneRegex = /^[0-9]{10}$/; // Assuming a 10-digit phone number format
        if (!PhoneNumber || !phoneRegex.test(PhoneNumber)) {
            return res.status(400).json({ error: 'Invalid or missing Phone Number. It must be a valid 10-digit number.' });
        }

        if (!Subject || typeof Subject !== 'string' || Subject.trim().length < 3) {
            return res.status(400).json({ error: 'Invalid or missing Subject. It must be at least 3 characters long.' });
        }

        if (!Message || typeof Message !== 'string' || Message.trim().length < 10) {
            return res.status(400).json({ error: 'Invalid or missing Message. It must be at least 10 characters long.' });
        }

        // Save the contact
        const newContact = new Contact({
            Name: Name.trim(),
            Email: Email.trim(),
            PhoneNumber: PhoneNumber.trim(),
            Subject: Subject.trim(),
            Message: Message.trim(),
        });

        const savedContact = await newContact.save();
        res.status(201).json(savedContact);
    } catch (error) {
        console.error('Error saving contact:', error);
        res.status(500).json({ error: 'An error occurred while creating the contact. Please try again later.' });
    }
};

exports.getAllContacts = async (req, res) => {
    try {
        const contacts = await Contact.find().sort({createdAt: -1}); 
        res.status(200).json(contacts);
    } catch (error) {
        console.error('Error fetching contacts:', error);
        res.status(500).json({ error: 'An error occurred while fetching contacts.' });
    }
};


exports.deleteContact = async (req, res) => {
    try {
        const { id } = req.params; 
        const deletedContact = await Contact.findByIdAndDelete(id);

        if (!deletedContact) {
            return res.status(404).json({ error: 'Contact not found.' });
        }

        res.status(200).json({ message: 'Contact deleted successfully.' });
    } catch (error) {
        console.error('Error deleting contact:', error);
        res.status(500).json({ error: 'An error occurred while deleting the contact.' });
    }
};

exports.toggleReadStatus = async (req, res) => {
    try {
        const { id } = req.params;

       
        const contact = await Contact.findById(id);

        if (!contact) {
            return res.status(404).json({ error: 'Contact not found.' });
        }

        contact.readIt = !contact.readIt; 
        const updatedContact = await contact.save();

        res.status(200).json({
            message: `Contact read status updated to ${updatedContact.isRead}`,
            contact: updatedContact,
        });
    } catch (error) {
        console.error('Error toggling read status:', error);
        res.status(500).json({ error: 'An error occurred while updating the read status.' });
    }
};
