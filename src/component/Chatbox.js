import { useState } from "react";
import ChatBotImg from "../assets/chatbot.png";
import GuestImg from "../assets/guest.png";
import "./Chatbox.css";

let CONST_MSG = [
  {
    from: "bot",
    msg: "Hey there🖐 I am a ChatBot! Type 'START' to begin...",
  },
];

const ChatBox = () => {
  const [userInput, setuserInput] = useState("");
  const [botStart, setbotStart] = useState(false);
  const [userMsg, setUserMsg] = useState(CONST_MSG);

  let bot_response = "";

  const inputSubmitHandler = async (e) => {
    //Preventing reloading of the form
    e.preventDefault();

    //Creating Message List: User Input
    setUserMsg((prevMsg) => [
      ...prevMsg,
      {
        from: "user",
        msg: userInput,
      },
    ]);

    //Start the bot
    if (userInput.toLowerCase() === "start") {
      setbotStart(true);
      bot_response = {
        from: "bot",
        msg: "Hey Guest, thanks for starting me up! Please enter your github username.",
      };
    }

    //Reset the bot
    if (userInput.toLowerCase() === "reset") {
      setbotStart(false);
      setUserMsg(CONST_MSG);
    }

    //Handling invalid messages
    if (!botStart && userInput !== "start") {
      bot_response = {
        from: "bot",
        msg: "Sorry but I don't understand this message 🤖, please type 'START' to begin with.",
      };
    }

    //Checking for the entered username
    if (
      botStart &&
      userInput !== "" &&
      userInput !== "reset" &&
      userInput !== "start"
    ) {
      setUserMsg((prevMsg) => [
        ...prevMsg,
        {
          from: "bot",
          msg: `Thanks for providing ${userInput} as your GitHub username...`,
        },
        {
          from: "bot",
          msg: "Let's look it up with GitHub... Please wait...",
        },
      ]);

      const response = await fetch("https://api.github.com/users/" + userInput);
      const jsonData = await response.json();

      if (response.ok) {
        if (jsonData.name === "") {
          setUserMsg((prevMsg) => [
            ...prevMsg,
            {
              from: "bot",
              msg: `We found you, please update your profile and add Name in it. You're awesome, coz you have got ${jsonData.public_repos} public repos! Saving your details!`,
            },
          ]);
        } else {
          setUserMsg((prevMsg) => [
            ...prevMsg,
            {
              from: "bot",
              msg: `Hey ${jsonData.name}! I found you! You're awesome, coz you have got ${jsonData.public_repos} public repos! Saving your details!`,
            },
          ]);
        }

        setUserMsg((prevMsg) => [
          ...prevMsg,
          {
            from: "bot",
            msg: `So what do you want to do now? Please enter one of the options here:
            - help: Displays this message again.
            - bio: Displays the GitHub Bio, if found.
            - company: Displays the Company, if found.
            - avatar: Displays the GitHub Avatar, if found.
            - repo: Displays the GitHub Repository List, if found.
            - blog site: Displays the Blog Link, if found.
            - location: Displays the Location, if found.
            - can hire: Tells if the person can be hired.
            - followers: Displays the number of followers of .
            - following: Displays the number of people follows.
            - reset: Back to Square one! 😉`,
          },
        ]);
      } else {
        setUserMsg((prevMsg) => [
          ...prevMsg,
          {
            from: "bot",
            msg: `Sorry but the user ${userInput} is not present on GIT.`,
          },
        ]);
      }
      console.log(jsonData);
    }

    //Re-creating the bot answer
    if (bot_response !== "")
      setUserMsg((prevMsg) => [...prevMsg, bot_response]);

    // //Checking if bot is started
    // if (botStart && userInput !== "reset") {
    //   //Checking GIT API response
    //   bot_response = botText(userInput);
    //   console.log(bot_response);
    // }

    //Resetting input tag
    setuserInput("");
  };

  return (
    <div className="chatbox-container">
      <div className="chatbox-messgaes">
        <ul id="messages">
          {userMsg.map((data, index) => (
            <li key={index} className={`chat-msg ${data.from}`}>
              <img
                src={data.from === "user" ? GuestImg : ChatBotImg}
                alt="Guest"
              ></img>
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
