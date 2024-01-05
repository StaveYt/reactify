function CalcSameData(data, chem, type, nRows) {
    // console.log(chem);
    for (let i = 0; i < 3; i++) {
        if (chem.m != 0) {
            if (chem.V != 0 && chem.D == 0) {
                let calculated = chem.m.quantity / (chem.V.quantity * 1000);
                chem.D = new KnownInfo(nRows, "D", type, calculated, "g/cm^3");
                nRows++;
            } else if (chem.V == 0 && chem.D != 0) {
                let calculated = (chem.m.quantity / chem.D.quantity) / 1000;
                chem.V = new KnownInfo(nRows, "V", type, calculated, "dm^3");
                nRows++;
            }
            if (chem.n != 0 && chem.M == 0) {
                let calculated = chem.m.quantity / chem.n.quantity;
                chem.M = new KnownInfo(nRows, "M", type, calculated, "g/mol");
                nRows++;
            } else if (chem.M != 0 && chem.n == 0) {
                let calculated = chem.m.quantity / chem.M.quantity;
                chem.n = new KnownInfo(nRows, "n", type, calculated, "mol");
                nRows++;
            }
            if (type != "otp") {
                if (chem.w != 0) {
                    let otpM = chem.m.quantity / (chem.w.quantity / 100);
                    let bW = 1 - (chem.w.quantity / 100);
                    let bM = otpM * bW;
                    if (data.otp.m == 0) {
                        data.otp.m = new KnownInfo(nRows, "m", "otp", otpM, "g");
                        nRows++;
                    } else {
                        bM = data.otp.m.quantity - chem.m.quantity;
                    }
                    if (type == "otap") {
                        if (data.otv.m == 0) {
                            data.otv.m = new KnownInfo(nRows, "m", "otv", bM, "g");
                            nRows++;
                        }
                        data.otv.w = new KnownInfo(nRows, "w", "otv", bW * 100, "%");
                        nRows++;
                    } else {
                        if (data.otap.m == 0) {
                            data.otap.m = new KnownInfo(nRows, "m", "otap", bM, "g");
                            nRows++;
                        }
                        data.otap.w = new KnownInfo(nRows, "w", "otap", bW * 100, "%");
                        nRows++;
                    }
                } else {
                    if (type == "otap" && data.otv.m != 0) {
                        let calculated = (chem.m.quantity / (chem.m.quantity + data.otv.m.quantity)) * 100;
                        chem.w = new KnownInfo(nRows, "w", type, calculated, "%");
                        nRows++;
                    }
                    else if (type == "otv" && data.otap.m != 0) {
                        let calculated = (chem.m.quantity / (chem.m.quantity + data.otap.m.quantity)) * 100;
                        chem.w = new KnownInfo(nRows, "w", type, calculated, "%");
                        nRows++;
                    }
                    else if (data.otp.m != 0) {
                        let calculated = (chem.m.quantity / data.otp.m.quantity) * 100;
                        chem.w = new KnownInfo(nRows, "w", type, calculated, "%");
                        nRows++;
                    }
                }
            }

        } else {
            if (type != "otp" && chem.w != 0 && data.otp.m != 0) {
                let calculated = chem.w.quantity * data.otp.m.quantity;
                chem.m = new KnownInfo(nRows, "m", type, calculated, "g");
                nRows++;
            } else if (type == "otp" && data.otv.m != 0 && data.otap.m != 0) {
                let calculated = data.otv.m.quantity + data.otap.m.quantity;
                chem.m = new KnownInfo(nRows, "m", type, calculated, "g");
            } else if (type == "otv" && data.ext.y != 0 && data.otp.V != 0) {
                let calculated = data.ext.y.quantity * data.otp.V.quantity;
                chem.m = new KnownInfo(nRows, "m", type, calculated, "g");
                nRows++;
            } else if (type == "otap" && data.ext.b != 0 && data.otv.n != 0) {
                let calculated = (data.otv.n.quantity / data.ext.b.quantity) * 1000;
                chem.m = new KnownInfo(nRows, "m", type, calculated, "g");
                nRows++;
            }
        }

        if (chem.n != 0) {
            if (chem.m == 0 && chem.M != 0) {
                let calculated = chem.n.quantity * chem.M.quantity;
                chem.m = new KnownInfo(nRows, "m", type, calculated, "g");
                nRows++;
            }
            if (type != "otp") {
                if (chem.x != 0) {
                    let otpN = chem.n.quantity / (chem.x.quantity / 100);
                    let bX = 1 - (chem.x.quantity / 100);
                    let bN = otpN * bX;
                    if (data.otp.n == 0) {
                        data.otp.n = new KnownInfo(nRows, "n", "otp", otpN, "g");
                        nRows++;
                    } else {
                        bN = data.otp.n.quantity - chem.n.quantity;
                    }
                    if (type == "otap") {
                        if (data.otv.n == 0) {
                            data.otv.n = new KnownInfo(nRows, "n", "otv", bN, "g");
                            nRows++;
                        }
                        data.otv.x = new KnownInfo(nRows, "w", "otv", bX * 100, "%");
                        nRows++;
                    } else {
                        if (data.otap.n == 0) {
                            data.otap.n = new KnownInfo(nRows, "n", "otap", bN, "g");
                            nRows++;
                        }
                        data.otap.x = new KnownInfo(nRows, "w", "otap", bX * 100, "%");
                        nRows++;
                    }
                } else {
                    if (type == "otap" && data.otv.n != 0) {
                        let calculated = (chem.n.quantity / (chem.n.quantity + data.otv.n.quantity)) * 100;
                        chem.x = new KnownInfo(nRows, "x", type, calculated, "%");
                        nRows++;
                    }
                    else if (type == "otv" && data.otap.n != 0) {
                        let calculated = (chem.n.quantity / (chem.n.quantity + data.otap.n.quantity)) * 100;
                        chem.x = new KnownInfo(nRows, "x", type, calculated, "%");
                        nRows++;
                    }
                    else if (data.otp.n != 0) {
                        let calculated = (chem.n.quantity / data.otp.n.quantity) * 100;
                        chem.x = new KnownInfo(nRows, "x", type, calculated, "%");
                        nRows++;
                    }
                }
            }

        } else {
            if (type != "otp" && chem.x != 0 && data.otp.n != 0) {
                let calculated = chem.x.quantity * data.otp.n.quantity;
                chem.n = new KnownInfo(nRows, "n", type, calculated, "mol");
                nRows++;
            } else if (type == "otp" && data.otv.n != 0 && data.otap.n != 0) {
                let calculated = data.otv.n.quantity + data.otap.n.quantity;
                chem.n = new KnownInfo(nRows, "n", type, calculated, "mol");
                nRows++;
            } else if (type == "otv") {
                if (data.ext.b != 0 && data.otap.m != 0) {
                    let calculated = data.ext.b.quantity * (data.otap.m.quantity / 1000);
                    chem.n = new KnownInfo(nRows, "n", type, calculated, "mol");
                    nRows++;
                } else if (data.ext.c != 0 && data.otp.V != 0) {
                    let calculated = data.ext.c.quantity * data.otp.V.quantity;
                    chem.n = new KnownInfo(nRows, "n", type, calculated, "mol");
                    nRows++;
                }
            }
        }

        if (chem.V != 0) {
            if (chem.m == 0 && chem.D != 0) {
                let calculated = chem.V.quantity * chem.D.quantity * 1000;
                chem.m = new KnownInfo(nRows, "m", type, calculated, "g");
                nRows++;
            }
            if (type != "otp") {
                if (chem.phi != 0) {
                    let otpV = chem.V.quantity / (chem.phi.quantity / 100);
                    let bPhi = 1 - (chem.phi.quantity / 100);
                    let bV = otpV * bPhi;
                    if (data.otp.V == 0) {
                        data.otp.V = new KnownInfo(nRows, "n", "otp", otpV, "g");
                        nRows++;
                    } else {
                        bV = data.otp.V.quantity - chem.V.quantity;
                    }
                    if (type == "otap") {
                        if (data.otv.V == 0) {
                            data.otv.V = new KnownInfo(nRows, "n", "otv", bV, "g");
                            nRows++;
                        }
                        data.otv.phi = new KnownInfo(nRows, "phi", "otv", bPhi * 100, "%");
                        nRows++;
                    } else {
                        if (data.otap.V == 0) {
                            data.otap.V = new KnownInfo(nRows, "n", "otap", bV, "g");
                            nRows++;
                        }
                        data.otap.phi = new KnownInfo(nRows, "phi", "otap", bPhi * 100, "%");
                        nRows++;
                    }
                } else {
                    if (type == "otap" && data.otv.V != 0) {
                        let calculated = (chem.V.quantity / (chem.V.quantity + data.otv.V.quantity)) * 100;
                        chem.phi = new KnownInfo(nRows, "phi", type, calculated, "%");
                        nRows++;
                    }
                    else if (type == "otv" && data.otap.V != 0) {
                        let calculated = (chem.V.quantity / (chem.V.quantity + data.otap.V.quantity)) * 100;
                        chem.phi = new KnownInfo(nRows, "phi", type, calculated, "%");
                        nRows++;
                    }
                    else if (data.otp.V != 0) {
                        let calculated = (chem.V.quantity / data.otp.V.quantity) * 100;
                        chem.phi = new KnownInfo(nRows, "phi", type, calculated, "%");
                        nRows++;
                    }
                }
            }

        } else {
            if (type != "otp" && chem.phi != 0 && data.otp.V != 0) {
                let calculated = chem.phi.quantity * data.otp.V.quantity;
                chem.V = new KnownInfo(nRows, "V", type, calculated, "dm^3");
                nRows++;
            } else if (type == "otp" && data.otv.V != 0 && data.otap.V != 0) {
                let calculated = data.otv.V.quantity + data.otap.V.quantity;
                chem.V = new KnownInfo(nRows, "V", type, calculated, "dm^3");
                nRows++;
            } else if (type == "otp") {
                if (data.ext.y != 0 && data.otv.m != 0) {
                    let calculated = data.otv.m.quantity / data.ext.y.quantity;
                    chem.V = new KnownInfo(nRows, "V", type, calculated, "dm^3");
                    nRows++;
                } else if (data.ext.c != 0 && data.otv.n != 0) {
                    let calculated = data.otv.n.quantity / data.ext.c.quantity;
                    chem.V = new KnownInfo(nRows, "V", type, calculated, "dm^3");
                    nRows++;
                }
            }
        }

        if (type != "otp") {
            if (chem.w != 0) {
                if (type == "otap" && data.otv.w == 0) {
                    let calculated = 100 - chem.w.quantity;
                    data.otv.w = new KnownInfo(nRows, "w", "otv", calculated, "%");
                    nRows++;
                }
                if (type == "otv" && data.otap.w == 0) {
                    let calculated = 100 - chem.w.quantity;
                    data.otap.w = new KnownInfo(nRows, "w", "otap", calculated, "%");
                    nRows++;
                }
            }
            if (chem.x != 0) {
                if (type == "otap" && data.otv.x == 0) {
                    let calculated = 100 - chem.x.quantity;
                    data.otv.x = new KnownInfo(nRows, "x", "otv", calculated, "%");
                    nRows++;
                }
                if (type == "otv" && data.otap.x == 0) {
                    let calculated = 100 - chem.x.quantity;
                    data.otap.x = new KnownInfo(nRows, "x", "otap", calculated, "%");
                    nRows++;
                }
            }
            if (chem.phi != 0) {
                if (type == "otap" && data.otv.phi == 0) {
                    let calculated = 100 - chem.phi.quantity;
                    data.otv.phi = new KnownInfo(nRows, "phi", "otv", calculated, "%");
                    nRows++;
                }
                if (type == "otv" && data.otap.phi == 0) {
                    let calculated = 100 - chem.phi.quantity;
                    data.otap.phi = new KnownInfo(nRows, "phi", "otap", calculated, "%");
                    nRows++;
                }
            }
        }
    }
    // console.log(chem,data)
}

