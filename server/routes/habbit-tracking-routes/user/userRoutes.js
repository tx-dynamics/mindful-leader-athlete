const express = require("express");
const router = express.Router();

const userLoginValidator = require("../../../middlewares/user/userLoginValidator");
const userPasswordValidator = require("../../../middlewares/user/userPasswordValidator");
const userSignUpValidator = require("../../../middlewares/user/userSignupValidator");
const userUpdateValidator = require("../../../middlewares/user/userUpdateValidator");
const userValidator = require("../../../middlewares/user/userValidator");
const user = require("../../api/user");

//GET
router.get("/:id", user.singleUser);
//POST
router.post("/signup", userValidator, userSignUpValidator, user.signUp);
router.post("/login", userLoginValidator, user.login);
router.post("/admin/login", user.adminLogin);
router.post("/admin/signup", user.adminSignUp);

//PUT
router.put("/change-password/", userPasswordValidator, user.changePassword);
router.put("/:id", userUpdateValidator, user.updateUser);
router.put("/addDepartment/:id", user.addDepartment);
router.post("/query", user.query);
module.exports = router;
