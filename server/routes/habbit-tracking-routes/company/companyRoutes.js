const express = require("express");
const router = express.Router();

const company = require("../../api/company");

//GET
//router.get("/:id", user.singleUser);
//POST
router.get("/:id", company.getSingleCompany);
router.get("/", company.getAllCompanies);
router.put("/:id", company.updateCompany);
router.post("/", company.createCompany);
router.post("/query", company.query);
router.delete("/:id", company.deleteCompany);
// router.post("/login", userLoginValidator, user.login);
//PUT
// router.put("/change-password/", userPasswordValidator, user.changePassword);
// router.put("/:id", userUpdateValidator, user.updateUser);

module.exports = router;
