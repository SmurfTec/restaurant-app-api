const mongoose = require('mongoose');

const restaurantSchema = new mongoose.Schema({
  name: { type: String, required: [true, 'name is required'] },
  description: { type: String, required: [true, 'description is required'] },
  logo: { type: String, required: [true, 'logo is required'] },
  hours: { type: String, required: [true, 'hours is required'] },
  images: [String],
  meals: [
    {
      name: {
        type: String,
        enum: ['breakfast', 'lunch', 'dinner'],
        required: [true, 'Meal Name is required !'],
      },
      menu: {
        type: mongoose.Schema.Types.ObjectId,
        ref: 'Menu',
      },
    },
  ],
});

restaurantSchema.pre(/^find/, function (next) {
  this.populate({ path: 'meals.menu' });
  next();
});

const Restaurant = mongoose.model('Restaurant', restaurantSchema);
module.exports = Restaurant;
