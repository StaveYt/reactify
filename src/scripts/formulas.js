import { convertUnit } from "./convertUnit";
import CalcM from "./molarmassCalc";

let changed = false; //oznacavat ce je li se neka nova koncentracija izracunala

//formule za koncentracije
function bCalc(ntv, motap) {
  return ntv / motap;
}
function yCalc(mtv, votp) {
  return mtv / votp;
}
function cCalc(ntv, votp) {
  return ntv / votp;
}

function KnownInfo(id, symbol, chem, quantity, unit) {
  this.id = id;
  this.symbol = symbol;
  this.chem = chem;
  this.quantity = quantity;
  this.unit = unit;
}

//racunanje za odredenu tvar
function CalcChemData(data, chem, type, nRows) {
  // console.log(chem);

  for (let i = 0; i < 3; i++) {
    //masa
    if (chem.m !== 0) { //imamo masu
      if (chem.D === 0 && chem.V !== 0) { //dobivanje gustoce
        let calculated = chem.m.quantity / (chem.V.quantity * 1000);
        chem.D = new KnownInfo(nRows, "D", type, calculated, "g/cm^3");
        nRows++;
      } else if (chem.V === 0 && chem.D !== 0) { //dobivanje volumena
        let calculated = (chem.m.quantity / chem.D.quantity) / 1000;
        chem.V = new KnownInfo(nRows, "V", type, calculated, "dm^3");
        nRows++;
      }
      if (chem.M === 0 && chem.n !== 0) { //dobivanje molarne mase
        let calculated = chem.m.quantity / chem.n.quantity;
        chem.M = new KnownInfo(nRows, "M", type, calculated, "g/mol");
        nRows++;
      } else if (chem.n === 0 && chem.M !== 0) { //dobivanje mnozine
        let calculated = chem.m.quantity / chem.M.quantity;
        chem.n = new KnownInfo(nRows, "n", type, calculated, "mol");
        nRows++;
      }

      //maseni udio
      if (type !== "otp") {
        if (chem.w !== 0) { //imamo maseni udio
          let otpM = chem.m.quantity / (chem.w.quantity / 100);
          let bW = 1 - (chem.w.quantity / 100);
          let bM = otpM * bW;

          if (data.otp.m === 0) { //dobivanje mase otopine
            data.otp.m = new KnownInfo(nRows, "m", "otp", otpM, "g");
            nRows++;
          } else {
            bM = data.otp.m.quantity - chem.m.quantity;
          }

          if (type === "otap") { //trenutna tvar je otapalo
            if (data.otv.m === 0) { //dobivanje mase otopljene tvari
              data.otv.m = new KnownInfo(nRows, "m", "otv", bM, "g");
              nRows++;
            }
          } else { //trenutna tvar je otopljena tvar
            if (data.otap.m === 0) { //dobivanje mase otapala
              data.otap.m = new KnownInfo(nRows, "m", "otap", bM, "g");
              nRows++;
            }
          }
        } else { //dobivanje masenog udijela
          if (type === "otap" && data.otv.m !== 0) {
            //za otapalao preko mase otapala, otopljene tvari i otapala
            let calculated = (chem.m.quantity / (chem.m.quantity + data.otv.m.quantity)) * 100;
            chem.w = new KnownInfo(nRows, "w", type, calculated, "%");
            nRows++;
          }
          else if (type === "otv" && data.otap.m !== 0) {
            //za otopljenu tvar preko mase otapala, otopljene tvari i otapala
            let calculated = (chem.m.quantity / (chem.m.quantity + data.otap.m.quantity)) * 100;
            chem.w = new KnownInfo(nRows, "w", type, calculated, "%");
            nRows++;
          }
          else if (data.otp.m !== 0) {
            //preko mase otapine i tvari
            let calculated = (chem.m.quantity / data.otp.m.quantity) * 100;
            chem.w = new KnownInfo(nRows, "w", type, calculated, "%");
            nRows++;
          }
        }
      }

    } else { //nemamo masu
      if (type !== "otp" && chem.w !== 0 && data.otp.m !== 0) {
        //dobivanje mase preko mesnog udijela
        let calculated = (chem.w.quantity / 100) * data.otp.m.quantity;
        chem.m = new KnownInfo(nRows, "m", type, calculated, "g");
        nRows++;
      } else if (type === "otp" && data.otv.m !== 0 && data.otap.m !== 0) {
        //dobivanje mase preko masa otopljene tvari i otapala
        let calculated = data.otv.m.quantity + data.otap.m.quantity;
        chem.m = new KnownInfo(nRows, "m", type, calculated, "g");
      } else if (type === "otv" && data.ext.y !== 0 && data.otp.V !== 0) {
        //dobivanje mase preko masene koncentracije
        let calculated = data.ext.y.quantity * data.otp.V.quantity;
        chem.m = new KnownInfo(nRows, "m", type, calculated, "g");
        nRows++;
      } else if (type === "otap" && data.ext.b !== 0 && data.otv.n !== 0) {
        //dobivanje mase preko molalnosti
        let calculated = (data.otv.n.quantity / data.ext.b.quantity) * 1000;
        chem.m = new KnownInfo(nRows, "m", type, calculated, "g");
        nRows++;
      }
    }

    //mnozina
    if (chem.n !== 0) { //imamo mnozinu
      if (chem.m === 0 && chem.M !== 0) { //dobivanje mase
        let calculated = chem.n.quantity * chem.M.quantity;
        chem.m = new KnownInfo(nRows, "m", type, calculated, "g");
        nRows++;
      }

      //mnozinski udio
      if (type !== "otp") {
        if (chem.x !== 0) {
          let otpN = chem.n.quantity / (chem.x.quantity / 100);
          let bX = 1 - (chem.x.quantity / 100);
          let bN = otpN * bX;

          if (data.otp.n === 0) { //dobivanje mnozine otopine
            data.otp.n = new KnownInfo(nRows, "n", "otp", otpN, "mol");
            nRows++;
          } else {
            bN = data.otp.n.quantity - chem.n.quantity;
          }

          if (type === "otap") { //trenutna tvar je otapalo
            if (data.otv.n === 0) { //dobivanje mnozine otopljene tvari
              data.otv.n = new KnownInfo(nRows, "n", "otv", bN, "mol");
              nRows++;
            }

          } else { //trenutna tvar je otopljena tvar
            if (data.otap.n === 0) { //dobivanje mnozine otapala
              data.otap.n = new KnownInfo(nRows, "n", "otap", bN, "mol");
              nRows++;
            }

          }
        } else { //dobivanje mnozinskog udijela
          if (type === "otap" && data.otv.n !== 0) {
            //za otapalo preko mnozina otapala i otopljene tvari
            let calculated = (chem.n.quantity / (chem.n.quantity + data.otv.n.quantity)) * 100;
            chem.x = new KnownInfo(nRows, "x", type, calculated, "%");
            nRows++;
          } else if (type === "otv" && data.otap.n !== 0) {
            //za otopljenu tvar preko mnozina otapala i otopljene tvari
            let calculated = (chem.n.quantity / (chem.n.quantity + data.otap.n.quantity)) * 100;
            chem.x = new KnownInfo(nRows, "x", type, calculated, "%");
            nRows++;
          } else if (data.otp.n !== 0) {
            //preko mnozina otopine i tvari
            let calculated = (chem.n.quantity / data.otp.n.quantity) * 100;
            chem.x = new KnownInfo(nRows, "x", type, calculated, "%");
            nRows++;
          }
        }
      }
    } else { //nemamo mnozinu
      if (type !== "otp" && chem.x !== 0 && data.otp.n !== 0) {
        //dobivanje mnozine preko mnozinskog udjela
        let calculated = chem.x.quantity * data.otp.n.quantity;
        chem.n = new KnownInfo(nRows, "n", type, calculated, "mol");
        nRows++;
      } else if (type === "otp" && data.otv.n !== 0 && data.otap.n !== 0) {
        //dobivanje mnozine otopine preko mnozine otapala i otopljene tvari
        let calculated = data.otv.n.quantity + data.otap.n.quantity;
        chem.n = new KnownInfo(nRows, "n", type, calculated, "mol");
        nRows++;
      } else if (type === "otv") {
        if (data.ext.b !== 0 && data.otap.m !== 0) {
          //dobivanje mnozine otopljene tvari preko molalnosti
          let calculated = data.ext.b.quantity * (data.otap.m.quantity / 1000);
          chem.n = new KnownInfo(nRows, "n", type, calculated, "mol");
          nRows++;
        } else if (data.ext.c !== 0 && data.otp.V !== 0) {
          //dobivanje mnozine otopljene tvari preko mnozinske koncentracije
          let calculated = data.ext.c.quantity * data.otp.V.quantity;
          chem.n = new KnownInfo(nRows, "n", type, calculated, "mol");
          nRows++;
        }
      }
    }

    //volumen
    if (chem.V !== 0) { //imamo volumen
      if (chem.m === 0 && chem.D !== 0) { //dobivanje mase
        let calculated = chem.V.quantity * chem.D.quantity * 1000;
        chem.m = new KnownInfo(nRows, "m", type, calculated, "g");
        nRows++;
      }

      //volumni udio
      if (type !== "otp") {
        if (chem.phi !== 0) { //imamo volumi udio
          let otpV = chem.V.quantity / (chem.phi.quantity / 100);
          let bPhi = 1 - (chem.phi.quantity / 100);
          let bV = otpV * bPhi;

          if (data.otp.V === 0) { //dobivanje volumena otopine
            data.otp.V = new KnownInfo(nRows, "V", "otp", otpV, "dm^3");
            nRows++;
          } else {
            bV = data.otp.V.quantity - chem.V.quantity;
          }

          if (type === "otap") { //trenutna tvar je otapalo
            if (data.otv.V === 0) { //dobivanje volumena otopljene tvari
              data.otv.V = new KnownInfo(nRows, "V", "otv", bV, "dm^3");
              nRows++;
            }
          } else { //trenutna tvar je otopljena tvar
            if (data.otap.V === 0) { //dobivanje volumena otapala
              data.otap.V = new KnownInfo(nRows, "V", "otap", bV, "dm^3");
              nRows++;
            }
          }
        } else { //dobivanje volumnog udijela
          if (type === "otap" && data.otv.V !== 0) {
            //za otapalo preko volumena otopine, otapala i otopljene tvari
            let calculated = (chem.V.quantity / (chem.V.quantity + data.otv.V.quantity)) * 100;
            chem.phi = new KnownInfo(nRows, "phi", type, calculated, "%");
            nRows++;
          }
          else if (type === "otv" && data.otap.V !== 0) {
            //za otopljenu tvar preko volumena otopine, otapala i otopljene tvari
            let calculated = (chem.V.quantity / (chem.V.quantity + data.otap.V.quantity)) * 100;
            chem.phi = new KnownInfo(nRows, "phi", type, calculated, "%");
            nRows++;
          }
          else if (data.otp.V !== 0) {
            //preko volumena otopine i tvari
            let calculated = (chem.V.quantity / data.otp.V.quantity) * 100;
            chem.phi = new KnownInfo(nRows, "phi", type, calculated, "%");
            nRows++;
          }
        }
      }

    } else { //nemamo volumen
      if (type !== "otp" && chem.phi !== 0 && data.otp.V !== 0) {
        //dobivanje volumena preko volumnog udijela i volumena otopine
        let calculated = chem.phi.quantity * data.otp.V.quantity;
        chem.V = new KnownInfo(nRows, "V", type, calculated, "dm^3");
        nRows++;
      } else if (type === "otp") { //dobivanje volumena za otopinu
        if (data.ext.y !== 0 && data.otv.m !== 0) {
          //preko volumne masene koncentracije i mase otopljene tvari
          let calculated = data.otv.m.quantity / data.ext.y.quantity;
          chem.V = new KnownInfo(nRows, "V", type, calculated, "dm^3");
          nRows++;
        } else if (data.ext.c !== 0 && data.otv.n !== 0) {
          //preko volumnog mnozinske koncentracije i mnozine otopljene tvari
          let calculated = data.otv.n.quantity / data.ext.c.quantity;
          chem.V = new KnownInfo(nRows, "V", type, calculated, "dm^3");
          nRows++;
        } else if (data.otv.V !== 0 && data.otap.V !== 0) {
          //preko volumnog volumena otapala i voluemna otopljene tvari
          let calculated = data.otv.V.quantity + data.otap.V.quantity;
          chem.V = new KnownInfo(nRows, "V", type, calculated, "dm^3");
          nRows++;
        }
      }
    }

    //mase, mnozinski i volumni udio
    if (type !== "otp") {
      //maseni udio
      if (chem.w !== 0) {
        if (type === "otap" && data.otv.w === 0) {
          //dobivanje masenog udijela otapala
          let calculated = 100 - chem.w.quantity;
          data.otv.w = new KnownInfo(nRows, "w", "otv", calculated, "%");
          nRows++;
        }
        if (type === "otv" && data.otap.w === 0) {
          //dobivanje masenog udijela otopljene tvari
          let calculated = 100 - chem.w.quantity;
          data.otap.w = new KnownInfo(nRows, "w", "otap", calculated, "%");
          nRows++;
        }
      }

      //mnozinski udio
      if (chem.x !== 0) {
        if (type === "otap" && data.otv.x === 0) {
          //dobivanje mnozinskog udijela otapala
          let calculated = 100 - chem.x.quantity;
          data.otv.x = new KnownInfo(nRows, "x", "otv", calculated, "%");
          nRows++;
        }
        if (type === "otv" && data.otap.x === 0) {
          //dobivanje mnozinskog udijela otopljene tvari
          let calculated = 100 - chem.x.quantity;
          data.otap.x = new KnownInfo(nRows, "x", "otap", calculated, "%");
          nRows++;
        }
      }

      //volumni udio
      if (chem.phi !== 0) {
        if (type === "otap" && data.otv.phi === 0) {
          //dobivanje volumnog udijela otapala
          let calculated = 100 - chem.phi.quantity;
          data.otv.phi = new KnownInfo(nRows, "phi", "otv", calculated, "%");
          nRows++;
        }
        if (type === "otv" && data.otap.phi === 0) {
          //dobivanje volumnog udijela otopljene tvari
          let calculated = 100 - chem.phi.quantity;
          data.otap.phi = new KnownInfo(nRows, "phi", "otap", calculated, "%");
          nRows++;
        }
      }
    }
  }
  // console.log(chem,data)
}

