const express = require("express");

const jwt = require('jsonwebtoken');

const vehicleController = require("../controllers/vehicleController");
const upload = require('../Middlewares/upload');

const router = express.Router(); 


router.post(
  "/addvehicle", upload.single("vehicleImage"),vehicleController.addVehicle
);



router.get("/getallvehicles",   vehicleController.getVehicles) 


router.get("/getvehiclebyid/:id", vehicleController.getVehicleById)

router.post("/updatevehicle/:id",
  upload.single("vehicleImage"), 

  async (req, res, next) => {

    next();
  },

  vehicleController.updateVehicle
);

router.delete("/deletevehicle/:id", vehicleController.deleteVehicle);

router.get("/",   (req, res) => {
  res.json("Back End");
})

// router.get("/getauthuser", authMiddlewareupd.authenticateToken, userController.Getauthuser);

// router.post("/logout", authMiddleware.isAuthenticated, userController.Logout);


module.exports = router;