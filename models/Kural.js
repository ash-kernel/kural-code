const mongoose = require('mongoose');

const kuralSchema = new mongoose.Schema({
  Number: { type: Number, required: true, unique: true },
  Line1: { type: String, required: true },
  Line2: { type: String, required: true },
  Translation: { type: String, required: true },
  mv: { type: String, required: true },
  sp: { type: String, required: true },
  mk: { type: String, required: true },
  explanation: { type: String, required: true },
  couplet: { type: String, required: true },
  transliteration1: { type: String, required: true },
  transliteration2: { type: String, required: true }
}, { timestamps: true });

module.exports = mongoose.model('Kural', kuralSchema);
