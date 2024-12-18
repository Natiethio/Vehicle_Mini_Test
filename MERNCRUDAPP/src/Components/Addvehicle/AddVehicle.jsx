import React, { useState } from 'react';
import { Form, Button, Container, Row, Col, Spinner } from 'react-bootstrap';
import "./Addvehicle.css"
import { useNavigate } from 'react-router-dom'
import { toast } from "react-toastify";
import "react-toastify/dist/ReactToastify.css";
import Header from '../Header/Header';
import axios from 'axios';

const AddVehicle = () => {

    const navigate = useNavigate();
    const [errors, setErrors] = useState({});
    const [Image, setImage] = useState(null);
    const [formData, setFormData] = useState({
        vehicleName: '',
        model: '',
        capacity: 0,
        plateNumber: '',
        region_code: '',
        code: '',
        status: '',
    });

    const handleChange = (e) => {
        clearErrorMessage()
        setFormData({ ...formData, [e.target.name]: e.target.value });
    };

    const clearErrorMessage = () => {
        setErrors("");
    };

    const handleFileChange = (e) => {
        setImage(e.target.files[0]);
    };

    // Vehicle-Mini

    const handleSubmit = async (e) => {
        e.preventDefault();
        document.getElementById('Submit_Button').disabled = true
        document.getElementById('Submit_Button').innerHTML = 'Registering...'
        const formDataToSend = new FormData();
        Object.entries(formData).forEach(([key, value]) => {
            formDataToSend.append(key, value);
        });
        if (Image) {
            formDataToSend.append("vehicleImage", Image);
        }

        console.log(formDataToSend)

        try {
            const response = await axios.post(
                "http://localhost:5000/api/vehicle/addvehicle",
                formDataToSend,
                {
                    headers: {
                        "Content-Type": "multipart/form-data",
                    },
                }
            );
            toast.success("Vehicle added successfully!", {
                position: "top-right",
                autoClose: 2000,
                hideProgressBar: false,
                closeOnClick: true,
                pauseOnHover: true,
                draggable: true,
                style: { backgroundColor: "green", color: "#fff" },
            });
            setTimeout(() => {
                navigate("/");
            }, 2000);

        } catch (error) {
            if (error.response && error.response.data.errors) {
                setErrors(error.response.data.errors);
            }
            // console.error(error.message);
            toast.error("Something went wrong!",
                {
                    position: "top-right",
                    autoClose: 4000,
                    hideProgressBar: false,
                    closeOnClick: true,
                    pauseOnHover: true,
                    draggable: true,
                    style: { backgroundColor: "red", color: "#fff" },
                }
            );
        }
        finally {
            document.getElementById("Submit_Button").disabled = false;
            document.getElementById("Submit_Button").innerHTML = "Register";
        }
    };

    return (
        <>
            <Header />

            <Container className="mt-5">
                <Row className="justify-content-center">
                    <Col md={6}>
                        <div className="p-4 border rounded shadow-sm bg-white">
                            <h3 className="text-center mb-4">Add New Vehicle</h3>
                            <Form onSubmit={handleSubmit}>
                                <div className='d-flex gap-5 '>
                                    <Form.Group controlId="formVehicleName">
                                        <Form.Label>Vehicle Name</Form.Label>
                                        <Form.Control
                                            type="text"
                                            placeholder="Enter vehicle name"
                                            name="vehicleName"
                                            value={formData.vehicleName}
                                            onChange={handleChange}
                                        // required
                                        />
                                        {errors.vehicleName && <div className="error">{errors.vehicleName}</div>}
                                    </Form.Group>

                                    <Form.Group controlId="formModel" className="">
                                        <Form.Label>Model</Form.Label>
                                        <Form.Control
                                            type="text"
                                            placeholder="Enter vehicle Model"
                                            name="model"
                                            value={formData.model}
                                            onChange={handleChange}
                                        // required
                                        />
                                        {errors.model && <div className="error">{errors.model}</div>}
                                    </Form.Group>
                                </div>
                                <div className='d-flex gap-5 mt-3'>
                                    <Form.Group controlId="formCapacity" className="">
                                        <Form.Label>Capacity</Form.Label>
                                        <Form.Control
                                            type="number"
                                            placeholder="Enter vehicle Capacity"
                                            name="capacity"
                                            value={formData.capacity}
                                            onChange={handleChange}
                                        // required
                                        />
                                        {errors.capacity && <div className="error">{errors.capacity}</div>}
                                        {errors.capacitynum && <div className="error">{errors.capacity ? " " : errors.capacitynum}</div>}
                                    </Form.Group>


                                    <Form.Group controlId="formPlateNumber" className="">
                                        <Form.Label>Plate Number</Form.Label>
                                        <Form.Control
                                            type="text"
                                            placeholder="Enter plate number"
                                            name="plateNumber"
                                            value={formData.plateNumber}
                                            onChange={handleChange}
                                        // required
                                        />
                                        {errors.plateNumber && <div className="error">{errors.plateNumber}</div>}
                                        {errors.plateNumberlen && <div className="error">{errors.plateNumber ? " " : errors.plateNumberlen}</div>}
                                    </Form.Group>
                                </div>

                                <div className='d-flex gap-5 mt-3'>
                                    <Form.Group controlId="formCode" className="code">
                                        <Form.Label>Code</Form.Label>
                                        <Form.Control
                                            as="select"
                                            placeholder="Enter Code"
                                            name="code"
                                            value={formData.code}
                                            onChange={handleChange}
                                        >
                                            <option value="" disabled>Select Code</option>
                                            <option value="1">1</option>
                                            <option value="2">2</option>
                                            <option value="3">3</option>
                                            <option value="4">4</option>
                                            <option value="5">5</option>
                                            <option value="UN / የተመ">UN / የተመ</option>
                                            <option value="AU / አሕ">AU / አሕ</option>
                                            <option value="ኢት /ተላላፊ">ኢት / ተላላፊ</option>
                                            <option value="ፖሊስ">ፖሊስ</option>
                                        </Form.Control>
                                        {errors.code && <div className="error">{errors.code}</div>}
                                    </Form.Group>


                                    <Form.Group controlId="formRegion" className="region">
                                        <Form.Label>Regional Code</Form.Label>
                                        <Form.Control
                                            as="select"
                                            name="region_code"
                                            value={formData.region_code}
                                            onChange={handleChange}>
                                            <option value="" disabled>Select Region Code</option>
                                            <option value="ኢት / ET">ኢት / ET</option>
                                            <option value="አአ / AA">አአ / AA</option>
                                            <option value="አፋ / AF">አፋ / AF</option>
                                            <option value="አማ / AM">አማ / AM</option>
                                            <option value="ቤጉ / BG">ቤጉ / BG</option>
                                            <option value="አአ / AA">ድሬ / DR</option>
                                            <option value="ድሬ / DR">ድሬ / DR</option>
                                            <option value="ጋም / GM	">ጋም / GM</option>
                                            <option value="ሐረ / HR">ሐረ / HR</option>
                                            <option value="ኦሮ / OR">ኦሮ / OR</option>
                                            <option value="ሶማ / SM">ሶማ / SM</option>
                                            <option value="AU / አሕ">AU / አሕ</option>
                                            <option value="ኢት /ተላላፊ">ኢት / ተላላፊ</option>
                                        </Form.Control>
                                        {errors.region_code && <div className="error">{errors.region_code}</div>}
                                    </Form.Group>
                                </div>


                                <Form.Group controlId="formVehicleStatus" className="mt-3">
                                    <Form.Label>Vehicle Status</Form.Label>
                                    <Form.Control
                                        as="select"
                                        name="status"
                                        value={formData.status}
                                        onChange={handleChange}
                                    >
                                        <option value="" disabled>Select Vehicle Status</option>
                                        <option value="Active">Active</option>
                                        <option value="Under_Maintenance">Under Maintenance</option>
                                        <option value="Out_of_Service">Out of Service</option>
                                    </Form.Control>
                                    {errors.status && <div className="error">{errors.status}</div>}
                                </Form.Group>


                                <Form.Group controlId="formFile" className="mt-3">
                                    <Form.Label>Vehicle Image(Max 5MB)</Form.Label>
                                    <Form.Control type="file"
                                        name='vehicleImage'
                                        onChange={handleFileChange} />
                                    {errors.vehicleImage && (
                                        <div className="error">{errors.vehicleImage}</div>
                                    )}
                                </Form.Group>


                                <Button variant="dark" Id="Submit_Button" type="submit" className="mt-4 w-100">
                                    Add
                                </Button>

                              </Form>
                            {/* <ToastContainer /> */}
                        </div>
                    </Col>
                </Row>
            </Container>
        </>
    )
}

export default AddVehicle
