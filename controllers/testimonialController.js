
const Testimonial = require('../models/Testimonial');

// Create new testimonial
// exports.createTestimonial = async (req, res) => {
//     try {
//         const { content } = req.body;
//         const existingTestimonial = await Testimonial.findOne({ content });
//         if (existingTestimonial) {
//             res.status(400).json({
//                 status: 400,
//                 message: 'A testimonial with the same content already exists.'
//             });
//         }

//         const testimonial = new Testimonial(req.body);
//         await testimonial.save();

//         res.status(201).json({
//             status: 201,
//             message: 'Testimonial created successfully'
//         });
//     } catch (error) {
//         res.status(500).json({
//             status: 500,
//             message: 'Server Error'
//         });
//     }
// };
const path = require("path");

exports.createTestimonial = async (req, res) => {
    try {
        const { content, name, role, rating, isActive } = req.body;

        // Define required fields with their specific messages
        const requiredFields = {
            content: "Content is required.",
            name: "Name is required.",
            role: "Role is required.",
            rating: "Rating is required."
        };

        // Check which fields are missing
        for (const field in requiredFields) {
            if (!req.body[field]) {
                return res.status(400).json({
                    status: 400,
                    message: requiredFields[field]
                });
            }
        }

        // Handle file upload (if an image is provided)
        let imagePath = "";
        if (req.file) {
            imagePath = path.join("uploads", req.file.filename);
        }

        // Check for duplicate content
        const existingTestimonial = await Testimonial.findOne({ content });
        if (existingTestimonial) {
            return res.status(400).json({
                status: 400,
                message: "A testimonial with the same content already exists."
            });
        }

        // Create testimonial
        const testimonial = new Testimonial({
            content,
            name,
            role,
            rating,
            isActive: isActive ?? true,
            image: imagePath // Save image path in DB
        });

        await testimonial.save();

        res.status(201).json({
            status: 201,
            message: "Testimonial created successfully",
            data: testimonial
        });

    } catch (error) {
        res.status(500).json({
            status: 500,
            message: "Server Error"
        });
    }
};

// Get all testimonials with pagination
exports.getTestimonials = async (req, res) => {
    try {
        const page = parseInt(req.query.page) || 1;
        const pageSize = parseInt(req.query.pageSize) || 10;
        const skip = (page - 1) * pageSize;

        const [testimonials, totalTestimonials] = await Promise.all([
            Testimonial.find().sort({ createdAt: -1 }).skip(skip).limit(pageSize),
            Testimonial.countDocuments()
        ]);

        res.status(200).json({
            status: 200,
            message: "Testimonials fetched successfully.",
            data: { testimonials, totalTestimonials }
        });
    } catch (error) {

        res.status(500).json({ status: 500, message: "Server Error" });
    }
};


exports.toggleTestimonialStatus = async (req, res) => {
    try {
        const { id } = req.params;
        const { isActive } = req.body;

        // Validate isActive value
        if (typeof isActive !== "boolean") {
            return res.status(400).json({ status: 400, message: "Invalid status value. Must be true or false." });
        }

        // Find and update the testimonial
        const updatedTestimonial = await Testimonial.findByIdAndUpdate(
            id,
            { isActive },
            { new: true } // Return the updated document
        );

        if (!updatedTestimonial) {
            return res.status(404).json({ status: 404, message: "Testimonial not found." });
        }

        res.status(200).json({
            status: 200,
            message: "Testimonial status updated successfully.",
            data: updatedTestimonial
        });

    } catch (error) {
        res.status(500).json({
            status: 500,
            message: "Server Error"
        });
    }
};

// Get active testimonials
exports.getActiveTestimonials = async (req, res) => {
    try {
        const testimonials = await Testimonial.find({ isActive: true });
        if (!testimonials) {
            res.status(404).json({ status: 404, message: "No testimonials found." });
        }
        res.status(200).json({ status: 200, message: "Testimonials Fetched Successfully.", data: testimonials });
    } catch (error) {
        res.status(500).json({
            status: 500,
            message: 'Server Error'
        });
    }
};

exports.updateTestimonialStatus = async (req, res) => {
    try {
        const { id } = req.params;
        const updateFields = req.body;

        // Ensure at least one valid field is provided
        const allowedFields = ["name", "role", "content", "image", "isActive"];
        const filteredFields = {};

        // Filter out only allowed fields that are provided in the request
        Object.keys(updateFields).forEach(key => {
            if (allowedFields.includes(key) && updateFields[key] !== undefined) {
                filteredFields[key] = updateFields[key];
            }
        });

        // If no valid fields were provided, return an error
        if (Object.keys(filteredFields).length === 0) {
            return res.status(400).json({status:400, message: "No valid fields provided for update." });
        }

        // Find and update the testimonial
        const updatedTestimonial = await Testimonial.findByIdAndUpdate(
            id,
            filteredFields, // Update only provided fields
            { new: true, runValidators: true } // Return updated document & validate
        );

        if (!updatedTestimonial) {
            return res.status(404).json({status:404, message: "Testimonial not found." });
        }

        res.status(200).json({
            status:200,
            message: "Testimonial updated successfully.",
            data: updatedTestimonial
        });

    } catch (error) {
        res.status(500).json({
            status:500,
            message: "Server Error"
        });
    }
};
