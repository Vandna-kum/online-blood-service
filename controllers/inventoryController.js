// @ts-nocheck
const mongoose = require("mongoose");
const inventoryModel = require("../models/inventoryModel");
const userModel = require("../models/userModel");
//CREATE INVENTORY
const createInventoryController = async (req, res) => {
    try {
        const { email } = req.body;
        //validation
        const user = await userModel.findOne({ email });
        if (!user) {

            throw new Error("User Not Found");
        }
        //  if (inventoryType === "in" && user.role !== "donar") {
        //    throw new Error("Not a donar account");
        // }
        //if (inventoryType === "out" && user.role !== 'hospital') {
        //    throw new Error("Not a hospital");
        //  }

        if (req.body.inventoryType == "out") {
            const requestedBloodGroup = req.body.bloodGroup;
            const requestedQuantityOfBlood = req.body.quantity;
            const organisation = new mongoose.Types.ObjectId(req.body.userId);
            //Calculate Blood Quantity
            const totalInOfRequestedBlood = await inventoryModel.aggregate([
                {
                    $match: {
                        organisation,
                        inventoryType: "in",
                        bloodgroup: requestedBloodGroup,
                    },
                },
                {
                    $group: {
                        _id: "$bloodGroup",
                        total: { $sum: "$quantity" },
                    },
                },
            ]);
            console.log("Total In", totalInOfRequestedBlood);
            const totalIn = totalInOfRequestedBlood[0]?.total || 0;

            //Calculate out Blood Quantity
            const totalOutOfRequestedBloodGroup = await inventoryModel.aggregate([
                {
                    $match: {
                        organisation,
                        inventoryType: "out",
                        bloodGroup: requestedBloodGroup,
                    }
                },
                {
                    $group: {
                        _id: "$bloodGroup",
                        total: { $sum: "$quantity" }
                    }
                },
            ]);
            const totalOut = totalOutOfRequestedBloodGroup[0]?.total || 0;
            //in & Out Calculation
            const availableQuantityOfBloodGroup = totalIn - totalOut;
            //Quantity validation
            if (availableQuantityOfBloodGroup < requestedQuantityOfBlood) {
                return res.status(500).send({
                    success: false,
                    message: `Only ${availableQuantityOfBloodGroup} ML
                     of ${requestedBloodGroup.toUpperCase()} is available`,
                });
            }
            req.body.hospital = user?._id;
        } else {
            req.body.donar = user?._id;
        }
        //save record
        const inventory = new inventoryModel(req.body);
        await inventory.save();
        return res.status(201).send({
            success: true,
            message: "New Blood Record Added",
        });

    } catch (error) {
        console.log(error);

        return res.status(500).send({
            success: false,
            message: "Error In Create Inventory API",
            error,
        });
    }
};

//GET ALL BLOOD RECORDS
const getInventoryController = async (req, res) => {
    try {
        const inventory = await inventoryModel
            .find({
                organisation: req.body.userId,
            })
            .populate("donar")
            .populate("hospital")
            .sort({ createdAt: -1 });
        return res.status(200).send({
            success: true,
            message: "get all records successfully",
            inventory,
        });
    } catch (error) {
        console.log(error);
        return res.status(500).send({
            success: false,
            message: "Error In Get All Inventory",
            error,
        });
    }
};
//GET HOSPITAL BLOOD RECORDS
const getInventoryHospitalController = async (req, res) => {
    try {
        const inventory = await inventoryModel
            .find(req.body.filters)
            .populate("donar")
            .populate("hospital")
            .populate("organisation")
            .sort({ createdAt: -1 });
        return res.status(200).send({
            success: true,
            message: "get hospital consumer records successfully",
            inventory,
        });
    } catch (error) {
        console.log(error);
        return res.status(500).send({
            success: false,
            message: "Error In Get consumer Inventory",
            error,
        });
    }
};

//GET BLOOD RECORD OF 3
const getRecentInventoryController = async (req, res) => {
    try {
        const inventory = await inventoryModel
            .find({
                organisation: req.body.userId,
            })
            .limit(3)
            .sort({ createdAt: -1 });
        return res.status(200).send({
            success: true,
            message: "Recent Inventory Data",
            inventory,
        });
    } catch (error) {
        console.log(error);
        return res.status(500).send({
            success: false,
            message: "Error In Recent Inventory API",
            error,
        });
    }
}

//GET DONAR RECORDS
const getDonarsController = async (req, res) => {
    try {
        const organisation = req.body.userId;
        //find donars
        const donarId = await inventoryModel.distinct("donar", {
            organisation,
        });
        //console.log(donarId);
        const donars = await userModel.find({ _id: { $in: donarId } });

        return res.status(200).send({
            success: true,
            message: "Donor Record Fetched Successfully",
            donars,
        });
    } catch (error) {
        console.log(error);
        return res.status(500).send({
            success: false,
            message: "Error in Donor record",
            error,
        });
    }
};
const getHospitalController = async (req, res) => {
    try {
        const organisation = req.body.userId
        //GET HOSPITAL ID
        const hospitalId = await inventoryModel.distinct("hospital", { organisation });
        // FIND HOSPITAL
        const hospitals = await userModel.find({
            _id: { $in: hospitalId }
        });
        return res.status(200).send({
            success: true,
            message: "Hospitals Data Fetched  Successfully",
            hospitals,
        });
    } catch (error) {
        console.log(error);
        return res.status(500).send({
            success: false,
            message: "Error in get Hospital API",
            error,
        });
    }
};

//GET ORG PROFILES
const getOrganisationController = async (req, res) => {
    try {
        const donar = req.body.userId;
        const ogrId = await inventoryModel.distinct(" organisation", { donar });
        //find ORG
        const org = await userModel.find({
            _id: { $in: ogrId }
        });
        return res.status(200).send({
            success: true,
            message: "Org Data Fetched Successfully",
            org,
        });
    } catch (error) {
        console.log(error);
        return res.status(500).send({
            success: false,
            message: "Error IN ORG API",
            error,
        });
    }
}
//GET ORG  FOR HOSPITAL PROFILES
const getOrganisationForHospitalController = async (req, res) => {
    try {
        const hospital = req.body.userId
        const ogrId = await inventoryModel.distinct(" organisation", { hospital });
        //find ORG
        const org = await userModel.find({
            _id: { $in: orgId }
        });
        return res.status(200).send({
            success: true,
            message: " Hospital Org Data Fetched Successfully",
            org,
        });
    } catch (error) {
        console.log(error);
        return res.status(500).send({
            success: false,
            message: "Error IN  hospital ORG API",
            error,
        });
    }
};

module.exports =
{
    createInventoryController,
    getInventoryController,
    getInventoryHospitalController,
    getDonarsController,
    getHospitalController,
    getOrganisationController,
    getOrganisationForHospitalController,
    getRecentInventoryController,
};