const Visit = require('../models/Visit');

// Create a new visit entry
exports.createVisit = async (req, res) => {
    try {
        const { firstName, lastName } = req.body;
        const visit = await Visit.findOne({ firstName, lastName });
        if (visit) {
            res.status(401).json({ status: 401, message: "Your visit already exists" })
        }
        const visitData = new Visit(req.body);
        await visitData.save();
        res.status(201).json({ status: 201, message: 'Visit recorded successfully', data: visitData });
    } catch (error) {
        res.status(400).json({ status: 500, message: "Server Error" });
    }
};

// Get all visits
exports.getVisits = async (req, res) => {
    try {
        const page = parseInt(req.query.page) || 1;  
        const pageSize = parseInt(req.query.pageSize) || 10; 
        const skip = (page - 1) * pageSize;

        const [visits, totalVisits] = await Promise.all([
            Visit.find().sort({ createdAt: -1 }).skip(skip).limit(pageSize),
            Visit.countDocuments()
        ]);
        res.status(200).json({
            status: 200,
            message: "Campus visits fetched successfully",
            data: { visits, totalVisits: totalVisits },
        });
    } catch (error) {
        res.status(500).json({ status: 500, message: "Server Error" });
    }
};

// Get a single visit by ID
exports.getVisitById = async (req, res) => {
    try {
        const visit = await Visit.findById(req.params.id);
        if (!visit) return res.status(404).json({ message: 'Visit not found' });
        res.status(200).json(visit);
    } catch (error) {
        res.status(500).json({ message: error.message });
    }
};
