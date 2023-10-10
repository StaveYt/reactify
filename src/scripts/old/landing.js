let periodicTableDiv = document.getElementById("periodicTable")
fetch("./src/json/table.json").then(res=>res.json()).then(data=>{
    data.elements.forEach(el=>{
        let div = document.createElement("div")
        div.setAttribute("class","element")
        let type = data.nonmetals.includes(el.number)?"nonmetal":data.halfmetals.includes(el.number)?"halfmetal":"metal"
        div.innerHTML=`<div class="element-inner ${type}">
        <p>${el.number}</p>
        <p>${el.symbol} </p>
        </div>
        <div class="element-back ${el.phase.toLowerCase()}">
        <p>${el.Ar}</p>
        </div>
        </div>
        `
        let yPos = 56 < el.number && el.number < 72 ? 8 : 88 < el.number && el.number < 104? 9 : el.period 
        // console.log(yPos,el.xpos)

        div.style.gridRowStart=String(yPos)
        div.style.gridColumnStart=String(el.xpos)
    
        periodicTableDiv.appendChild(div)
    })

})


