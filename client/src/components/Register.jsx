import React, { useState } from "react";
import axios from "axios";
import { Formik, Form as FormikForm } from "formik";
import * as Yup from "yup";
import {
  Form,
  Button,
  Container,
  Row,
  Col,
  Alert,
  Spinner,
} from "react-bootstrap";

const validationSchema = Yup.object().shape({
  name: Yup.string().required("Name is required"),
  email: Yup.string().email("Invalid email").required("Email is required"),
  password: Yup.string()
    .min(6, "Min 6 characters")
    .required("Password is required"),
  otp: Yup.string()
    .length(6, "OTP must be 6 digits")
    .when("otpSent", {
      is: true,
      then: Yup.string().required("OTP is required"),
    }),
});

function Register() {
  const [otpSent, setOtpSent] = useState(false);
  const [registered, setRegistered] = useState(false);
  const [message, setMessage] = useState("");

  const handleSendOtp = async (values, setFieldTouched) => {
    try {
      await axios.post("http://localhost:3400/sendOtp", {
        email: values.email,
        name: values.name,
      });
      setOtpSent(true);
      setMessage(`OTP sent to ${values.email}`);
      setFieldTouched("otp", true); // trigger validation for OTP
    } catch (error) {
      setMessage(error.response?.data || "Error sending OTP");
    }
  };

  const handleRegister = async (values) => {
    try {
      const res = await axios.post("http://localhost:3400/register", {
        name: values.name,
        email: values.email,
        password: values.password,
        otp: values.otp,
      });
      setRegistered(true);
      setMessage(res.data);
    } catch (error) {
      setMessage(error.response?.data || "Error registering user");
    }
  };

  return (
    <Container className="mt-5">
      <Row className="justify-content-md-center">
        <Col md={6}>
          <h2 className="mb-4 text-center">Register</h2>

          {!registered ? (
            <Formik
              initialValues={{
                name: "",
                email: "",
                password: "",
                otp: "",
              }}
              validationSchema={validationSchema}
              onSubmit={handleRegister}
            >
              {({
                values,
                errors,
                touched,
                handleChange,
                handleBlur,
                handleSubmit,
                setFieldTouched,
              }) => (
                <FormikForm noValidate onSubmit={handleSubmit}>
                  <Form.Group className="mb-3" controlId="formName">
                    <Form.Label>Name</Form.Label>
                    <Form.Control
                      type="text"
                      name="name"
                      value={values.name}
                      onChange={handleChange}
                      onBlur={handleBlur}
                      isInvalid={touched.name && !!errors.name}
                      disabled={otpSent}
                    />
                    <Form.Control.Feedback type="invalid">
                      {errors.name}
                    </Form.Control.Feedback>
                  </Form.Group>

                  <Form.Group className="mb-3" controlId="formEmail">
                    <Form.Label>Email</Form.Label>
                    <Form.Control
                      type="email"
                      name="email"
                      value={values.email}
                      onChange={handleChange}
                      onBlur={handleBlur}
                      isInvalid={touched.email && !!errors.email}
                      disabled={otpSent}
                    />
                    <Form.Control.Feedback type="invalid">
                      {errors.email}
                    </Form.Control.Feedback>
                  </Form.Group>

                  <Form.Group className="mb-3" controlId="formPassword">
                    <Form.Label>Password</Form.Label>
                    <Form.Control
                      type="password"
                      name="password"
                      value={values.password}
                      onChange={handleChange}
                      onBlur={handleBlur}
                      isInvalid={touched.password && !!errors.password}
                      disabled={otpSent}
                    />
                    <Form.Control.Feedback type="invalid">
                      {errors.password}
                    </Form.Control.Feedback>
                  </Form.Group>

                  {!otpSent ? (
                    <Button
                      variant="primary"
                      onClick={() => handleSendOtp(values, setFieldTouched)}
                    >
                      Send OTP
                    </Button>
                  ) : (
                    <>
                      <Form.Group className="mb-3 mt-3" controlId="formOtp">
                        <Form.Label>OTP</Form.Label>
                        <Form.Control
                          type="text"
                          name="otp"
                          value={values.otp}
                          onChange={handleChange}
                          onBlur={handleBlur}
                          maxLength={6}
                          isInvalid={touched.otp && !!errors.otp}
                        />
                        <Form.Control.Feedback type="invalid">
                          {errors.otp}
                        </Form.Control.Feedback>
                      </Form.Group>
                      <Button variant="success" type="submit">
                        Verify & Register
                      </Button>
                    </>
                  )}
                </FormikForm>
              )}
            </Formik>
          ) : (
            <Alert variant="success" className="text-center">
              🎉 Registered successfully!
            </Alert>
          )}

          {message && (
            <Alert
              className="mt-3"
              variant={message.includes("success") ? "success" : "danger"}
            >
              {message}
            </Alert>
          )}
        </Col>
      </Row>
    </Container>
  );
}

export default Register;
