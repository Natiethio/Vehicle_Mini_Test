import { Navbar, Nav, Container } from 'react-bootstrap';
import { Link, useNavigate } from 'react-router-dom';
import "./Header.css"
function Header() {

  const navigate = useNavigate()

  // const handleLogout = () => {
  //  localStorage.removeItem("token")
  //  localStorage.removeItem("admin-user")
  //  navigate("/login")
  // }

  return (
    <div>
      <Navbar bg= "dark"  className="navbar"  variant="dark">
        <Container>
          <Navbar.Brand as={Link} to= "/" className="nav-brand">
            DashBoard
          </Navbar.Brand>

          <Nav className="ml-auto navbar-wrapper">
                <Nav.Link as={Link} to="/" className="nav-link">Home</Nav.Link>
                <Nav.Link as={Link} to="/add_vehicle">Add Vehicle</Nav.Link>
                {/* <Nav.Link className='nav-link' onClick={handleLogout} >Logout</Nav.Link>
                <Nav.Link as={Link} to="/Register">Register</Nav.Link>
                <Nav.Link as={Link} to="/Login">Login</Nav.Link> */}
          </Nav>
        </Container>
      </Navbar>

    </div>
  );
}

export default Header;
