import { Helmet } from "react-helmet";
import { Link } from "react-router-dom";

function PolicyLayout({ title, icon, children }) {
  return (
    <>
      <Helmet>
        <title>{title} | Book Store</title>
      </Helmet>

      {/* Hero */}
      <div className="bg-gradient-to-r from-gray-900 to-gray-800 text-white">
        <div className="max-w-6xl mx-auto px-6 py-12">
          <h1 className="text-3xl md:text-4xl font-bold flex items-center gap-3">
            <span>{icon}</span>
            {title}
          </h1>
          <p className="mt-3 text-gray-300">
            Transparent policies designed for your trust and safety.
          </p>
        </div>
      </div>

      {/* Content */}
      <div className="max-w-5xl mx-auto px-6 py-12">
        <div className="bg-white rounded-xl shadow-md p-6 md:p-10 text-gray-700 leading-relaxed">
          {children}
        </div>

        {/* Quick Links */}
        <div className="mt-8 flex flex-wrap gap-4 text-sm">
          <Link to="/privacy-policy" className="text-blue-600 hover:underline">
            Privacy Policy
          </Link>
          <Link to="/terms" className="text-blue-600 hover:underline">
            Terms
          </Link>
          <Link to="/shipping-policy" className="text-blue-600 hover:underline">
            Shipping
          </Link>
          <Link to="/returns-refund" className="text-blue-600 hover:underline">
            Returns
          </Link>
        </div>
      </div>
    </>
  );
}

export default PolicyLayout;
