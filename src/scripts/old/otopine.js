let known = [];
let consts = {
  K: 273.15,
  R: 8.314
};

let changed=false

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
let nRows = 0;

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
  known.push(new KnownInfo(nRows, "V", "otap", 0, "m^3"));
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
  known.splice(known.indexOf(arrEl), 1);
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

function CalcSameData(data, chem, type){
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

function CalcAllData(data){
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

function OutputToTable(data){
  let container = document.getElementById("calculated")
  data.forEach((el,id)=>{
    let div = document.createElement("div")
    let subtitle = document.createElement("h4")
    subtitle.innerText= id==0?"Otopljena Tvar":id==1?"Otapalo":id==2?"Otopina":"Koncentracija"

    div.appendChild(subtitle)
    div.innerHTML+=`<table class="table table-dark" id="${id}">
    <thead>
      <th>Podatak</th>
      <th>Količina</th>
      <th>Mjerna Jedinica</th>
    </thead>
    <tbody>
    </tbody>
    </table>`

    let tbody=div.children[1].children[1]

    for(let prop in el){
      let tr = document.createElement("tr")
      if(el[prop] != 0 && !(prop=="M"&&id==2) && el[prop]!=Infinity){
        tr.innerHTML+=`<td>${prop}</td>
        <td>
          ${el[prop].quantity}
        </td>
        <td>
          ${el[prop].unit}
        </td>
        `
      }

      tbody.appendChild(tr)
    }
    container.appendChild(div)
  })
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
function Calc() {
  let formulaOtapStr = document.getElementById("formOtapInp").value
  let formulaOtvStr = document.getElementById("formOtvInp").value
  let container = document.getElementById("calculated")
  let button = document.getElementById("calcBtn")
  let plinCheck = document.getElementById("plin")
  container.removeChild(button)
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
    data.otv.M = CalcM(formulaOtvStr);
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
    CalcSameData(data,data.otap,"otap")
    CalcSameData(data,data.otv,"otv")
    CalcSameData(data,data.otp,"otp")
  }
  for(let i = 0; i<3;i++){
    CalcAllData(data)
    if(changed){
      for(let i = 0; i< 3; i++){
        CalcSameData(data,data.otap,"otap")
        CalcSameData(data,data.otv,"otv")
        CalcSameData(data,data.otp,"otp")
      }
    }
  }

  OutputToTable([otv,otap,otp,ext])
  console.log(data);
}