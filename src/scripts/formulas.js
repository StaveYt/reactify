import axios from "axios";

//Molarna Masa
let elements;
await axios.get("http://localhost:3001/table").then(res=>elements=res.data.elements)
fetch("../json/table.json").then(res=>res.json()).then(data=>elements=data.elements)

function GetFormula(formula){
    let dijeloviFormule = [];
    let tempDio = "";
    for(let i = 0; i <= formula.length; i++){
        if(isNaN(parseInt(formula[i])) && tempDio != "" && formula[i] != String(formula[i]).toLowerCase()){
            dijeloviFormule.push(tempDio);
            tempDio = "";
            tempDio += formula[i];
        }
        else{
            if(isNaN(tempDio[tempDio.length-1]) && isNaN(parseInt(formula[i])) != true){
                tempDio+="/"
            }
            tempDio += formula[i];    
        }
    }
    return dijeloviFormule
}

function CalcM(formula){
    let dijeloviFormule = GetFormula(formula);
    let M = 0;
    let tempDio = ""
    for(let i = 0; i < dijeloviFormule.length; i++){
        tempDio = dijeloviFormule[i].split("/");
        for(let j = 0; j < elements.length; j++){
            if(tempDio[0] == elements[j].symbol){
                if(tempDio.length > 1){
                    M += elements[j].Ar * parseInt(tempDio[1]);
                }
                else{
                    M += elements[j].Ar;
                }
            }
        }
    }
    M = M.toFixed(3); 
    
    return M
}

//Razlicite formule
function bCalc(ntv, motap) { 
  return ntv/motap;
}
function xCalc(na, notp) {
  return na / notp;
}
function wCalc(ma, motp) {
  return ma / motp;
}
function phiCalc(va, votp) {
  return va / votp;
}
function yCalc(mtv, votp) {
  return mtv / votp;
}
function cCalc(ntv, votp) {
  return ntv / votp;
}
function dCalc(m, v) {
  return m / v;
}

//Otopine

// let consts = {
//     K: 273.15,
//     R: 8.314
// };

let nRows = 0;
let changed = false
function KnownInfo(id, symbol, chem, quantity, unit) {
  this.id = id;
  this.symbol = symbol;
  this.chem = chem;
  this.quantity = quantity;
  this.unit = unit;
}

