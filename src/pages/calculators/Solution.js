import { useEffect, useState } from "react";
import Input from "../../components/form/Input.js";
import Option from "../../components/form/Option.js";
import Select from "../../components/form/Select.js";
import { calcSolution } from "../../scripts/formulas.js";
import StepProgressBar from "../../components/stepProgress/StepProgressBar.js";
import DataInput from "../../components/dataInput/DataInput.js";
import ShowTabledData from "../../components/dataInput/ShowTabledData.js";
function SolutionCalc() {
  const [known, setKnown] = useState([]);
  const [usedSymbols, setUsedSymbols] = useState([
    { symbol: 'c', envOnly: true, env: true, ext: [] },
    { symbol: 'V', envOnly: false, env: false, ext: [] },
    { symbol: 'n', envOnly: false, env: false, ext: [] },
    { symbol: 'm', envOnly: false, env: false, ext: [] },
    { symbol: 'phi', envOnly: false, env: false, ext: [] },
    { symbol: 'w', envOnly: false, env: false, ext: [] },
    { symbol: 'x', envOnly: false, env: false, ext: [] },
    { symbol: 'b', envOnly: true, env: true, ext: [] },
    { symbol: 'y', envOnly: true, env: true, ext: [] },
    { symbol: 'D', envOnly: false, env: false, ext: [] },
    ['c', 'V', 'n', 'm', 'phi', 'w', 'x', 'b', 'y', 'D']
  ]); //podaci koji korisnik moze unijeti
  const [formulas, setFormulas] = useState({
    otap: "",
    otv: "",
    plin: false
  });
  const [calculated, setCalculated] = useState({
    otp: {},
    otv: {},
    otap: {},
    ext: {},
    calculated: false
  });
  const [nRows, setNRows] = useState(0);
  const [currStep, setCurrStep] = useState(1);
  const [selectedChem, setSelectedChem] = useState("Otopljena tvar");

  // konstruktorska funkcija za poznate podatke
  function KnownInfo(id, symbol, chem, quantity, unit) {
    this.id = id;
    this.symbol = symbol;
    this.chem = chem;
    this.quantity = quantity;
    this.unit = unit;
  }

  //unos kemijskih formula
  function HandleTextChange(event) {
    if (event.target.type === "checkbox") {
      setFormulas({ ...formulas, [event.target.id]: event.target.checked });
    }
    else { 
      setFormulas({ ...formulas, [event.target.id]: event.target.value }); 
    }
  }

  //dodavanje poznatih podataka
  function AddKnown() {
    setKnown([...known, new KnownInfo(nRows, "V", "otap", 0, "m^3", "")]);
    setNRows(nRows + 1);
  }

  //dohvacanje i racunanje
  function Calculate() {
    if(known.length===0){
      alert("Unesite podatke u tablicu")
    } else {
      setCurrStep(currStep + 1);
      let data = calcSolution(known, formulas.otap, formulas.otv, formulas.plin);
      setCalculated({ ...data, calculated: true });
    }
  }

  return (
    <div className="flex flex-col h-full mx-5 items-center">
      <h1 className="text-[#464648] font-bold text-lg">Kalkultor za otopine</h1>
      <div className="flex flex-col max-sm:w-[90%] min-w-[300px] gap-10">
        {/* traka napretka */}
        <StepProgressBar currStep={currStep} stepLength={[1, 2, 3]} />

        {/* glavno sucelje */}
        <div id={currStep < 3 ? "known" : ""} className="bg-white max-sm:w-[90%]  min-h-[150px] min-w-[300px] flex flex-col m-auto self-center p-10 justify-center shadow-sm shadow-[#222] gap-5 rounded-sm">
          {currStep === 1 ? <>
            {/* unos kemijskih formula */}
            <p>Unesite kemijske formule za otapalo i otopljenu tvar.</p>

            {/* unos otapala */}
            <div className="flex gap-2 mb-1 mt-1 max-sm:flex-col">
              <label htmlFor="otap">Formula Otapala (otap)</label>
              <Input onChange={HandleTextChange} id="otap" />
            </div>

            {/* unos otopljene tvari */}
            <div className="flex gap-2 mb-1 mt-1 max-sm:flex-col">
              <label htmlFor="otv">Formula Otopljene tvari (otv)</label>
              <div className="flex gap-2"><Input onChange={HandleTextChange} id="otv" />
                <input onChange={HandleTextChange} id="plin" type="checkbox"></input>
                <label htmlFor="plin">Plin</label></div>
            </div>

            <button onClick={() => { setCurrStep(currStep + 1); }} id="submit" className="flex p-1 items-center justify-center rounded-sm bg-[#92FF9F] [clip-path:inset(0_0_-10px_0)] [box-shadow:0_1px_2px_0_#222]">
              <span className="text-[#464648]">Sljedeće</span>
            </button>
          </> : currStep === 2 ? <>
            {/* tablicni unos podataka */}
            <p>Kliknite + za dodavati poznate podatke</p>
            <button id="add-known" className="flex p-1 items-center justify-center rounded-sm bg-[#92FF9F] [clip-path:inset(0_0_-10px_0)] [box-shadow:0_1px_2px_0_#222]" onClick={AddKnown}>+</button>

            <DataInput usedSymbols={usedSymbols} vars={{ setUsedSymbols: setUsedSymbols, known: known, setKnown: setKnown, nKnown: nRows, setNKnown: setNRows, chemicals: ["otap", "otv", "otp"] }} />

            <button className="flex p-1 items-center justify-center rounded-sm bg-[#92FF9F] [clip-path:inset(0_0_-10px_0)] [box-shadow:0_1px_2px_0_#222]" id="calcBtn" onClick={Calculate}>Izračunaj</button>
          </> : <>
            {/*sucelje za prikaz rezultata*/}
            <h3>Dobiveno:</h3>

            {/* izbornik tvari za koje korisnik zeli vidjeti rezulatat */}
            <Select className="shadow-sm clip-t" onChange={(event) => { setSelectedChem(event.target.value); }}>
              <Option value="Otopljena tvar" />
              <Option value="Otapalo" />
              <Option value="Otopina" />
              <Option value="Koncentracije" />
            </Select>

            {/*tablica za prikaz rezultata */}
            {selectedChem === "Otopljena tvar" ? <>
              <h4>Otopljena tvar</h4>
              <ShowTabledData calculatedData={calculated.otv} />
            </> : selectedChem === "Otapalo" ? <>
              <h4>Otapalo</h4>
              <ShowTabledData calculatedData={calculated.otap} />
            </> : selectedChem === "Otopina" ? <>
              <h4>Otopina</h4>
              <ShowTabledData calculatedData={calculated.otp} />
            </> : <>
              <h4>Koncentracije</h4>
              <ShowTabledData calculatedData={calculated.ext} />
            </>}

          </>}
        </div>
      </div>
    </div>
  );
}
export default SolutionCalc;