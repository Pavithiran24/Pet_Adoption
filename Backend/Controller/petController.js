const petService = require('../services/petService');

const petController = {
  /**
   * Add a new pet
   * @param {Object} req - Express request object
   * @param {Object} res - Express response object
   */
  createPet: async (req, res) => {
    try {
      const { name, species, age, personality } = req.body;
      
      // Validate required fields
      if (!name || !species || !age || !personality) {
        return res.status(400).json({ 
          success: false, 
          message: 'Missing required fields' 
        });
      }
      
      const newPet = await petService.createPet(req.body);
      res.status(201).json({
        success: true,
        data: newPet,
        message: 'Pet created successfully'
      });
    } catch (error) {
      res.status(500).json({
        success: false,
        message: error.message
      });
    }
  },

  /**
   * Get all pets
   * @param {Object} req - Express request object
   * @param {Object} res - Express response object
   */
  getAllPets: async (req, res) => {
    try {
      const pets = await petService.getAllPets();
      res.status(200).json({
        success: true,
        count: pets.length,
        data: pets
      });
    } catch (error) {
      res.status(500).json({
        success: false,
        message: error.message
      });
    }
  },

  /**
   * Get a pet by ID
   * @param {Object} req - Express request object
   * @param {Object} res - Express response object
   */
  getPetById: async (req, res) => {
    try {
      const pet = await petService.getPetById(req.params.id);
      res.status(200).json({
        success: true,
        data: pet
      });
    } catch (error) {
      if (error.message === 'Pet not found') {
        return res.status(404).json({
          success: false,
          message: error.message
        });
      }
      res.status(500).json({
        success: false,
        message: error.message
      });
    }
  },

  /**
   * Update a pet's profile
   * @param {Object} req - Express request object
   * @param {Object} res - Express response object
   */
  updatePet: async (req, res) => {
    try {
      const updatedPet = await petService.updatePet(req.params.id, req.body);
      res.status(200).json({
        success: true,
        data: updatedPet,
        message: 'Pet updated successfully'
      });
    } catch (error) {
      if (error.message === 'Pet not found') {
        return res.status(404).json({
          success: false,
          message: error.message
        });
      }
      res.status(500).json({
        success: false,
        message: error.message
      });
    }
  },

  /**
   * Adopt a pet
   * @param {Object} req - Express request object
   * @param {Object} res - Express response object
   */
  adoptPet: async (req, res) => {
    try {
      const pet = await petService.adoptPet(req.params.id);
      res.status(200).json({
        success: true,
        data: pet,
        message: 'Pet adopted successfully'
      });
    } catch (error) {
      if (error.message === 'Pet not found') {
        return res.status(404).json({
          success: false,
          message: error.message
        });
      }
      if (error.message === 'Pet is already adopted') {
        return res.status(400).json({
          success: false,
          message: error.message
        });
      }
      res.status(500).json({
        success: false,
        message: error.message
      });
    }
  },

  /**
   * Delete a pet
   * @param {Object} req - Express request object
   * @param {Object} res - Express response object
   */
  deletePet: async (req, res) => {
    try {
      await petService.deletePet(req.params.id);
      res.status(200).json({
        success: true,
        message: 'Pet deleted successfully'
      });
    } catch (error) {
      if (error.message === 'Pet not found') {
        return res.status(404).json({
          success: false,
          message: error.message
        });
      }
      res.status(500).json({
        success: false,
        message: error.message
      });
    }
  },

  /**
   * Filter pets by mood
   * @param {Object} req - Express request object
   * @param {Object} res - Express response object
   */
  filterPetsByMood: async (req, res) => {
    try {
      const { mood } = req.params;
      if (!mood) {
        return res.status(400).json({
          success: false,
          message: 'Mood parameter is required'
        });
      }

      const pets = await petService.filterPetsByMood(mood);
      res.status(200).json({
        success: true,
        count: pets.length,
        data: pets
      });
    } catch (error) {
      res.status(500).json({
        success: false,
        message: error.message
      });
    }
  }
};

module.exports = petController;