const mongoose = require("mongoose");

const userSchema = new mongoose.Schema(
  {
    name: { type: String, required: true },
    email: { type: String, required: true },
    password: { type: String, required: true },
    profileImage: { type: String, default: null },
    role: { type: String, enum: ["admin", "member"], default: "member" }
  },
  { timestamps: true } // <-- timestamps should be outside the fields object
);

module.exports = mongoose.model("User", userSchema);
