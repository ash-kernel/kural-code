const mongoose = require('mongoose');
const fs = require('fs');
const path = require('path');
const Kural = require('./models/Kural');

async function seedDatabase() {
  try {
    const count = await Kural.countDocuments();
    if (count === 0) {
      console.log('Seeding Database with Kurals...');
      const dataPath = path.join(__dirname, 'kural.json');
      const kuralData = JSON.parse(fs.readFileSync(dataPath, 'utf8'));
      
      if (kuralData && kuralData.kural && Array.isArray(kuralData.kural)) {
        await Kural.insertMany(kuralData.kural);
        console.log(`Successfully seeded ${kuralData.kural.length} kurals.`);
      } else {
        console.error('Invalid kural.json format.');
      }
    } else {
      console.log(`Database already has ${count} kurals. Skipping seed.`);
    }
  } catch (error) {
    console.error('Error seeding database:', error);
  }
}

module.exports = seedDatabase;
