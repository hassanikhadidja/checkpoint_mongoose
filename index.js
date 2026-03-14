const express = require("express");
const app = express();
const PORT = 5000;
require("dotenv").config();
const mongoose = require("mongoose");

const connectDB=require("./config/connectDB");
const User=require("./models/user")

connectDB()

// ─── 2. Create and Save a Single Person
const insert=async()=>{
  try {
    const user = new User({
      name:"Mary",
      age:23,
      favoriteFoods:["apple pie"],})
    await user.save()
      } catch (error) {
        console.log(error);
      }
}
//insert()

// ─── 3. Create Many People at Once
const insertMany = async () => {
  try {
    const manyUsers = [
      { name: "khadidja", age: 23, favoriteFoods: ["apple pie"] },
      { name: "ahmed",    age: 28, favoriteFoods: ["pizza", "couscous"] },
      { name: "sara",     age: 19, favoriteFoods: ["ice cream"] }
      // add as many as you want
    ];

    const savedUsers = await User.create(manyUsers);
    
    console.log("Successfully inserted many users:", savedUsers);
    // savedUsers is an array of the created documents (with _id, etc.)
    
  } catch (error) {
    console.log("Error inserting many users:", error);
  }
};

// Call it
//insertMany();

// ─── 4. Find All People by Name
const findPeopleByName = async (personName) => {
  try {
    const users = await User.find({ name: personName });
    console.log("Found:", users);
    return users;
  } catch (err) {
    console.error("Error finding users:", err);
    throw err;
  }
};

//findPeopleByName("khadidja");

// ─── 5. Find One Person by Favorite Food
const findOneByFood = async (food) => {
  try {
    const user = await User.findOne({ favoriteFoods: food });
    console.log("Found user who likes that food:", user.name, user.age);
    return user; // returns one user or null
  } catch (err) {
    console.error("Error:", err);
    throw err;
  }
};
//findOneByFood("pizza");

// ─── 6. Find a Person by _id
const findPersonById = async (personId) => {
  try {
    const user = await User.findById(personId);
    console.log("Found user by ID:", user.name, user.age, user.favoriteFoods);
    return user; // returns document or null
  } catch (err) {
    console.error("Error finding by ID:", err);
    throw err;
  }
};
//findPersonById("69b5bac87959c179161fbe8c")

// ─── 7. Find, Edit, then Save
const findEditThenSaveModern = async (personId) => {
  try {
    const user = await User.findById(personId);
    if (!user) {
      throw new Error("User not found");
    }

    user.favoriteFoods.push("hamburger");
    
    const updated = await user.save();
    return updated;
  } catch (err) {
    console.error("Update error:", err);
    throw err;
  }
};

//(async () => {const updated = await findEditThenSaveModern("69b5bac87959c179161fbe8c"); console.log("Updated foods:", updated.favoriteFoods);})();

// ─── 8. Find by Name and Update Age to 20
const findAndUpdate = async (personName) => {
  try {
    const updatedUser = await User.findOneAndUpdate(
      { name: personName },
      { age: 20 },
      { new: true }           // return updated document
    );
    console.log("Updated user:");
    console.log("Name:", updatedUser.name);
    console.log("New age:", updatedUser.age);         // should be 20
    console.log("Favorite foods:", updatedUser.favoriteFoods);
    if (!updatedUser) {
      console.log("No user found");
      return null;
    }
    
    return updatedUser;
  } catch (err) {
    console.error("Error in findAndUpdate:", err);
    throw err;
  }
};
//findAndUpdate("sara");

// ─── 9. Delete One Person by _id
const removeById = async ({_id}) => {
  try {
    const deletedUser = await User.deleteOne({_id});

    console.log("Successfully deleted user:");
    console.log("Name:", User.name);
    console.log("Age:", User.age);
    console.log("Was favorite foods:", User.favoriteFoods);
    
  } catch (error){
    console.log(error);
}; 
}
//removeById({_id:"69b5bac87e7a28f7a51c97fa"})

// ─── 10. Delete All People Named "Mary"
const removeManyUsers = async () => {
  try {
    const result = await User.deleteMany({ name: "Mary" });
    console.log("Deleted:", result.deletedCount, "users named Mary");
    return result;
  } catch (error) {
    console.log(error);
  }
};
//removeManyUsers()

// ─── 11. Chain Query Helpers
// Make the function async
const runQuery = async () => {
  const count = await User.countDocuments({ favoriteFoods: "burrito" });
  console.log('Users who like burrito:', count);

  const data = await User.find({ favoriteFoods: "burrito" })
    .sort({ name: 1 })
    .limit(2)
    .select("-age")
    .exec();
  console.log(data);
};

runQuery().catch(err => console.error(err));


app.listen(PORT, () => console.log("server is running"));