import check from "../../assets/imgs/check.svg"

function Step(props) {
  return (
    <span className={props.currStep == props.id ? "curr-step" : "next-step"}>
      {props.currStep > props.id ? <img className="w-5 h-5" src={check}></img> : "1."}
    </span>
  );
}

export default Step;