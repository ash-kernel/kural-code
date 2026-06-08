const mongoose = require('mongoose');

const apiKeySchema = new mongoose.Schema({
  name: { type: String, required: true },
  key: { type: String, required: true, unique: true },
  active: { type: Boolean, default: true },
  expiresAt: { type: Date, default: null },
}, { timestamps: true });

module.exports = mongoose.models.ApiKey || mongoose.model('ApiKey', apiKeySchema);
