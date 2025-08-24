const mongoose = require("mongoose");

const skillSchema = new mongoose.Schema(
  {
    user: { type: mongoose.Schema.Types.ObjectId, ref: "User", required: true },
    offered: { type: String, required: true },
    wanted: { type: String, required: true },
  },
  { timestamps: true }
);

module.exports = mongoose.model("Skill", skillSchema);
