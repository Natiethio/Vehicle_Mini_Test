const Vehicle = require("../models/vehicle")
const jwt = require('jsonwebtoken');
const validator = require('validator');
const cookieParser = require("cookie-parser");
require('dotenv').config();

const fs = require("fs");
const path = require("path");

class vehicleService {

  async getAllVehicles() {
    return await Vehicle.find();
  }

  async getVehicleById(vehicleId) {
    return await Vehicle.findById(vehicleId)
  }


  async addNewVehicle(vehicleName, model, plateNumber, capacity, code, region_code, status, vehicleImage) {
    const errors = {};

    // Basic validations
    if (!vehicleName) errors.vehicleName = "Vehicle name is required";
    if (!plateNumber) errors.plateNumber = "Plate number is required";
    if (!model) errors.model = "Model required";
    if (!capacity) errors.capacity = "Capacity is required";
    if (!code) errors.code = "Code is required";
    if (!region_code) errors.region_code = "Regional Code is required";
    if (!status) errors.status = "Vehicle Status required";

    // if (Object.keys(errors).length > 0) {
    //   throw { validationErrors: errors };
    // }


    if (plateNumber && plateNumber.length !== 6) {
      errors.plateNumberlen = "Must be exactly 6 characters";
    }

    if (!errors.plateNumber && await Vehicle.findOne({ plateNumber })) {
      errors.plateNumber = 'Plate number already exists';
    }

    if (capacity && capacity < 2) {
      errors.capacitynum = "Must be at least 2";
    }

    if (Object.keys(errors).length > 0) {
      throw { validationErrors: errors };
    }

    let vehicleImageName = null;
    if (vehicleImage) {
      const uniqueSuffix = `${Date.now()}-${Math.round(Math.random())}`;
      vehicleImageName = `${vehicleName}_${plateNumber}_${new Date().toISOString().split('T')[0]}_${uniqueSuffix}${path.extname(vehicleImage.originalname)}`;

      // Ensure the uploads directory exists
      const uploadPath = path.join(__dirname, "../../uploads");
      if (!fs.existsSync(uploadPath)) {
        fs.mkdirSync(uploadPath, { recursive: true });
      }

      // Save the file
      const fullFilePath = path.join(uploadPath, vehicleImageName);
      fs.writeFileSync(fullFilePath, vehicleImage.buffer);
    }
    else {
      vehicleImageName = "Profile-Default_Car.png";
    }

    // Save vehicle to the database
    const Addvehicle = new Vehicle({
      vehicleName,
      model,
      capacity,
      plateNumber,
      code,
      region_code,
      status,
      vehicleImage: vehicleImageName,
    });

    return await Addvehicle.save();
  }


  async updateVehicle(vehicleId, updateData, vehicleImage) {
    const errors = {};


    // Destructure fields from updateData
    const { vehicleName, model, plateNumber, capacity, code, region_code, status } = updateData;


    if (!vehicleName) errors.vehicleName = "Vehicle name is required";
    if (!plateNumber) errors.plateNumber = "Plate number is required";
    if (!model) errors.model = "Model required";
    if (!capacity) errors.capacity = "Capacity is required";
    if (!code) errors.code = "Code is required";
    if (!region_code) errors.region_code = "Regional Code is required";
    if (!status) errors.status = "Vehicle Status required";

    if (plateNumber && plateNumber.length !== 6) {
      errors.plateNumberlen = "Must be exactly 6 characters";
    }



    if (capacity && capacity < 2) {
      errors.capacitynum = "Must be at least 2";
    }

    // Fetch the existing vehicle for comparison
    const existingVehicle = await Vehicle.findById(vehicleId);

    if (plateNumber !== existingVehicle.plateNumber) {
      if (!errors.plateNumber && await Vehicle.findOne({ plateNumber })) {
        errors.plateNumber = 'Plate number already exists';
      }
    }

    if (Object.keys(errors).length > 0) {
      throw { validationErrors: errors };
    }

    if (!existingVehicle) {
      throw { message: "Vehicle not found" };
    }


    if (Object.keys(errors).length > 0) {
      throw { validationErrors: errors };
    }

    // Handle vehicle image logic
    let vehicleImageName = existingVehicle.vehicleImage;
    if (vehicleImage) {

      // Generate a new vehicle image name
      const uniqueSuffix = `${Date.now()}-${Math.round(Math.random())}`;
      vehicleImageName = `${vehicleName}_${plateNumber}_${new Date().toISOString().split("T")[0]}_${uniqueSuffix}${path.extname(vehicleImage.originalname)}`;
      console.log(vehicleImageName)

      // Save the new image to the uploads folder
      const uploadPath = path.join(__dirname, "../../uploads");
      if (!fs.existsSync(uploadPath)) {
        fs.mkdirSync(uploadPath, { recursive: true });
      }
      const fullFilePath = path.join(uploadPath, vehicleImageName);
      fs.writeFileSync(fullFilePath, vehicleImage.buffer);

      // Delete the old vehicle image (if it exists and is not a default image)
      if (existingVehicle.vehicleImage && !existingVehicle.vehicleImage.startsWith("Profile-Default-Car")) {
        const oldFilePath = path.join(uploadPath, existingVehicle.vehicleImage);
        if (fs.existsSync(oldFilePath)) {
          fs.unlinkSync(oldFilePath);
        }
      }
    }

    updateData.vehicleImage = vehicleImageName;
    return await Vehicle.findByIdAndUpdate(vehicleId, updateData, { new: true });
  }


  async deleteVehicle(vehicleId) {

    const existingVehicle = await Vehicle.findById(vehicleId);

    if (!existingVehicle) {
      throw { message: "Vehicle not found" };
    }

    const uploadPath = path.join(__dirname, "../../uploads");
    if (!fs.existsSync(uploadPath)) {
      fs.mkdirSync(uploadPath, { recursive: true });
    }

    if (existingVehicle.vehicleImage && !existingVehicle.vehicleImage.startsWith("Profile-Default")) {
      const oldFilePath = path.join(uploadPath, existingVehicle.vehicleImage);
      if (fs.existsSync(oldFilePath)) {
        fs.unlinkSync(oldFilePath);
      }
    }

    return await Vehicle.findByIdAndDelete(vehicleId)
  }
};

module.exports = new vehicleService();






