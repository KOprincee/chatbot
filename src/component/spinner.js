import "./spinner.css";

const spinner = (props) => {
  return (
    <>
      <div className="container" onClick={props.clickMe}>
        <div id="chatbot">
          <div className="dot"></div>
          <div className="dot"></div>
          <div className="dot"></div>
        </div>
        <div id="chatbot-corner"></div>
        <div id="antenna">
          <div id="beam"></div>
          <div id="beam-pulsar"></div>
        </div>
        <div className="click-me">Click Me</div>
      </div>
    </>
  );
};

export default spinner;