function CalcConcentration(data, nRows) {
  //molalnost
  if (data.ext.b === 0 && data.otap.m !== 0 && data.otv.n !== 0) {
    let motap = data.otap.m.quantity / 1000;
    let b = bCalc(data.otv.n.quantity, motap);
    data.ext.b = new KnownInfo(nRows, "b", "ext", b, "mol/kg");
    nRows++;
    changed = true;
  }
  //mnozinska koncentracija
  if (data.ext.c === 0 && data.otp.D !== 0 && data.otv.M !== 0 && data.otv.w !== 0) {
    let c = (data.otp.D.quantity * (data.otv.w.quantity / 100)) / data.otv.M.quantity;
    data.ext.c = new KnownInfo(nRows, "c", "ext", c, "mol/L");
    nRows++;
    changed = true;
  }

  //imamo volumen otopine
  if (data.otp.V !== 0) {
    if (data.ext.c === 0 && data.otv.n !== 0) { //mnozinska koncentracija
      let c = cCalc(data.otv.n.quantity, data.otp.V.quantity);
      data.ext.c = new KnownInfo(nRows, "c", "ext", c, "mol/L");
      nRows++;
      changed = true;
    }
    if (data.ext.y === 0 && data.otv.m !== 0) { //masena koncentracija
      let y = yCalc(data.otv.m.quantity, data.otp.V.quantity);
      data.ext.y = new KnownInfo(nRows, "y", "ext", y, "m/L");
      nRows++;
      changed = true;
    }
  }
}

