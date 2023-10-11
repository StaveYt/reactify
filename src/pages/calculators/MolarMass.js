function MolarMassCalc() {
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
                <input id="formulaInput" className="input" />
                <button id="submit" onClick={BtnCalc} className="btn btn-primary">Submit</button>
                <p id="anwser" className="text-white">Molarna masa je:</p>
            </div>
        </div>
    );
}

export default MolarMassCalc;