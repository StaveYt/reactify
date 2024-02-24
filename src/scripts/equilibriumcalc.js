import { convertUnit } from "./convertUnit";
import CalcM from "./molarmassCalc";

const R = 8.314;

//konstruktorske funckije
function ElementInfo(element, ind, id, type, M, coefficient, state) {
  this.element = element;
  this.ind = ind;
  this.id = id;
  this.type = type;
  this.coefficient = coefficient;
  this.state = state;
  this.c0 = 0;
  this.c1 = 0;
  this.n0 = 0;
  this.n1 = 0;
  this.V = 0;
  this.m0 = 0;
  this.m1 = 0;
  this.M = M;
  this.x = 0;
  this.p = 0;
}
function KnownInfo(id, symbol, chem, quantity, unit) {
  this.id = id;
  this.symbol = symbol;
  this.chem = chem;
  this.quantity = quantity;
  this.unit = unit;
}

//racunanje za odredenu tvar
function CalcChemData(env, chem, type, nRows) {
  // console.log(chem);
  for (let i = 0; i < 3; i++) {
    //START masa
    if (chem.m0 !== 0) {
      if (chem.M !== 0 && chem.n === 0) {
        let calculated = chem.m0.quantity / chem.M.quantity;
        chem.n0 = new KnownInfo(nRows, "n", chem.element, calculated, "mol");
        nRows++;
      }

    } else {
    }
    //FINAL masa
    if (chem.m1 !== 0) {
      if (chem.M !== 0 && chem.n === 0) {
        let calculated = chem.m0.quantity / chem.M.quantity;
        chem.n1 = new KnownInfo(nRows, "n", chem.element, calculated, "mol");
        nRows++;
      }
    }
    //START mnozina
    if (chem.n0 !== 0) { //imamo n0
      if (chem.m0 === 0 && chem.M !== 0) {
        let calculated = chem.n0.quantity * chem.M.quantity;
        chem.m0 = new KnownInfo(nRows, "m", chem.element, calculated, "g");
        nRows++;
      }
      if (chem.c0 === 0 && env.V !== 0) {
        let calculated = chem.n0.quantity * env.V.quantity;
        chem.c0 = new KnownInfo(nRows, "c", chem.element, calculated, "mol/dm3");
        nRows++;
      }
      if (chem.V === 0 && env.p !== 0 && env.T !== 0) {
        let calculated = ((chem.n0.quantity * env.T.quantity * R) / env.p.quantity) * 1000;
        chem.V = new KnownInfo(nRows, "V", chem.element, calculated, "dm3");
        nRows++;
      }
      if (env.p === 0 && chem.V !== 0 && env.T !== 0) {
        let calculated = ((chem.n0.quantity * env.T.quantity * R) / (chem.V.quantity / 1000));
        env.p = new KnownInfo(nRows, "p", chem.element, calculated, "Pa");
        nRows++;
      }
      if (chem.n1 === 0 && env.X !== 0) {
        let calculated = chem.n0 - (env.X * chem.coefficient);
        chem.n1 = new KnownInfo(nRows, "n", chem.element, calculated, "mol");
        nRows++;
      }

    } else { //nemamo n0
      if (chem.c0 !== 0 && env.V !== 0) {
        let calculated = chem.c.quantity * env.V.quantity;
        chem.n0 = new KnownInfo(nRows, "n", chem.element, calculated, "mol");
        nRows++;
      }
    }
    //FINAL mnozina
    if (chem.n1 !== 0) { //imamo n1
      if (chem.m1 === 0 && chem.M !== 0) {
        let calculated = chem.n1.quantity * chem.M.quantity;
        chem.m1 = new KnownInfo(nRows, "m", type, calculated, "g");
        nRows++;
      }
      if (chem.c1 === 0 && env.V !== 0) {
        let calculated = chem.n1.quantity * env.V.quantity;
        chem.c1 = new KnownInfo(nRows, "c", chem.element, calculated, "mol/dm3");
        nRows++;
      }
      if (chem.n0 === 0 && env.X !== 0) {
        let calculated = chem.n1 + (env.X * chem.coefficient);
        chem.n0 = new KnownInfo(nRows, "n", type, calculated, "mol");
        nRows++;
      }
      if (type !== "product") {
        if (chem.x !== 0) {
          let x1 = 1 - (chem.x.quantity / 100);
          let n0 = chem.n1.quantity / (x1);
          let nEq = (n0 * (chem.x.quantity / 100)) / chem.coefficient;

          if (chem.n0 === 0) {
            chem.n0 = new KnownInfo(nRows, "n", chem.element, n0, "mol");
            nRows++;
          } else {
            nEq = chem.n0.quantity - chem.n.quantity;
          }
          if (env.X === 0) {
            env.X = new KnownInfo(nRows, "n", "mixture", nEq, 'mol');
            nRows++;
          }
        } else if (env.X !== 0) {

          let calculated = (env.X.quantity / chem.n1) * 100;
          chem.x = new KnownInfo(nRows, "x", chem.element, calculated, "%");
          nRows++;
        }
      }

    } else { //nemamo n1
      if (type !== "product" && chem.x !== 0 && env.X !== 0) {
        let n0;
        let x1 = 1 - (chem.x.quantity / 100);
        if (chem.n0 === 0) {
          n0 = env.X.quantity / (chem.x.quantity / 100);
          chem.n0 = new KnownInfo(nRows, "n", chem.element, n0, "mol");
          nRows++;
        } else {
          n0 = chem.n0.quantity;
        }
        let calculated = x1 * chem.n0.quantity;
        chem.n = new KnownInfo(nRows, "n", type, calculated, "mol");
        nRows++;
      } else {
        if (chem.c1 !== 0 && env.V !== 0) {
          let calculated = chem.c.quantity * env.V.quantity;
          chem.n1 = new KnownInfo(nRows, "n", type, calculated, "mol");
          nRows++;
        }
      }
    }

    if (chem.V !== 0) { //imamo volumen
      if (chem.n0 === 0 && env.T !== 0 && env.p !== 0) {
        let calculated = (env.p.quantity * chem.V.quantity) / (R * env.T.quantity);
        chem.n0 = new KnownInfo(nRows, "n", chem.element, calculated, "mol");
        nRows++;
      }

    } 

    if (chem.c0 !== 0 && chem.c1 !== 0 && env.X === 0) {
      let calculated;
      if (chem.type === 'product') {
        calculated = (chem.c1.quantity - chem.c0.quantity) / chem.coefficient;
      } else if (chem.type === 'reactant') {
        calculated = (chem.c0.quantity - chem.c1.quantity) / chem.coefficient;
      }

      env.X = new KnownInfo(nRows, "n", 'mixture', calculated, "mol");
      nRows++;
    }
    if (chem.c0 === 0 && chem.c1 !== 0 && env.X !== 0) {
      let calculated;
      if (chem.type === 'product') {
        calculated = chem.c1.quantity - env.X.quantity;
      } else if (chem.type === 'reactant') {
        calculated = chem.c1.quantity + env.X.quantity;
      }
      chem.c0 = new KnownInfo(nRows, "c", chem.element, calculated, "mol/dm3");
      nRows++;
    }

    if (chem.c1 === 0 && chem.c0 !== 0 && env.X !== 0) {
      let calculated;
      if (chem.type === 'product') {
        calculated = chem.c0.quantity + env.X.quantity;
      } else if (chem.type === 'reactant') {
        calculated = chem.c0.quantity - env.X.quantity;
      }

      chem.c1 = new KnownInfo(nRows, "c", chem.element, calculated, "mol/dm3");
      nRows++;
    }
  }
}

