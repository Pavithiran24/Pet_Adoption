/**
 * Determines a pet's mood based on how long it's been in the system
 * @param {Date} createdAt - Date when the pet was added to the system
 * @returns {String} - The mood of the pet
 */
const calculateMood = (createdAt) => {
    const now = new Date();
    const daysInSystem = Math.floor((now - createdAt) / (1000 * 60 * 60 * 24));
    
    if (daysInSystem < 1) {
      return 'Happy';
    } else if (daysInSystem >= 1 && daysInSystem <= 3) {
      return 'Excited';
    } else {
      return 'Sad';
    }
  };
  
  module.exports = {
    calculateMood
  };