function CalcSameData(data, chem, type,nRows){
  console.log(chem)
  for(let i = 0; i<3; i++){
    if(chem.m!=0){
      if(chem.V!=0&&chem.D==0){
        let calculated = chem.m.quantity/(chem.V.quantity*1000)
        chem.D=new KnownInfo(nRows,"D",type,calculated,"g/cm^3")
        nRows++
      }else if(chem.V==0&&chem.D!=0){
        let calculated = (chem.m.quantity/chem.D.quantity)/1000
        chem.V=new KnownInfo(nRows,"V",type,calculated,"dm^3")
        nRows++
      }
      if(chem.n!=0&&chem.M==0){
        let calculated = chem.m.quantity/chem.n.quantity
        chem.M=new KnownInfo(nRows,"M",type,calculated,"g/mol")
        nRows++
      }else if(chem.M!=0&&chem.n==0){
        let calculated = chem.m.quantity/chem.M.quantity
        chem.n=new KnownInfo(nRows,"n",type,calculated,"mol")
        nRows++
      }
      if(type!="otp"){
        if(chem.w!=0){
          let otpM = chem.m.quantity/(chem.w.quantity/100)
          let bW = 1-(chem.w.quantity/100)
          let bM = otpM*bW
          if(data.otp.m==0){
            data.otp.m=new KnownInfo(nRows,"m","otp",otpM,"g")
            nRows++
          } else{
            bM = data.otp.m.quantity-chem.m.quantity
          }
          if(type=="otap"){
            if(data.otv.m==0){
              data.otv.m=new KnownInfo(nRows,"m","otv",bM,"g")
              nRows++
            }
            data.otv.w=new KnownInfo(nRows,"w","otv",bW*100,"%")
            nRows++
          }else{
            if(data.otap.m==0){
              data.otap.m=new KnownInfo(nRows,"m","otap",bM,"g")
              nRows++
            }
            data.otap.w=new KnownInfo(nRows,"w","otap",bW*100,"%")
            nRows++
          }
        }else{
          if(type=="otap"&&data.otv.m!=0){
            let calculated = (chem.m.quantity/(chem.m.quantity+data.otv.m.quantity))*100
            chem.w= new KnownInfo(nRows,"w",type,calculated,"%")
            nRows++
          }
          else if(type=="otv"&&data.otap.m!=0){
            let calculated = (chem.m.quantity/(chem.m.quantity+data.otap.m.quantity))*100
            chem.w= new KnownInfo(nRows,"w",type,calculated,"%")
            nRows++
          }
          else if(data.otp.m!=0){
            let calculated = (chem.m.quantity/data.otp.m.quantity)*100
            chem.w= new KnownInfo(nRows,"w",type,calculated,"%")
            nRows++
          }
        }
      }
  
    }else{
      if(type!="otp"&&chem.w!=0&&data.otp.m!=0){
        let calculated = chem.w.quantity*data.otp.m.quantity
        chem.m= new KnownInfo(nRows,"m",type,calculated,"g")
        nRows++
      }else if(type=="otp"&&data.otv.m!=0&&data.otap.m!=0){
        let calculated = data.otv.m.quantity+data.otap.m.quantity
        chem.m= new KnownInfo(nRows,"m",type,calculated,"g")
      }else if(type=="otv"&&data.ext.y!=0&&data.otp.V!=0){
          let calculated = data.ext.y.quantity*data.otp.V.quantity
          chem.m= new KnownInfo(nRows,"m",type,calculated,"g")
          nRows++
      }else if(type=="otap"&&data.ext.b!=0&&data.otv.n!=0){
          let calculated = (data.otv.n.quantity/data.ext.b.quantity)*1000
          chem.m= new KnownInfo(nRows,"m",type,calculated,"g")
          nRows++
      }
    }

    if(chem.n!=0){
      if(chem.m==0&&chem.M!=0){
        let calculated = chem.n.quantity*chem.M.quantity
        chem.m=new KnownInfo(nRows,"m",type,calculated,"g")
        nRows++
      }
      if(type!="otp"){
        if(chem.x!=0){
          let otpN = chem.n.quantity/(chem.x.quantity/100)
          let bX = 1-(chem.x.quantity/100)
          let bN = otpN*bX
          if(data.otp.n==0){
            data.otp.n=new KnownInfo(nRows,"n","otp",otpN,"g")
            nRows++
          } else{
            bN = data.otp.n.quantity-chem.n.quantity
          }
          if(type=="otap"){
            if(data.otv.n==0){
              data.otv.n=new KnownInfo(nRows,"n","otv",bN,"g")
              nRows++
            }
            data.otv.x=new KnownInfo(nRows,"w","otv",bX*100,"%")
            nRows++
          }else{
            if(data.otap.n==0){
              data.otap.n=new KnownInfo(nRows,"n","otap",bN,"g")
              nRows++
            }
            data.otap.x=new KnownInfo(nRows,"w","otap",bX*100,"%")
            nRows++
          }
        }else{
          if(type=="otap"&&data.otv.n!=0){
            let calculated = (chem.n.quantity/(chem.n.quantity+data.otv.n.quantity))*100
            chem.x= new KnownInfo(nRows,"x",type,calculated,"%")
            nRows++
          }
          else if(type=="otv"&&data.otap.n!=0){
            let calculated = (chem.n.quantity/(chem.n.quantity+data.otap.n.quantity))*100
            chem.x= new KnownInfo(nRows,"x",type,calculated,"%")
            nRows++
          }
          else if(data.otp.n!=0){
            let calculated = (chem.n.quantity/data.otp.n.quantity)*100
            chem.x= new KnownInfo(nRows,"x",type,calculated,"%")
            nRows++
          }
        }
      }
  
    }else{
      if(type!="otp"&&chem.x!=0&&data.otp.n!=0){
        let calculated = chem.x.quantity*data.otp.n.quantity
        chem.n= new KnownInfo(nRows,"n",type,calculated,"mol")
        nRows++
      }else if(type=="otp"&&data.otv.n!=0&&data.otap.n!=0){
        let calculated = data.otv.n.quantity+data.otap.n.quantity
        chem.n= new KnownInfo(nRows,"n",type,calculated,"mol")
        nRows++
      }else if(type=="otv"){
        if(data.ext.b!=0&&data.otap.m!=0){
          let calculated = data.ext.b.quantity*(data.otap.m.quantity/1000)
          chem.n= new KnownInfo(nRows,"n",type,calculated,"mol")
          nRows++
        }else if(data.ext.c!=0&&data.otp.V!=0){
          let calculated = data.ext.c.quantity*data.otp.V.quantity
          chem.n= new KnownInfo(nRows,"n",type,calculated,"mol")
          nRows++
        }
      }
    }

    if(chem.V!=0){
      if(chem.m==0&&chem.D!=0){
        let calculated = chem.V.quantity*chem.D.quantity*1000
        chem.m=new KnownInfo(nRows,"m",type,calculated,"g")
        nRows++
      }
      if(type!="otp"){
        if(chem.phi!=0){
          let otpV = chem.V.quantity/(chem.phi.quantity/100)
          let bPhi = 1-(chem.phi.quantity/100)
          let bV = otpV*bPhi
          if(data.otp.V==0){
            data.otp.V=new KnownInfo(nRows,"n","otp",otpV,"g")
            nRows++
          } else{
            bV = data.otp.V.quantity-chem.V.quantity
          }
          if(type=="otap"){
            if(data.otv.V==0){
              data.otv.V=new KnownInfo(nRows,"n","otv",bV,"g")
              nRows++
            }
            data.otv.phi=new KnownInfo(nRows,"phi","otv",bPhi*100,"%")
            nRows++
          }else{
            if(data.otap.V==0){
              data.otap.V=new KnownInfo(nRows,"n","otap",bV,"g")
              nRows++
            }
            data.otap.phi=new KnownInfo(nRows,"phi","otap",bPhi*100,"%")
            nRows++
          }
        }else{
          if(type=="otap"&&data.otv.V!=0){
            let calculated = (chem.V.quantity/(chem.V.quantity+data.otv.V.quantity))*100
            chem.phi= new KnownInfo(nRows,"phi",type,calculated,"%")
            nRows++
          }
          else if(type=="otv"&&data.otap.V!=0){
            let calculated = (chem.V.quantity/(chem.V.quantity+data.otap.V.quantity))*100
            chem.phi= new KnownInfo(nRows,"phi",type,calculated,"%")
            nRows++
          }
          else if(data.otp.V!=0){
            let calculated = (chem.V.quantity/data.otp.V.quantity)*100
            chem.phi= new KnownInfo(nRows,"phi",type,calculated,"%")
            nRows++
          }
        }
      }
  
    }else{
      if(type!="otp"&&chem.phi!=0&&data.otp.V!=0){
        let calculated = chem.phi.quantity*data.otp.V.quantity
        chem.V= new KnownInfo(nRows,"V",type,calculated,"dm^3")
        nRows++
      }else if(type=="otp"&&data.otv.V!=0&&data.otap.V!=0){
        let calculated = data.otv.V.quantity+data.otap.V.quantity
        chem.V= new KnownInfo(nRows,"V",type,calculated,"dm^3")
        nRows++
      }else if(type=="otp"){
        if(data.ext.y!=0&&data.otv.m!=0){
          let calculated = data.otv.m.quantity/data.ext.y.quantity
          chem.V= new KnownInfo(nRows,"V",type,calculated,"dm^3")
          nRows++
        }else if(data.ext.c!=0&&data.otv.n!=0){
          let calculated = data.otv.n.quantity/data.ext.c.quantity
          chem.V= new KnownInfo(nRows,"V",type,calculated,"dm^3")
          nRows++
        }
      }
    }

    if(type!="otp"){
      if(chem.w!=0){
        if(type=="otap"&&data.otv.w==0){
          let calculated = 100-chem.w.quantity
          data.otv.w=new KnownInfo(nRows,"w","otv",calculated,"%")
          nRows++
        }
        if(type=="otv"&&data.otap.w==0){
          let calculated = 100-chem.w.quantity
          data.otap.w=new KnownInfo(nRows,"w","otap",calculated,"%")
          nRows++
        }
      }
      if(chem.x!=0){
        if(type=="otap"&&data.otv.x==0){
          let calculated = 100-chem.x.quantity
          data.otv.x=new KnownInfo(nRows,"x","otv",calculated,"%")
          nRows++
        }
        if(type=="otv"&&data.otap.x==0){
          let calculated = 100-chem.x.quantity
          data.otap.x=new KnownInfo(nRows,"x","otap",calculated,"%")
          nRows++
        }
      }
      if(chem.phi!=0){
        if(type=="otap"&&data.otv.phi==0){
          let calculated = 100-chem.phi.quantity
          data.otv.phi=new KnownInfo(nRows,"phi","otv",calculated,"%")
          nRows++
        }
        if(type=="otv"&&data.otap.phi==0){
          let calculated = 100-chem.phi.quantity
          data.otap.phi=new KnownInfo(nRows,"phi","otap",calculated,"%")
          nRows++
        }
      }
    }
  }
}

