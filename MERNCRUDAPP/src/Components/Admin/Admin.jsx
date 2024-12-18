import React, { useState,useEffect } from 'react';
import { Form, Button, Container, Row, Col } from 'react-bootstrap';
import "./Admin.css"
import { useNavigate } from 'react-router-dom'
import Header from '../Header/Header';
import axios from 'axios';
import { useCookies } from "react-cookie";
import { ToastContainer, toast } from "react-toastify";

const Admin = () => {
    const navigate = useNavigate();
    const [cookies, removeCookie] = useCookies([]);
    const [adminname, setAdminname] = useState("");
  return (
    <>
    <Header />
    <div className="d-flex justify-content-center align-items-center vh-100">
        <Container className="justify-content-center">
            <Row className="justify-content-center">
                <Col md={6}>
                    <div className="p-4 border rounded shadow-sm bg-white">
                        <h3 className="text-center mb-4">Welcome Admin</h3>
                        {/* <button onClick={Logout}>LOGOUT</button> */}
                    </div>
                    <ToastContainer />
                </Col>
            </Row>
        </Container>
    </div>
</>
  )
}

export default Admin
