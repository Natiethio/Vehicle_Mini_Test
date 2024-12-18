import React, { useState,useEffect } from 'react';
import { Form, Button, Container, Row, Col } from 'react-bootstrap';
import "./User.css"
import { useNavigate } from 'react-router-dom'
import Header from '../Header/Header';
import axios from 'axios';
import { useCookies } from "react-cookie";
import { ToastContainer, toast } from "react-toastify";

const User = () => {

    const navigate = useNavigate();
    const [cookies, removeCookie] = useCookies([]);
    const [username, setUsername] = useState("");

    // useEffect(() => {
    //     const verifyCookie = async () => {
    //       if (!cookies.token) {
    //         navigate("/login");
    //       }
    //       const response = await axios.post(
    //         "http://localhost:5001/api/user/username",
    //         {},
    //         { withCredentials: true }
    //       );
    //       const status = response.data.status;

    //       const user = response.data.user;

    //       setUsername(user);
    //       return status
    //         ? toast(`Hello ${user}`, {
    //             position: "top-right",
    //           })
    //         : (removeCookie("token"), navigate("/login"));
    //     };
    //     verifyCookie();
    //   }, [cookies, navigate, removeCookie]);

    //   const Logout = () => {
    //     removeCookie("token");
    //     navigate("/login");
    //   };

    return (
        <>
            <Header />
            <div className="d-flex justify-content-center align-items-center vh-100">
                <Container className="justify-content-center">
                    <Row className="justify-content-center">
                        <Col md={6}>
                            <div className="p-4 border rounded shadow-sm bg-white">
                                <h3 className="text-center mb-4">Welcome User</h3>
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

export default User
