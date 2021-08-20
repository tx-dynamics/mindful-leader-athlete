const express = require("express");
const router = express.Router();

const challange = require("../../api/challange");
const companyNameExist = require("../../../middlewares/company/companyNameExist");

router.get("/:id", challange.getSingleChallange);
router.put("/:id", challange.updateChallange);
router.post("/todays", challange.getTodaysChallange);
router.post("/tomorrow", challange.getTomorrowsChallange);
router.post("/yesterday", challange.getYesterdaysChallange);
router.post("/forDate", challange.getChallangeForDate);
router.post("/", companyNameExist, challange.createChallange);
router.post("/completeHabbit", challange.completeHabbit);
router.put("/updateUserHabbitState", challange.updateUserHabbitState);
router.post("/query", challange.query);

module.exports = router;
