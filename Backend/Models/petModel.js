const mongoose = require('mongoose');
const Schema = mongoose.Schema;

const petSchema = new Schema({
  name: {
    type: String,
    required: true,
    trim: true
  },
  species: {
    type: String,
    required: true,
    trim: true
  },
  age: {
    type: Number,
    required: true,
    min: 0
  },
  personality: {
    type: String,
    trim: true
  },
  mood: {
    type: String,
    enum: ['happy', 'sad', 'calm', 'playful'],
    default: 'happy'
  },
  image: {
    type: String,  // Store the URL/path to the image
    default: null
  },
  adopted: {
    type: Boolean,
    default: false
  },
  addedAt: {
    type: Date,
    default: Date.now
  }
});

module.exports = mongoose.model('Pet', petSchema);