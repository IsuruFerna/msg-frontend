import { BrowserRouter, Route, Routes } from "react-router-dom";
import "./App.css";
import MessagePage from "./pages/MessagePage";
import LoginPage from "./pages/LoginPage";
import { Container } from "react-bootstrap";
import RegisterPage from "./pages/RegisterPage";

function App() {
   return (
      <BrowserRouter>
         <Container fluid>
            <Routes>
               <Route element={<MessagePage />} path="/" />
               <Route element={<LoginPage />} path="/login" />
               <Route element={<RegisterPage />} path="/register" />
            </Routes>
         </Container>
      </BrowserRouter>
   );
}

export default App;
