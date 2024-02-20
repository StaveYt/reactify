import { useEffect, useState } from "react";
import Select from "../form/Select";
import Table from "../table/Table";
import Option from "../form/Option";
import Input from "../form/Input";
function DataInput(props) {
  const symbols = [
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
  ];
  const [blank, setBlank] = useState(false);
  const [newUsedSymbols, setNewUsedSymbols] = useState(props.usedSymbols.map((el, ind) => {
    if (ind < props.usedSymbols.length - 1) {
      let filteredSymbols = symbols.filter(symbol => symbol.symbol == el.symbol ? true : false)[0];
      return ({ ...el, units: filteredSymbols.units, varied: filteredSymbols.varied });
    } else {
      return (el);
    }
  }));
  useEffect(() => {
    console.log(symbols);
    if (props.vars.known.length != 0) { console.log(newUsedSymbols[newUsedSymbols[newUsedSymbols.length - 1].indexOf(props.vars.known[0].symbol)]); }
  });

  function SymbolChange(event) {
    let targetRow = event.target.parentElement.parentElement;
    let data = props.vars.known.filter(el => el.id === parseInt(targetRow.id) ? true : false)[0];
    data.symbol = event.target.value;
    if (newUsedSymbols[newUsedSymbols[newUsedSymbols.length - 1].indexOf(data.symbol)].envOnly === true) { data.chem = 'mixture'; }
    setBlank(!blank);
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
        data.ext = event.target.value;
    }
  }
  function DelKnown(event) {
    let targetRow = event.target.parentElement.parentElement;
    props.vars.setKnown(props.vars.known.filter(el => el.id !== parseInt(targetRow.id) ? true : false));
  }
  return (<Table columns={["Podatak", "Tvar", "Količina", "Mjerna Jedinica", "Dodatak", "Izbriši"]}>
    {props.vars.known.map(el => {
      let data = props.vars.known.filter(knownEl => knownEl.id === parseInt(el.id) ? true : false)[0];
      return (
        <tr id={el.id} key={el.id}>
          <td>
            <Select className='w-[95%] h-[95%]' id='symbol' onChange={SymbolChange}>

              {symbols.map((symbolEl) => { if (props.usedSymbols[props.usedSymbols.length - 1].indexOf(symbolEl.symbol) != -1) { return (<Option selected={symbolEl.symbol == data.symbol} value={symbolEl.symbol} />); } })}
            </Select>
          </td>
          <td>
            <Select className='w-[95%] h-[95%]' disabled={newUsedSymbols[newUsedSymbols[newUsedSymbols.length - 1].indexOf(data.symbol)].envOnly ? true : false} id='chem' onChange={handleInputChange}>
              {props.vars.chemicals.map((chem) => (
                <Option selected={chem === data.chem} value={chem} />
              ))}
              {newUsedSymbols[newUsedSymbols[newUsedSymbols.length - 1].indexOf(data.symbol)].env === true && <Option selected={'mixture' === data.chem} value={'mixture'} />}
            </Select>
          </td>
          <td className="max-w-[90px]">
            <Input id="quantity" className="max-w-[95%] my-1" type="number" onChange={handleInputChange} />
          </td>
          <td>
            <Select id='unit' className='w-[95%] h-[95%]' onChange={handleInputChange}>
              {newUsedSymbols[newUsedSymbols[newUsedSymbols.length - 1].indexOf(data.symbol)].units.map((unit) => (<Option selected={unit === data.unit} value={unit} />))}
            </Select>
          </td>
          <td>
            <Select id='ext' className='w-[95%] h-[95%]' onChange={handleInputChange}>
              {newUsedSymbols[newUsedSymbols[newUsedSymbols.length - 1].indexOf(data.symbol)].ext.map((extra) => { if (newUsedSymbols[newUsedSymbols[newUsedSymbols.length - 1].indexOf(data.symbol)].ext != []) { return (<Option selected={extra === data.ext} value={extra} />); } })}
            </Select>
          </td>
          <td>
            <button onClick={DelKnown} className="p-2 w-10 rounded-sm bg-[#FFC591] aspect-square text-white">-</button>
          </td>
        </tr>
      );
    })}
  </Table>);
}

export default DataInput; 