import React, { useState } from "react";
import Button from "react-bootstrap/Button";
import Col from "react-bootstrap/Col";
import Form from "react-bootstrap/Form";
import Row from "react-bootstrap/Row";
import { useNavigate } from "react-router-dom";

const RegisterPage = () => {
   const navigate = useNavigate();
   const [userData, setUserData] = useState({
      username: "",
      firstname: "",
      lastname: "",
      email: "",
      password: "",
      passwordConfirm: "",
   });

   const handleChange = (e) => {
      const target = e.target;
      setUserData({
         ...userData,
         [target.name]: target.value,
      });
   };

   const handleSubmit = async (e) => {
      e.preventDefault();

      try {
         const response = await fetch(
            process.env.REACT_APP_BE_URL + "/auth/register",
            {
               method: "POST",
               body: JSON.stringify(userData),
               headers: {
                  "Content-Type": "application/json",
               },
            }
         );

         if (response.ok) {
            // navigate("/login");
            setUserData({
               username: "",
               firstname: "",
               lastname: "",
               email: "",
               password: "",
               passwordConfirm: "",
            });
         } else {
            throw new Error("Registration issues: " + response.status);
         }
      } catch (error) {
         console.log(error);
      }
   };

   return (
      <Row className="d-flex min-vh-100 justify-content-center align-items-center">
         <Col md={8}>
            <Form onSubmit={handleSubmit}>
               <Form.Group
                  className="mb-3"
                  as={Col}
                  controlId="formGridUsername"
               >
                  <Form.Label>Username</Form.Label>
                  <Form.Control
                     name="username"
                     value={userData.username}
                     onChange={handleChange}
                     type="text"
                     placeholder="Enter username"
                  />
               </Form.Group>

               <Row className="mb-3">
                  <Form.Group as={Col} controlId="formGridFirstname">
                     <Form.Label>First name</Form.Label>
                     <Form.Control
                        name="firstname"
                        value={userData.firstname}
                        onChange={handleChange}
                        type="text"
                        placeholder="Enter first name"
                     />
                  </Form.Group>

                  <Form.Group as={Col} controlId="formGridLastname">
                     <Form.Label>Last name</Form.Label>
                     <Form.Control
                        name="lastname"
                        value={userData.lastname}
                        onChange={handleChange}
                        type="text"
                        placeholder="Enter last name"
                     />
                  </Form.Group>
               </Row>

               <Form.Group className="mb-3" as={Col} controlId="formGridEmail">
                  <Form.Label>Email</Form.Label>
                  <Form.Control
                     type="email"
                     name="email"
                     value={userData.email}
                     onChange={handleChange}
                     placeholder="Enter email"
                  />
               </Form.Group>

               <Row className="mb-3">
                  <Form.Group as={Col} controlId="formGridPassword">
                     <Form.Label>Password</Form.Label>
                     <Form.Control
                        type="password"
                        name="password"
                        value={userData.password}
                        onChange={handleChange}
                        placeholder="Password"
                     />
                  </Form.Group>
                  <Form.Group as={Col} controlId="formGridPasswordConfirm">
                     <Form.Label>Confirm password</Form.Label>
                     <Form.Control
                        type="password"
                        name="passwordConfirm"
                        value={userData.passwordConfirm}
                        onChange={handleChange}
                        placeholder="Confirm password"
                     />
                  </Form.Group>
               </Row>

               <Button variant="primary" type="submit">
                  Register
               </Button>
            </Form>
         </Col>
      </Row>
   );
};

export default RegisterPage;
