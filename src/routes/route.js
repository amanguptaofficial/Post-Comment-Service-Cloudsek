const express = require("express");
const router = express.Router();

router.get("/", (req, res) => {
  console.log("everthing okay");
  res.send("OK");
});

module.exports = router;
