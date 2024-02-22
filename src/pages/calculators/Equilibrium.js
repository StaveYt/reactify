import { useEffect, useState } from "react";
import ReactionParticipants from "../../components/equation/ReactionParticipants";
import { calcConstant } from "../../scripts/equilibriumcalc";
import DataInput from "../../components/dataInput/DataInput";
import StepProgressBar from "../../components/stepProgress/StepProgressBar";
import Select from "../../components/form/Select";
import Option from "../../components/form/Option";
import '../../main.css';

function EquilibriumCalc() {
  const [reactants, setReactants] = useState([]);
  const [nReactants, setNReactants] = useState(0);
  const [nProducts, setNProducts] = useState(0);
  const [products, setProducts] = useState([]);
  const [usedSymbols, setUsedSymbols] = useState([
    { symbol: 'c', envOnly: false, env: false, ext: ['final', 'start'] },
    { symbol: 'V', envOnly: false, env: true, ext: [] },
    { symbol: 'n', envOnly: false, env: false, ext: ['final', 'start'] },
    { symbol: 'T', envOnly: true, env: true, ext: [] },
    { symbol: 'p', envOnly: false, env: true, ext: [] },
    { symbol: 'm', envOnly: false, env: false, ext: ['final', 'start'] },
    { symbol: 'Kc', envOnly: true, env: true, ext: [] },
    { symbol: 'Kp', envOnly: true, env: true, ext: [] },
    ['c', 'V', 'n', 'T', 'p', 'm', 'Kc', 'Kp']
  ]);
  const [known, setKnown] = useState([]);
  const [nKnown, setNKnown] = useState(0);
  const [simpleEquation, setSimpleEquation] = useState([]);
  const [calculated, setCalculated] = useState(undefined);
  const [currStep, setCurrStep] = useState(1);

  //dodavaju reaktant / produkt
  function HandleAddReactant() {
    setNReactants(nReactants + 1);
    setReactants([...reactants, new Participant('reactant', nReactants)]);
  }
  function HandleAddProduct() {
    setNProducts(nProducts + 1);
    setProducts([...products, new Participant('product', nProducts)]);
  }


  //konstruktorska funkcija za sudionke reakcije
  function Participant(type, id) {
    this.state = 'g';
    this.element = '';
    this.coefficient = 1;
    this.id = id;
    this.type = type;
  }

  //kalkulira Kc i Kp
  function Calculate() {
    if(known.length === 0){
      alert("Unesite podatke u tablicu")
    } else {
      setCurrStep(currStep + 1);

      let reactantsInput = [...reactants];
      let productsInput = [...products];
      let knownTemp = [];

      //svakom elementu dodaje njihove podatke za lakse sortiranje
      reactants.forEach((el, ind) => { 
        knownTemp = known.filter(knownEl => knownEl.chem === el.element ? true : false); 
        el.known = [...knownTemp]; reactantsInput[ind] = el; 
      });
      products.forEach((el, ind) => { 
        knownTemp = known.filter(knownEl => knownEl.chem === el.element ? true : false); 
        el.known = [...knownTemp]; productsInput[ind] = el; 
      });

      //odvaja one stvari koje se odnose na cijelu reakciju kao toplina
      let extra = known.filter((el) => el.chem === 'mixture');
      let calculatedConstant = calcConstant(reactantsInput, productsInput, extra, nKnown);

      setCalculated(calculatedConstant);
    }
  }

  //dodaje poznate podatke u niz
  function AddKnown() {
    let defaultChem = simpleEquation[0];

    setKnown([...known, new KnownInfo(nKnown, "c", defaultChem, 0, "mol/dm3", "final")]);
    setNKnown(nKnown + 1);
  }

  //konstruktorska funkcija za poznate podatke
  function KnownInfo(id, symbol, chem, quantity, unit, ext) {
    this.id = id;
    this.symbol = symbol;
    this.chem = chem;
    this.quantity = quantity;
    this.unit = unit;
    this.ext = ext;
  }

  //prikazuje tablicu za unos podataka 
  function HandleShowKnownForm() {
    let tempEquation = [...reactants, ...products];
    if (reactants.length === 0 || products.length === 0) {
      alert("Unesite valjanu kemijsku jednadzbu");
    } else {
      setCurrStep(currStep + 1);
      setSimpleEquation(tempEquation.map(el => el.element));
    }
  }
  
  return (
    <div className="flex flex-col h-full mx-5">
      <h2 className="text-[#464648] font-bold text-lg">Kalkulator ravnotežne konstante</h2>

      <div className="flex lg:max-w-[800px] md:max-w-[800px] max-sm:w-[90%] self-center md:mx-4 mx-1 flex-col min-w-[150px] gap-10">
        {/* traka napretka */}
        <StepProgressBar currStep={currStep} stepLength={[1, 2, 3]} />

        {/* glavno sucelje */}
        <div className="bg-white max-sm:w-[90%]  lg:w-full md:w-full min-h-[150px] min-w-[150px] flex flex-col m-auto self-center p-10 justify-center shadow-sm shadow-[#222] gap-5 rounded-sm">
          <div className="relative gap-5 sm:min-w-[500px] flex flex-col justify-center">
            {currStep === 1 ? <>
              <h2>Upiši kemijsku jednadžbu</h2>
              {/* unos kemijske jednadzbe */}
              <div>
                {/* desktop prikaz */}
                <div className="max-sm:hidden grid h-[70px] grid-cols-7 my-3" id="equationContainer">
                  <div className="relative " style={{ gridColumnStart: "1", gridColumnEnd: "4" }}>
                    <div className="absolute grid grid-cols-10 top-[-35%] h-5  w-full">
                      <button style={{ gridColumnStart: "1", gridColumnEnd: "4" }} onClick={HandleAddReactant} className="flex h-full items-center justify-center rounded-t-sm bg-light-green shadow-sm clip-tr">+</button>
                      <div className="text-center flex items-center justify-center" style={{ gridColumnStart: "5", gridColumnEnd: "10" }}>
                        <span>REAKTANTI</span>
                      </div>

                    </div>
                    <div className="border overflow-auto h-full rounded-sm border-[#909093]  gap-2 flex flex-row" id='reactantsContainer'>
                      {reactants.length !== 0 ? reactants.map((el) => (
                        <ReactionParticipants vars={{ nProducts: nProducts, setNProducts: setNProducts, products: products, setProducts: setProducts, nReactants: nReactants, setNReactants: setNReactants, reactants: reactants, setReactants: setReactants }} type={el.type} id={`${el.id} ${el.type}`} />
                      )) : (<></>)}
                    </div>
                  </div>
                  <div className="flex items-center justify-center p-1">
                    <Select className="text-lg">
                      <Option value="⇌" />
                    </Select>
                  </div>
                  <div className="relative " style={{ gridColumnStart: "5", gridColumnEnd: "8" }}>
                    <div className="absolute grid grid-cols-10 top-[-35%] h-5  w-full">
                      <button style={{ gridColumnStart: "1", gridColumnEnd: "4" }} onClick={HandleAddProduct} className="flex h-full items-center justify-center rounded-t-sm bg-light-green shadow-sm clip-tr">+</button>
                      <div className="text-center flex items-center justify-center" style={{ gridColumnStart: "5", gridColumnEnd: "10" }}>
                        <span>PRODUKTI</span>
                      </div>

                    </div>
                    <div className="border overflow-auto h-full rounded-sm border-[#909093]  gap-2 flex flex-row" id='productsContainer' >
                      {products.length !== 0 ? products.map((el) => (
                        <ReactionParticipants vars={{ nProducts: nProducts, setNProducts: setNProducts, products: products, setProducts: setProducts, nReactants: nReactants, setNReactants: setNReactants, reactants: reactants, setReactants: setReactants }} type={el.type} id={`${el.id} ${el.type}`} />
                      )) : (<></>)}
                    </div>
                  </div>
                </div>

                {/* mobilni prikaz*/}
                <div className="sm:hidden flex flex-col gap-5 grow my-3" id="equationContainer">
                  <div className="relative h-[70px]">
                    <div className="absolute grid grid-cols-10 top-[-35%] h-5  w-full">
                      <button style={{ gridColumnStart: "1", gridColumnEnd: "4" }} onClick={HandleAddReactant} className="flex h-full items-center justify-center rounded-t-sm bg-light-green shadow-sm clip-tr">+</button>
                      <div className="text-center flex items-center justify-center" style={{ gridColumnStart: "5", gridColumnEnd: "10" }}>
                        <span>REAKTANTI</span>
                      </div>

                    </div>
                    <div className="border overflow-auto h-full rounded-sm border-[#909093]  gap-2 flex flex-row" id='reactantsContainer'>
                      {reactants.length !== 0 ? reactants.map((el) => (
                        <ReactionParticipants vars={{ nProducts: nProducts, setNProducts: setNProducts, products: products, setProducts: setProducts, nReactants: nReactants, setNReactants: setNReactants, reactants: reactants, setReactants: setReactants }} type={el.type} id={`${el.id} ${el.type}`} />
                      )) : (<></>)}
                    </div>
                  </div>
                  <div className="flex items-center justify-center p-1">
                    <Select className="text-lg">
                      <Option value="⇌" />
                    </Select>
                  </div>
                  <div className="relative  h-[70px] max-sm:my-4">
                    <div className="absolute grid grid-cols-10 top-[-35%] h-5  w-full">
                      <button style={{ gridColumnStart: "1", gridColumnEnd: "4" }} onClick={HandleAddProduct} className="flex h-full items-center justify-center rounded-t-sm bg-light-green shadow-sm clip-tr">+</button>
                      <div className="text-center flex items-center justify-center" style={{ gridColumnStart: "5", gridColumnEnd: "10" }}>
                        <span>PRODUKTI</span>
                      </div>

                    </div>
                    <div className="border overflow-auto h-full rounded-sm border-[#909093]  gap-2 flex flex-row" id='productsContainer' >
                      {products.length !== 0 ? products.map((el) => (
                        <ReactionParticipants vars={{ nProducts: nProducts, setNProducts: setNProducts, products: products, setProducts: setProducts, nReactants: nReactants, setNReactants: setNReactants, reactants: reactants, setReactants: setReactants }} type={el.type} id={`${el.id} ${el.type}`} />
                      )) : (<></>)}
                    </div>
                  </div>
                </div>
              </div>
              <button className="flex p-1 items-center justify-center rounded-sm bg-light-green shadow-sm clip-t" onClick={HandleShowKnownForm}>
                <span className="text-[#464648]">Sljedeće</span>
              </button>
            </> : currStep === 2 ? <>
              {/* unos podataka */}
              <button id="add-known" className="flex p-1 items-center justify-center rounded-sm bg-light-green shadow-sm clip-t" onClick={AddKnown}>+</button>
              <DataInput usedSymbols={usedSymbols} vars={{ setUsedSymbols: setUsedSymbols, known: known, setKnown: setKnown, nKnown: nKnown, setNKnown: setNKnown, chemicals: simpleEquation}} />
              <button className="flex p-1 items-center justify-center rounded-sm bg-light-green clip-t shadow-sm" onClick={Calculate}>Izračunaj</button>
            </> : <>
              {/* rezultat */}
              <h2>Rezultat:</h2>
              {calculated !== undefined ? <div>
                <h1>Kc: {calculated.Kc.quantity}</h1>
                <h1>Kp: {calculated.Kp.quantity}</h1>
              </div> : <></>}
            </>}
          </div>
        </div>
      </div>
    </div>
  );
}

export default EquilibriumCalc;