import { Helmet } from "react-helmet";
import { Link } from "react-router-dom";
import { NavLink } from "react-router-dom";


function Footer() {
  const facebook = "https://facebook.com/SunnatIbrahim";
  const instagram = "https://instagram.com/yourpage";
  const whatsapp = "https://wa.me/9899166988";
  const email = "maktaba.sw@gmail.com";

  return (
    <>
      <Helmet>
        <link
          rel="stylesheet"
          href="https://cdnjs.cloudflare.com/ajax/libs/font-awesome/6.5.0/css/all.min.css"
        />
      </Helmet>

      <footer className="bg-gray-800 text-gray-300">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-12">
          <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-4 gap-6">

            {/* Follow Us */}
            <div>
              <h3 className="text-white text-lg md:text-xl font-semibold mb-4">
                Follow Us
              </h3>
              <div className="flex items-center space-x-3">
                <a href={facebook} target="_blank" rel="noopener noreferrer"
                  className="w-10 h-10 rounded-full bg-white flex items-center justify-center shadow-sm">
                  <i className="fa-brands fa-facebook text-blue-600 text-xl md:text-2xl"></i>
                </a>
                <a href={instagram} target="_blank" rel="noopener noreferrer"
                  className="w-10 h-10 rounded-full bg-white flex items-center justify-center shadow-sm">
                  <i className="fa-brands fa-instagram text-pink-500 text-xl md:text-2xl"></i>
                </a>
                <a href={whatsapp} target="_blank" rel="noopener noreferrer"
                  className="w-10 h-10 rounded-full bg-white flex items-center justify-center shadow-sm">
                  <i className="fa-brands fa-whatsapp text-green-500 text-xl md:text-2xl"></i>
                </a>
                <a href={`mailto:${email}`}
                  className="w-10 h-10 rounded-full bg-white flex items-center justify-center shadow-sm">
                  <i className="fa-solid fa-envelope text-red-500 text-xl md:text-2xl"></i>
                </a>
              </div>
            </div>

            {/* Policies */}
            <div>
              <h3 className="text-white text-lg md:text-xl font-semibold mb-4">
                Policies
              </h3>
              <ul className="space-y-2 text-sm">
                <li>
                  <NavLink
                    to="/secure-shopping"
                    className={({ isActive }) =>
                      `flex items-center gap-2 transition-all
         ${isActive ? "text-primary font-semibold" : "text-gray-300 hover:text-white"}`
                    }
                  >
                    <span>🛡️</span> Secure Shopping
                  </NavLink>
                </li>

                <li>
                  <NavLink
                    to="/privacy-policy"
                    className={({ isActive }) =>
                      `flex items-center gap-2 transition-all
         ${isActive ? "text-primary font-semibold" : "text-gray-300 hover:text-white"}`
                    }
                  >
                    <span>🔒</span> Privacy Policy
                  </NavLink>
                </li>

                <li>
                  <NavLink
                    to="/terms"
                    className={({ isActive }) =>
                      `flex items-center gap-2 transition-all
         ${isActive ? "text-primary font-semibold" : "text-gray-300 hover:text-white"}`
                    }
                  >
                    <span>📜</span> Terms of Use
                  </NavLink>
                </li>

                <li>
                  <NavLink
                    to="/shipping-policy"
                    className={({ isActive }) =>
                      `flex items-center gap-2 transition-all
         ${isActive ? "text-primary font-semibold" : "text-gray-300 hover:text-white"}`
                    }
                  >
                    <span>🚚</span> Shipping Policy
                  </NavLink>
                </li>

                <li>
                  <NavLink
                    to="/returns-refund"
                    className={({ isActive }) =>
                      `flex items-center gap-2 transition-all
         ${isActive ? "text-primary font-semibold" : "text-gray-300 hover:text-white"}`
                    }
                  >
                    <span>🔄</span> Returns & Refunds
                  </NavLink>
                </li>

                <li>
                  <NavLink
                    to="/payment-option"
                    className={({ isActive }) =>
                      `flex items-center gap-2 transition-all
         ${isActive ? "text-primary font-semibold" : "text-gray-300 hover:text-white"}`
                    }
                  >
                    <span>💳</span> Payment Options
                  </NavLink>
                </li>
              </ul>

            </div>

            {/* Store Locations */}
            {/* <div className="text-center">
  <h3 className="text-white text-lg md:text-xl font-semibold mb-4">
    Also Visit Our Stores
  </h3>

  <div className="flex flex-col items-center space-y-3">
    <i className="fa-solid fa-location-dot text-primary text-4xl"></i>

    <p className="text-sm text-gray-300 leading-relaxed max-w-xs mx-auto">
      25 B-1, Rehman Complex, Jamia Nagar, Block C,
      Joga Bai Extension, Okhla, New Delhi – 110025
    </p>
  </div>
</div> */}

            <div>
              <h3 className="text-white text-lg md:text-xl font-semibold mb-4">
                Also Visit Our Stores
              </h3>

              <ul className="space-y-3 text-sm">
                <li className="flex items-start gap-2">
                  <i className="fa-solid fa-location-dot mt-1"></i>
                  <span>
                    25 B-1, Rehman Complex, Jamia Nagar, Block C,
                    Joga Bai Extension, Okhla, New Delhi – 110025
                  </span>
                </li>
              </ul>

            </div>

            {/* About */}
            <div>
              <h3 className="text-white text-lg md:text-xl font-semibold mb-4">
                Book Store
              </h3>
              <p className="text-sm leading-relaxed">
                Book-Store is an online marketplace for buying books, Prayer Mat, Tasbih, Quran Box, Itra/Perfume etc with shipping all over India. Discover our wide variety of products at the most affordable prices.
              </p>
            </div>

          </div>
        </div>
      </footer>

      {/* Copyright */}
      <div className="bg-gray-900 border-t border-gray-700">
        {/* <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-4 flex flex-col md:flex-row items-center justify-between gap-3">
          <p className="text-sm text-gray-400 text-center md:text-left">
            © {new Date().getFullYear()} <span className="text-white font-medium">Islamic Book Zone</span> — All Rights Reserved
          </p>
          <img
            src="/assets/images/methods.png"
            alt="Accepted payment methods"
            className="h-6 opacity-90 hover:opacity-100 transition mx-auto md:mx-0"
          />
        </div> */}
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-4 flex flex-col md:flex-row items-center justify-between gap-3">

          {/* Left: Copyright */}
          <p className="text-sm text-gray-400 text-center md:text-left">
            © {new Date().getFullYear()}{" "}
            <span className="text-white font-medium">Islamic Book Zone</span> — All Rights Reserved
          </p>

          {/* Center: Testing Notice */}
          <p className="text-xs text-yellow-400 font-semibold flex items-center gap-1">
            🚧 Site under final testing
          </p>

          {/* Right: Payment Methods */}
          <img
            src="/assets/images/methods.png"
            alt="Accepted payment methods"
            className="h-6 opacity-90 hover:opacity-100 transition mx-auto md:mx-0"
          />
        </div>

      </div>
    </>
  );
}

export default Footer;
