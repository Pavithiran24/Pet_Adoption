const Pet = require('../models/petModel');
const { calculateMood } = require('../utils/moodLogic');

const petService = {
  /**
   * Create a new pet
   * @param {Object} petData - Pet information
   * @returns {Promise<Object>} - Created pet
   */
  createPet: async (petData) => {
    try {
      const pet = new Pet(petData);
      return await pet.save();
    } catch (error) {
      throw new Error(`Error creating pet: ${error.message}`);
    }
  },

  /**
   * Get all pets with updated moods
   * @returns {Promise<Array>} - List of all pets
   */
  getAllPets: async () => {
    try {
      const pets = await Pet.find();
      
      // Update moods based on time in system
      return pets.map(pet => {
        const petObj = pet.toObject();
        if (!pet.adopted) {
          petObj.mood = calculateMood(pet.createdAt);
        }
        return petObj;
      });
    } catch (error) {
      throw new Error(`Error fetching pets: ${error.message}`);
    }
  },

  /**
   * Get a pet by ID with updated mood
   * @param {String} id - Pet ID
   * @returns {Promise<Object>} - Pet object
   */
  getPetById: async (id) => {
    try {
      const pet = await Pet.findById(id);
      if (!pet) {
        throw new Error('Pet not found');
      }

      const petObj = pet.toObject();
      if (!pet.adopted) {
        petObj.mood = calculateMood(pet.createdAt);
      }
      
      return petObj;
    } catch (error) {
      throw new Error(`Error fetching pet: ${error.message}`);
    }
  },

  /**
   * Update a pet's information
   * @param {String} id - Pet ID
   * @param {Object} petData - Updated pet information
   * @returns {Promise<Object>} - Updated pet
   */
  updatePet: async (id, petData) => {
    try {
      const pet = await Pet.findById(id);
      if (!pet) {
        throw new Error('Pet not found');
      }

      // Update only the fields that are provided
      Object.keys(petData).forEach(key => {
        if (key !== 'adopted' && key !== 'adoption_date' && key !== 'mood') {
          pet[key] = petData[key];
        }
      });
      
      await pet.save();
      
      // Calculate and update mood
      const petObj = pet.toObject();
      if (!pet.adopted) {
        petObj.mood = calculateMood(pet.createdAt);
      }
      
      return petObj;
    } catch (error) {
      throw new Error(`Error updating pet: ${error.message}`);
    }
  },

  /**
   * Adopt a pet
   * @param {String} id - Pet ID
   * @returns {Promise<Object>} - Updated pet
   */
  adoptPet: async (id) => {
    try {
      const pet = await Pet.findById(id);
      if (!pet) {
        throw new Error('Pet not found');
      }

      if (pet.adopted) {
        throw new Error('Pet is already adopted');
      }

      pet.adopted = true;
      pet.adoption_date = new Date();
      pet.mood = 'Happy'; // Always happy when adopted
      
      await pet.save();
      return pet;
    } catch (error) {
      throw new Error(`Error adopting pet: ${error.message}`);
    }
  },

  /**
   * Delete a pet
   * @param {String} id - Pet ID
   * @returns {Promise<Boolean>} - True if deletion successful
   */
  deletePet: async (id) => {
    try {
      const pet = await Pet.findById(id);
      if (!pet) {
        throw new Error('Pet not found');
      }

      await Pet.deleteOne({ _id: id });
      return true;
    } catch (error) {
      throw new Error(`Error deleting pet: ${error.message}`);
    }
  },

  /**
   * Filter pets by mood
   * @param {String} mood - Mood to filter by
   * @returns {Promise<Array>} - Filtered pets
   */
  filterPetsByMood: async (mood) => {
    try {
      const allPets = await petService.getAllPets();
      return allPets.filter(pet => pet.mood === mood);
    } catch (error) {
      throw new Error(`Error filtering pets: ${error.message}`);
    }
  }
};

module.exports = petService;