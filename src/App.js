import logo from './logo.svg';
import './App.css';
import './main.css'
import Home from './pages/Home';
import AboutUs from './pages/AboutUs';
import Navbar from './components/Navbar';
import { BrowserRouter, Route, Routes } from 'react-router-dom';
import MolarMassCalc from './pages/calculators/MolarMass';
import SolutionCalc from './pages/calculators/Solution';

function App() {
  return (
    <>
      <BrowserRouter className="h-full background-img font-mono">
        <Routes>
          <Route path="/" element={<Navbar />}>
            <Route index element={<Home />} />
            <Route path="aboutus" element={<AboutUs />} />
            <Route path="calculators/molarmass" element={<MolarMassCalc/>} />
            <Route path="calculators/solutions" element={<SolutionCalc/>} />
          </Route>
        </Routes>
      </BrowserRouter>
    </>

  );
}

export default App;
