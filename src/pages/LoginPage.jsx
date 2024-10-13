import React, { useState } from "react";
import { Col, Row } from "react-bootstrap";
import Button from "react-bootstrap/Button";
import Form from "react-bootstrap/Form";
import { Link, useNavigate } from "react-router-dom";
import { TOKEN, useLocalStorage } from "../hooks/useLocalStorage";

const LoginPage = () => {
   const [userData, setUserData] = useState({
      email: "",
      password: "",
   });
   const { setItem: setToken } = useLocalStorage(TOKEN);
   const navigate = useNavigate();

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
            process.env.REACT_APP_BE_URL + "/auth/login",
            {
               method: "POST",
               body: JSON.stringify(userData),
               headers: {
                  "Content-Type": "application/json",
               },
            }
         );

         if (response.ok) {
            const data = await response.json();
            // console.log("this is token: ", data);
            setToken(data.token);
            setUserData({
               email: "",
               password: "",
            });

            navigate("/");
         } else {
            throw new Error("Registration issues: " + response.status);
         }
      } catch (error) {
         console.log(error);
      }
   };

   return (
      <div>
         <Row className="d-flex justify-content-center align-items-center vh-100">
            <Col md={6}>
               <Form onSubmit={handleSubmit}>
                  <Form.Group className="mb-3" controlId="formBasicEmail">
                     <Form.Label>Email address</Form.Label>
                     <Form.Control
                        name="email"
                        value={userData.email}
                        onChange={handleChange}
                        type="email"
                        placeholder="Enter email"
                     />
                  </Form.Group>

                  <Form.Group className="mb-3" controlId="formBasicPassword">
                     <Form.Label>Password</Form.Label>
                     <Form.Control
                        type="password"
                        name="password"
                        value={userData.password}
                        onChange={handleChange}
                        placeholder="Password"
                     />
                  </Form.Group>
                  <Button variant="primary" type="submit">
                     Login
                  </Button>
               </Form>
               <Link to={"/register"}>Register </Link>
            </Col>
         </Row>
      </div>
   );
};

export default LoginPage;
