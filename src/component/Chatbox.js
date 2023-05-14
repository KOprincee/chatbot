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
  const [gitResp, setgitResp] = useState("");

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
      setgitResp("");
    }

    //Handling invalid messages
    if (!botStart && userInput !== "start") {
      bot_response = {
        from: "bot",
        msg: "Please type 'START' to begin with 🤖.",
      };
    }

    //Checking for the entered username
    if (
      botStart &&
      gitResp === "" &&
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
        setgitResp(jsonData);
        if (jsonData.name === "" || jsonData.name === null) {
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
            - bio: Displays the GitHub Bio, if found.
            - company: Displays the Company, if found.
            - avatar: Displays the GitHub Avatar, if found.
            - repo: Displays the GitHub Repository List, if found.
            - blog site: Displays the Blog Link, if found.
            - location: Displays the Location, if found.
            - can hire: Tells if the person can be hired.
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

    if (gitResp !== "" && userInput.toLowerCase() !== "reset") {
      switch (userInput.toLowerCase()) {
        case "bio":
          bot_response = {
            from: "bot",
            msg:
              gitResp.bio === null
                ? `${
                    gitResp.name === null ? gitResp.login : gitResp.name
                  } hasn't written a bio yet`
                : gitResp.bio,
          };
          break;

        case "company":
          bot_response = {
            from: "bot",
            msg:
              gitResp.company === null
                ? `${
                    gitResp.name === null ? gitResp.login : gitResp.name
                  } hasn't updated a company `
                : gitResp.company,
          };
          break;

        case "avatar":
          bot_response = {
            from: "bot",
            msg: (
              <>
                <img
                  src={gitResp.avatar_url}
                  alt={`${gitResp.login}'s Avatar`}
                />
              </>
            ),
          };
          break;

        case "blog site":
          bot_response = {
            from: "bot",
            msg:
              gitResp.blog === null ? (
                `${
                  gitResp.name === null ? gitResp.login : gitResp.name
                } hasn't written any blog or website yet.`
              ) : (
                <>
                  {gitResp.name === null ? gitResp.login : gitResp.name} writes
                  at{" "}
                  <a href={gitResp.blog} target="_blank" rel="noreferrer">
                    here
                  </a>
                  ...
                </>
              ),
          };
          break;

        case "location":
          bot_response = {
            from: "bot",
            msg:
              gitResp.location === null
                ? `${
                    gitResp.name === null ? gitResp.login : gitResp.name
                  } hasn't updated the location`
                : gitResp.location,
          };
          break;

        case "can hire":
          bot_response = {
            from: "bot",
            msg: gitResp.hireable ? (
              <>
                {gitResp.name === null ? gitResp.login : gitResp.name} can be
                hired. Visit to the profile to see some of there work{" "}
                <a href={gitResp.html_url} target="_blank" rel="noreferrer">
                  <p>{gitResp.login}</p>
                </a>
                {"\n"}
              </>
            ) : (
              `${
                gitResp.name === null ? gitResp.login : gitResp.name
              } can't be hired or hasn't updated there status.`
            ),
          };
          break;

        case "repo":
          const response = await fetch(gitResp.repos_url);
          const jsonData = await response.json();
          //console.log(jsonData);

          bot_response = {
            from: "bot",
            msg:
              jsonData.length > 0 ? (
                <>
                  {jsonData.map((data, index) => (
                    <a
                      key={index}
                      href={data.html_url}
                      target="_blank"
                      rel="noreferrer"
                    >
                      {data.name}
                    </a>
                  ))}
                </>
              ) : (
                `${
                  gitResp.name === null ? gitResp.login : gitResp.name
                } has no public repositories to be shown.`
              ),
          };

          break;
        default:
          bot_response = {
            from: "bot",
            msg: "Please type only the options available above. Or type 'RESET' to get a fresh start.",
          };
          break;
      }
    }

    //Re-creating the bot answer
    if (bot_response !== "")
      setUserMsg((prevMsg) => [...prevMsg, bot_response]);

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
                src={
                  data.from === "user"
                    ? gitResp === "" && botStart
                      ? GuestImg
                      : gitResp.avatar_url
                    : ChatBotImg
                }
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
