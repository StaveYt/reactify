
//Prebačeno
let navbarSideButton = document.getElementById('navbarSideButton');
navbarSideButton.addEventListener('click', ()=>{
    let navbarSide = document.getElementById('navbarSide')
    navbarSide.classList.toggle('hidden')
})

let dropdownToggle = document.getElementById('dropdownToggle')
dropdownToggle.addEventListener('click', ()=>{
    let dropdownMenu = document.getElementById('dropdownMenu')
    dropdownMenu.classList.toggle('hidden')
})
function BtnCalc(){
    let formulaInput = document.getElementById("formulaInput");
    let M = CalcM(formulaInput.value)
    document.getElementById('anwser').innerText = `Molarna masa je: ${M}`
}

fetch("../json/table.json").then(res=>res.json()).then(data=>elements=data.elements)
let elements;
let M;
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
            tempDio += formula[i];        }
    }
    return dijeloviFormule
}



//Prebačeno
function CalcM(formula){
    let dijeloviFormule = GetFormula(formula);
    M = 0;
    
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
    
    return parseInt(M)
}

