import axios from "axios";

//dohvacenje elemenata iz databaze
let elements;
await axios.get("http://localhost:3001/table").then(res => elements = res.data.elements);
fetch("../json/table.json").then(res => res.json()).then(data => elements = data.elements);

//razdvajanje formule u djelove
function GetFormula(formula) {
  let dijeloviFormule = [];
  let tempDio = "";

  for (let i = 0; i <= formula.length; i++) {
    //ako smo dosli na sljedeci atom u formuli, prijasnji atom sa indeksom se sprema u niz
    if (isNaN(parseInt(formula[i])) && tempDio !== "" && formula[i] !== String(formula[i]).toLowerCase()) {
      dijeloviFormule.push(tempDio);
      tempDio = "";
      tempDio += formula[i];
    }
    else {
      //ako je trenutni dio formule broj dodaje se / kako bi se odvojio indeks od atoma
      if (isNaN(tempDio[tempDio.length - 1]) && isNaN(parseInt(formula[i])) !== true) {
        tempDio += "/";
      }
      tempDio += formula[i];
    }
  }
  return dijeloviFormule;
}

function CalcM(formula) {
  let dijeloviFormule = GetFormula(formula);
  let M = 0;
  let tempDio = "";

  for (let i = 0; i < dijeloviFormule.length; i++) {
    tempDio = dijeloviFormule[i].split("/"); //odvaja se atom od indeksa

    for (let j = 0; j < elements.length; j++) {
      if (tempDio[0] === elements[j].symbol) {
        //ako imamo indeks (imamo ga ako nije 1) onda mnozimo sa indeksom
        if (tempDio.length > 1) {
          M += elements[j].Ar * parseInt(tempDio[1]);
        }
        else {
          M += elements[j].Ar;
        }
      }
    }
  }

  M = M.toFixed(3);
  return parseFloat(M);
}

export default CalcM