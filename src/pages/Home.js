import axios from 'axios';
import { useEffect, useRef, useState } from 'react';
import '../main.css';
import '../Home.css';
import closeI from '../assets/imgs/close.svg';
import searchI from '../assets/imgs/search.svg';

function Home() {
   const [elements, setElements] = useState([]);
   const [elementTypes, setElementTypes] = useState({ nonmetals: [], halfmetals: [] });
   const [clickedEl, setClickedEl] = useState({
      "name": "Hydrogen, Vodik",
      "Ar": 1.008,
      "type": "nonmetal, nemetal",
      "category": null,
      "number": 1,
      "period": 1,
      "phase": "Gas",
      "hrv_summary": "Vodik je najlakši element u periodnom sustavu. Njegov jednoatomski oblik (H) je najobilnija kemijska tvar u Svemiru, čineđi oko 75% sve barionske mase.",
      "symbol": "H",
      "xpos": 1,
      "ypos": 1,
      "shells": [
         1
      ],
      "electron_affinity": 72.769,
   });
   const [clicked, setClicked] = useState(false);
   const [notFound, setNotFound] = useState(false)
   const periodicTableRef = useRef();
   const elCardRef = useRef();
   const elSearchRef = useRef();

   useEffect(() => {
      axios.get("http://localhost:3001/table").then(res => {
         setElements(res.data.elements);
         setElementTypes({ ...elementTypes, nonmetals: res.data.nonmetals, halfmetals: res.data.halfmetals });
      });
   }, []);

   function ShowElCard(el) {
      if (!clicked) { setClickedEl(el); }
      console.log(clickedEl, clicked);
      let classList = elCardRef.current.className.split(" ");
      const defaultClasses = "text-black shadow-sm border-black border rounded-md b max-sm:w-[300px] max-w-[450px] grow p-2 gap-2 items-center absolute transform-center flex flex-col";
      setClicked(!clicked);
      if (classList.indexOf("hidden") < 0) {
         classList = defaultClasses.split(" ");
         console.log("out");
         classList.push("hidden");
      } else {
         classList = defaultClasses.split(" ");
         if (el.type.split(", ")[0] == "metalloid") {
            classList.push("halfmetal");
         } else {
            classList.push(el.type.split(", ")[0]);
         }

         console.log(classList);
      }
      elCardRef.current.className = classList.join(" ");
   }

   function HandleSearch() {
      setNotFound(false)
      let searchValue = elSearchRef.current.value;
      let searchType = !isNaN(parseInt(searchValue))?"number":searchValue.length<3?"symbol":"name"
      console.log(searchType, searchValue, parseInt(searchValue), !isNaN(parseInt(searchValue))?"number":searchValue.length<3?"symbol":"name")
      let searchedElement = elements.filter(el=>searchType=="name"?el.name.split(", ")[0].toLowerCase()==searchValue.toLowerCase() || el.name.split(", ")[1].toLowerCase()==searchValue.toLowerCase()?true:false:el[searchType]==searchValue?true:false)[0]
      console.log(searchedElement)
      if(searchedElement!==undefined){
         setClickedEl(searchedElement)
         setClicked(true)
         let classList = elCardRef.current.className.split(" ");
         const defaultClasses = "text-black shadow-sm border-black border rounded-md b max-sm:w-[300px] max-w-[450px] grow p-2 gap-2 items-center absolute transform-center flex flex-col";
         classList = defaultClasses.split(" ");
         if (searchedElement.type.split(", ")[0] == "metalloid") {
            classList.push("halfmetal");
         } else {
            classList.push(searchedElement.type.split(", ")[0]);
         }
         elCardRef.current.className = classList.join(" ");
      }else{
         setNotFound(true)

      }
   }

   function capitalizeFirstLetter(string) {
      return string.charAt(0).toUpperCase() + string.slice(1);
  }

   return (
      <div className=' '>
         <div className={`${clicked ? "blur-sm" : ""} mx-4 mt-4 flex flex-col`} id="">
            <h3 className="brand-slogan text-lg font-bold">Kemija koja inspirira</h3>
            <h1 className="main-text text-lg max-md:hidden">Pogledajte naše <strong>Kalkulatore</strong> za sve Vaše kemijske potrebe ili pogledajte naš interaktivni periodni sustav!</h1>
            <h1 className="main-text text-lg md:hidden">Pogledajte naše <strong>Kalkulatore</strong> za sve Vaše kemijske potrebe ili pretražite element periodnog sustava!</h1>
         </div>
         <div className="relative flex flex-col mx-4 items-center mt-4">
            <div ref={periodicTableRef}
               className={`${clicked ? "blur-sm" : ""} max-md:hidden rounded-xl p-3 text-white grid grid-rows-[repeat(9,45px)] grid-cols-[repeat(18,45px)]`}
               id="periodicTable">
               {elements.map(el => (
                  <div className={`element ${!clicked ? "element_hover cursor-pointer" : ""} `} onClick={() => { if (!clicked) { ShowElCard(el); } }} style={{
                     gridRowStart: String(56 < el.number && el.number < 72 ? 8 : 88 < el.number && el.number < 104 ? 9 : el.period),
                     gridColumnStart: String(el.xpos)
                  }}>
                     <div className={"element-inner " + (elementTypes.nonmetals.includes(el.number) ? "nonmetal" : elementTypes.halfmetals.includes(el.number) ? "halfmetal" : "metal")}>
                        <p>{el.number}</p>
                        <p>{el.symbol} </p>
                     </div>
                     <div className={"element-back " + (el.phase)}>
                        <p>{el.Ar}</p>
                     </div>
                  </div>)
               )}
            </div>
            <div className={`flex md:hidden flex-col ${clicked ? "blur-sm" : ""}`}>
               <label htmlFor='formulaInput text-xl'>Unesite protonski broj, ime ili simbol elementa</label>
               <div className="w-full flex text-black md:text-xl">

                  <input id="formulaInput" placeholder='1, H ili vodik' ref={elSearchRef} className="shadow-[#222] text-xl bg-white w-[90%] [clip-path:inset(0_0px_-10px_-10px)] p-1 shadow-sm rounded-l-sm" />

                  <button id="submit" onClick={HandleSearch} className="p-1 rounded-r-sm bg-[#92FF9F] [clip-path:inset(0_-10px_-10px_0)] min-h-[31.98px] [box-shadow:0_1px_2px_0_#222]">
                     <img className="w-7 h-7" src={searchI} />
                  </button>
               </div>
            </div>

            <div ref={elCardRef} className={`text-black shadow-sm border-black border rounded-md b max-sm:w-[300px] hidden max-w-[450px] grow p-2 gap-2 items-center absolute md:transform-center bottom-[-5%] flex flex-col`}>
               <div className='w-[95%] flex items-center justify-start  relative grow'>
                  <h1 className='text-2xl font-bold ml-auto'>{clickedEl.name.split(", ")[1]}</h1>
                  <a onClick={() => ShowElCard(1)} className='justify-self-end ml-auto' role='button'><img className='w-7' src={closeI} /></a>
               </div>
               <div className='flex flex-row border-b-2 border-black justify-between grow w-[95%]'>
                  <h2 className='text-5xl self-start'>{clickedEl.symbol}</h2>
                  <div className='flex flex-col justify-center'>
                     <h2 className='font-bold'>{capitalizeFirstLetter(clickedEl.type.split(", ")[1])} ({clickedEl.phase})</h2>
                     <h2 className='font-bold'>{clickedEl.xpos}. Skupina {clickedEl.category != null ? `(${clickedEl.category.split(", ")[1]})` : ""}</h2>
                  </div>
                  <div className='flex flex-col self-end'>
                     <h2>Broj: <strong>{clickedEl.number}</strong></h2>
                     <h2>Ar: <strong>{clickedEl.Ar}</strong></h2>

                  </div>
               </div>
               <div className='flex w-[95%] max-h-[200px] gap-3'>

                  <span className='overflow-auto'>{clickedEl.hrv_summary}</span>
               </div>
               <div className='w-[95%] flex gap-1 flex-col'>
                  <h2>Ljuske: <strong>{clickedEl.shells.join(" ")}</strong></h2>
                  <h2>Afinitet: <strong>{clickedEl.electron_affinity}</strong></h2>
               </div>
            </div>
            <h2 className={`text-2xl text-red-400 ${notFound?"":"hidden"}`}>Taj element ne postoji</h2>
         </div>
      </div>
   );
}

export default Home;