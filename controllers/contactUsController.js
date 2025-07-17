const ContactUs = require('../models/ContactUs');

// Create a new contact us entry
exports.createContactUs = async (req, res) => {
    try {
        const { contactName, contactEmail } = req.body;
        const contact = await ContactUs.findOne({
            $or: [{ contactName }, { contactEmail }]
        });

        if (contact) {
            return res.status(401).json({ status: 401, message: "Your contact us request already exists" })
        }
        const contactData = new ContactUs(req.body);
        await contactData.save();
        return res.status(201).json({ status: 201, message: 'Contact us request created successfully', data: contactData });
    } catch (error) {
        return res.status(400).json({ status: 500, message: "Server Error" });
    }
};

// Get all contact us's
exports.getContactUs = async (req, res) => {
    try {
        const page = parseInt(req.query.page) || 1;
        const pageSize = parseInt(req.query.pageSize) || 10;
        const skip = (page - 1) * pageSize;

        const [contactUs, totalContactUs] = await Promise.all([
            ContactUs.find().sort({ createdAt: -1 }).skip(skip).limit(pageSize),
            ContactUs.countDocuments()
        ]);
        res.status(200).json({
            status: 200,
            message: "Contact us fetched successfully",
            data: { contactUs, totalContactUs: totalContactUs },
        });
    } catch (error) {
        res.status(500).json({ status: 500, message: "Server Error" });
    }
};

