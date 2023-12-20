function calConstant (reactants, products, known){
    console.log(reactants, products)

    /*reactants =[
        {state: 'g', element: 'I2', coefficient: '1', id: 0, type: 'reactant', known:[{id:0,symbol:c,chem:'H2',quantity:0.222,ext:'final',unit:'mol/dm3}]}
        {state: 'g', element: 'H2', coefficient: '1', id: 1, type: 'reactant', known:[{id:0,symbol:c,chem:'I2',quantity:0.222,ext:'final',unit:'mol/dm3}]}
    ]*/
    /*products =[
        {state: 'g', element: 'HI', coefficient: '2', id: 0, type: 'product', known:[{id:0,symbol:c,chem:'HI',quantity:1.56,ext:'final',unit:'mol/dm3}]}
    ]*/

    reactants = reactants.filter(el=>el.state!=='l'&&el.state!=='s'?true:false)
    products = products.filter(el=>el.state!=='l'&&el.state!=='s'?true:false)
    
    let eqConst = products.reduce((acc,el)=>(acc*=el.known[0]**el.coefficient),1)/reactants.reduce((acc,el)=>(acc*=el.known[0]**el.coefficient),1)
    return eqConst
}


export const calcConstant = calConstant