import { useEffect, useState } from "react";
import ReactionParticipants from "../../components/equation/ReactionParticipants";
import { calcConstant } from "../../scripts/equilibriumcalc";
import DataInput from "../../components/dataInput/DataInput";
function EquilibriumCalc() {
  const [reactants, setReactants] = useState([]);
  const [nReactants, setNReactants] = useState(0);
  const [nProducts, setNProducts] = useState(0);
  const [products, setProducts] = useState([]);
  const [usedSymbols, setUsedSymbols] = useState([
    { symbol: 'c', envOnly: false, env: false, ext:['final','start'] }, 
    { symbol: 'V', envOnly: false, env: true, ext:[] }, 
    { symbol: 'n', envOnly: false, env: false, ext:['final','start'] }, 
    { symbol: 'T', envOnly: true, env: true, ext:[] },
    { symbol: 'p', envOnly: false, env: true, ext:[] }, 
    { symbol: 'm', envOnly: false, env: false, ext:['final','start'] },
    { symbol: 'Kc', envOnly: true, env: true, ext:[] },
    { symbol: 'Kp', envOnly: true, env: true, ext:[] },
    ['c','V','n','T','p','m','Kc','Kp']
  ]);
  const [known, setKnown] = useState([]);
  const [nKnown, setNKnown] = useState(0);
  const [equation, setEquation] = useState([]);
  const [calculated, setCalculated] = useState(undefined);
  function handleAddReactant(event) {
    event.target.className += " hidden";
    setNReactants(nReactants + 1);
    setReactants([...reactants, new Participant('reactant', nReactants)]);
  }
  function handleAddProduct(event) {
    event.target.className += " hidden";
    setNProducts(nProducts + 1);
    setProducts([...products, new Participant('product', nProducts)]);
  }
  function Participant(type, id) {
    this.state = 'g';
    this.element = '';
    this.coefficient = 1;
    this.id = id;
    this.type = type;
  }
  function handleCalc() {

    let reactantsInput = [...reactants];
    let productsInput = [...products];
    let knownTemp = [];
    reactants.forEach((el, ind) => { knownTemp = known.filter(knownEl => knownEl.chem === el.element ? true : false); el.known = [...knownTemp]; reactantsInput[ind] = el; });
    products.forEach((el, ind) => { knownTemp = known.filter(knownEl => knownEl.chem === el.element ? true : false); el.known = [...knownTemp]; productsInput[ind] = el; });
    let extra = known.filter((el)=>el.chem==='mixture')
    let calculatedConstant = calcConstant(reactantsInput, productsInput, extra, nKnown);
    console.log(calculatedConstant);
    setCalculated(calculatedConstant);
  }
  function AddKnown() {
    setKnown([...known, new KnownInfo(nKnown, "c", "HI", 0, "mol/dm3", "final")]);
    setNKnown(nKnown + 1);
  }
  function KnownInfo(id, symbol, chem, quantity, unit, ext) {
    this.id = id;
    this.symbol = symbol;
    this.chem = chem;
    this.quantity = quantity;
    this.unit = unit;
    this.ext = ext;
  }
  function handleShowKnownForm() {
    setEquation([...reactants, "equilibrium", ...products]);
  }
  useEffect(() => console.log(equation.map(el => el !== 'equilibrium' ? el.element : false)));
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
        {equation.length !== 0 ? (<>
          <button id="add-known" className="px-3 py-1 rounded-sm bg-green-600 text-white border border-green-500" onClick={AddKnown}>+</button>
          <DataInput usedSymbols={usedSymbols} vars={{ known: known, setKnown: setKnown, nKnown: nKnown, setNKnown: setNKnown, chemicals: equation.filter(el => el !== 'equilibrium' ? true : false).map(el => el.element) }} />
        </>) : (<></>)}
      </div>
      <button className="p-1 rounded-sm bg-green-600 text-white border border-green-500" onClick={handleCalc}>Izračunaj</button>
      <div>
        {calculated !== undefined ? (<><h1>Kc: {calculated.Kc.quantity}</h1><h1>Kp: {calculated.Kp.quantity}</h1></>) : (<></>)}
      </div>
    </div>
  );
}

export default EquilibriumCalc;