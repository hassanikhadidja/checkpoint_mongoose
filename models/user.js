const mongoose = require("mongoose");

// ─── 1. Define the Person Schema
const userSchema = new mongoose.Schema({
  name: { type: String, required: true }, // name is required
  age: { type: Number },                  // age is optional
  favoriteFoods: { type: [String] },      // array of strings
});


 

module.exports= mongoose.model('user', userSchema)