function CalcAllData(data,nRows){
  if(data.ext.b==0&&data.otap.m!=0&&data.otv.n!=0){
    let motap = data.otap.m.quantity/1000
    let b = bCalc(data.otv.n.quantity, motap)
    data.ext.b=new KnownInfo(nRows,"b","ext",b,"mol/kg")
    nRows++
    changed = true
  }
  if(data.otp.V!=0){
    if(data.ext.c==0&&data.otv.n!=0){
      let c = cCalc(data.otv.n.quantity, data.otp.V.quantity)
      data.ext.c=new KnownInfo(nRows,"c","ext",c,"mol/L")
      nRows++
      changed = true
    }
    if(data.ext.y==0&&data.otv.m!=0){
      let y = yCalc(data.otv.m.quantity, data.otp.V.quantity)
      data.ext.y=new KnownInfo(nRows,"y","ext",y,"m/L")
      nRows++
      changed = true
    }
  }
  if(data.ext.c==0&&data.otp.D!=0&&data.otv.M!=0&&data.otv.w!=0){
    let c = (data.otp.D.quantity*data.otv.w.quantity*10)/data.otv.M.quantity
    data.ext.c=new KnownInfo(nRows,"c","ext",c,"mol/L")
    nRows++
    changed = true
  }

}

function ConvertData(chem){
  for(const prop in chem){
    if(typeof chem[prop] == "object"){
      switch(prop){
        case "V":
          if(chem[prop].unit=="cm^3"){
            chem[prop].quantity/=1000
            chem[prop].unit="dm^3"
          }else if(chem[prop].unit=="m^3"){
            chem[prop].quantity*=1000
            chem[prop].unit="dm^3"
          }
          break;
        case "m":
          if(chem[prop].unit=="mg"){
            chem[prop].quantity/=1000
            chem[prop].unit="g"
          }else if(chem[prop].unit=="dg"){
            chem[prop].quantity/=10
            chem[prop].unit="g"
          }else if(chem[prop].unit=="dag"){
            chem[prop].quantity*=10
            chem[prop].unit="g"
          }else if(chem[prop].unit=="kg"){
            chem[prop].quantity*=1000
            chem[prop].unit="g"
          }
          break;
      }
    }
  }
}

