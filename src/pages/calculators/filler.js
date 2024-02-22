import { useEffect, useState } from "react";
import ReactionParticipants from "../../components/equation/ReactionParticipants";
import { calcConstant } from "../../scripts/equilibriumcalc";

function EquilibriumCalc() {
  const [known, setKnown] = useState([]);
  const [reactants, setReactants] = useState([]);
  const [products, setProducts] = useState([]);
  const [nRows, setNRows] = useState(0);

  function AddKnown() {
    setKnown([...known, new Participant('reactant', nRows)]);
    setNRows(nRows + 1);

    console.log(nRows);
  }
  function Participant(type, id) {
    this.state = 'gas';
    this.element = '';
    this.coefficient = 1;
    this.id = id;
    this.type = type;
  }
  return (
    <div id="0" className="flex flex-col mx-4">
      <div>
        <h2>Kalkulator ravnotežne konstante</h2>
      </div>
      <h2>Upiši kemijsku jednadžbu</h2>
      <div className="h-20 grid grid-cols-7" id="equationContainer">
        <div className="border overflow-auto border-rose-600 flex flex-row" id='reactantsContainer' style={{ gridColumnStart: "1", gridColumnEnd: "4" }}>
          {known.length !== 0 ? known.map((el) => (
            <ReactionParticipants vars={{ nRows: nRows, setNRows: setNRows, known: known, setKnown: setKnown }} id={`${el.id} ${el.type}`} />
          )) : (<button className="flex-1 p-1 rounded-sm bg-green-600 text-white border border-green-500" onClick={AddKnown}>+</button>)}
        </div>
        <div className="border-green-600 border"></div>
        <div className="border-rose-600 overflow-auto flex flex-row border" id='productsContainer' style={{ gridColumnStart: "5", gridColumnEnd: "8" }}>
          {products.length !== 0 ? products.map((el) => (
            <ReactionParticipants vars={{ nRows: nRows, setNRows: setNRows, known: known, setKnown: setKnown }} id={`${el.id} ${el.type}`} />
          )) : (<button className="flex-1 p-1 rounded-sm bg-green-600 text-white border border-green-500" onClick={AddKnown} >+</button>)}
        </div>
      </div>
      <button className="p-1 rounded-sm bg-green-600 text-white border border-green-500" onClick={AddKnown}>Izračunaj</button>
      <div></div>
    </div>
  );
}

export default EquilibriumCalc;