//racunanje mjerne jedinice konstante
function CalcUnit(reactants, products, type) {
  let coefDiff;
  let unit;

  coefDiff = products.reduce((acc, el) => (acc += el.coefficient)) - reactants.reduce((acc, el) => (acc += el.coefficient));

  if (type === "Kp") {
    unit = coefDiff !== 0 ? `kPa${coefDiff > 1 ? '^' + String(coefDiff) : ""}` : "";
  } else {
    unit = coefDiff !== 0 ? `mol${coefDiff > 1 ? '^' + String(coefDiff) : ""}/L${coefDiff > 1 ? '^' + String(coefDiff) : ""}` : "";
  }

  return unit;
}

//racunanje koncentracijske konsatnte
function CalcKc(reactants, products, data, allC, nRows) {
  if (data.Kp !== 0 && data.T !== 0 && !allC) { //dobivanje preko tlacne konstante
    let calculated = data.Kp.quantity / (data.T.quantity * R) ** data.dCoef;
    data.Kc = new KnownInfo(nRows, "Kc", 'mixture', calculated, 'mol/dm3');
    nRows++;
  } else if (allC) { //dobivanje preko formule
    let calculated = products.reduce((acc, el) => (acc *= el.c1.quantity ** el.coefficient), 1) / reactants.reduce((acc, el) => (acc *= el.c1.quantity ** el.coefficient), 1);
    console.log(products, reactants);
    products.reduce((acc, el) => { console.log(el); return (acc *= el.c1.quantity ** el.coefficient); }, 1);
    data.Kc = new KnownInfo(nRows, "Kc", 'mixture', calculated, CalcUnit(reactants, products, "Kc"));
    nRows++;
    if (data.Kp === 0 && data.T !== 0) { //dobivanje tlacne konstante
      let kP = calculated * (data.T.quantity * R) ** data.dCoef;
      data.Kp = new KnownInfo(nRows, "Kp", 'mixture', kP, 'kPa');
      nRows++;
    }
  }
}