function CalcSolution(known, formulaOtapStr, formulaOtvStr, plinCheck, nRows) {

  let otap = {
    V: 0,
    n: 0,
    m: 0,
    D: 0,
    w: 0,
    x: 0,
    phi: 0,
    M: 0
  };
  let otv = {
    V: 0,
    n: 0,
    m: 0,
    D: 0,
    w: 0,
    x: 0,
    phi: 0,
    M: 0
  };
  let otp = {
    V: 0,
    n: 0,
    m: 0,
    D: 0,
    M: 0
  };
  let ext = {
    c: 0,
    y: 0,
    b: 0,
  };
  let data = {
    otap: otap,
    otv: otv,
    otp: otp,
    ext: ext,
    len: known.length,
  };

  //dobivanje molarne mase
  if (formulaOtapStr !== "") {
    let M = CalcM(formulaOtapStr);
    data.otap.M = new KnownInfo(nRows, "M", "otap", M, "g/mol");
    nRows++;
  } else {
    let M = prompt("Unesite molarnu masu otapala, ako je nemate upišite ne");
    if (M !== "ne") { data.otap.M = new KnownInfo(nRows, "M", "otap", M, "g/mol"); nRows++; }
  }
  if (formulaOtvStr !== "") {
    let M = CalcM(formulaOtvStr);
    data.otv.M = new KnownInfo(nRows, "M", "otv", M, "g/mol");
    nRows++;
  } else {
    let M = prompt("Unesite molarnu masu otopljene tvari, ako je nemate upišite ne");
    if (M !== "ne") { data.otv.M = new KnownInfo(nRows, "M", "otv", M, "g/mol"); nRows++; }
  } 

  //sortiranje unesenih podataka
  known.forEach(el => {
    if(el.symbol === "c" || el.symbol === "y" || el.symbol === "b"){
      data.ext[el.symbol] = el
    } else if (el.symbol === "V" && plinCheck && el.chem==="otap"){
      data.otp.V = el
      data.otap.V = el;
    } else {
      data[el.chem][el.symbol] = el
    }
  });

  //pretvorba u standardne mjerne jedinice
  convertUnit(otv);
  convertUnit(otap);
  convertUnit(otp);

  for (const prop in data.ext) {
    if (typeof data.ext[prop] === "object") {
      switch (prop) {
        case "c":
          if (data.ext[prop].unit === "mmol/L") {
            data.ext[prop].quantity /= 1000;
            data.ext[prop].unit = "mol/L";
          }
          break;
      }
    }
  }

  //racunanje podataka
  for (let i = 0; i < 3; i++) {
    CalcChemData(data, data.otap, "otap", nRows);
    CalcChemData(data, data.otv, "otv", nRows);
    CalcChemData(data, data.otp, "otp", nRows);
    CalcConcentration(data);
    if (changed) {
      CalcChemData(data, data.otap, "otap", nRows);
      CalcChemData(data, data.otv, "otv", nRows);
      CalcChemData(data, data.otp, "otp", nRows);
    }
  }

  return data;
}

export const calcSolution = CalcSolution;