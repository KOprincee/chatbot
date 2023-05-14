import ChatBox from "./component/Chatbox";
import Spinner from "./component/spinner";
import "./App.css";
import { useState } from "react";

function App() {
  const [showSpiner, setShowSpiner] = useState(true);
  const spinerHandler = () => {
    setShowSpiner(false);
  };

  return (
    <div className="App">
      {showSpiner && <Spinner clickMe={spinerHandler} />}
      {!showSpiner && <ChatBox />}
    </div>
  );
}

export default App;
