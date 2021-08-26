const express = require("express");
const router = express.Router();

const dashboard = require("../../api/dashboard");

router.post("/individual", dashboard.getIndividualRanking);
router.post("/department", dashboard.getDepartmentWiseRanking);
router.post("/companyDepartments", dashboard.getCompanyDepartmentsRanking);
router.post("/habits", dashboard.getHabbitWiseRanking);

module.exports = router;
