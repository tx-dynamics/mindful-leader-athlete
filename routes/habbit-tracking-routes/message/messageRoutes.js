const express = require("express");
const router = express.Router();

const message = require("../../api/message");

router.post("/getAll", message.getAllMessages);

module.exports = router;
