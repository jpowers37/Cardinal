const User = require("../models/User");
const router = require("express").Router();
const bcrypt = require("bcrypt");
const multer = require("multer");
const path = require("path");
const express = require("express");
 
const storage = multer.memoryStorage();
const upload = multer({ storage: storage });

// Upload profile picture
router.put("/:id/profilePicture", async (req, res) => {
  try {
    const user = await User.findById(req.params.id);
    if (user) {
      user.profilePicture = req.body.profilePicture;
      await user.save();
      res.status(200).json("Profile picture updated successfully.");
    } else {
      res.status(404).json("User not found."); 
    }
  } catch (err) {
    res.status(500).json(err);
  }
});
 
// Upload cover picture
router.put("/:id/coverPicture", async (req, res) => {
  try {
    const user = await User.findById(req.params.id);
    if (user) {
      user.coverPicture = req.body.coverPicture;
      await user.save();
      res.status(200).json("Cover picture updated successfully.");
    } else {
      res.status(404).json("User not found.");
    }
  } catch (err) {
    res.status(500).json(err);
  }
});

// Search users by username
router.get("/search", async (req, res) => {
  const query = req.query.q;
  console.log("Search query:", query); // Log the search query
  try {
    const users = await User.find({ username: { $regex: query, $options: "i" } }).limit(10);
    console.log("Found users:", users);
    res.status(200).json(users);
  } catch (err) {
    res.status(500).json(err);
  }
});

//update user
router.put("/:id", async (req, res) => {
  if (req.body.userId === req.params.id || req.body.isAdmin) {
    if (req.body.password) {
      try {
        const salt = await bcrypt.genSalt(10);
        req.body.password = await bcrypt.hash(req.body.password, salt);
      } catch (err) {
        return res.status(500).json(err);
      }
    }
    try {
      const user = await User.findByIdAndUpdate(req.params.id, {
        $set: req.body,
      });
      res.status(200).json("Account has been updated");
    } catch (err) {
      return res.status(500).json(err);
    }
  } else {
    return res.status(403).json("You can update only your account!");
  }
});

//delete user
router.delete("/:id", async (req, res) => {
  if (req.body.userId === req.params.id || req.body.isAdmin) {
    try {
      await User.findByIdAndDelete(req.params.id);
      res.status(200).json("Account has been deleted");
    } catch (err) {
      return res.status(500).json(err);
    }
  } else {
    return res.status(403).json("You can delete only your account!");
  }
});

//get a user
router.get("/", async (req, res) => {
  const userId = req.query.userId;
  const username = req.query.username;
  try {
    const user = userId
      ? await User.findById(userId)
      : await User.findOne({ username: username });
    const { password, updatedAt, ...other } = user._doc;
    res.status(200).json(other);
  } catch (err) {
    res.status(500).json(err);
  }
});

//get friends
router.get("/friends/:userId", async (req, res) => {
  try {
    const user = await User.findById(req.params.userId);
    const friends = await Promise.all(
      user.followings.map((friendId) => {
        return User.findById(friendId);
      })
    );
    let friendList = [];
    friends.map((friend) => {
      const { _id, username, profilePicture } = friend;
      friendList.push({ _id, username, profilePicture });
    });
    res.status(200).json(friendList)
  } catch (err) {
    res.status(500).json(err);
  }
});

// Follow a user
router.put("/:id/follow", async (req, res) => {
  const { userId } = req.body;
  console.log("Follow request received for user:", req.params.id, "by user:", userId); // Debug log
  if (userId !== req.params.id) {
    try {
      const user = await User.findById(req.params.id);
      const currentUser = await User.findById(userId);
      if (!user.followers.includes(userId)) {
        await user.updateOne({ $push: { followers: userId } });
        await currentUser.updateOne({ $push: { followings: req.params.id } });
        res.status(200).json("User has been followed");
      } else {
        res.status(403).json("You already follow this user");
      }
    } catch (err) {
      res.status(500).json(err);
    }
  } else {
    res.status(403).json("You can't follow yourself");
  }
});

// Unfollow a user
router.put("/:id/unfollow", async (req, res) => {
  const { userId } = req.body;
  console.log("Unfollow request received for user:", req.params.id, "by user:", userId); // Debug log
  if (userId !== req.params.id) {
    try {
      const user = await User.findById(req.params.id);
      const currentUser = await User.findById(userId);
      if (user.followers.includes(userId)) {
        await user.updateOne({ $pull: { followers: userId } });
        await currentUser.updateOne({ $pull: { followings: req.params.id } });
        res.status(200).json("User has been unfollowed");
      } else {
        res.status(403).json("You don't follow this user");
      }
    } catch (err) {
      res.status(500).json(err);
    }
  } else {
    res.status(403).json("You can't unfollow yourself");
  }
});


module.exports = router;
