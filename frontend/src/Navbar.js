import {Link} from "react-router-dom";

const Navbar = () => {
    return (
        <div className="navbar">
            <h1>Interoperabilidade</h1>
            <div className="links">
                <Link to="/">Home</Link>
                <Link to="/login" id="a-create">Login</Link>
            </div>
        </div>
    );
}
 
export default Navbar;