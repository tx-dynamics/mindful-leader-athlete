const express = require("express");
const router = express.Router();

const message = require("../../api/message");

router.get("/:roomId", message.getAllMessages);

module.exports = router;
