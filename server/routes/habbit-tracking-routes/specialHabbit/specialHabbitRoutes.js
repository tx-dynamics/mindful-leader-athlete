const express = require("express");
const router = express.Router();

const specialHabbit = require("../../api/specialHabbit");

//POST
router.post("/", specialHabbit.addSpecialHabbit);

module.exports = router;
