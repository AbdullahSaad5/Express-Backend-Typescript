import express from "express";
import { Vehicle } from "../models/Vehicle.js";
import { verifyToken } from "../middlewares/verifyToken.js";
const router = express.Router();
router.get("/", verifyToken, async (req, res, next) => {
    const vehicles = await Vehicle.find();
    res.json({
        message: "Vehicles retrieved successfully",
        vehicles,
    });
});
router.post("/", verifyToken, async (req, res, next) => {
    const { vin, make, model, year, color, mileage, price, images } = req.body;
    const alreadyExists = await Vehicle.findOne({ vin });
    if (alreadyExists)
        return res.status(409).json({
            message: "Vehicle already exists",
        });
    try {
        await Vehicle.create({
            vin,
            make,
            model,
            year,
            color,
            mileage,
            price,
            images,
        });
        res.json({
            message: "Vehicle created successfully",
        });
    }
    catch (err) {
        return res.status(500).json({ message: err.message });
    }
});
router.get("/:id", verifyToken, async (req, res, next) => {
    const { id } = req.params;
    try {
        const vehicle = await Vehicle.findById(id);
        if (!vehicle)
            return res.status(404).json({
                message: "Vehicle not found",
            });
        res.json({
            message: "Vehicle retrieved successfully",
            vehicle,
        });
    }
    catch (err) {
        return res.status(500).json({ message: err.message });
    }
});
router.patch("/:id", verifyToken, async (req, res, next) => {
    const { id } = req.params;
    if (!id)
        return res.status(400).json({ message: "Vehicle ID is required" });
    try {
        const vehicle = await Vehicle.findById(id);
        if (!vehicle)
            return res.status(404).json({
                message: "Vehicle not found",
            });
        await Vehicle.updateOne({ _id: id }, {
            $set: req.body,
        });
        res.json({
            message: "Vehicle updated successfully",
        });
    }
    catch (err) {
        return res.status(500).json({ message: err.message });
    }
});
router.delete("/:id", verifyToken, async (req, res, next) => {
    const { id } = req.params;
    if (!id)
        return res.status(400).json({ message: "Vehicle ID is required" });
    try {
        const vehicle = await Vehicle.findById(id);
        if (!vehicle)
            return res.status(404).json({
                message: "Vehicle not found",
            });
        await Vehicle.deleteOne({ _id: id });
        res.json({
            message: "Vehicle deleted successfully",
        });
    }
    catch (err) {
        return res.status(500).json({ message: err.message });
    }
});
export default router;
//# sourceMappingURL=vehicles.js.map