//racunanje tlacne konstante
function CalcKp(reactants, products, data, allP, nRows) {
  if (data.Kc !== 0 && data.T !== 0 && !allP) { //dobivanje preko koncentracijske konstante
    let calculated = data.Kc.quantity * (data.T.quantity * R) ** data.dCoef;
    console.log(calculated, 'Kp', data.Kc.quantity, data.T.quantity, R, data.dCoef);
    data.Kp = new KnownInfo(nRows, "Kp", 'mixture', calculated, 'kPa');
    nRows++;
  } else if (allP) { //dobivnje preko formule
    let calculated = products.reduce((acc, el) => (acc *= el.p.quantity ** el.coefficient), 1) / reactants.reduce((acc, el) => (acc *= el.p.quantity ** el.coefficient), 1);
    data.Kp = new KnownInfo(nRows, "Kp", 'mixture', calculated, CalcUnit(reactants, products, "Kp"));
    nRows++;
    if (data.Kc === 0 && data.T !== 0) { //dobivanje koncentracijske konstante
      let kC = calculated / (data.T.quantity * R) ** data.dCoef;
      data.Kc = new KnownInfo(nRows, "Kc", 'mixture', kC, 'mol/dm3');
      nRows++;
    }
  }
}

function CalcConstant(reactants, products, extra, nRows) {
  /*reactants =[
    {state: 'g', element: 'I2', coefficient: '1', id: 0, type: 'reactant', known:[{id:0,symbol:c,chem:'H2',quantity:0.222,ext:'final',unit:'mol/dm3}]}
    {state: 'g', element: 'H2', coefficient: '1', id: 1, type: 'reactant', known:[{id:0,symbol:c,chem:'I2',quantity:0.222,ext:'final',unit:'mol/dm3}]}
  ]*/
  /*products =[
    {state: 'g', element: 'HI', coefficient: '2', id: 0, type: 'product', known:[{id:0,symbol:c,chem:'HI',quantity:1.56,ext:'final',unit:'mol/dm3}]}
  ]*/

  let newNRows = nRows;
  let allElements = [...reactants, ...products];
  let elementsFinal = [];
  let reactantsC = [];
  let productsC = [];
  let reactantsP = [];
  let productsP = [];
  let extraFinal = {
    V: 0,
    T: 0,
    p: 0,
    X: 0,
    dCoef: 0,
    Kc: 0,
    Kp: 0
  };
  let allC = false;
  let allP = false;

  //sortiranje podataka
  allElements.forEach((elementEl, ind) => {
    elementsFinal.push(new ElementInfo(elementEl.element, ind, elementEl.id, elementEl.type, CalcM(elementEl.element), elementEl.coefficient, elementEl.state));
    elementEl.known.forEach((el, ind) => {
      let element = elementsFinal[elementsFinal.length - 1];
      if(["m","n","c"].includes(el.symbol)){
        if(el.ext==="final"){element[`${el.symbol}1`] = el}
        else{element[`${el.symbol}0`]= el}
      } else {element[el.symbol] = el}
    });

    if (elementEl.type === 'reactant') {
      extraFinal.dCoef -= elementEl.coefficient;
    } else if (elementEl.type === 'product') {
      extraFinal.dCoef += elementEl.coefficient;
    }
    convertUnit(elementsFinal[elementsFinal.length - 1]);
  });
  extra.forEach((el) => {
    extraFinal[el.symbol]=el
  }
  );

  let allReqElC = elementsFinal.filter(el => el.state === 'g' || el.state === 'aq' ? true : false).map(el => el.element);
  let allReqElP = elementsFinal.filter(el => el.state === 'g' ? true : false).map(el => el.element);

  //racuanje podataka
  elementsFinal.forEach((el) => { CalcChemData(extraFinal, el, el.type, newNRows); });
  elementsFinal.forEach((el) => {
    let i = 0;
    while ((el.c1 === 0 && i < 3)) {
      CalcChemData(extraFinal, el, el.type, newNRows);
      i++;
    }

    //razvrstavanje vaznih podataka
    if (el.type === 'reactant') {
      if (el.c1 !== 0 && (reactants[el.ind].state === 'g' || reactants[el.ind].state === 'aq')) { reactantsC.push(el); }
      if (el.p !== 0 && reactants[el.ind].state === 'g') { reactantsP.push(el); }
    }
    else if (el.type === 'product') {
      if (el.c1 !== 0 && (el.state === 'g' || el.state === 'aq')) { productsC.push(el); }
      if (el.p !== 0 && el.state === 'g') { ; productsP.push(el); }
    }
  });

  //provjeravnaje imamo li sve potrebne podatke
  if (allReqElC.length === (reactantsC.length + productsC.length)) { allC = true; }
  if (allReqElP.length === (reactantsP.length + productsP.length)) { allP = true; }

  //racunanje konstanti
  CalcKc(reactantsC, productsC, extraFinal, allC, newNRows);
  CalcKp(reactantsP, productsP, extraFinal, allP, newNRows);

  return extraFinal;
}

export const calcConstant = CalcConstant;