function ElementInfo(element, ind, id){
    this.element = element
    this.ind = ind
    this.id = id
    this.c0 = 0
    this.c1 = 0
}

function calConstant(reactants, products, known) {
    console.log(reactants, products);

    /*reactants =[
        {state: 'g', element: 'I2', coefficient: '1', id: 0, type: 'reactant', known:[{id:0,symbol:c,chem:'H2',quantity:0.222,ext:'final',unit:'mol/dm3}]}
        {state: 'g', element: 'H2', coefficient: '1', id: 1, type: 'reactant', known:[{id:0,symbol:c,chem:'I2',quantity:0.222,ext:'final',unit:'mol/dm3}]}
    ]*/
    /*products =[
        {state: 'g', element: 'HI', coefficient: '2', id: 0, type: 'product', known:[{id:0,symbol:c,chem:'HI',quantity:1.56,ext:'final',unit:'mol/dm3}]}
    ]*/

    // let productsTest = reactants.map(el=>{let newEl = {element:el.element,c:el.known,p:0,}})
    let elementsFinal
    let reactantsC = reactants.filter(el => el.state !== 'l' && el.state !== 's' ? true : false);
    let productsC = products.filter(el => el.state !== 'l' && el.state !== 's' ? true : false);

    let eqConst = productsC.reduce((acc, el) => (acc *= el.known[0].quantity ** el.coefficient), 1) / reactantsC.reduce((acc, el) => (acc *= el.known[0].quantity ** el.coefficient), 1);
    return eqConst;
}


export const calcConstant = calConstant;