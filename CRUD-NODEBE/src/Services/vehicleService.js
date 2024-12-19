const Vehicle = require("../models/vehicle")
const jwt = require('jsonwebtoken');
const validator = require('validator');
const cookieParser = require("cookie-parser");
const cloudinary = require("../Configration/cloudinaryConfig");
const { Readable } = require("stream");

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

    let vehicleImageUrl = null;
    if (vehicleImage) {
      const uniqueSuffix = `${Date.now()}-${Math.round(Math.random())}`;
      const imagePublicId = `${vehicleName}_${plateNumber}_${new Date().toISOString().split('T')[0]}_${uniqueSuffix}`;

      // Upload file from buffer using Cloudinary
      const stream = Readable.from(vehicleImage.buffer); // Convert buffer to a readable stream
      const uploadResult = await new Promise((resolve, reject) => {
        const uploadStream = cloudinary.uploader.upload_stream(
          {
            folder: "vehicle-uploads",
            public_id: imagePublicId,
            overwrite: true,
          },
          (error, result) => {
            if (error) {
              return reject(error);
            }
            resolve(result);
          }
        );
        stream.pipe(uploadStream);
      });

      vehicleImageUrl = uploadResult.secure_url;
    } else {
      vehicleImageUrl = "https://res.cloudinary.com/dgrj6cljo/image/upload/v1734642788/Profile-Default_Car_g2efjy.png";
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
      vehicleImage: vehicleImageUrl,
    });

    return await Addvehicle.save();
  }


  // async updateVehicle(vehicleId, updateData, vehicleImage) {
  //   const errors = {};


  //   const { vehicleName, model, plateNumber, capacity, code, region_code, status } = updateData;


  //   if (!vehicleName) errors.vehicleName = "Vehicle name is required";
  //   if (!plateNumber) errors.plateNumber = "Plate number is required";
  //   if (!model) errors.model = "Model required";
  //   if (!capacity) errors.capacity = "Capacity is required";
  //   if (!code) errors.code = "Code is required";
  //   if (!region_code) errors.region_code = "Regional Code is required";
  //   if (!status) errors.status = "Vehicle Status required";

  //   if (plateNumber && plateNumber.length !== 6) {
  //     errors.plateNumberlen = "Must be exactly 6 characters";
  //   }



  //   if (capacity && capacity < 2) {
  //     errors.capacitynum = "Must be at least 2";
  //   }

  //   const existingVehicle = await Vehicle.findById(vehicleId);

  //   if (plateNumber !== existingVehicle.plateNumber) {
  //     if (!errors.plateNumber && await Vehicle.findOne({ plateNumber })) {
  //       errors.plateNumber = 'Plate number already exists';
  //     }
  //   }

  //   if (Object.keys(errors).length > 0) {
  //     throw { validationErrors: errors };
  //   }

  //   if (!existingVehicle) {
  //     throw { message: "Vehicle not found" };
  //   }


  //   if (Object.keys(errors).length > 0) {
  //     throw { validationErrors: errors };
  //   }

  //   let vehicleImageName = existingVehicle.vehicleImage;
  //   if (vehicleImage) {

  //     const uniqueSuffix = `${Date.now()}-${Math.round(Math.random())}`;
  //     vehicleImageName = `${vehicleName}_${plateNumber}_${new Date().toISOString().split("T")[0]}_${uniqueSuffix}${path.extname(vehicleImage.originalname)}`;
  //     console.log(vehicleImageName)

  //     const uploadPath = path.join(__dirname, "../../uploads");
  //     if (!fs.existsSync(uploadPath)) {
  //       fs.mkdirSync(uploadPath, { recursive: true });
  //     }
  //     const fullFilePath = path.join(uploadPath, vehicleImageName);
  //     fs.writeFileSync(fullFilePath, vehicleImage.buffer);


  //     if (existingVehicle.vehicleImage && !existingVehicle.vehicleImage.startsWith("Profile-Default-Car")) {
  //       const oldFilePath = path.join(uploadPath, existingVehicle.vehicleImage);
  //       if (fs.existsSync(oldFilePath)) {
  //         fs.unlinkSync(oldFilePath);
  //       }
  //     }
  //   }

  //   updateData.vehicleImage = vehicleImageName;
  //   return await Vehicle.findByIdAndUpdate(vehicleId, updateData, { new: true });
  // }


  // async deleteVehicle(vehicleId) {

  //   const existingVehicle = await Vehicle.findById(vehicleId);

  //   if (!existingVehicle) {
  //     throw { message: "Vehicle not found" };
  //   }

  //   const uploadPath = path.join(__dirname, "../../uploads");
  //   if (!fs.existsSync(uploadPath)) {
  //     fs.mkdirSync(uploadPath, { recursive: true });
  //   }

  //   if (existingVehicle.vehicleImage && !existingVehicle.vehicleImage.startsWith("Profile-Default")) {
  //     const oldFilePath = path.join(uploadPath, existingVehicle.vehicleImage);
  //     if (fs.existsSync(oldFilePath)) {
  //       fs.unlinkSync(oldFilePath);
  //     }
  //   }

  //   return await Vehicle.findByIdAndDelete(vehicleId)
  // }


  async updateVehicle(vehicleId, updateData, vehicleImage) {
    const errors = {};
    const { vehicleName, model, plateNumber, capacity, code, region_code, status } = updateData;

    // Basic validations
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

    const existingVehicle = await Vehicle.findById(vehicleId);
    if (!existingVehicle) {
      throw { message: "Vehicle not found" };
    }

    if (plateNumber !== existingVehicle.plateNumber) {
      if (!errors.plateNumber && await Vehicle.findOne({ plateNumber })) {
        errors.plateNumber = "Plate number already exists";
      }
    }

    // Throw validation errors
    if (Object.keys(errors).length > 0) {
      throw { validationErrors: errors };
    }

   
    let vehicleImageUrl = existingVehicle.vehicleImage;
    if (vehicleImage) {
      
      if (vehicleImageUrl && !vehicleImageUrl.includes("Profile-Default")) {
        try {
          const publicIdMatch = vehicleImageUrl.match(/\/([^/]+)\.[a-z]+$/i);
          const publicId = publicIdMatch ? publicIdMatch[1] : null;

          if (publicId) {
            await cloudinary.uploader.destroy(`vehicle-uploads/${publicId}`);
            console.log(`Old image ${publicId} deleted from Cloudinary`);
          }
        } catch (error) {
          console.error("Error deleting old image from Cloudinary:", error.message);
        }
      }

      
      const uniqueSuffix = `${Date.now()}-${Math.round(Math.random())}`;
      const imagePublicId = `${vehicleName}_${plateNumber}_${new Date().toISOString().split("T")[0]}_${uniqueSuffix}`;

      const stream = Readable.from(vehicleImage.buffer); 
      const uploadResult = await new Promise((resolve, reject) => {
        const uploadStream = cloudinary.uploader.upload_stream(
          {
            folder: "vehicle-uploads",
            public_id: imagePublicId,
            overwrite: true,
          },
          (error, result) => {
            if (error) return reject(error);
            resolve(result);
          }
        );
        stream.pipe(uploadStream);
      });

      vehicleImageUrl = uploadResult.secure_url; 
    }

    
    updateData.vehicleImage = vehicleImageUrl;
    return await Vehicle.findByIdAndUpdate(vehicleId, updateData, { new: true });
  }


  async deleteVehicle(vehicleId) {
    const existingVehicle = await Vehicle.findById(vehicleId);

    if (!existingVehicle) {
      throw { message: "Vehicle not found" };
    }


    if (
      existingVehicle.vehicleImage &&
      !existingVehicle.vehicleImage.includes("Profile-Default")
    ) {
      try {
        const publicIdMatch = existingVehicle.vehicleImage.match(/\/([^/]+)\.[a-z]+$/i);
        const publicId = publicIdMatch ? publicIdMatch[1] : null;


        if (publicId) {
          await cloudinary.uploader.destroy(`vehicle-uploads/${publicId}`, {
            invalidate: true, // Optional: Invalidate cached versions of the image
          });
          console.log(`Image ${publicId} deleted from Cloudinary`);
        }
      } catch (error) {
        console.error("Error deleting image from Cloudinary:", error.message);
      }
    }


    return await Vehicle.findByIdAndDelete(vehicleId);
  }
};

module.exports = new vehicleService();






