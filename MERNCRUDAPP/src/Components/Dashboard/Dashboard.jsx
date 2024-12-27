import React, { useEffect, useState } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import { Form, Button, Container, Row, Col, Spinner, Alert, Table } from "react-bootstrap";
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';
import { faTrashAlt, faEdit, faEnvelope } from '@fortawesome/free-solid-svg-icons';
import axios from 'axios';
import './Dashboard.css';
import Header from '../Header/Header';
import ConfirmDeleteModal from './ConfirmDeleteModel.jsx';
import { format } from 'date-fns';
import 'bootstrap/dist/css/bootstrap.min.css';
import { toast } from "react-toastify";
import "react-toastify/dist/ReactToastify.css";
import { ArrowRight } from 'react-bootstrap-icons';

const Dashboard = () => {
  const [Vehicles, setVehicles] = useState([]);
  const [showModal, setShowModal] = useState(false);
  const [selectedVehicle, setSelectedVehicle] = useState(null);
  const [loading, setLoading] = useState(true);
  const backendURL = import.meta.env.VITE_REACT_APP_BACKEND_BASEURL;
  const backendURLocal = import.meta.env.VITE_REACT_APP_BACKEND_BASEURLocal;
  const [isOffline, setIsOffline] = useState(!navigator.onLine);
  const navigate = useNavigate();

  const formatDate = (dateString) => {
    return format(new Date(dateString), 'EEE-MMM-dd'); // Fri-Dec-13
  };

  useEffect(() => {

    fetchVehicle();

    const handleOnline = () => {
      setIsOffline(false);
      fetchVehicle();
    };

    const handleOffline = () => setIsOffline(true);

    window.addEventListener("online", handleOnline);
    window.addEventListener("offline", handleOffline);

    return () => {
      window.removeEventListener("online", handleOnline);
      window.removeEventListener("offline", handleOffline);
    };
  }, []);

  const fetchVehicle = async () => {

    setLoading(true);
    try {
      const response = await axios.get(`${backendURL}/api/vehicle/getallvehicles`, {
        headers: {
          "Content-Type": "application/json",
        },
        // withCredentials: true 
      })
      const data = response.data;
      setVehicles(data);
      // console.log(data);
    }
    catch (error) {
      console.error("There was an error fetching the vehicles!", error);
    }
    finally {
      setLoading(false);
    }
  }


  const handleDelete = async () => {
    if (!selectedVehicle)
      return;

    if (!navigator.onLine) {
      setShowModal(false);
      toast.error("Unabele to Delete!",
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
      return;
    }

    const id = selectedVehicle._id;

    try {
      const response = await axios.delete(`${backendURL}/api/vehicle/deletevehicle/${id}`, {
        headers: {
          "Content-Type": "application/json",
        },
        // withCredentials: true 
      })

      fetchVehicle();
      setShowModal(false);
      toast.success("Deleted Successfully!",
        {
          position: "top-right",
          autoClose: 4000,
          hideProgressBar: false,
          closeOnClick: true,
          pauseOnHover: true,
          draggable: true,
          style: { backgroundColor: "green", color: "#fff" },
        }
      );

    }

    catch (error) {
      console.error("There was an error deleting the vehicle!", error);
      setShowModal(false);
      toast.error("Unabele to Delete!",
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
  };

  const openModal = (Vehicle) => {
    setSelectedVehicle(Vehicle);
    setShowModal(true);
  };

  const closeModal = () => {
    setSelectedVehicle(null);
    setShowModal(false);
  };


  return (
    <>
      <Header />

      {isOffline && (
        <Alert variant="warning" className="d-flex justify-content-center align-items-center text-center">
          Opps! You appear to be offline. Please check your internet connection.
        </Alert>
      )}

      {loading ? (
        <div className="d-flex justify-content-center align-items-center" style={{ height: "100vh" }}>
          <Spinner animation="border" size='800px' variant="primary" />
        </div>
      ) : Vehicles.length > 0 ? (

        <div className="dashboard-container">
          <div className="header">
            <h1 className="text-center">All Vehicles</h1>
            <h1 className="text-center Arrow">
              <span className='span-Arrow'>
                Slide Table</span><ArrowRight />
              </h1>
          </div>
          <div className="table-responsive">
            <Table striped bordered hover className="dashboard-table">
              <thead>
                <tr>
                  <th>Vehicle Name</th>
                  <th>Model</th>
                  <th>Plate Number</th>
                  <th>Code</th>
                  <th>Regional Code</th>
                  <th>Status</th>
                  <th>Vehicle Image</th>
                  <th>Last Update</th>
                  <th>Actions</th>
                </tr>
              </thead>
              <tbody>
                {Vehicles.map((Vehicle, index) => (
                  <tr key={index}>
                    <td>{Vehicle.vehicleName}</td>
                    <td>{Vehicle.model}</td>
                    <td>{Vehicle.plateNumber}</td>
                    <td>{Vehicle.code}</td>
                    <td>{Vehicle.region_code}</td>
                    <td>{Vehicle.status}</td>
                    <td>
                      <img
                        src={Vehicle.vehicleImage}
                        alt="Vehicle"
                        className="vehicle-image"
                      />
                    </td>
                    <td>{formatDate(Vehicle.updatedAt)}</td>
                    <td className="d-flex justify-content-around action-buttons">
                      <button
                        onClick={() => openModal(Vehicle)}
                        className="btn btn-danger btn-icon btn-sm mr-2"
                      >
                        <FontAwesomeIcon icon={faTrashAlt} />
                      </button>
                      <Link to={`/updatevehicle/${Vehicle._id}`} className="btn btn-success btn-icon btn-sm">
                        <FontAwesomeIcon icon={faEdit} />
                      </Link>
                    </td>
                  </tr>
                ))}
              </tbody>
            </Table>
          </div>
        </div>
      ) : (

        <div className="d-flex justify-content-center align-items-center" style={{ height: "80vh" }}>
          <h1 className="text-muted">No data or Unable to featch</h1>
        </div>
      )}

      {selectedVehicle && (
        <ConfirmDeleteModal
          show={showModal}
          handleClose={closeModal}
          handleDelete={handleDelete}
          VehicleName={`${selectedVehicle.vehicleName} ${selectedVehicle.plateNumber}`}
        />
      )}
    </>
  );
}

export default Dashboard;
