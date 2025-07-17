const Application = require('../models/Application');
const path = require('path');
const fs = require('fs');
// Create new job application
exports.createApplication = async (req, res) => {
    try {
        const { jobId, firstName, lastName, phone, email, coverLetter } = req.body;
        const resume = req.file ? req.file.filename : null;

        if (!firstName || !lastName || !phone || !email) {
            return res.status(400).json({ error: "All required fields must be filled" });
        }

        const application = new Application({ jobId, firstName, lastName, phone, email, coverLetter, resume });
        await application.save();

        res.status(201).json({ message: "Job application submitted successfully", data: application, status: 201 });
    } catch (error) {
        res.status(500).json({ status: 500, message: "Server Error" });
    }
};

// Get all job applications

exports.getApplications = async (req, res) => {
    try {
        let { page = 1, limit = 10, search = '' } = req.query;

        // Convert page & limit to numbers
        page = parseInt(page);
        limit = parseInt(limit);

        // Clean search query (removing quotes if passed like `"John Doe"`)
        search = search.replace(/['"]+/g, '').trim();

        const matchStage = search
            ? {
                $or: [
                    { firstName: { $regex: search, $options: 'i' } },
                    { lastName: { $regex: search, $options: 'i' } },
                    { email: { $regex: search, $options: 'i' } }
                ]
            }
            : {};

        const applications = await Application.aggregate([
            { $match: matchStage }, // Filter by search if provided
            {
                $lookup: {
                    from: 'jobs', // Collection name (should match the actual MongoDB collection for Job)
                    localField: 'jobId',
                    foreignField: '_id',
                    as: 'job'
                }
            },
            { $unwind: { path: '$job', preserveNullAndEmptyArrays: true } }, // Optional if job might be missing
            { $sort: { createdAt: -1 } }, // Default sorting by createdAt descending
            { $skip: (page - 1) * limit },
            { $limit: limit }
        ]);

        const totalApplications = await Application.countDocuments(matchStage);

        res.status(200).json({
            status: 200,
            message: "Applications fetched successfully.",
            data: { applications, totalApplications }
        });

    } catch (error) {
        res.status(500).json({status:500, message: 'Server Error' });
    }
};

// Delete application (by admin)
exports.deleteApplication = async (req, res) => {
    try {
        await Application.findByIdAndDelete(req.params.id);
        res.status(200).json({ message: 'Application deleted successfully' });
    } catch (error) {
        res.status(500).json({ message: 'Error deleting application', error });
    }
};

//Download resume (by admin)
exports.downloadResume = (req, res) => {
    const fileName = req.params.fileName;
    const filePath = path.join(__dirname, '../uploads/', fileName);

    // Check if file exists
    if (!fs.existsSync(filePath)) {
        return res.status(404).json({ error: 'File not found' });
    }

    // Send file for download
    res.download(filePath);
};

//Application status update 

exports.updateApplicationStatus = async (req, res) => {
    try {
        const { id } = req.params;
        const { status } = req.body;

        // Validate request body
        if (!status) {
            return res.status(400).json({ message: 'Status is required' });
        }

        // Check if application exists
        const application = await Application.findById(id);
        if (!application) {
            return res.status(404).json({ message: 'Application not found' });
        }

        // Update status
        application.status = status;
        await application.save();

        return res.status(200).json({
            status:200,
            message: 'Application status updated successfully',
            application,
        });
    } catch (error) {
        return res.status(500).json({
            status:500,
            message: 'Server Error',
        });
    }
};