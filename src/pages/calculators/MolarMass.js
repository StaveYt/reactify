import { useState } from "react";
import send from "../../assets/imgs/send.svg";
import StepProgressBar from "../../components/stepProgress/StepProgressBar.js";
import CalcM from "../../scripts/molarmassCalc.js";

function MolarMassCalc() {
  const [formula, setFormula] = useState("");
  const [caluclatedM, setCalculatedM] = useState(0);
  const [currStep, setCurrStep] = useState(1);

  function HandleTextChange(event) {
    setFormula(event.target.value);
  }
  function BtnCalc() {
    setCurrStep(currStep + 1);
    setCalculatedM(CalcM(formula));
  }

  return (
    <div className="flex flex-col h-full mx-5 items-center">
      <div className="flex flex-col min-w-[300px] gap-10">
        <h1 className="text-[#464648] font-bold text-lg">Kalkulator Molarne Mase</h1>
        <StepProgressBar currStep={currStep} stepLength={[1, 2]} />
        <div className="bg-white min-h-[150px] min-w-[300px] flex flex-col m-auto self-center p-10 justify-center shadow-sm shadow-[#222] gap-5 rounded-sm">
          {
            currStep === 1 ? (<><div>
              <p className="">Unesite kemijsku formulu tvari:</p>
              <div className="flex">
                <input id="formulaInput" onChange={HandleTextChange} className="shadow-[#222] bg-white [clip-path:inset(0_0px_-10px_-10px)] p-1 shadow-sm rounded-l-sm" />
                <button id="submit" onClick={BtnCalc} className="p-1 rounded-r-sm bg-[#92FF9F] text-white [clip-path:inset(0_-10px_-10px_0)] min-h-[31.98px] [box-shadow:0_1px_2px_0_#222]">
                  <img className="w-5 h-5" src={send}></img>
                </button>
              </div>

            </div></>) :
              (<>
                <p id="anwser" className="">Molarna masa je: {caluclatedM}</p>
              </>)}
        </div>
      </div>

    </div>
  );
}

export default MolarMassCalc;