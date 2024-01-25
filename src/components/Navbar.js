import { createRef } from "react";
import { Outlet, Link } from "react-router-dom";

function Navbar() {
    let dropdownRef = createRef()
    function Dropdown(){
        let classList = dropdownRef.current.className.split(" ")
        if(classList.indexOf("hidden")<0){
            classList.push("hidden")
        } else {
            classList.splice(classList.indexOf("hidden"), 1)
        }
        dropdownRef.current.className = classList.join(" ")
    }
    return (
        <>
            <nav className="navbar w-full flex text-2xl flex-row justify-center justify-between font-red-hat">
                
                {/* <div className="max-lg:hidden"> */}
                <div className="">
                    <ul className="flex flex-row items-center gap-4">
                        <li><Link className=" font-bold font-brand" to="/">Home</Link></li>
                        <li className="">
                            <a className="text-lg" href="#" role="button" id="dropdownToggle" onClick={Dropdown}>
                                Kalkulatori
                            </a>
                            <ul ref={dropdownRef} className="hidden absolute rounded-lg t-0 mt-4 bg-white p-2" id="dropdownMenu">
                                <li className="">
                                    <Link className="text-lg" to="/calculators/molarmass">Molarna Masa</Link>
                                </li>
                                <li className="">
                                    <Link className="text-lg" to="/calculators/solutions">Otopine</Link>
                                </li>
                                <li className="">
                                    <Link className="text-lg" to="/calculators/equlibriumconstant">Konstanta Kemijske Ravnoteže</Link>
                                </li>
                            </ul>
                        </li>
                    </ul>
                </div>
                <h2 className="font-bold font-brand" to="/">Reactify</h2>
                {/* <div className="max-lg:hidden"> */}
                <div className="">
                    <ul className="flex flex-row items-center gap-4">
                    <li>
                            <a href="" className="text-lg">Tečajevi</a>
                        </li>
                        <li className="">
                            <Link className="text-lg" to="/aboutus">O Nama</Link>
                        </li>
                    </ul>
                </div>
            </nav>
            <Outlet />
        </>
    );
}

export default Navbar;