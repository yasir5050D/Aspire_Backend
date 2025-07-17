const Update = require('../models/Update');

// Create new update (admin)
exports.createUpdate = async (req, res) => {
    try {
        const update = new Update(req.body);
        await update.save();
        res.status(201).json({ status: 201, message: 'Update created successfully', update });
    } catch (error) {
        res.status(500).json({ status: 500, message: 'Server Error' });
    }
};

// Get all updates
exports.getUpdates = async (req, res) => {
    try {
        let { page = 1, pageSize = 10, search = '' } = req.query;

        // Convert to numbers
        page = parseInt(page);
        const limit = parseInt(pageSize);
        const skip = (page - 1) * limit;

        search = search.replace(/['"]+/g, '').trim();

        const filter = search
            ? { title: { $regex: search, $options: 'i' } } // Case-insensitive search on title
            : {};

        // Fetch posts and count concurrently
        const [posts, totalCount] = await Promise.all([
            Update.find(filter).sort({ createdAt: -1 }).skip(skip).limit(limit),
            Update.countDocuments(filter)
        ]);

        res.status(200).json({
            status: 200,
            message: "Updates fetched successfully.",
            data: { posts, totalCount }
        });

    } catch (error) {
        res.status(500).json({ status: 500, message: 'Server Error' });
    }
};


// Update an update (admin)
exports.updateUpdate = async (req, res) => {
    try {
        const update = await Update.findByIdAndUpdate(req.params.id, req.body, { new: true });
        res.status(200).json({ status: 200, message: 'Update modified successfully', update });
    } catch (error) {
        res.status(500).json({ status: 500, message: 'Server Error' });
    }
};

// Delete an update (admin)
exports.deleteUpdate = async (req, res) => {
    try {
        await Update.findByIdAndDelete(req.params.id);
        res.status(200).json({ status: 200, message: 'Update deleted successfully' });
    } catch (error) {
        res.status(500).json({ status: 500, message: 'Server Error' });
    }
};
