import { useEffect, useState } from "react";
import ReactionParticipants from "../../components/equation/ReactionParticipants";

function EquilibriumCalc() {
    const [reactants, setReactants] = useState([]);
    const [nReactants, setNReactants] = useState(0);
    const [nProducts, setNProducts] = useState(0);
    const [products, setProducts] = useState([]);
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
    function handleAddProduct(event) {
        event.target.className += " hidden";
        let newProducts = 0
        setNProducts((nProducts)=>{newProducts = nProducts+1;return nProducts+1})
        setProducts((products)=>[...products,{addRP: handleAddProduct,deleteRP:handleDeleteProduct, id:newProducts}]);

    }
    function handleDeleteProduct(event) {
        let participant = event.target.parentNode.parentNode;
        let parentChildren = event.target.parentNode.parentNode.parentNode.children
        let lastChild = parentChildren[parentChildren.length-2]
        let lastChildButton = lastChild.children[lastChild.children.length-1]

        setProducts((products)=>products.filter(el=>el.id!==parseInt(participant.id)?true:false));
        lastChildButton.className = lastChildButton.className.replace(' hidden', '')
    }

    function handleCalc(){
        
    }

    return (
        <div id="0" className="flex flex-col mx-4">
            <div>
                <h2>Kalkulator ravnotežne konstante</h2>
            </div>
            <h2>Upiši kemijsku jednadžbu</h2>
            <div className="h-20 grid grid-cols-7">
                <div className="border overflow-auto border-rose-600 flex flex-row" style={{ gridColumnStart: "1", gridColumnEnd: "4" }}>
                {reactants.length != 0 ? reactants.map((el)=>(
                        <ReactionParticipants id={el.id} deleteRP={el.deleteRP} addRP={el.addRP}/>
                    )) : (<button onClick={handleAddReactant} className="flex-1 p-1 rounded-sm bg-green-600 text-white border border-green-500">+</button>)}
                </div>
                <div className="border-green-600 border"></div>
                <div className="border-rose-600 overflow-auto flex flex-row border" style={{ gridColumnStart: "5", gridColumnEnd: "8" }}>
                {products.length != 0 ? products.map((el)=>(
                        <ReactionParticipants id={el.id} deleteRP={el.deleteRP} addRP={el.addRP}/>
                    )) : (<button onClick={handleAddProduct} className="flex-1 p-1 rounded-sm bg-green-600 text-white border border-green-500">+</button>)}
                </div>
            </div>
            <button className="p-1 rounded-sm bg-green-600 text-white border border-green-500" onClick={handleCalc}>Izračunaj</button>
            <div></div>
        </div>
    );
}

export default EquilibriumCalc;