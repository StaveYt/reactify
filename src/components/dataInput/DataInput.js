import { useState } from "react";
import Select from "../form/Select";
import Table from "../table/Table";
import Option from "../form/Option";
function DataInput(props) {
    // const [known, setKnown] = useState([]);
    // const [nRows, setNRows] = useState(0);
    // const [chemicals, setChemicals] = useState([])

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
    const [selectedSymbol, setSelectedSymbol] = useState(        {
      symbol: "M",
      units: ["g/mol"],
      varied: true
    })
    function SymbolChange(event) {
        let targetRow = event.target.parentElement.parentElement;
        let selected = symbols.filter(el => el.symbol === event.target.value ? true : false)[0];
        let data = props.vars.known.filter(el => el.id === parseInt(targetRow.id) ? true : false)[0];
        console.log(data);
        data.symbol = event.target.value;
        setSelectedSymbol(selected)
        console.log(props.vars.known);
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
                data.unit = event.target.value
                break;
        }
    }
    function DelKnown(event) {
        let targetRow = event.target.parentElement.parentElement;
        props.vars.setKnown(known => known.filter(el => el.id !== parseInt(targetRow.id) ? true : false));
    }
return(    <Table columns={["Podatak", "Tvar", "Količina", "Mjerna Jedinica", "Izbriši"]}>
        {props.vars.known.map(el => (
            <tr id={el.id} key={el.id}>
                <td>
                    <Select id='symbol' onChange={SymbolChange}>
                        {symbols.map((el)=>(<Option value={el.symbol} />))}
                    </Select>
                </td>
                <td>
                    <Select disabled={props.vars.chemicals[0]==='otap'?!selectedSymbol.varied:false} id='chem' onChange={handleInputChange}>
                        {props.vars.chemicals.map((el)=>(
                            <Option value={el} />
                        ))}
                    </Select>
                </td>
                <td>
                    <input id="quantity" className="rounded-sm bg-slate-700 text-white p-1 border border-slate-500" onChange={handleInputChange} type="number" />
                </td>
                <td>
                    <Select id='unit' onChange={handleInputChange}>
                        {selectedSymbol.units.map((el)=>(<Option value={el} />))}
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