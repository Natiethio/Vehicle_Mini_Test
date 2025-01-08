const mongoose = require("../Configration/dbConfig")

const vehicleSchema = new mongoose.Schema({
    vehicleName: { type: String, required: true },
    model: { type: String, required: true },
    capacity: {type: Number, required:true}, 
    plateNumber: {type: String, required:true},
    code: {type: String, required: true},
    region_code: {type: String, required: true},
    status: {type: String, required: true},
    vehicleImage: { type: String, default: '' },
}, {
    timestamps: true,      
});

const Vehicle = mongoose.model('Vehicle', vehicleSchema);

module.exports = Vehicle;
