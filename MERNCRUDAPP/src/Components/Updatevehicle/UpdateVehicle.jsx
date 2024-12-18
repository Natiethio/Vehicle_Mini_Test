import React, { useEffect, useState } from 'react'
import { useNavigate } from 'react-router-dom'
import { useParams } from 'react-router-dom';
import { Form, Button, Container, Row, Col, Spinner } from 'react-bootstrap';
import "./UpdateVehicle.css"
import Header from '../Header/Header';
import { toast } from "react-toastify";
import "react-toastify/dist/ReactToastify.css";
import axios from 'axios'

const UpdateVehicle = () => {

    const { id } = useParams();
    const [Vehicle, setVehicle] = useState("");
    const [vehicleName, setVehicleName] = useState("");
    const [platenumber, setPlateNumber] = useState("");
    const [model, setModel] = useState("");
    const [code, setCode] = useState("");
    const [regionlcode, setRegionalCode] = useState("");
    const [capacity, setCapacity] = useState("");
    const [status, setStatus] = useState("")
    const [loading, setLoading] = useState(true);
    const [vehicleImage, setVehicleImage] = useState("");
    const [Image, setImage] = useState(null);
    const [errors, setErrors] = useState({});
    const [initialValues, setInitialValues] = useState({}); 

    const navigate = useNavigate();

    useEffect(() => {
        fetchVehicleUPD();
    }, [id]);


    const fetchVehicleUPD = async () => {
        setLoading(true);
        try {
            const response = await axios.get(`http://localhost:5000/api/vehicle/getvehiclebyid/${id}`, {
                headers: {
                    "Content-Type": "multipart/form-data",
                },
            })
            const Vehiclenew = response.data;
            setVehicle(response.data)
            setVehicleName(Vehiclenew.vehicleName);
            setPlateNumber(Vehiclenew.plateNumber);
            setStatus(Vehiclenew.status)
            setModel(Vehiclenew.model);
            setCapacity(Vehiclenew.capacity);
            setCode(Vehiclenew.code)
            setRegionalCode(Vehiclenew.region_code)
            setVehicleImage(Vehiclenew.vehicleImage)

            // setInitialValues({
            //     vehicleName: Vehiclenew.vehicleName,
            //     plateNumber: Vehiclenew.plateNumber,
            //     model: Vehiclenew.model,
            //     capacity: Vehiclenew.capacity,
            //     code: Vehiclenew.code,
            //     regionalcode: Vehiclenew.region_code,
            //     status: Vehiclenew.status,
            // });

        } catch (error) {
            console.error("There was an error fetching the Vehicle upd!", error);
        } finally {
            setLoading(false);
        }
    }

    const handleFileChange = (e) => {
        setImage(e.target.files[0]);
    };

    const handleChange = (e) => {
        clearErrorMessage()
    };

    // const hasChanges = (e) => {
    //     vehicleName !== initialValues.vehicleName ||
    //     platenumber !== initialValues.plateNumber ||
    //     model !== initialValues.model ||
    //     capacity !== initialValues.capacity ||
    //     code !== initialValues.code ||
    //     regionlcode !== initialValues.region_code ||
    //     status !== initialValues.status 
    // };

    const handelUpdate = async (e) => {
        e.preventDefault();


        console.log("Vehicle Name:", vehicleName)
        console.log("Plate Number:", platenumber)
        console.log("status:", status)

        const formdata = new FormData();
        formdata.append("vehicleName", vehicleName)
        formdata.append("plateNumber", platenumber)
        formdata.append("model", model)
        formdata.append("capacity", capacity)
        formdata.append("code", code)
        formdata.append("region_code", regionlcode)
        formdata.append("status", status)

        if (Image) {
            formdata.append("vehicleImage", Image);
        }

        console.log(formdata)


        try {
            const response = await axios.post(`http://localhost:5000/api/vehicle/updatevehicle/${id}`, formdata, {
                headers: {
                    "Content-Type": "multipart/form-data",
                },
                // withCredentials: true
            })

            toast.success("Updated successfully!", {
                position: "top-right",
                autoClose: 1500,
                hideProgressBar: false,
                closeOnClick: true,
                pauseOnHover: true,
                draggable: true,
                style: { backgroundColor: "green", color: "#fff" },
            });
            setTimeout(() => {
                navigate("/");
            }, 1500);

        }
        catch (error) {
            if (error.response && error.response.data.errors) {
                setErrors(error.response.data.errors);
            }
        }
    }

    const clearErrorMessage = () => {
        setErrors("");
    };

    return (
        <>
            <Header />

            <Container className="mt-5">
                <Row className="justify-content-center">
                    <Col md={6}>

                        {loading ? (

                            <div className="d-flex justify-content-center align-items-center" style={{ height: "100vh" }}>
                                <Spinner animation="border" size='800px' variant="primary" />
                            </div>
                        ) : Vehicle ? (
                            <div className="p-4 border rounded shadow-sm bg-white">
                                <h3 className="text-center mb-4">Update Vehicle</h3>
                                <Form onSubmit={handelUpdate}>
                                    <div className='d-flex mt-3 gap-5'>
                                        <Form.Group controlId='formBasicvehicleName' className="">
                                            <Form.Label>Vehicle Name</Form.Label>
                                            <Form.Control
                                                type="text"
                                                name="vehicleName"
                                                placeholder="Enter Vehicle Name"
                                                value={vehicleName}
                                                onChange={(e) => {
                                                    setVehicleName(e.target.value)
                                                    handleChange()
                                                }}
                                            />
                                            {errors.vehicleName && <div className="error">{errors.vehicleName}</div>}
                                        </Form.Group>

                                        <Form.Group controlId='formBasicModel' className="">
                                            <Form.Label>Model</Form.Label>
                                            <Form.Control
                                                type="text"
                                                name="model"
                                                placeholder="Enter Vehicle Model"
                                                value={model}
                                                onChange={(e) => {
                                                    setModel(e.target.value)
                                                    handleChange()
                                                }}
                                            />
                                            {errors.model && <div className="error">{errors.model}</div>}
                                        </Form.Group>

                                    </div>

                                    <div className='d-flex mt-3 gap-5'>
                                        <Form.Group controlId='formBasicPlateNumber' className="">
                                            <Form.Label>Plate Number</Form.Label>
                                            <Form.Control
                                                type="text"
                                                name="platenumber"
                                                placeholder="Enter Plate Number"
                                                value={platenumber}
                                                onChange={(e) => {
                                                    setPlateNumber(e.target.value)
                                                    handleChange()
                                                }}
                                            />
                                            {errors.plateNumber && <div className="error">{errors.plateNumber}</div>}
                                        </Form.Group>

                                        <Form.Group controlId="formCode" className="code">
                                            <Form.Label>Code</Form.Label>
                                            <Form.Control
                                                as="select"
                                                name="code"
                                                placeholder="Enter Code"
                                                value={code}
                                                onChange={(e) => {
                                                    setCode(e.target.value)
                                                    handleChange()
                                                }}
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
                                    </div>

                                    <div className='d-flex mt-3 gap-5'>
                                        <Form.Group controlId="formRegion" className="region">
                                            <Form.Label>Regional Code</Form.Label>
                                            <Form.Control
                                                as="select"
                                                name="region_code"
                                                value={regionlcode}
                                                onChange={(e) => {
                                                    setRegionalCode(e.target.value)
                                                    handleChange()
                                                }}>
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

                                        <Form.Group controlId="formCapacity" className="">
                                            <Form.Label>Capacity</Form.Label>
                                            <Form.Control
                                                type="number"
                                                placeholder="Enter vehicle Capacity"
                                                name="capacity"
                                                value={capacity}
                                                onChange={(e) => {
                                                    setCapacity(e.target.value)
                                                    handleChange()
                                                }}
                                            // required
                                            />
                                            {errors.capacity && <div className="error">{errors.capacity}</div>}
                                            {errors.capacitynum && <div className="error">{errors.capacity ? " " : errors.capacitynum}</div>}
                                        </Form.Group>


                                    </div>

                                    <Form.Group controlId="formVehicleStatus" className='mt-3'>
                                        <Form.Label>Vehicle Status</Form.Label>
                                        <Form.Control
                                            as="select"
                                            name="status"
                                            value={status}
                                            onChange={(e) => {
                                                setStatus(e.target.value)
                                                handleChange()
                                            }}
                                        >
                                            <option value="" disabled>Select Status</option>
                                            <option value="Active">Active</option>
                                            <option value="Under_Maintenance">Under Maintenance</option>
                                            <option value="Out_of_Service">Out of Service</option>
                                        </Form.Control>
                                        {errors.status && <div className="error">{errors.status}</div>}
                                    </Form.Group>


                                    <div className="vehicle-img">
                                        <p className='vehicle-Image'>Vehicle Image:</p>
                                        <img
                                            src={
                                                // Vehicle.profileImage
                                                `http://localhost:5000/uploads/${vehicleImage}`
                                            }
                                            alt="Profile"
                                            className="vehicle-image-upd"
                                        />
                                    </div>

                                    <Form.Group controlId="formFile" className="mt-3">
                                        <Form.Label>Vehicle Image(Max 5MB)</Form.Label>
                                        <Form.Control type="file"
                                            name='vehicle_pic'
                                            onChange={handleFileChange}
                                        />
                                        {errors.vehicleImage && (
                                            <div className="error">{errors.vehicleImage}</div>
                                        )}
                                    </Form.Group>


                                    <Button variant="dark" type="submit" className="w-100 mt-5">
                                        Update Vehicle
                                    </Button>

                                </Form>
                            </div>
                        ) : (

                            <div className="d-flex justify-content-center align-items-center" style={{ height: "80vh" }}>
                                <h1 className="text-muted">No Vehicles Found</h1>
                            </div>
                        )}
                    </Col>
                </Row>
            </Container>
        </>
    )
}

export default UpdateVehicle
