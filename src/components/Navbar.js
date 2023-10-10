import {Outlet, Link} from "react-router-dom"

function Navbar(){
    return(
        <>
        <nav>
            <ul>
                <li>
                    <Link to="/">Home</Link>
                </li>
                <li>
                    <Link to="/aboutus">About Us</Link>
                </li>
            </ul>
        </nav>
        <Outlet/>
        </>
    )
}

export default Navbar;