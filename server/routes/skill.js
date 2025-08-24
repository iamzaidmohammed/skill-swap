const express = require("express");
const jwt = require("jsonwebtoken");
const Skill = require("../model/Skill");

const router = express.Router();

// Inline auth (since you don't have a middleware file)
function requireAuth(req, res, next) {
  const authHeader = req.header("Authorization") || "";
  const token = authHeader.startsWith("Bearer ") ? authHeader.slice(7) : null;

  if (!token)
    return res.status(401).json({ msg: "No token, authorization denied" });

  try {
    const decoded = jwt.verify(token, process.env.JWT_SECRET);
    // Support either { user: { id } } or { id } payloads
    req.userId = decoded?.user?.id || decoded?.id || decoded?._id;
    if (!req.userId)
      return res.status(401).json({ msg: "Invalid token payload" });
    next();
  } catch (err) {
    return res.status(401).json({ msg: "Token is not valid: " + err.message });
  }
}

// GET /api/skills - list my skills
router.get("/", requireAuth, async (req, res) => {
  try {
    const skills = await Skill.find({ user: req.userId }).sort({
      createdAt: -1,
    });
    res.json(skills);
  } catch (e) {
    res.status(500).json({ msg: "Server error: " + e.message });
  }
});

// POST /api/skills - add a skill
router.post("/", requireAuth, async (req, res) => {
  try {
    const { offered, wanted } = req.body;
    if (!offered || !wanted) {
      return res
        .status(400)
        .json({ msg: "Both 'offered' and 'wanted' are required" });
    }

    const skill = await Skill.create({ user: req.userId, offered, wanted });
    res.status(201).json(skill);
  } catch (e) {
    res.status(500).json({ msg: "Server error: " + e.message });
  }
});

// PUT /api/skills/:id - update a skill
router.put("/:id", requireAuth, async (req, res) => {
  try {
    const { offered, wanted } = req.body;
    if (!offered || !wanted) {
      return res
        .status(400)
        .json({ msg: "Both 'offered' and 'wanted' are required" });
    }

    const updated = await Skill.findOneAndUpdate(
      { _id: req.params.id, user: req.userId },
      { $set: { offered, wanted } },
      { new: true }
    );
    if (!updated) return res.status(404).json({ msg: "Skill not found" });
    res.json(updated);
  } catch (e) {
    res.status(500).json({ msg: "Server error: " + e.message });
  }
});

// DELETE /api/skills/:id - delete a skill
router.delete("/:id", requireAuth, async (req, res) => {
  try {
    const deleted = await Skill.findOneAndDelete({
      _id: req.params.id,
      user: req.userId,
    });
    if (!deleted) return res.status(404).json({ msg: "Skill not found" });
    res.json({ msg: "Skill deleted" });
  } catch (e) {
    res.status(500).json({ msg: "Server error: " + e.message });
  }
});

module.exports = router;
