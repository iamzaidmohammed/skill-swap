const express = require("express");
const jwt = require("jsonwebtoken");
const Request = require("../model/Request");
const Notification = require("../model/Notification");
const Skill = require("../model/Skill");

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

// POST /api/requests - send a request for a skill
router.post("/", requireAuth, async (req, res) => {
  try {
    const { skillId, message } = req.body;
    if (!skillId) return res.status(400).json({ msg: "skillId is required" });

    const skill = await Skill.findById(skillId).populate("user");
    if (!skill) return res.status(404).json({ msg: "Skill not found" });

    // Do not allow requesting your own skill
    if (skill.user.toString() === req.userId)
      return res.status(400).json({ msg: "Cannot request your own skill" });

    const request = await Request.create({
      skill: skill._id,
      from: req.userId,
      to: skill.user,
      message,
    });

    // For now, just return the created request. In a real app you'd push a websocket/notification.
    res.status(201).json(request);
  } catch (e) {
    res.status(500).json({ msg: "Server error: " + e.message });
  }
});

// GET /api/requests/received - list requests received by authenticated user
router.get("/received", requireAuth, async (req, res) => {
  try {
    const items = await Request.find({ to: req.userId })
      .populate("skill from to")
      .sort({ createdAt: -1 });
    res.json(items);
  } catch (e) {
    res.status(500).json({ msg: "Server error: " + e.message });
  }
});

// POST /api/requests/:id/respond - accept/decline a request
router.post("/:id/respond", requireAuth, async (req, res) => {
  try {
    const { action } = req.body; // 'accept' or 'decline'
    if (!["accept", "decline"].includes(action))
      return res.status(400).json({ msg: "Invalid action" });

    const reqItem = await Request.findById(req.params.id).populate("skill");
    if (!reqItem) return res.status(404).json({ msg: "Request not found" });
    if (reqItem.to.toString() !== req.userId)
      return res.status(403).json({ msg: "Not authorized" });

    reqItem.status = action === "accept" ? "accepted" : "declined";
    await reqItem.save();

    // If accepted, create a notification for the requester
    if (action === "accept") {
      try {
        // Get the current user's information to include email in notification
        const User = require("../model/User");
        const currentUser = await User.findById(req.userId);
        
        const note = await Notification.create({
          user: reqItem.from,
          from: req.userId,
          type: "request_accepted",
          data: { 
            requestId: reqItem._id, 
            skillId: reqItem.skill._id,
            accepterEmail: currentUser.email,
            accepterName: currentUser.name
          },
        });
        // emit via socket if connected
        try {
          req.app.locals.emitNotification(reqItem.from.toString(), note);
        } catch (e) {
          console.log("Emit notification error:", e.message);
        }
      } catch (nerr) {
        console.log("Notification create error:", nerr.message);
      }
    }

    res.json(reqItem);
  } catch (e) {
    res.status(500).json({ msg: "Server error: " + e.message });
  }
});

// GET /api/notifications - list notifications for authenticated user
router.get("/../notifications", requireAuth, async (req, res) => {
  try {
    // route path is /api/notifications because of how this file is mounted
    const notes = await Notification.find({ user: req.userId })
      .populate("from")
      .sort({ createdAt: -1 });
    res.json(notes);
  } catch (e) {
    res.status(500).json({ msg: "Server error: " + e.message });
  }
});

module.exports = router;
