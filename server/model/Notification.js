const mongoose = require("mongoose");

const notificationSchema = new mongoose.Schema(
  {
    user: { type: mongoose.Schema.Types.ObjectId, ref: "User", required: true }, // recipient
    from: { type: mongoose.Schema.Types.ObjectId, ref: "User" }, // actor
    type: { type: String, required: true }, // e.g., 'request_accepted'
    data: { type: mongoose.Schema.Types.Mixed },
    read: { type: Boolean, default: false },
  },
  { timestamps: true }
);

module.exports = mongoose.model("Notification", notificationSchema);
