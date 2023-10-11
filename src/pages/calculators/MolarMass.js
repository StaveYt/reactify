import { useState } from "react";
import CalcM from "../../scripts/formulas.js"

function MolarMassCalc() {
    const [formula, setFormula] = useState("")
    const [caluclatedM, setCalculatedM] = useState(0)
    function HandleTextChange(event){
        setFormula(event.target.value)
    }
    function BtnCalc(){
        setCalculatedM(CalcM(formula))
    }
    return (
        <div className="container">
            <h1 className="text-white main-title">Kalkulator Molarne Mase</h1>
            <p className="text-white">Unesite kemijsku formulu tvari i kliknite botun!</p>
            <div>
                <input id="formulaInput" onChange={HandleTextChange} className="rounded-sm bg-slate-700 text-white p-1 border border-slate-500" />
                <button id="submit" onClick={BtnCalc} className="p-1 rounded-sm bg-green-600 text-white border border-green-500">Submit</button>
                <p id="anwser" className="text-white">Molarna masa je: {caluclatedM}</p>
            </div>
        </div>
    );
}

export default MolarMassCalc;