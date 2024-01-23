import { convertUnit } from "./convertUnit";
import { calcM } from "./formulas";

const R = 8.314;

function CalcSameData(env, chem, type, nRows) {
    // console.log(chem);
    for (let i = 0; i < 3; i++) {
        //START Mass
        if (chem.m0 != 0) {
            if (chem.M != 0 && chem.n == 0) {
                let calculated = chem.m0.quantity / chem.M.quantity;
                chem.n0 = new KnownInfo(nRows, "n", chem.element, calculated, "mol");
                nRows++;
            }

        } else {
        }
        //FINAL Mass
        if (chem.m1 != 0) {
            if (chem.M != 0 && chem.n == 0) {
                let calculated = chem.m0.quantity / chem.M.quantity;
                chem.n1 = new KnownInfo(nRows, "n", chem.element, calculated, "mol");
                nRows++;
            }
        }
        //START Amount of substance
        if (chem.n0 != 0) { //has n0
            if (chem.m0 == 0 && chem.M != 0) {
                let calculated = chem.n0.quantity * chem.M.quantity;
                chem.m0 = new KnownInfo(nRows, "m", chem.element, calculated, "g");
                nRows++;
            }
            if (chem.c0 == 0 && env.V != 0) {
                let calculated = chem.n0.quantity * env.V.quantity;
                chem.c0 = new KnownInfo(nRows, "c", chem.element, calculated, "mol/dm3");
                nRows++;
            }
            if (chem.V == 0 && env.p != 0 && env.T != 0) {
                let calculated = ((chem.n0.quantity * env.T.quantity * R) / env.p.quantity) * 1000;
                chem.V = new KnownInfo(nRows, "V", chem.element, calculated, "dm3");
                nRows++;
            }
            if (env.p == 0 && chem.V != 0 && env.T != 0) {
                let calculated = ((chem.n0.quantity * env.T.quantity * R) / (chem.V.quantity / 1000));
                env.p = new KnownInfo(nRows, "p", chem.element, calculated, "Pa");
                nRows++;
            }
            if (chem.n1 == 0 && env.X != 0) {
                let calculated = chem.n0 - (env.X * chem.coefficient);
                chem.n1 = new KnownInfo(nRows, "n", chem.element, calculated, "mol");
                nRows++;
            }

        } else { //no n0
            if (chem.c0 != 0 && env.V != 0) {
                let calculated = chem.c.quantity * env.V.quantity;
                chem.n0 = new KnownInfo(nRows, "n", chem.element, calculated, "mol");
                nRows++;
            }
        }
        //FINAL Amount of substance
        if (chem.n1 != 0) {
            if (chem.m1 == 0 && chem.M != 0) {
                let calculated = chem.n1.quantity * chem.M.quantity;
                chem.m1 = new KnownInfo(nRows, "m", type, calculated, "g");
                nRows++;
            }
            if (chem.c1 == 0 && env.V != 0) {
                let calculated = chem.n1.quantity * env.V.quantity;
                chem.c1 = new KnownInfo(nRows, "c", chem.element, calculated, "mol/dm3");
                nRows++;
            }
            if (chem.n0 == 0 && env.X != 0) {
                let calculated = chem.n1 + (env.X * chem.coefficient);
                chem.n0 = new KnownInfo(nRows, "n", type, calculated, "mol");
                nRows++;
            }
            if (type != "product") {
                if (chem.x != 0) {
                    let x1 = 1 - (chem.x.quantity / 100);
                    let n0 = chem.n1.quantity / (x1);
                    let nEq = (n0 * (chem.x.quantity / 100)) / chem.coefficient;

                    if (chem.n0 == 0) {
                        chem.n0 = new KnownInfo(nRows, "n", chem.element, n0, "mol");
                        nRows++;
                    } else {
                        nEq = chem.n0.quantity - chem.n.quantity;
                    }
                    if (env.X == 0) {
                        env.X = new KnownInfo(nRows, "n", "mixture", nEq, 'mol');
                        nRows++;
                    }
                } else if (env.X != 0) {

                    let calculated = (env.X.quantity / chem.n1) * 100;
                    chem.x = new KnownInfo(nRows, "x", chem.element, calculated, "%");
                    nRows++;
                }
            }

        } else { //no n1
            if (type != "product" && chem.x != 0 && env.X != 0) {
                let n0;
                let x1 = 1 - (chem.x.quantity / 100);
                if (chem.n0 == 0) {
                    n0 = env.X.quantity / (chem.x.quantity / 100);
                    chem.n0 = new KnownInfo(nRows, "n", chem.element, n0, "mol");
                    nRows++;
                } else {
                    n0 = chem.n0.quantity;
                }
                let calculated = x1 * chem.n0.quantity;
                chem.n = new KnownInfo(nRows, "n", type, calculated, "mol");
                nRows++;
            } else {
                if (chem.c1 != 0 && env.V != 0) {
                    let calculated = chem.c.quantity * env.V.quantity;
                    chem.n1 = new KnownInfo(nRows, "n", type, calculated, "mol");
                    nRows++;
                }
            }
        }

        if (chem.V != 0) {
            if (chem.n0 == 0 && env.T != 0 && env.p != 0) {
                let calculated = (env.p.quantity * chem.V.quantity) / (R * env.T.quantity);
                chem.n0 = new KnownInfo(nRows, "n", chem.element, calculated, "mol");
                nRows++;
            }

        } else {
        }
        if (chem.c0 != 0 && chem.c1 != 0 && env.X == 0) {
            let calculated;
            if (chem.type == 'product') {
                calculated = (chem.c1.quantity - chem.c0.quantity) / chem.coefficient;
            } else if (chem.type == 'reactant') {
                calculated = (chem.c0.quantity - chem.c1.quantity) / chem.coefficient;
            }

            env.X = new KnownInfo(nRows, "n", 'mixture', calculated, "mol");
            nRows++;
        }
        if (chem.c0 == 0 && chem.c1 != 0 && env.X != 0) {
            let calculated;
            if (chem.type == 'product') {
                calculated = chem.c1.quantity - env.X.quantity;
            } else if (chem.type == 'reactant') {
                calculated = chem.c1.quantity + env.X.quantity;
            }
            chem.c0 = new KnownInfo(nRows, "c", chem.element, calculated, "mol/dm3");
            nRows++;
        }
        console.log(chem, chem.c1, chem.c0, env.X);
        if (chem.c1 == 0 && chem.c0 != 0 && env.X != 0) {
            console.log("whae");
            let calculated;
            if (chem.type == 'product') {
                calculated = chem.c0.quantity + env.X.quantity;
            } else if (chem.type == 'reactant') {
                calculated = chem.c0.quantity - env.X.quantity;
            }
            chem.c1 = new KnownInfo(nRows, "c", chem.element, calculated, "mol/dm3");
            nRows++;
        }

    }

}

