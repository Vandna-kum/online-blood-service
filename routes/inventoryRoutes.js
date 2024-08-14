const express = require('express');
const authMiddleware = require('../middlewares/authMiddleware');
const { createInventoryController,
    getInventoryController,
    getInventoryHospitalController,
    getDonarsController,
    getHospitalController,
    getOrganisationController,
    getOrganisationForHospitalController,
    getRecentInventoryController,
} = require('../controllers/inventoryController');

const router = express.Router();

//routes
//ADD INVENTORY || POST
router.post("/create-inventory", authMiddleware, createInventoryController);

//GET ALL BLOOD RECORDS
router.get("/get-inventory", authMiddleware, getInventoryController);

//GET Recent BLOOD RECORDS
router.get("/get-recent-inventory", authMiddleware, getRecentInventoryController);

//GET HOSPITAL BLOOD RECORDS
router.post(
    "/get-inventory-hospital",
    authMiddleware,
    getInventoryHospitalController
);

//GET DONAR RECORDS
router.get("/get-donars", authMiddleware, getDonarsController);

//GET HOSPITAL RECORDS
router.get("/get-hospitals", authMiddleware, getHospitalController);
//GET ORGANISATION RECORDS
router.get("/get-organisation", authMiddleware, getOrganisationController);
//GET ORGANISATION FOR HOSPITAL RECORDS
router.get(
    "/get-organisation-for-hospital",
    authMiddleware,
    getOrganisationForHospitalController);

module.exports = router;