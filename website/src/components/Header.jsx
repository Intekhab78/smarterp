import { Link } from "react-router-dom";
import logo from "../assets/images/logo.svg";
import logo1 from "../assets/images/logo1.png";
import { useCart } from "../CartContext/CartContext"; // Import useCart

function Header() {
  const { getCartItemCount } = useCart(); // Get the cart item count

  return (
    <header className="py-4 shadow-sm bg-white">
      <div className="container flex items-center justify-between">
        <Link to="/">
          <img src={logo1} alt="Logo" className="w-12" />
        </Link>

        <div className="flex items-center space-x-4">
          <a
            href="#"
            className="text-center text-gray-700 hover:text-primary transition relative"
          >
            {/* <div className="text-2xl">
              <i className="fa-solid fa-bag-shopping"></i>
            </div> */}
            <div className="text-xs leading-3">
              <Link to="/cart">Cart</Link>
            </div>
            {/* Display dynamic item count */}
            <div className="absolute -right-4 -top-1 w-4 h-4 rounded-full flex items-center justify-center bg-primary text-white text-xs">
              {getCartItemCount()}
            </div>
          </a>
          <a
            href="#"
            className="text-center text-gray-700 hover:text-primary transition relative"
          >
            <div className="text-2xl">
              <i className="fa-regular fa-user"></i>
            </div>
            <div className="text-xs leading-3">
              <Link to="/accounts">My profile</Link>
            </div>
          </a>
        </div>
      </div>
    </header>
  );
}

export default Header;
