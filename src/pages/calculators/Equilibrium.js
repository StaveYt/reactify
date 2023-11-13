import { useState } from "react"
import ReactionParticipants from "../../components/equation/ReactionParticipants"

function EquilibriumCalc(){
    const [reactants, setReactants] = useState([0])
    const [products, setProducts] = useState([0])
    function handleAddReactant(event){
        console.log(reactants)
        event.target.className+=" hidden"
        let reactants2 = reactants
        reactants2.push(1)
        console.log(reactants2)
        setReactants(reactants2)

    }
    function handleDeleteReactant(event){
        console.log(event)
        event.target.className+=" hidden"

    }
    function handleAddProduct(event){
        console.log(event)
        event.target.className+=" hidden"

    }
    function handleDeleteProduct(event){
        console.log(event)
        event.target.className+=" hidden"

    }

    return(
        <div className="flex flex-col mx-4">
            <div>
                <h2>Kalkulator ravnotežne konstante</h2>
            </div>
            <h2>Upiši kemijsku jednadžbu</h2>
            <div className="h-20 grid grid-cols-7">
                <div className="border overflow-auto border-rose-600 flex flex-row" style={{gridColumnStart:"1",gridColumnEnd:"4"}}>
                    {reactants.map((el,ind)=>(
                        <ReactionParticipants key={ind} addRAndP={handleAddReactant} deleteRAndP={handleDeleteReactant}/>
                    ))}
                </div>
                <div className="border-green-600 border"></div>
                <div className="border-rose-600 border" style={{gridColumnStart:"5",gridColumnEnd:"8"}}></div>
            </div>
            <button className="p-1 rounded-sm bg-green-600 text-white border border-green-500">Izračunaj</button>
            <div></div>
        </div>
    )
}

export default EquilibriumCalc