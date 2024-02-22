import { createRef, useState } from "react";
import { Outlet, Link } from "react-router-dom";
import hamburger from "../assets/imgs/hamburger.svg";
import dropdown from "../assets/imgs/dropdown.svg";
function Navbar() {
  const dropdownRef = createRef();
  const mobDropdownRef = createRef();
  const mobNavRef = createRef();
  const hamBtnRef = createRef();
  const [mobDropdownShow, setMobDropdownShow] = useState(false);
  const [mobNavShow, setMobNavShow] = useState(false);
  const [dropDownShow, setdropDownShow] = useState(false);

  function Dropdown() {
    let classList = dropdownRef.current.className.split(" ");
    setdropDownShow(!dropDownShow);
    if (classList.indexOf("hidden") < 0) {
      classList.push("hidden");
    } else {
      classList.splice(classList.indexOf("hidden"), 1);
    }
    dropdownRef.current.className = classList.join(" ");
    console.log(dropdownRef.current);
  }

  function MobDropdown() {
    let classList = mobDropdownRef.current.className.split(" ");
    setMobDropdownShow(!mobDropdownShow);
    if (classList.indexOf("hidden") < 0) {
      classList.push("hidden");
    } else {
      classList.splice(classList.indexOf("hidden"), 1);
    }
    mobDropdownRef.current.className = classList.join(" ");
    console.log(mobDropdownRef.current);
  }

  function MobNavbar() {
    let classList = mobNavRef.current.className.split(" ");
    setMobNavShow(!mobNavShow);
    if (classList.indexOf("hidden") < 0) {
      classList.push("hidden");
    } else {
      classList.splice(classList.indexOf("hidden"), 1);
    }
    mobNavRef.current.className = classList.join(" ");
  }

  return (
    <>
      <nav className="navbar relative w-full mb-1 flex text-2xl flex-row justify-between font-red-hat">
        <div className="max-sm:hidden">
          <ul className="flex flex-row items-center gap-4">
            <li><Link className=" font-bold" to="/">Home</Link></li>
            <li className="">
              <a className="text-lg" href="#" role="button" id="dropdownToggle" onClick={Dropdown}>
                <span>Kalkulatori</span>
                <img className={dropDownShow ? "transition-250ms flip-y mx-2 w-3 inline" : "inline w-3 mx-2 transition-250ms"} src={dropdown} />
              </a>
              <ul ref={dropdownRef} className="border border-light-gray hidden shadow-sm absolute rounded-lg z-10 t-0 mt-4 bg-white p-2" id="dropdownMenu">
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
        <h2 className="font-bold max-sm:hidden" to="/">Reactify</h2>
        <Link className="sm:hidden max-sm:text-3xl max-sm:test font-bold" to="/">Reactify</Link>
        <div className="relative max-sm:hidden">
          <ul className="max-sm:hidden flex flex-row items-center gap-4">
            <li>
              <a href="" className="text-lg cl-disabled">Tečajevi</a>
            </li>
            <li className="">
              <Link className="text-lg" to="/aboutus">O Nama</Link>
            </li>
          </ul>

        </div>
        <button ref={hamBtnRef} onClick={MobNavbar} className="sm:hidden relative aspect-square">
          <img className={mobNavShow ? "w-[31px] transition-250ms flip-x" : "w-[31px] transition-250ms"} src={hamburger} />
        </button>
        <div ref={mobNavRef} className="sm:hidden hidden transition-500ms min-w-[252px] shadow-sm border border-light-gray rounded-sm absolute z-10 right-0 mr-3 top-[95%] flex flex-col right bg-white p-1">
          <ul className="relative flex flex-col items-center gap-2">
            <li className="">
              <a className="text-lg" href="#" role="button" id="dropdownToggle" onClick={MobDropdown}>
                <span>Kalkulatori</span>
                <img className={mobDropdownShow ? "transition-250ms flip-y mx-2 w-3 inline" : "inline w-3 mx-2 transition-250ms"} src={dropdown} />
              </a>

            </li>
            <li className={mobDropdownShow ? "" : "hidden"}>
              <ul ref={mobDropdownRef} className="min-w-[242px] hidden" id="dropdownMenu">
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
              <a href="" className="text-lg cl-disabled">Tečajevi</a>
            </li>
            <li className="">
              <Link className="text-lg" to="/aboutus">O Nama</Link>
            </li>

          </ul>
          <ul className="max-sm:hidden flex flex-row items-center gap-4">

          </ul>
        </div>
      </nav>
      <Outlet />
    </>
  );
}

export default Navbar;