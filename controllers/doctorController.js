const Doctor = require('../models/Doctor');

// Add a new doctor
exports.addDoctor = async (req, res) => {
  try {
    const newDoctor = new Doctor(req.body);
    const savedDoctor = await newDoctor.save();
    res.status(201).json({
      success: true,
      message: 'Doctor added successfully',
      doctor: savedDoctor
    });
  } catch (error) {
    console.error('Error adding doctor:', error);
    res.status(400).json({
      success: false,
      message: 'Failed to add doctor',
      error: error.message
    });
  }
};

// List doctors with filtering and pagination
exports.listDoctors = async (req, res) => {
  try {
    const page = parseInt(req.query.page) || 1;
    const limit = parseInt(req.query.limit) || 9;
    const skip = (page - 1) * limit;
    
    // Build filter object based on query parameters
    const filter = {};
    
    if (req.query.specialty) {
      filter.specialty = req.query.specialty;
    }
    
    if (req.query.location) {
      filter.location = req.query.location;
    }
    
    if (req.query.gender) {
      filter.gender = req.query.gender;
    }
    
    // Experience filter
    if (req.query.experience) {
      const expRange = req.query.experience.split('-');
      if (expRange.length === 2) {
        if (expRange[1] === '+') {
          filter.experience = { $gte: parseInt(expRange[0]) };
        } else {
          filter.experience = { 
            $gte: parseInt(expRange[0]), 
            $lte: parseInt(expRange[1]) 
          };
        }
      }
    }
    
    // Rating filter
    if (req.query.rating) {
      const minRating = parseInt(req.query.rating.replace('+', ''));
      filter.rating = { $gte: minRating };
    }
    
    // Count total documents for pagination
    const totalDocs = await Doctor.countDocuments(filter);
    const totalPages = Math.ceil(totalDocs / limit);
    
    // Fetch doctors with pagination and filters
    const doctors = await Doctor.find(filter)
      .sort({ rating: -1 })
      .skip(skip)
      .limit(limit);
    
    res.status(200).json({
      success: true,
      count: doctors.length,
      totalDocs,
      totalPages,
      currentPage: page,
      doctors
    });
  } catch (error) {
    console.error('Error listing doctors:', error);
    res.status(500).json({
      success: false,
      message: 'Failed to list doctors',
      error: error.message
    });
  }
};