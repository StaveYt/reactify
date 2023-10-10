import { useState } from "react";

function SolutionCalc() {
    let [known, setKnown] = useState([]);
    let symbols = [
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
          units: ["mol/L","mmol/L"],
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
    ];
    function AddKnown() {
        let tbody = document.getElementById("tKnown");
        let trow = document.createElement("tr");
        trow.setAttribute("id", nRows);
        trow.innerHTML = `  <td>
        <select class="input-select" onchange="SymbolChange(event)">
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
        <select class="input-select" onchange="ChemChange(event)">
          <option value="otap">otap</option>
          <option value="otv">otv</option>
          <option value="otp">otp</option>
        </select>
      </td>
      <td>
        <input class="input" onchange="QuanChange(event)" type="number">
      </td>
      <td>
        <select class="input-select" onchange="UnitChange(event)">
          <option value="m^3">m^3</option>
          <option value="cm^3">cm^3</option>
          <option value="dm^3">dm^3</option>
        </select>
      </td>
      <td>
        <button onclick="DelKnown(event)" class="btn btn-danger">-</button>
      </td>`;
        tbody.appendChild(trow);
        setKnown(known.push(new KnownInfo(nRows, "V", "otap", 0, "m^3")));
        nRows++;
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
        let data = known.filter(el => el.id == targetRow.id ? true : false)[0];
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

    return (
        <>
        </>
    );
}

export default SolutionCalc;