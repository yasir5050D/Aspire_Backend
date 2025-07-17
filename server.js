const express = require('express');
const dotenv = require('dotenv');
const cors = require('cors');
const connectDB = require('./config/db');

dotenv.config();
connectDB();

const app = express();
app.use(cors());
app.use(express.json());

const authRoutes = require('./routes/authRoutes');
const testimonialRoutes = require('./routes/testimonialRoutes');
const visitRoutes = require('./routes/visitRoutes');
app.use("/uploads", express.static("uploads"));
const applicationRoutes = require('./routes/applicationRoutes');
const jobRoutes = require('./routes/jobRoutes');
const updateRoutes = require('./routes/updateRoutes');
const studentRoutes = require('./routes/studentRoutes');
const contactUsRoutes = require('./routes/contactUsRoutes')
app.use('/api', visitRoutes);
app.use('/api', authRoutes);
app.use('/api', testimonialRoutes);
app.use('/api', applicationRoutes);
app.use('/api', jobRoutes);
app.use('/api', updateRoutes);
app.use('/api', studentRoutes);
app.use('/api', contactUsRoutes);
const PORT = process.env.PORT || 5000;

if (process.env.NODE_ENV === 'production') {
    // Hostinger handles HTTPS
    app.listen(PORT, '0.0.0.0', () => {
        console.log(`Production server running on port ${PORT}`);
    });
} else {
    // Local development - HTTP only
    app.listen(PORT, () => {
        console.log(`Development server running on http://localhost:${PORT}`);
    });
}
