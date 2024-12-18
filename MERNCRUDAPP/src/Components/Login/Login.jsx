import React, { useEffect, useState } from 'react'
import { useNavigate } from 'react-router-dom'
import { Form, Button, Container, Row, Col } from 'react-bootstrap';
import "./Login.css"
import { ToastContainer, toast } from "react-toastify";
import Header from '../Header/Header';
import axios from 'axios'

const Login = () => {
    const [email, setEmail] = useState("");
    const [password, setPassword] = useState("");
    const [errors, setErrors] = useState({});
    const [role, setRole] = useState("");

    useEffect(() => {
        localStorage.removeItem("token")
        localStorage.removeItem("admin-user")
      }, []);


    const navigate = useNavigate();

    // const handelInputChange= (event)=>{
    //   const {name,value} = event.target;
    //   setFormData({
    //    ...formData,
    //    [name]:value,
    //   });
    //  }

    const handleError = (err) =>
        toast.error(err, {
            position: "bottom-left",
        });
    const handleSuccess = (msg) =>
        toast.success(msg, {
            position: "bottom-right",
        });

    const handelSubmit = async (e) => {
        e.preventDefault();
        console.log("email", email)
        console.log("password", password)

        const formdata = new FormData();
        formdata.append("email", email)
        formdata.append("password", password)

        document.getElementById('Login_Button').disabled = true
        document.getElementById('Login_Button').innerHTML = 'Signing in...'

        try {
            const  response  = await axios.post("http://localhost:5001/api/user/login", formdata, {
                headers: {
                    "Content-Type": "application/json",
                },
                // withCredentials: true,
            });

            console.log(response.data.message)
            console.log(response.data.success)
            console.log(response.data.token)
            const role = response.data.role
            // setRole(role)
            localStorage.setItem('token', JSON.stringify(response.data.token));

            // navigate("/")
            handleSubsequentRequests();
        }
        catch (error) {
            if (error.response && error.response.data.errors) {
                setErrors(error.response.data.errors);
            }
            console.error(error.message)
            navigate("/login")
        }
        document.getElementById('Login_Button').disabled = false
        document.getElementById('Login_Button').innerHTML = 'Login'
    }

    async function handleSubsequentRequests() {

        const token = JSON.parse(localStorage.getItem('token'));
    
        await axios.get('http://localhost:5001/api/user/getauthuser', {
          headers: {
            'Authorization': `Bearer ${token}`,
          },
        })
          .then(response => {
            const user = response.data.loginuser;
            console.log(user)
            const role = user.role; 
            setRole(role); 
            console.log(role)
            // localStorage.setItem("user-info", JSON.stringify(response.data.loginuser));
            if(role === "admin"){
                localStorage.setItem("admin-user", JSON.stringify(role));
            }
            else{
                localStorage.removeItem("admin-user")
            }
            
            if (role === "user") {
              navigate("/");
            }
            else if (role === "admin") {
              navigate("/dashboard");
            }
          })
          .catch(error => {
            console.error(error.message)
            console.error('Subsequent request error')
            // setLoginstate(false);
          });
      };

    const handleChange = (e) => {
        clearErrorMessage()
    };

    const clearErrorMessage = () => {
        setErrors("");
    };

    return (
        <>
            <Header />
            <div className="d-flex justify-content-center align-items-center vh-100">
                <Container className="justify-content-center">
                    <Row className="justify-content-center">
                        <Col md={6}>
                            <div className="p-4 border rounded shadow-sm bg-white">
                                <h3 className="text-center mb-4">Login</h3>
                                <Form onSubmit={handelSubmit}>
                                    <Form.Group controlId='formBasicEmail' className="mt-3">
                                        <Form.Label>Email</Form.Label>
                                        <Form.Control
                                            type="email"
                                            name="email"
                                            placeholder="Enter Your Email"
                                            value={email}
                                            onChange={(e) => {
                                                setEmail(e.target.value)
                                                handleChange()
                                            }}
                                        />
                                        {errors.email && <div className="error">{errors.email}</div>}
                                    </Form.Group>

                                    <Form.Group controlId='formPassword' className="mt-3">
                                        <Form.Label>Password</Form.Label>
                                        <Form.Control
                                            type="password"
                                            name="password"
                                            placeholder="Enter Your Password"
                                            value={password}
                                            //  onChange={handelInputChange}
                                            onChange={(e) => {
                                                setPassword(e.target.value)
                                                handleChange()
                                            }}
                                        />
                                        {errors.password && <div className="error">{errors.password}</div>}
                                    </Form.Group>

                                    <Button Id="Login_Button" variant="dark" type="submit" className="mt-4 w-100">
                                        Login
                                    </Button>

                                </Form>
                                <ToastContainer />
                            </div>
                        </Col>
                    </Row>
                </Container>
            </div>
        </>
    )
}

export default Login
