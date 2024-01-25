import logo from './logo.svg';
import './App.css';
import './main.css'
import Home from './pages/Home';
import AboutUs from './pages/AboutUs';
import Navbar from './components/Navbar';
import { BrowserRouter, Route, Routes } from 'react-router-dom';
import MolarMassCalc from './pages/calculators/MolarMass';
import SolutionCalc from './pages/calculators/Solution';
import EquilibriumCalc from './pages/calculators/Equilibrium';

function App() {
  return (
    <>
      <BrowserRouter className="font-red-hat block relative text-center z-[1] h-full w-full bg-[#F0EEEE]">
        <Routes>
          <Route path="/" element={<Navbar />}>
            <Route index element={<Home />} />
            <Route path="aboutus" element={<AboutUs />} />
            <Route path="calculators/molarmass" element={<MolarMassCalc/>} />
            <Route path="calculators/solutions" element={<SolutionCalc/>} />
            <Route path="calculators/equlibriumconstant" element={<EquilibriumCalc/>} />
          </Route>
        </Routes>
      </BrowserRouter>
    </>

  );
}

export default App;
