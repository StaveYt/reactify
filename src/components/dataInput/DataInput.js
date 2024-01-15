import { useEffect, useState } from "react";
import Select from "../form/Select";
import Table from "../table/Table";
import Option from "../form/Option";
function DataInput(props) {
  const [symbols, setSymbols] = useState([
    {
      symbol: "M",
      units: ["g/mol"],
      varied: true,

    },
    {
      symbol: "m",
      units: ["g", "kg", "mg", "dg", "dag"],
      varied: true,
    },
    {
      symbol: "n",
      units: ["mol", "mmol"],
      varied: true,
    },
    {
      symbol: "D",
      units: ["g/cm^3",],
      varied: true,
    },
    {
      symbol: "V",
      units: ["cm^3", "dm^3", "m^3"],
      varied: true,
    },
    {
      symbol: "c",
      units: ["mol/L", "mmol/L"],
      varied: false,
    },
    {
      symbol: "y",
      units: ["g/L"],
      varied: false,
    },
    {
      symbol: "b",
      units: ["mol/kg"],
      varied: false,
    },
    {
      symbol: "x",
      units: ["%"],
      varied: true,
    },
    {
      symbol: "phi",
      units: ["%"],
      varied: true,
    },
    {
      symbol: "w",
      units: ["%"],
      varied: true,
    },
    {
      symbol: "p",
      units: ["Pa", "kPa", "bar"],
      varied: true,
    },
    {
      symbol: "T",
      units: ["K", "C"],
      varied: false,
    },
    {
      symbol: "Kc",
      units: ['mol/dm3'],
      varied: false,
    },
    {
      symbol: "Kp",
      units: ['kPa'],
      varied: false,
    },
  ]);
  const [selectedSymbols, setSelectedSymbols] = useState([{
    symbol: "Kp",
    units: undefined,
    varied: false,
  }]);
  const [newUsedSymbols, setNewUsedSymbols] = useState(props.usedSymbols.map((el,ind)=>{
    if(ind<props.usedSymbols.length-1){
    let filteredSymbols = symbols.filter(symbol=>symbol.symbol==el.symbol?true:false)[0]
    console.log(symbols.filter(symbol=>symbol.symbol==el.symbol?true:false)[0])
    return({...el, units: filteredSymbols.units, varied: filteredSymbols.varied})}else{
    return(el)}
  }))
  useEffect(() => {
    let selected = symbols.filter(el => el.symbol === props.usedSymbols[0].symbol ? true : false)[0];
    let selectedSymbolsTemp = [...selectedSymbols]
    selectedSymbolsTemp[0] = {...selected, ext: props.usedSymbols[0].ext, env: props.usedSymbols[0].env, envOnly: props.usedSymbols[0].envOnly }
    setSelectedSymbols([...selectedSymbolsTemp]);
    // let newUsedSymbols = 
    
    // setNewUsedSymbols([...newUsedSymbols])
    // props.vars.addButton.current.addEventListener('click', addSelectedSymbol)
    console.log(newUsedSymbols)
  }, []);
  useEffect(() => {
    console.log(selectedSymbols)
    
  });
  function addSelectedSymbol(){
    setSelectedSymbols([...selectedSymbols, {}])
  }
  function SymbolChange(event) {
    let targetRow = event.target.parentElement.parentElement;
    let selected = symbols.filter(el => el.symbol === event.target.value ? true : false)[0];
    let symbolInd = props.usedSymbols[props.usedSymbols.length - 1].indexOf(event.target.value);
    let data = props.vars.known.filter(el => el.id === parseInt(targetRow.id) ? true : false)[0];
    data.symbol = event.target.value;
    let selectedSymbolsTemp = selectedSymbols
    selectedSymbolsTemp[targetRow.id] = { ...selected, ext: props.usedSymbols[symbolInd].ext, env: props.usedSymbols[symbolInd].env, envOnly: props.usedSymbols[symbolInd].envOnly }
    setSelectedSymbols([...selectedSymbolsTemp]);
  }
  function handleInputChange(event) {
    let targetRow = event.target.parentElement.parentElement;
    let data = props.vars.known.filter(el => el.id === parseInt(targetRow.id) ? true : false)[0];
    switch (event.target.id) {
      case 'chem':
        // console.log(event.target.value)
        data.chem = event.target.value;
        break;

      case 'quantity':
        data.quantity = parseFloat(event.target.value);
        break;
      case 'unit':
        data.unit = event.target.value;
        break;
      case 'ext':
        data.ext = event.target.value
    }
  }
  function DelKnown(event) {
    let targetRow = event.target.parentElement.parentElement;
    props.vars.setKnown(known => known.filter(el => el.id !== parseInt(targetRow.id) ? true : false));
  }
  return (<Table columns={["Podatak", "Tvar", "Količina", "Mjerna Jedinica", "Dodatak", "Izbriši"]}>
    {props.vars.known.map(el => (
      <tr id={el.id} key={el.id}>
        <td>
          <Select id='symbol' onChange={SymbolChange}>
            {symbols.map((symbolEl) => { if (props.usedSymbols[props.usedSymbols.length - 1].indexOf(symbolEl.symbol) != -1) { return (<Option selected={symbolEl.symbol==props.vars.known[el.id].symbol} value={symbolEl.symbol} />); } })}
          </Select>
        </td>
        <td>
          <Select disabled={newUsedSymbols[newUsedSymbols[newUsedSymbols.length-1].indexOf(props.vars.known[el.id].symbol)].envOnly ? true : false} id='chem' onChange={handleInputChange}>
            {props.vars.chemicals.map((el) => (
              <Option value={el} />
            ))}
            {newUsedSymbols[newUsedSymbols[newUsedSymbols.length-1].indexOf(props.vars.known[el.id].symbol)].env===true && <Option value={'mixture'} />}
          </Select>
        </td>
        <td>
          <input id="quantity" className="rounded-sm bg-slate-700 text-white p-1 border border-slate-500" onChange={handleInputChange} type="number" />
        </td>
        <td>
          <Select id='unit' onChange={handleInputChange}>
            {newUsedSymbols[newUsedSymbols[newUsedSymbols.length-1].indexOf(props.vars.known[el.id].symbol)].units.map((unit) => (<Option value={unit} />))}
          </Select>
        </td>
        <td>
          <Select id='ext' onChange={handleInputChange}>
            {newUsedSymbols[newUsedSymbols[newUsedSymbols.length-1].indexOf(props.vars.known[el.id].symbol)].ext.map((extra) => { if (newUsedSymbols[newUsedSymbols[newUsedSymbols.length-1].indexOf(props.vars.known[el.id].symbol)].ext != []) { return(<Option value={extra} />); } })}
          </Select>
        </td>
        <td>
          <button onClick={DelKnown} className="p-1 rounded-sm bg-red-600 text-white border border-red-500">-</button>
        </td>
      </tr>
    ))}
  </Table>);
}

export default DataInput; 