import { useEffect, useState } from "react";
import ReactionParticipants from "../../components/equation/ReactionParticipants";
import { calcConstant } from "../../scripts/equilibriumcalc";
import Input from "../../components/form/Input.js";
import Option from "../../components/form/Option.js";
import Select from "../../components/form/Select.js";
import Table from "../../components/table/Table.js";
function EquilibriumCalc() {
  const [reactants, setReactants] = useState([]);
  const [nReactants, setNReactants] = useState(0);
  const [nProducts, setNProducts] = useState(0);
  const [products, setProducts] = useState([]);
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
    }
  ]);
  const [known, setKnown] = useState([])
  const [nKnown, setNKnown] = useState(0)
  const [equationEntered, setEquationEntered] = useState(false)
  const [equation, setEquation] = useState([])
  function handleAddReactant(event) {
    event.target.className += " hidden"
    setNReactants(nReactants + 1);
    setReactants([...reactants, new Participant('reactant', nReactants)]);
  }
  function handleAddProduct(event) {
    event.target.className += " hidden";
    setNProducts(nProducts + 1);
    setProducts([...products, new Participant('product', nProducts)]);
  }
  function Participant(type, id) {
    this.state = 'gas';
    this.element = '';
    this.coefficient = 1;
    this.id = id;
    this.type = type;
  }
  function handleCalc() {
    let reactantsInput;
    let productsInput;

    calcConstant(reactants, products);
  }
  function AddKnown(){
    setKnown([...known, new KnownInfo(nKnown, "c", "HI", 0, "mol/dm3", "final")])
  }
  function KnownInfo(id, symbol, chem, quantity, unit, ext) {
    this.id = id;
    this.symbol = symbol;
    this.chem = chem;
    this.quantity = quantity;
    this.unit = unit;
    this.ext = ext
  }
  function handleShowKnownForm() {
    setEquation([...reactants, "equilibrium", ...products])
    setEquationEntered(true)
  }
  useEffect(()=>console.log(products))
  function DelKnown(event) {
    let targetRow = event.target.parentElement.parentElement; //shit working
    setKnown(known => known.filter(el => el.id !== parseInt(targetRow.id) ? true : false));
  }
  function SymbolChange(event) {
    let targetRow = event.target.parentElement.parentElement;
    let unitSel = targetRow.children[3].children[0];
    let chemSel = targetRow.children[1].children[0];
    let selected = symbols.filter(el => el.symbol === event.target.value ? true : false)[0];
    console.log(event.target.value, targetRow.id, known);
    let data = known.filter(el => el.id === targetRow.id ? true : false)[0];
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
    let data = known.filter(el => el.id === parseInt(targetRow.id) ? true : false)[0];
    console.log(targetRow,)
    data.chem = event.target.value; //ne radi
  }
  function QuanChange(event) {
    let targetRow = event.target.parentElement.parentElement;
    let data = known.filter(el => el.id === parseInt(targetRow.id) ? true : false)[0];
    data.quantity = parseFloat(event.target.value);
  }
  function UnitChange(event) {
    let targetRow = event.target.parentElement.parentElement;
    let data = known.filter(el => el.id === parseInt(targetRow.id) ? true : false)[0];
    data.unit = event.target.value;
  }
  return (
    <div id="0" className="flex flex-col mx-4">
      <div>
        <h2>Kalkulator ravnotežne konstante</h2>
      </div>
      <h2>Upiši kemijsku jednadžbu</h2>
      <div className="h-20 grid grid-cols-7" id="equationContainer">
        <div className="border overflow-auto border-rose-600 flex flex-row" id='reactantsContainer' style={{ gridColumnStart: "1", gridColumnEnd: "4" }}>
          {reactants.length != 0 ? reactants.map((el) => (
            <ReactionParticipants vars={{ nProducts: nProducts, setNProducts: setNProducts, products: products, setProducts: setProducts, nReactants: nReactants, setNReactants: setNReactants, reactants: reactants, setReactants: setReactants }} type={el.type} id={`${el.id} ${el.type}`} />
          )) : (<button className="flex-1 p-1 rounded-sm bg-green-600 text-white border border-green-500" onClick={handleAddReactant}>+</button>)}
        </div>
        <div className="border-green-600 border">
        </div>
        <div className="border-rose-600 overflow-auto flex flex-row border" id='productsContainer' style={{ gridColumnStart: "5", gridColumnEnd: "8" }}>
          {products.length != 0 ? products.map((el) => (
            <ReactionParticipants vars={{ nProducts: nProducts, setNProducts: setNProducts, products: products, setProducts: setProducts, nReactants: nReactants, setNReactants: setNReactants, reactants: reactants, setReactants: setReactants }} type={el.type} id={`${el.id} ${el.type}`} />
          )) : (<button className="flex-1 p-1 rounded-sm bg-green-600 text-white border border-green-500" onClick={handleAddProduct} >+</button>)}
        </div>
      </div>
      <div>
        <button className="p-1 rounded-sm bg-green-600 text-white border border-green-500" onClick={handleShowKnownForm}>Submit</button>
      </div>
      <div>
        {equationEntered ? (<><button id="add-known" className="px-3 py-1 rounded-sm bg-green-600 text-white border border-green-500" onClick={AddKnown}>+</button><Table columns={["Podatak", "Tvar", "Količina", "Mjerna Jedinica", "Izbriši"]}>
          {known.map(el => (
            <tr id={el.id} key={el.id}>
              <td>
                <Select onChange={SymbolChange}>
                  <Option value="V" />
                  <Option value="D" />
                  <Option value="n" />
                  <Option value="m" />
                  <Option value="y" />
                  <Option value="c" />
                </Select>
              </td>
              <td>
                <Select onChange={ChemChange}>
                  {equation.map(el => el !== 'equlibrium' ? (<Option value={el.element} />) : (<></>))}
                </Select>
              </td>
              <td>
                <input className="rounded-sm bg-slate-700 text-white p-1 border border-slate-500" onChange={QuanChange} type="number" />
              </td>
              <td>
                <Select onChange={UnitChange}>
                  <Option value="m^3" />
                  <Option value="cm^3" />
                  <Option value="dm^3" />
                </Select>
              </td>
              <td>
                <button onClick={DelKnown} className="p-1 rounded-sm bg-red-600 text-white border border-red-500">-</button>
              </td>
            </tr>
          ))}
        </Table></>) : (<></>)}
      </div>
      <button className="p-1 rounded-sm bg-green-600 text-white border border-green-500" onClick={handleCalc}>Izračunaj</button>
      <div></div>
    </div>
  );
}

export default EquilibriumCalc;