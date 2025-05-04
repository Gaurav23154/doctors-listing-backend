const express = require('express');
const router = express.Router();
const doctorController = require('../controllers/doctorController');

// GET - List all doctors with filters and pagination
router.get('/', doctorController.listDoctors);

// POST - Add a new doctor
router.post('/', doctorController.addDoctor);

module.exports = router;