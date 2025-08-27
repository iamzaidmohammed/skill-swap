const express = require("express");
const Notification = require("../model/Notification");
const jwt = require("jsonwebtoken");

const router = express.Router();

function requireAuth(req, res, next) {
  const authHeader = req.header("Authorization") || "";
  const token = authHeader.startsWith("Bearer ") ? authHeader.slice(7) : null;

  if (!token)
    return res.status(401).json({ msg: "No token, authorization denied" });

  try {
    const decoded = jwt.verify(token, process.env.JWT_SECRET);
    req.userId = decoded?.user?.id || decoded?.id || decoded?._id;
    if (!req.userId)
      return res.status(401).json({ msg: "Invalid token payload" });
    next();
  } catch (err) {
    return res.status(401).json({ msg: "Token is not valid: " + err.message });
  }
}

// GET /api/notifications - list notifications for authenticated user
router.get("/", requireAuth, async (req, res) => {
  try {
    const notes = await Notification.find({ user: req.userId })
      .populate("from")
      .sort({ createdAt: -1 });
    res.json(notes);
  } catch (e) {
    res.status(500).json({ msg: "Server error: " + e.message });
  }
});

// POST /api/notifications/:id/read - mark single notification read
router.post("/:id/read", requireAuth, async (req, res) => {
  try {
    const note = await Notification.findById(req.params.id);
    if (!note) return res.status(404).json({ msg: "Notification not found" });
    if (note.user.toString() !== req.userId)
      return res.status(403).json({ msg: "Not authorized" });
    note.read = true;
    await note.save();
    res.json(note);
  } catch (e) {
    res.status(500).json({ msg: "Server error: " + e.message });
  }
});

// POST /api/notifications/read-all - mark all user's notifications read
router.post("/read-all", requireAuth, async (req, res) => {
  try {
    await Notification.updateMany(
      { user: req.userId, read: false },
      { read: true }
    );
    res.json({ ok: true });
  } catch (e) {
    res.status(500).json({ msg: "Server error: " + e.message });
  }
});

module.exports = router;
