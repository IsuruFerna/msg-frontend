import "./App.css";
import SockJS from "sockjs-client";
import SockJsClient from "react-stomp";
import { over } from "stompjs";
import { useEffect, useState } from "react";
// import chatAPI from "./services/chatAPI";
import Messages from "./components/Messages";
import { Button, Col, Container, Form, ListGroup, Row } from "react-bootstrap";

function App() {
   //  var socket = SockJS("http://localhost/8080");
   const [groupChats, setGroupChats] = useState([]);
   const [privateChats, setPrivateChats] = useState([]);
   const [stompClient, setStompClient] = useState(null);

   const SOCKET_URL = "http://localhost:8080/ws-chat/";
   const USER_NAMES = ["Ara", "Euna", "Reba", "group-chat"];
   const [selectedUser, setSelectedUser] = useState("group-chat");

   const [messages, setMessages] = useState([]);
   const [user, setUser] = useState({
      sender: "bob",
      receiver: selectedUser,
      connected: false,
      message: "",
   });

   const disconnect = () => {
      if (stompClient !== null) {
         stompClient.disconnect();
      }
   };

   const connect = () => {
      const socket = new SockJS(SOCKET_URL);
      const client = over(socket);

      // set headers with the token
      const headers = {};
      headers["Authentication"] = "Bearer " + "token";

      client.connect(
         headers,
         function (frame) {
            console.log("Connected: " + frame);

            setUser({
               ...user,
               connected: true,
            });

            console.log("user details: ", user.sender, user.receiver);

            // client.subscribe("/topic/private/" + topic, onPrivateMessageReceived);

            if (selectedUser === "group-chat") {
               client.subscribe("/topic/group", onGroupMessageReceived);
            } else {
               console.log("subscribing to receive pvt msg: ");
               client.subscribe("/topic/private", onPrivateMessageReceived);
            }

            setStompClient(client);
         },
         function (error) {
            console.log("Connection error: ", error);
         }
      );
   };

   const sendGroupMessage = () => {
      if (stompClient) {
         let chatMessage = {
            sender: "bob",
            receiver: selectedUser,
            content: user.message,
         };

         const headers = {};
         headers["Authentication"] = "Bearer " + "token";

         // setGroupChats(groupChats.push(chatMessage));

         console.log("updated chat: ", groupChats);
         stompClient.send(
            "/app/sendMessage",
            headers,
            JSON.stringify(chatMessage)
         );
         setUser({ ...user, message: "" });
      }
   };

   const sendPrivateMessage = () => {
      if (stompClient && selectedUser !== "group-chat") {
         let chatMessage = {
            sender: "bob",
            receiver: selectedUser,
            content: user.message,
         };

         const headers = {};
         headers["Authentication"] = "Bearer " + "token";

         // privateChats.get(user.receiver).push(chatMessage);
         // setPrivateChats(new Map(privateChats));

         // setGroupChats(privateChats.push(chatMessage));

         console.log("updated chat: sending", privateChats);
         stompClient.send(
            "/app/sendMessageTo",
            headers,
            JSON.stringify(chatMessage)
         );
         setUser({ ...user, message: "" });
      }
   };

   const onGroupMessageReceived = (payload) => {
      let payloadData = JSON.parse(payload.body);
      console.log("this is payload group: ", payloadData);

      // avoid duplicate messages
      const msgExsisits = groupChats.some(
         (msg) =>
            msg.timestamp === payloadData.timestamp &&
            msg.content === payloadData.content
      );

      if (!msgExsisits) {
         groupChats.push(payloadData);
         setGroupChats([...groupChats]);
      }
   };

   const onPrivateMessageReceived = (payload) => {
      console.log("subscribed to private msg:");
      let payloadData = JSON.parse(payload.body);
      console.log("this is payload private: ", payloadData);

      console.log("receiving pvt msgs::::");
      console.log("previous msg: ", privateChats);

      // avoid duplicate messages
      const msgExsisits = privateChats.some(
         (msg) =>
            msg.timestamp === payloadData.timestamp &&
            msg.content === payloadData.content
      );

      if (!msgExsisits) {
         privateChats.push(payloadData);
         setPrivateChats([...privateChats]);
      }
      console.log("updated messages: ", privateChats);

      // console.log("this is pvt msg: ", privateChats);
   };

   const handleSubmit = (e) => {
      e.preventDefault();

      if (stompClient) {
         if (selectedUser === "group-chat") {
            sendGroupMessage();
         } else {
            sendPrivateMessage();
         }
      } else {
         console.log("stomp client is null");
      }
   };

   const handleUserChange = (e) => {
      setUser({
         ...user,
         [e.target.name]: e.target.value,
      });
   };

   // useEffect(() => {
   //    setUser({
   //       ...user,
   //       receiver: selectedUser,
   //    });
   // }, [selectedUser]);

   useEffect(() => {
      connect();

      // if (!privateChats.has(user.receiver)) {
      //    privateChats.set(user.receiver, []);
      // }

      return () => {
         disconnect();
      };
   }, [selectedUser]);

   return (
      <div className="App">
         {user.username !== "" ? (
            <>
               <Container fluid className="bg-primary">
                  <Row className="vh-100 ">
                     <Col md={4}>
                        <h2>Chat</h2>
                        <ListGroup as="ol" numbered>
                           {USER_NAMES &&
                              USER_NAMES.map((user, index) => (
                                 <ListGroup.Item
                                    style={{ cursor: "pointer" }}
                                    as="li"
                                    key={index}
                                    onClick={() => {
                                       console.log("setting new user: ", user);
                                       setSelectedUser(user);
                                    }}
                                 >
                                    {user}
                                 </ListGroup.Item>
                              ))}
                           {/* <ListGroup.Item as="li">
                              Group message
                           </ListGroup.Item>
                           <ListGroup.Item as="li">
                              Cras justo odio
                           </ListGroup.Item>
                           <ListGroup.Item as="li">
                              Cras justo odio
                           </ListGroup.Item> */}
                        </ListGroup>
                     </Col>
                     <Col className="100 bg-white" md={8}>
                        <h1>Chat</h1>

                        <Row className="h-75">
                           Chat space
                           <ul>
                              {selectedUser === "group-chat" ? (
                                 groupChats.length > 0 ? (
                                    groupChats.map((msg, index) => (
                                       <li key={index}>{msg.content}</li>
                                    ))
                                 ) : (
                                    <p>No group messages</p>
                                 )
                              ) : privateChats.length > 0 ? (
                                 privateChats.map((msg, index) => (
                                    <li key={index}>{msg.content}</li>
                                 ))
                              ) : (
                                 <p>No messages</p>
                              )}
                           </ul>
                        </Row>
                        <Row className="h-25">
                           <Form onSubmit={handleSubmit}>
                              <div className="d-flex">
                                 <Form.Control
                                    as="textarea"
                                    className="me-2"
                                    rows={1}
                                    placeholder="Enter message"
                                    onChange={handleUserChange}
                                    value={user.message}
                                    name="message"
                                 />
                                 <div>
                                    <Button variant="primary" type="submit">
                                       Send
                                    </Button>
                                 </div>
                              </div>
                           </Form>
                        </Row>
                     </Col>
                  </Row>
               </Container>
            </>
         ) : (
            <h1>Login form</h1>
         )}
      </div>
   );
}

export default App;
