import { useState } from "react";
import CalcM from "../../scripts/formulas.js"

function MolarMassCalc() {
    const [formula, setFormula] = useState("")
    function HandleTextChange(event){
        setFormula(event.target.value)
    }
    function BtnCalc(){
        let formulaInput = document.getElementById("formulaInput");
        let M = CalcM(formulaInput.value)
        document.getElementById('anwser').innerText = `Molarna masa je: ${M}`
    }
    return (
        <div className="container">
            <h1 className="text-white main-title">Kalkulator Molarne Mase</h1>
            <p className="text-white">Unesite kemijsku formulu tvari i kliknite botun!</p>
            <div>
                <input id="formulaInput" onChange={HandleTextChange} className="input" />
                <button id="submit" onClick={BtnCalc} className="btn btn-primary">Submit</button>
                <p id="anwser" className="text-white">Molarna masa je:</p>
            </div>
        </div>
    );
}

export default MolarMassCalc;