import { useState } from "react";
import { Container, Row, Col, Card, Button } from "react-bootstrap";
import Login from "./Login";
import Register from "./Register";

function HeroSection() {
  const [isRegistering, setIsRegistering] = useState(false);

  const backgroundImage =
    "https://www.maimt.com/wp-content/uploads/2024/03/IMG_20231130_144714_1.jpg";

  return (
    <div>
      {/* Overlay for better text contrast */}

      <Container fluid>
        <Row
          style={{
            backgroundImage: `url(${backgroundImage})`,
            backgroundSize: "cover",
            width: "100%",
            height: "100%",
            paddingTop: "60px",
          }}
          className="align-items-center min-vh-100"
        >
          {/* Left Side: Welcome Message */}
          <Col md={8} className="text-white px-5 mb-4 mb-md-0">
            <h1 className="display-4 fw-bold">
              Welcome to MAIMT Admission Portal
            </h1>
            <p className="lead">
              Admission open for 2025! Login to apply or register to get
              started.
            </p>
          </Col>

          {/* Right Side: Login/Register Box */}
          <Col md={4}>
            <Card className="p-4 shadow" style={{ backgroundColor: "white" }}>
              <h4 className="text-center mb-3"></h4>

              {isRegistering ? <Register /> : <Login />}

              <div className="text-center mt-3">
                <Button
                  variant="link"
                  className="text-primary text-decoration-none"
                  onClick={() => setIsRegistering(!isRegistering)}
                >
                  {isRegistering
                    ? "Already registered? Login here"
                    : "Not registered yet? Click here"}
                </Button>
              </div>
            </Card>
          </Col>
        </Row>
      </Container>
    </div>
  );
}

export default HeroSection;
