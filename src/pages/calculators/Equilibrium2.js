import { useEffect, useState } from "react";

function EquilibriumCalc(){
    const [reactants, setReactants] = useState([])
    const [nReactants,setNReactants] = useState(0)
    function handleAddReactant(event) {
        event.target.className += " hidden";
        let newReactants = 0
        setNReactants((nReactants)=>{newReactants = nReactants+1;return nReactants+1})
        setReactants((reactants)=>[...reactants,{addRP: handleAddReactant,deleteRP:handleDeleteReactant, id:newReactants}]);
    }
    function handleDeleteReactant(event) { //shit aint working
        let participant = event.target.parentNode.parentNode;
        let parentChildren = event.target.parentNode.parentNode.parentNode.children
        let lastChild = parentChildren[parentChildren.length-2]
        let lastChildButton = lastChild.children[lastChild.children.length-1]

        setReactants((reactants)=>reactants.filter(el=>el.id!==parseInt(participant.id)?true:false));
        lastChildButton.className = lastChildButton.className.replace(' hidden', '')
    }
    useEffect(()=>{console.log(reactants, nReactants)})
    return (
        <div id="0" className="flex flex-col mx-4">
            <div>
                <h2>Kalkulator ravnotežne konstante</h2>
            </div>
            <h2>Upiši kemijsku jednadžbu</h2>
            <div className="h-20 grid grid-cols-7">
                <div className="border overflow-auto border-rose-600 flex flex-row" style={{ gridColumnStart: "1", gridColumnEnd: "4" }}>
                    {reactants.length != 0 ? reactants.map((el)=>(
                        <div id={el.id} key={el.id} className="border border-rose-600 text-black flex flex-row justify-center">
                        <input className="w-10" type="number" min={1} />
                        <input className="inline-flex" type="text" />
                        <div className="flex flex-col  justify-center">
                            <button onClick={el.deleteRP} className="flex-1 rounded-sm bg-green-600 text-white border border-green-500">-</button>
                            <select className="flex-1">
                                <option>g</option>
                                <option>s</option>
                                <option>l</option>
                                <option>aq</option>
                            </select>
                        </div>
                        <button onClick={el.addRP} className="flex-1 p-1 rounded-sm bg-green-600 text-white border border-green-500">+</button>
                    </div>
                    )) : (<button onClick={handleAddReactant} className="flex-1 p-1 rounded-sm bg-green-600 text-white border border-green-500">+</button>)}
                </div>
                <div className="border-green-600 border"></div>
                <div className="border-rose-600 border" style={{ gridColumnStart: "5", gridColumnEnd: "8" }}></div>
            </div>
            <button className="p-1 rounded-sm bg-green-600 text-white border border-green-500 ">Izračunaj</button>
            <div></div>
        </div>
    );
}
export default EquilibriumCalc