function CalcUnit() { }

function CalcKc(reactants, products, data, allC, nRows) {
    if (data.Kp != 0 && data.T != 0 && !allC) {
        let calculated = data.Kp.quantity / (data.T.quantity * R) ** data.dCoef;
        data.Kc = new KnownInfo(nRows, "Kc", 'mixture', calculated, 'mol/dm3');
        nRows++;
    } else if (allC) {
        let calculated = products.reduce((acc, el) => (acc *= el.c1.quantity ** el.coefficient), 1) / reactants.reduce((acc, el) => (acc *= el.c1.quantity ** el.coefficient), 1);
        console.log(products, reactants);
        products.reduce((acc, el) => { console.log(el); return (acc *= el.c1.quantity ** el.coefficient); }, 1);
        data.Kc = new KnownInfo(nRows, "Kc", 'mixture', calculated, 'mol/dm3');
        nRows++;
        if (data.Kp == 0 && data.T != 0) {
            let kP = calculated * (data.T.quantity * R) ** data.dCoef;
            data.Kp = new KnownInfo(nRows, "Kp", 'mixture', kP, 'kPa');
            nRows++;
        }
    }
}

function CalcKp(reactants, products, data, allP, nRows) {
    if (data.Kc != 0 && data.T != 0 && !allP) {
        let calculated = data.Kc.quantity * (data.T.quantity * R) ** data.dCoef;
        console.log(calculated, 'Kp', data.Kc.quantity, data.T.quantity, R, data.dCoef);
        data.Kp = new KnownInfo(nRows, "Kp", 'mixture', calculated, 'Pa');
        nRows++;
    } else if (allP) {
        let calculated = products.reduce((acc, el) => (acc *= el.p.quantity ** el.coefficient), 1) / reactants.reduce((acc, el) => (acc *= el.p.quantity ** el.coefficient), 1);
        data.Kp = new KnownInfo(nRows, "Kp", 'mixture', calculated, 'Pa');
        nRows++;
        if (data.Kc == 0 && data.T != 0) {
            let kC = calculated / (data.T.quantity * R) ** data.dCoef;
            data.Kc = new KnownInfo(nRows, "Kc", 'mixture', kC, 'mol/dm3');
            nRows++;
        }
    }
}

function ElementInfo(element, ind, id, type, M, coefficient, state) {
    this.element = element;
    this.ind = ind;
    this.id = id;
    this.type = type;
    this.coefficient = coefficient;
    this.state = state;
    this.c0 = 0;//done
    this.c1 = 0;//done
    this.n0 = 0;//done
    this.n1 = 0; //done
    this.V = 0; //done
    this.m0 = 0;//done
    this.m1 = 0;//done
    this.M = M; //done
    this.x = 0;//done
    this.p = 0;//done
}

