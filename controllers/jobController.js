const Job = require('../models/Job');

// Create new job posting (admin)
exports.createJob = async (req, res) => {
    try {
        const { title, department } = req.body;

        // Check if a job with the same title and department already exists
        const existingJob = await Job.findOne({ title, department });

        if (existingJob) {
            return res.status(409).json({
                message: 'Job with the same title and department already exists',
                job: existingJob
            });
        }

        const job = new Job(req.body);
        await job.save();

        res.status(201).json({
            status: 201,
            message: 'Job created successfully',
            job
        });

    } catch (error) {

        res.status(500).json({
            status: 500,
            message: 'Server Error'
        });
    }
};

// Get all jobs
// exports.getJobs = async (req, res) => {
//     try {
//         let { page = 1, pageSize = 10, search = '' } = req.query;

//         // Convert page and limit to numbers
//         const pageNumber = parseInt(page, 10);
//         const limit = parseInt(pageSize, 10);
//         const skip = (pageNumber - 1) * limit;
//         // Default sort (latest jobs first)
//         const sortObj = { createdAt: -1 };

//         // Search logic: search on title, department, description
//         const searchQuery = search
//             ? {
//                 $or: [
//                     { title: { $regex: search, $options: 'i' } },
//                     { department: { $regex: search, $options: 'i' } },
//                     { description: { $regex: search, $options: 'i' } }
//                 ]
//             }
//             : {};

//         // Fetch jobs with pagination, search, and sorting applied
//         const jobs = await Job.find(searchQuery)
//             .sort(sortObj)
//             .skip(skip)
//             .limit(pageSize);

//         // Total jobs count for pagination
//         const totalJobs = await Job.countDocuments(searchQuery);

//         res.status(200).json({
//             message: "Jobs fetched successfully",
//             data: { jobs, totalJobs: totalJobs },
//         });

//     } catch (error) {
//         res.status(500).json({
//             message: 'Error fetching jobs'
//         });
//     }
// };
exports.getJobs = async (req, res) => {
    try {
        // Extract query parameters with default values
        let { page = 1, pageSize = 10, search = '' } = req.query;

        const pageNumber = parseInt(page); // Convert page to a number
        const limit = parseInt(pageSize); // Convert pageSize to a number
        const skip = (pageNumber - 1) * limit;

        // Default sort (latest jobs first)
        const sortObj = { createdAt: -1 };

        // Build the search query if a search term is provided
        const searchQuery = search
            ? {
                $or: [
                    { title: { $regex: search, $options: 'i' } },
                    { department: { $regex: search, $options: 'i' } },
                    { description: { $regex: search, $options: 'i' } }
                ]
            }
            : {};

        // Fetch jobs with pagination, search, and sorting applied
        const [jobs, totalJobs] = await Promise.all([
            Job.find(searchQuery)
                .sort(sortObj)
                .skip(skip)
                .limit(limit),
            Job.countDocuments(searchQuery) // Get total count of matching jobs
        ]);

        // Respond with the fetched data
        res.status(200).json({
            status: 200,
            message: "Jobs fetched successfully",
            data: { jobs, totalJobs: totalJobs },
        });

    } catch (error) {

        res.status(500).json({
            status: 500,
            message: 'Server Error'
        });
    }
};
// Update job posting (admin)
exports.updateJob = async (req, res) => {
    try {
        const { id } = req.params;
        const { status } = req.body;

        if (!status) return res.status(400).json({ status: 400, message: 'Status is required' });

        const job = await Job.findByIdAndUpdate(id, { status }, { new: true });

        if (!job) return res.status(404).json({ status: 404, message: 'Job not found' });

        res.status(200).json({ status: 200, message: 'Job status updated successfully', job });
    } catch (error) {

        res.status(500).json({ status: 500, message: 'Server Error' });
    }
};


// Delete job posting (admin)
exports.deleteJob = async (req, res) => {
    try {
        await Job.findByIdAndDelete(req.params.id);
        res.status(200).json({ status: 200, message: 'Job deleted successfully' });
    } catch (error) {
        res.status(500).json({ status: 500, message: 'Server Error' });
    }
};
