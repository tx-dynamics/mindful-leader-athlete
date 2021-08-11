const express = require("express");
const router = express.Router();

const dashboard = require("../../api/dashboard");

router.post("/individual", dashboard.getIndividualRanking);
router.post("/department", dashboard.getDepartmentWiseRanking);
router.post("/companyDepartments", dashboard.getCompanyDepartmentsRanking);

module.exports = router;