function KnownInfo(id, symbol, chem, quantity, unit) {
    this.id = id;
    this.symbol = symbol;
    this.chem = chem;
    this.quantity = quantity;
    this.unit = unit;
}

function CalcConstant(reactants, products, extra, nRows) {
    let newNRows = nRows;
    console.log(reactants, products);
    let allElements = [...reactants, ...products];

    /*reactants =[
        {state: 'g', element: 'I2', coefficient: '1', id: 0, type: 'reactant', known:[{id:0,symbol:c,chem:'H2',quantity:0.222,ext:'final',unit:'mol/dm3}]}
        {state: 'g', element: 'H2', coefficient: '1', id: 1, type: 'reactant', known:[{id:0,symbol:c,chem:'I2',quantity:0.222,ext:'final',unit:'mol/dm3}]}
    ]*/
    /*products =[
        {state: 'g', element: 'HI', coefficient: '2', id: 0, type: 'product', known:[{id:0,symbol:c,chem:'HI',quantity:1.56,ext:'final',unit:'mol/dm3}]}
    ]*/

    let elementsFinal = [];
    let reactantsC = [];
    let productsC = [];
    let allC = false;
    let reactantsP = [];
    let productsP = [];
    let allP = false;
    let extraFinal = {
        V: 0,
        T: 0,
        p: 0,
        X: 0,
        dCoef: 0,
        Kc: 0,
        Kp: 0
    };
    let tempInd = -1;
    allElements.forEach((elementEl, ind) => {
        elementsFinal.push(new ElementInfo(elementEl.element, ind, elementEl.id, elementEl.type, calcM(elementEl.element), elementEl.coefficient, elementEl.state));
        elementEl.known.forEach((el, ind) => {
            console.log(el);
            let element = elementsFinal[elementsFinal.length - 1];
            switch (el.symbol) {
                case "V":
                    element.V = el;
                    break;
                case "m":
                    if (el.ext == "final") {
                        element.m1 = el;
                    } else {
                        element.m0 = el;
                    }
                    break;
                case "n":
                    if (el.ext == "final") {
                        element.n1 = el;
                    } else {
                        element.n0 = el;
                    }
                    break;
                case "c":
                    if (el.ext == "final") {
                        element.c1 = el;
                    } else {
                        element.c0 = el;
                    }
                    break;
                case "w":
                    element.w = el;
                    break;
                case "x":
                    element.x = el;
                    break;
                case "p":
                    element.p = el;
                    break;
            }
        });
        console.log(elementEl);
        if (elementEl.type == 'reactant') {
            extraFinal.dCoef -= elementEl.coefficient;
        } else if (elementEl.type == 'product') {
            extraFinal.dCoef += elementEl.coefficient;
        }
        convertUnit(elementsFinal[elementsFinal.length-1])
    });

    console.log(extra);
    extra.forEach((el) => {
        switch (el.symbol) {
            case "V":
                extraFinal.V = el;
                break;
            case "p":
                extraFinal.p = el;
                break;
            case "Kc":
                extraFinal.Kc = el;
                break;
            case "Kp":
                extraFinal.Kp = el;
                break;
            case "T":
                extraFinal.T = el;
                break;
        }
    }
    );

    let allReqElC = elementsFinal.filter(el => el.state == 'g' || el.state == 'aq' ? true : false).map(el => el.element);
    let allReqElP = elementsFinal.filter(el => el.state == 'g' ? true : false).map(el => el.element);
    elementsFinal.forEach((el) => { CalcSameData(extraFinal, el, el.type, newNRows); });
    elementsFinal.forEach((el) => {
        let i = 0;
        while ((el.c1 == 0 && i < 3)) {
            CalcSameData(extraFinal, el, el.type, newNRows);
            i++;
        }

        if (el.type == 'reactant') {
            // console.log(el, reactants[el.ind].state);
            if (el.c1 != 0 && (reactants[el.ind].state == 'g' || reactants[el.ind].state == 'aq')) { console.log("test"); reactantsC.push(el); }
            if (el.p != 0 && reactants[el.ind].state == 'g') { reactantsP.push(el); }
        }
        else if (el.type == 'product') {
            // console.log(el, el.state);
            if (el.c1 != 0 && (el.state == 'g' || el.state == 'aq')) { productsC.push(el); }
            if (el.p != 0 && el.state == 'g') { ; productsP.push(el); }
        }
    });
    if (allReqElC.length === (reactantsC.length + productsC.length)) { allC = true; }
    if (allReqElP.length === (reactantsP.length + productsP.length)) { allP = true; }
    CalcKc(reactantsC, productsC, extraFinal, allC, newNRows);
    CalcKp(reactantsP, productsP, extraFinal, allP, newNRows);

    console.log(extraFinal.Kc, extraFinal.Kp);
    return extraFinal;
}

export const calcConstant = CalcConstant;