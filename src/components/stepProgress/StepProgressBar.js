import Step from "./Step";

function StepProgressBar(props) {
  return (
    <div className="relative flex flex-row justify-between">
      {/* <span className={currStep == 1 ? "curr-step" : "next-step"}>
        {currStep > 1 ? <img className="w-5 h-5" src={check}></img> : "1."}
      </span>*/}
      {
        props.stepLength.map(el => (
          <Step id={el} key={props.stepLength.indexOf(el)} currStep={props.currStep}/>
        ))
      }

      <div className="absolute bottom-[40%] rounded-md -z-10 h-2 bg-[#9090937f]  w-full"></div>
    </div>
  );
}

export default StepProgressBar;