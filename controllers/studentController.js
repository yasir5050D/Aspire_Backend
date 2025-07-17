const Student = require('../models/Student');

// Create new student registration
exports.registerStudent = async (req, res) => {
    try {
        const { firstName, lastName } = req.body.personalDetails;

        // Check if a student exists with either:
        const existingStudent = await Student.findOne({
            $or: [{ "personalDetails.firstName": firstName, "personalDetails.lastName": lastName },]
        });

        if (existingStudent) {
            return res.status(400).json({
                status: 400,
                message: `A student with the same name ${firstName} ${lastName} already exists.`
            });
        }

        const student = new Student(req.body);
        await student.save();

        res.status(201).json({
            status: 201,
            message: 'Student registered successfully'
        });
    } catch (error) {
        res.status(500).json({
            status: 500,
            message: 'Server Error',
        });
    }
};
// Get all students (admin view)
exports.getStudents = async (req, res) => {
    try {
        const page = parseInt(req.query.page) || 1;
        const pageSize = parseInt(req.query.pageSize) || 10;
        const skip = (page - 1) * pageSize;

        // Fetch testimonials and total count in parallel
        const [students, totalStudents] = await Promise.all([
            Student.find().sort({ createdAt: -1 }).skip(skip).limit(pageSize),
            Student.countDocuments()
        ]);

        res.status(200).json({
            status: 200,
            message: "Testimonials fetched successfully.",
            data: { students, totalStudents }
        });
    } catch (error) {
        res.status(500).json({ status: 500, message: 'Server Error' });
    }
};

// Update student data (admin)
exports.updateStudent = async (req, res) => {
    try {
        const student = await Student.findByIdAndUpdate(req.params.id, req.body, { new: true });
        res.status(200).json({ status: 200, message: 'Student data updated successfully', student });
    } catch (error) {
        res.status(500).json({ status: 500, message: 'Server Error' });
    }
};

// Delete student data (admin)
exports.deleteStudent = async (req, res) => {
    try {
        const { id } = req.params;

        // Check if the student exists
        const student = await Student.findById(id);
        if (!student) {
            return res.status(404).json({
                status: 404,
                message: 'Student record not found'
            });
        }

        // Delete student
        await Student.findByIdAndDelete(id);

        res.status(200).json({
            status: 200,
            message: 'Student record deleted successfully'
        });
    } catch (error) {
        res.status(500).json({
            status: 500,
            message: 'Server Error'
        });
    }
};