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
            <nav className="navbar w-full">
                <Link className="text-2xl font-bold font-brand" to="/">Reactify</Link>
                <hr className="v-line">
                </hr>
                <div className="max-lg:hidden">
                    <ul className="flex flex-row items-center gap-4">
                        <li className="">
                            <a className="text-lg" href="#" role="button" id="dropdownToggle" onClick={Dropdown}>
                                Kalkulatori
                            </a>
                            <ul ref={dropdownRef} className="hidden absolute rounded-lg t-0 mt-4 bg-slate-900 p-2" id="dropdownMenu">
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

                        <li>
                            <a href="" className="text-lg">Tečajevi</a>
                        </li>
                        <li className="">
                            <Link className="text-lg" to="/aboutus">O Nama</Link>
                        </li>
                    </ul>
                </div>
                {/* <button class="border-2 rounded-lg p-2 lg:hidden ml-auto" id="navbarSideButton">=</button>
                <div id="navbarSide" class="lg:hidden top-0 mt-16 hidden absolute p-4 rounded-lg bg-slate-900 right-0 text-white mr-4">
                    <ul class="navbar-nav flex flex-col items-center gap-4">
                        <li class=" dropdown">
                            <a class="nav-link dropdown-toggle" href="#" role="button" data-bs-toggle="dropdown" aria-expanded="false">
                                Kalkulatori
                            </a>
                            <ul class="">
                                <li class="">
                                    <a class="" href="src/pages/kalkulatorM.html">Kalkulator Molarne Mase</a>
                                </li>
                                <li class="">
                                    <a class="" href="src/pages/kalkulatorOtp.html">Kalkulator Za Otopine</a>
                                </li>
                            </ul>
                        </li>
                        <li class="text-lg">
                            <a class="" href="src/pages/walter.html">About Walter White</a>
                        </li>
                    </ul>
                </div> */}
            </nav>
            <Outlet />
        </>
    );
}

export default Navbar;