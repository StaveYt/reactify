function EquilibriumCalc(){
    return(
        <div className="flex flex-col mx-4">
            <div>
                <h2>Kalkulator ravnotežne konstante</h2>
            </div>
            <h2>Upiši kemijsku jednadžbu</h2>
            <div className="h-20 grid grid-cols-7">
                <div className="border border-rose-600" style={{gridColumnStart:"1",gridColumnEnd:"4"}}></div>
                <div className="border-green-600 border"></div>
                <div className="border-rose-600 border" style={{gridColumnStart:"5",gridColumnEnd:"8"}}></div>
            </div>
            <button>Izračunaj</button>
            <div></div>
        </div>
    )
}

export default EquilibriumCalc