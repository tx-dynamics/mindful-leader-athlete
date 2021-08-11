const express = require("express");
const router = express.Router();

const userLoginValidator = require("../../../middlewares/user/userLoginValidator");
const userPasswordValidator = require("../../../middlewares/user/userPasswordValidator");
const userSignUpValidator = require("../../../middlewares/user/userSignUpValidator");
const userUpdateValidator = require("../../../middlewares/user/userUpdateValidator");
const userValidator = require("../../../middlewares/user/userValidator");
const challange = require("../../api/challange");
const companyNameExist = require("../../../middlewares/company/companyNameExist");

//router.get("/todays/check/:id", challange.checkHabbitState);
router.post("/todays", challange.getTodaysChallange);
router.post("/tomorrow", challange.getTomorrowsChallange);
router.post("/yesterday", challange.getYesterdaysChallange);
router.post("/forDate", challange.getChallangeForDate);
router.post("/", companyNameExist, challange.createChallange);
router.post("/completeHabbit", challange.completeHabbit);
router.put("/updateUserHabbitState", challange.updateUserHabbitState);

module.exports = router;
