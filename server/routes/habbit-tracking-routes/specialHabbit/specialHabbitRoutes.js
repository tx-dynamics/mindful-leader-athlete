const express = require("express");
const router = express.Router();

const specialHabbit = require("../../api/specialHabbit");

//POST
router.post("/", specialHabbit.addSpecialHabbit);
router.put("/edit/:id", specialHabbit.editSpecialHabbit);

module.exports = router;
