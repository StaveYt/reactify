import axios from 'axios';
import { useEffect, useState } from 'react';
import '../main.css';
import '../Home.css'

function Home() {
   const [elements, setElements] = useState([]);
   const [elementTypes, setElementTypes] = useState({ nonmetals: [], halfmetals: [] });

   useEffect(() => {
      axios.get("http://localhost:3001/table").then(res => {
         setElements(res.data.elements);
         setElementTypes({ ...elementTypes, nonmetals: res.data.nonmetals, halfmetals: res.data.halfmetals });
      });
   }, []);

   return (
      <div className=''>
         <div className=" mx-auto mt-4 flex flex-col" id="">
            <img className="mx-auto" src="assets\img\logo.svg" />
            <h1 className="main-text">Reactify</h1>
            <h3 className="brand-slogan">Kemija koja inspirira</h3>
         </div>
         <div className=" flex flex-col mx-4 items-center mt-4">
            <div
               className="rounded-xl p-3 text-white grid grid-rows-[repeat(9,45px)] gap-1 grid-cols-[repeat(18,45px)]"
               id="periodicTable">
               {elements.map(el => (
                  <div className='element' style={{
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
         </div>
      </div>
   );
}

export default Home;