import { useState } from "react";
import { calcSolution } from "../../scripts/formulas.js";
function SolutionCalc() {
  const [known, setKnown] = useState([]);
  const [symbols, setSymbols] = useState([
    {
      symbol: "M",
      units: ["g/mol"],
      varied: true
    },
    {
      symbol: "m",
      units: ["g", "kg", "mg", "dg", "dag"],
      varied: true
    },
    {
      symbol: "n",
      units: ["mol", "mmol"],
      varied: true
    },
    {
      symbol: "D",
      units: ["g/cm^3",],
      varied: true
    },
    {
      symbol: "V",
      units: ["cm^3", "dm^3", "m^3"],
      varied: true
    },
    {
      symbol: "c",
      units: ["mol/L", "mmol/L"],
      varied: false
    },
    {
      symbol: "y",
      units: ["g/L"],
      varied: false
    },
    {
      symbol: "b",
      units: ["mol/kg"],
      varied: false
    },
    {
      symbol: "x",
      units: ["%"],
      varied: true
    },
    {
      symbol: "phi",
      units: ["%"],
      varied: true
    },
    {
      symbol: "w",
      units: ["%"],
      varied: true
    },
  ]);
  const [nRows, setNRows] = useState(0);
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



  function HandleTextChange(event) {
    if (event.target.type == "checkbox") {
      setFormulas({ ...formulas, [event.target.id]: event.target.checked });
    }
    else { setFormulas({ ...formulas, [event.target.id]: event.target.value }); }
    console.log(formulas);
  }
  function AddKnown() {
    let tbody = document.getElementById("tKnown");
    let trow = document.createElement("tr");
    trow.setAttribute("id", nRows);
    tbody.appendChild(trow);
    setKnown([...known, new KnownInfo(nRows, "V", "otap", 0, "m^3")]);
    setNRows(nRows + 1);
  }
  function KnownInfo(id, symbol, chem, quantity, unit) {
    this.id = id;
    this.symbol = symbol;
    this.chem = chem;
    this.quantity = quantity;
    this.unit = unit;
  }
  function DelKnown(event) {
    let targetRow = event.target.parentElement.parentElement;
    targetRow.remove();
    let arrEl = known.filter(el => el.id == targetRow.id ? true : false)[0];
    setKnown(known.splice(known.indexOf(arrEl), 1));
  }
  function SymbolChange(event) {
    let targetRow = event.target.parentElement.parentElement;
    let unitSel = targetRow.children[3].children[0];
    let chemSel = targetRow.children[1].children[0];
    let selected = symbols.filter(el => el.symbol == event.target.value ? true : false)[0];
    console.log(event.target.value, targetRow.id, known);
    let data = known.filter(el => el.id == targetRow.id ? true : false)[0];
    console.log(data);
    data.symbol = event.target.value;
    unitSel.innerHTML = "";
    selected.units.forEach(el => {
      unitSel.innerHTML += `
    <option value="${el}">${el}</option>`;
      data.unit = unitSel.value;
    });
    if (!selected.varied) {
      chemSel.innerHTML = `<option>/</option>`;
      chemSel.setAttribute('disabled', "true");
      data.chem = "/";
    } else {
      chemSel.innerHTML = `<option value="otap">otap</option>
    <option value="otv">otv</option>
    <option value="otp">otp</option>`;
      data.chem = "otap";
      chemSel.removeAttribute("disabled");
    }
    console.log(known);
  }
  function ChemChange(event) {
    let targetRow = event.target.parentElement.parentElement;
    let data = known.filter(el => el.id == targetRow.id ? true : false)[0];
    data.chem = event.target.value;
  }
  function QuanChange(event) {
    let targetRow = event.target.parentElement.parentElement;
    let data = known.filter(el => el.id == targetRow.id ? true : false)[0];
    data.quantity = parseFloat(event.target.value);
  }
  function UnitChange(event) {
    let targetRow = event.target.parentElement.parentElement;
    let data = known.filter(el => el.id == targetRow.id ? true : false)[0];
    data.unit = event.target.value;
  }

  async function Calculate() {
    let data = calcSolution(known, formulas.otap, formulas.otv, formulas.plin);
    console.log(data)
    await data.forEach(el => {console.log(el);return(setCalculated({ ...calculated, [el[1]]: el[0] }))});
    await setCalculated({ ...calculated, ["calculated"]: true });
    console.log(calculated)
  }

  return (
    <div className="text-white flex flex-col mx-8">
      <h1 className="center mb-5 mt-2">Kalkultor za otopine</h1>
      <p>Unesite kemijske formule za otapalo i otopljenu tvar.</p>
      <p> Kliknite + za dodavat poznate podatke. Ako se podatak odnosi na otopljenu tvar koristite otv, ako se odnosi na otapalo otap, ako se odnosi na otopinu koristite, otp</p>
      <p></p>
      <div id="known">
        <h3>Poznato:</h3>
        <div className="flex gap-2 mb-1 mt-1">
          <label htmlFor="otap">Formula Otapala (otap)</label>
          <input onChange={HandleTextChange} className="rounded-sm bg-slate-700 text-white p-1 border border-slate-500" id="otap" />
        </div>
        <div className="flex gap-2 mb-1 mt-1">
          <label htmlFor="otv">Formula Otopljene tvari (otv)</label>
          <input onChange={HandleTextChange} className="rounded-sm bg-slate-700 text-white p-1 border border-slate-500" id="otv" />
          <input onChange={HandleTextChange} id="plin" type="checkbox" />
          <label htmlFor="plin">Plin</label>
        </div>

        <button id="add-known" className="px-3 py-1 rounded-sm bg-green-600 text-white border border-green-500" onClick={AddKnown}>+</button>
        <table className="bg-slate-700 w-full">
          <thead className="border-b-2 border-white">
            <th>Podatak</th>
            <th>Tvar</th>
            <th>Količina</th>
            <th>Mjerna Jedinica</th>
            <th>Izbriši</th>
          </thead>
          <tbody id="tKnown">
            {known.map(el => (
              <tr id={el.id}>
                <td>
                  <select className="bg-slate-800 text-white border border-slate-500" onChange={SymbolChange}>
                    <option value="V">V</option>
                    <option value="D">ρ</option>
                    <option value="n">n</option>
                    <option value="m">m</option>
                    <option value="phi">φ</option>
                    <option value="w">w</option>
                    <option value="x">x</option>
                    <option value="y">y</option>
                    <option value="c">c</option>
                    <option value="b">b</option>
                  </select>
                </td>
                <td>
                  <select className="bg-slate-800 text-white border border-slate-500" onChange={ChemChange}>
                    <option value="otap">otap</option>
                    <option value="otv">otv</option>
                    <option value="otp">otp</option>
                  </select>
                </td>
                <td>
                  <input className="rounded-sm bg-slate-700 text-white p-1 border border-slate-500" onChange={QuanChange} type="number" />
                </td>
                <td>
                  <select className="bg-slate-800 text-white border border-slate-500" onChange={UnitChange}>
                    <option value="m^3">m^3</option>
                    <option value="cm^3">cm^3</option>
                    <option value="dm^3">dm^3</option>
                  </select>
                </td>
                <td>
                  <button onClick={DelKnown} className="p-1 rounded-sm bg-red-600 text-white border border-red-500">-</button>
                </td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>
      <hr />
      <div id="calculated">
        <h3>Dobiveno:</h3>
        {!calculated.calculated?(
        <button className="p-1 rounded-sm bg-blue-600 text-white border border-blue-500" id="calcBtn" onClick={Calculate}>Izračunaj</button>
        ):false}
        
        {calculated.calculated ? (<>
          <h4>Otopljena tvar</h4>
          <table className="bg-slate-700 w-full">
            <thead className="border-b-2 border-white">
              <th>Podatak</th>
              <th>Količina</th>
              <th>Mjerna Jedinica</th>
            </thead>
            <tbody id="tKnown">
              {Object.keys(calculated.otv).map((key, index) => (
                <tr key={index}>
                  <td>
                    {key}
                  </td>
                  <td>
                    {calculated.otv[key].quantity}
                  </td>
                  <td>
                    {calculated.otv[key].unit}
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
          <h4>Otapalo</h4>
          <table className="bg-slate-700 w-full">
            <thead className="border-b-2 border-white">
              <th>Podatak</th>
              <th>Količina</th>
              <th>Mjerna Jedinica</th>
            </thead>
            <tbody id="tKnown">
              {Object.keys(calculated.otap)}
              {Object.keys(calculated.otap).map((key, index) => (calculated.otap[key] != 0 && calculated.otap[key] != Infinity) ? (
                <tr key={index}>
                  <td>
                    {key}
                  </td>
                  <td>
                    {calculated.otap[key].quantity}
                  </td>
                  <td>
                    {calculated.otap[key].unit}
                  </td>
                </tr>
              ) : false)}
            </tbody>
          </table>
          <h4>Otopina</h4>
          <table className="bg-slate-700 w-full">
            <thead className="border-b-2 border-white">
              <th>Podatak</th>
              <th>Količina</th>
              <th>Mjerna Jedinica</th>
            </thead>
            <tbody id="tKnown">
              {Object.keys(calculated.otp).map((key, index) => (calculated.otp[key] != 0 && key != "M" && calculated.otp[key] != Infinity) ? (
                <tr key={index}>
                  <td>
                    {key}
                  </td>
                  <td>
                    {calculated.otp[key].quantity}
                  </td>
                  <td>
                    {calculated.otp[key].unit}
                  </td>
                </tr>
              ) : false)}
            </tbody>
          </table>
          <h4>Koncentracije</h4>
          <table className="bg-slate-700 w-full">
            <thead className="border-b-2 border-white">
              <th>Podatak</th>
              <th>Količina</th>
              <th>Mjerna Jedinica</th>
            </thead>
            <tbody id="tKnown">
              {Object.keys(calculated.ext).map((key, index) => (calculated.ext[key] != 0 && calculated.ext[key] != Infinity) ? (
                <tr key={index}>
                  <td>
                    {key}
                  </td>
                  <td>
                    {calculated.ext[key].quantity}
                  </td>
                  <td>
                    {calculated.ext[key].unit}
                  </td>
                </tr>
              ) : false)}
            </tbody>
          </table>
        </>) : false}

      </div>
    </div>
  );
}
// if(el[prop] != 0 && !(prop=="M"&&id==2) && el[prop]!=Infinity){
//   tr.innerHTML+=`<td>${prop}</td>
//   <td>
//     ${el[prop].quantity}
//   </td>
//   <td>
//     ${el[prop].unit}
//   </td>`
export default SolutionCalc;