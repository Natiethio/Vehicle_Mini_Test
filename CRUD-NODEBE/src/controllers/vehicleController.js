const vehicleService = require("../Services/vehicleService");
const cookieParser = require("cookie-parser");
require('dotenv').config();
const session = require('express-session');
const fs = require("fs");
const path = require("path");

class vehicleController {

  async getVehicles(req, res) {
    try {
      const allvehicles = await vehicleService.getAllVehicles();
      res.json(allvehicles);
    }
    catch (error) {
      res.status(500).json({ error: error.message })
    }
  }

  async getVehicleById(req, res) {
    const vehicleId = req.params.id

    try {
      const vehicle = await vehicleService.getVehicleById(vehicleId);
      if (!vehicle) {
        return res.status(404).json({ error: "Vehicle not found" })
      }
      res.json(vehicle);
    }
    catch (error) {
      res.status(500).json({ error: error.message })
    }
  }

  async updateVehicle(req, res) {

    const vehicleId = req.params.id
    const updateData = req.body;
    const vehicleImage = req.file;

    try {
      const updatedvehicle = await vehicleService.updateVehicle(vehicleId, updateData, vehicleImage)

      if (!updatedvehicle)
        return res.status(404).json({ error: "Vehicle not found" })
      res.json(updatedvehicle);
    }

    catch (error) {
      if (error.validationErrors) {
        return res.status(400).json({ errors: error.validationErrors });
      }
      res.status(500).json({ error: error.message })
    }
  }

  async deleteVehicle(req, res) {
    const vehicleId = req.params.id
    try {
      const deletevehicle = await vehicleService.deleteVehicle(vehicleId)
      
      if (!deletevehicle){
        return res.status(404).json({ error: "Vehicle not found" })
      }
        
      res.json({ message: "Vehicle deleted succesffully", vehicle: deletevehicle });
    }
    catch (error) {
      res.status(500).json({ error: error.message })
    }
  }

  async addVehicle(req, res, next) {
    try {
      const { vehicleName,model, plateNumber, capacity, code, region_code, status } = req.body;

      const vehicleImage = req.file || null; 

      // console.log("Received File:", req.file); 

      const newvehicle = await vehicleService.addNewVehicle(vehicleName, model, plateNumber, capacity, code, region_code, status, vehicleImage)

      res.status(200).json({ message: "Vehicle Added Successfully", success: true, newvehicle });

    }
    catch (error) {
      console.log(error)
      if (error.validationErrors) {
        return res.status(400).json({ errors: error.validationErrors });
      }
      res.status(500).json({ error: error.message })
    }
  }
};

module.exports = new vehicleController();