function CalcSolution(known, formulaOtapStr, formulaOtvStr, plinCheck, nRows) {

let otap = {
    V:0,
    n:0,
    m:0,
    D:0,
    w:0,
    x:0,
    phi:0,
    M: 0
  }
  let otv = {
    V:0,
    n:0,
    m:0,
    D:0,
    w:0,
    x:0,
    phi:0,
    M: 0
  }
  let otp={
    V:0,
    n:0,
    m:0,
    D:0,
    M:0
  }
  let ext={
    c:0,
    y:0,
    b:0,
  }
  let data = {
    otap: otap,
    otv: otv,
    otp: otp,
    ext:ext,
    len: known.length,
  };

  
  if (formulaOtapStr != "") {
    let M = CalcM(formulaOtapStr)
    data.otap.M = new KnownInfo(nRows,"M","otap",M,"g/mol"); 
    nRows++
  }else{
    let M = prompt("Unesite molarnu masu otapala, ako je nemate upišite ne")
    if(M!="ne"){data.otap.M = new KnownInfo(nRows,"M","otap",M,"g/mol"); nRows++}
  }
  if (formulaOtvStr != "") { 
    let M = CalcM(formulaOtvStr);
    data.otv.M = new KnownInfo(nRows,"M","otv",M,"g/mol"); 
    nRows++
  }else{
    let M = prompt("Unesite molarnu masu otopljene tvari, ako je nemate upišite ne")
    if(M!="ne"){data.otv.M = new KnownInfo(nRows,"M","otv",M,"g/mol"); nRows++}
  }
  console.log(data)
  known.forEach(el => {
    console.log(el)
    switch (el.symbol) {
      case "V":
        if (el.chem == "otap") { 
          if(plinCheck.checked){
            data.otp.V = el;
          }
          data.otap.V = el; 
        }
        else if (el.chem == "otv") { data.otv.V = el; }
        else { data.otp.V = el; }
        break;
      case "m":
        if (el.chem == "otap") { data.otap.m = el; }
        else if (el.chem == "otv") { data.otv.m = el; }
        else { data.otp.m = el; }
        break;
      case "n":
        if (el.chem == "otap") { data.otap.n = el; }
        else if (el.chem == "otv") { data.otv.n = el; }
        else { data.otp.n = el; }
        break;
      case "D":
        if (el.chem == "otap") { data.otap.D = el; }
        else if (el.chem == "otv") { data.otv.D = el; }
        else { data.otp.D = el; }
        break;
      case "w":
        if (el.chem == "otap") { data.otap.w = el; }
        else { data.otv.w = el; }
        break;
      case "x":
        if (el.chem == "otap") { data.otap.x = el; }
        else { data.otv.x = el; }
        break;
      case "phi":
        if (el.chem == "otap") { data.otap.phi = el; }
        else { data.otv.phi = el; }
        break;
      case "c":
        data.ext.c = el;
        break;
      case "y":
        data.ext.y = el;
        break;
      case "b":
        data.ext.b = el;
        break;
    }
  });
  
  ConvertData(otv)
  ConvertData(otap)
  ConvertData(otp)
  for(const prop in data.ext){
    if(typeof data.ext[prop] == "object"){
      switch(prop){
        case "c":
          if(data.ext[prop].unit=="mmol/L"){
            data.ext[prop].quantity/=1000
            data.ext[prop].unit="mol/L"
          }
          break;
      }
    }
  }
  for(let i = 0; i< 3; i++){
    CalcSameData(data,data.otap,"otap",nRows)
    CalcSameData(data,data.otv,"otv",nRows)
    CalcSameData(data,data.otp,"otp",nRows)
  }
  for(let i = 0; i<3;i++){
    CalcAllData(data)
    if(changed){
      for(let i = 0; i< 3; i++){
        CalcSameData(data,data.otap,"otap",nRows)
        CalcSameData(data,data.otv,"otv",nRows)
        CalcSameData(data,data.otp,"otp",nRows)
      }
    }
  }
  return[[otv,"otv"],[otap,"otap"],[otp,"otp"],[ext,"ext"]]
}

//Dinamička ravnoteža


export const calcM = CalcM
export const calcSolution = CalcSolution