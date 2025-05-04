const express = require('express');
const router = express.Router();
const Pet = require('../Models/petModel');
const multer = require('multer');
const path = require('path');
const fs = require('fs');

// Set up multer for file uploads
const storage = multer.diskStorage({
  destination: function(req, file, cb) {
    const uploadDir = 'uploads/';
    if (!fs.existsSync(uploadDir)) {
      fs.mkdirSync(uploadDir, { recursive: true });
    }
    cb(null, uploadDir);
  },
  filename: function(req, file, cb) {
    cb(null, Date.now() + path.extname(file.originalname));
  }
});

const upload = multer({ 
  storage: storage,
  fileFilter: function(req, file, cb) {
    const filetypes = /jpeg|jpg|png|gif/;
    const mimetype = filetypes.test(file.mimetype);
    const extname = filetypes.test(path.extname(file.originalname).toLowerCase());
    
    if (mimetype && extname) {
      return cb(null, true);
    }
    cb(new Error('Only image files are allowed!'));
  }
});

// GET all pets
router.get('/', async (req, res) => {
  try {
    const pets = await Pet.find().sort({ addedAt: -1 });
    res.status(200).json({ success: true, data: pets });
  } catch (error) {
    res.status(500).json({ success: false, error: error.message });
  }
});

// GET single pet by ID
router.get('/:id', async (req, res) => {
  try {
    const pet = await Pet.findById(req.params.id);
    if (!pet) {
      return res.status(404).json({ success: false, error: 'Pet not found' });
    }
    res.status(200).json({ success: true, data: pet });
  } catch (error) {
    res.status(500).json({ success: false, error: error.message });
  }
});

// POST create new pet
router.post('/', upload.single('image'), async (req, res) => {
  try {
    const { name, species, age, personality, mood } = req.body;
    
    const newPet = new Pet({
      name,
      species,
      age,
      personality,
      mood: mood || 'happy',
      image: req.file ? `/uploads/${req.file.filename}` : null
    });
    
    const savedPet = await newPet.save();
    res.status(201).json({ success: true, data: savedPet });
  } catch (error) {
    res.status(400).json({ success: false, error: error.message });
  }
});

// PUT update pet
router.put('/:id', upload.single('image'), async (req, res) => {
  try {
    const { name, species, age, personality, mood } = req.body;
    
    const petToUpdate = await Pet.findById(req.params.id);
    if (!petToUpdate) {
      return res.status(404).json({ success: false, error: 'Pet not found' });
    }
    
    // Update pet data
    petToUpdate.name = name || petToUpdate.name;
    petToUpdate.species = species || petToUpdate.species;
    petToUpdate.age = age || petToUpdate.age;
    petToUpdate.personality = personality || petToUpdate.personality;
    petToUpdate.mood = mood || petToUpdate.mood;
    
    // Update image if provided
    if (req.file) {
      // If there's an existing image, you may want to delete it
      if (petToUpdate.image) {
        const oldImagePath = path.join(__dirname, '..', petToUpdate.image);
        if (fs.existsSync(oldImagePath)) {
          fs.unlinkSync(oldImagePath);
        }
      }
      petToUpdate.image = `/uploads/${req.file.filename}`;
    }
    
    const updatedPet = await petToUpdate.save();
    res.status(200).json({ success: true, data: updatedPet });
  } catch (error) {
    res.status(400).json({ success: false, error: error.message });
  }
});

// PATCH adopt a pet
router.patch('/:id/adopt', async (req, res) => {
  try {
    const pet = await Pet.findById(req.params.id);
    if (!pet) {
      return res.status(404).json({ success: false, error: 'Pet not found' });
    }
    
    pet.adopted = true;
    const adoptedPet = await pet.save();
    
    res.status(200).json({ success: true, data: adoptedPet });
  } catch (error) {
    res.status(400).json({ success: false, error: error.message });
  }
});

// DELETE a pet
router.delete('/:id', async (req, res) => {
  try {
    const pet = await Pet.findById(req.params.id);
    if (!pet) {
      return res.status(404).json({ success: false, error: 'Pet not found' });
    }
    
    // Delete the image file if it exists
    if (pet.image) {
      const imagePath = path.join(__dirname, '..', pet.image);
      if (fs.existsSync(imagePath)) {
        fs.unlinkSync(imagePath);
      }
    }
    
    await Pet.findByIdAndDelete(req.params.id);
    res.status(200).json({ success: true, data: {} });
  } catch (error) {
    res.status(500).json({ success: false, error: error.message });
  }
});

// GET filter pets by mood
router.get('/filter/:mood', async (req, res) => {
  try {
    const { mood } = req.params;
    const pets = await Pet.find({ mood }).sort({ addedAt: -1 });
    res.status(200).json({ success: true, data: pets });
  } catch (error) {
    res.status(500).json({ success: false, error: error.message });
  }
});

module.exports = router;