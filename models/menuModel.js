const mongoose = require('mongoose');

const menuSchema = new mongoose.Schema({
  name: { type: String, requird: [true, 'Menu Name is required'] },
  items: [
    {
      _id: String,
      name: String,
      price: Number,
      description: String,
      image: String,
      type: {
        type: String,
        enum: ['appetizers', 'sandwiches', 'entrees', 'dessert', 'platters'],
      },
    },
  ],
});

// this.pre(/^find/, function (next) {
//  this.populate({ path: '' });
//  next();
// });

const Menu = mongoose.model('Menu', menuSchema);
module.exports = Menu;
