const Query = require('../models/Query.model.js');

// Submit a contact query
const submitQuery = async (req, res) => {
  try {
    const { fullName, email, subject, message } = req.body;

    // Validation
    if (!fullName || !email || !subject || !message) {
      return res.status(400).json({
        message: 'Please provide all required fields',
      });
    }

    // Get user ID if authenticated, otherwise null
    const userId = req.user ? req.user._id : null;

    // Create query
    const query = await Query.create({
      fullName,
      email,
      subject,
      message,
      user: userId,
    });

    res.status(201).json({
      message: 'Query submitted successfully',
      query,
    });
  } catch (error) {
    res.status(500).json({
      message: error.message || 'Error submitting query',
    });
  }
};

// Get all queries (admin)
const getAllQueries = async (req, res) => {
  try {
    const queries = await Query.find().populate('user', 'fullName email');
    res.status(200).json(queries);
  } catch (error) {
    res.status(500).json({
      message: error.message || 'Error fetching queries',
    });
  }
};

module.exports = {
  submitQuery,
  getAllQueries,
};
