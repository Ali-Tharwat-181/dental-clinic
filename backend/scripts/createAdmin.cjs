const mongoose = require("mongoose");
const User = require("../models/user.cjs");
require("dotenv").config();

async function createAdmin() {
  await mongoose.connect(process.env.MONGO_URI, {
    useNewUrlParser: true,
    useUnifiedTopology: true,
  });

  const email = "admin@ever-care.com"; // CHANGE THIS
  const password = "admin1234"; // CHANGE THIS
  const name = "Admin"; // CHANGE THIS

  // Check if admin already exists
  const existing = await User.findOne({ email });
  if (existing) {
    console.log("Admin user already exists.");
    process.exit(0);
  }

  const admin = new User({
    name,
    email,
    password,
    role: "admin",
  });

  await admin.save();
  console.log("Admin user created successfully!");
  process.exit(0);
}

createAdmin().catch((err) => {
  console.error(err);
  process.exit(1);
});
