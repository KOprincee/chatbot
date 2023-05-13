import { useState } from "react";
//import ChatBotImg from "../assets/chatbot.png";
import GuestImg from "../assets/guest.png";
import "./Chatbox.css";

const ChatBox = () => {
  const [userInput, setuserInput] = useState("");
  const [userMsg, setUserMsg] = useState([]);

  const inputSubmitHandler = (e) => {
    //Preventing reloading of the form
    e.preventDefault();

    //Creating Message List
    setUserMsg((prevMsg) => [
      ...prevMsg,
      {
        from: "user",
        msg: userInput,
      },
    ]);

    //Resetting input tag
    setuserInput("");
  };

  return (
    <div className="chatbox-container">
      <div className="chatbox-messgaes">
        <ul id="messages">
          {userMsg.map((data, index) => (
            <li key={index} className="chat-msg">
              <img src={GuestImg} alt="Guest"></img>
              <p>{data.msg}</p>
            </li>
          ))}
        </ul>
        <form className="ChatBot-Input" onSubmit={inputSubmitHandler}>
          <input
            type="text"
            value={userInput}
            onChange={(e) => setuserInput(e.target.value)}
            placeholder={"Please start typing something..."}
          />
        </form>
      </div>
    </div>
  );
};

export default ChatBox;
