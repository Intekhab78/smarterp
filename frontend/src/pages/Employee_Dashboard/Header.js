import { Link } from "react-router-dom";

export default function Header() {
  return (
    <header className="bg-purple-700 text-white shadow">
      <div className="max-w-7xl mx-auto px-6 py-3 flex items-center justify-between">
        {/* Left side - Logo */}
        <h1 className="text-lg font-bold tracking-wide">ERP System</h1>

        {/* Right side - Navigation */}
        <nav className="flex gap-6">
          {/* <Link
            to="/"
            className="hover:bg-purple-600 px-3 py-2 rounded transition"
          >
            Dashboard 
          </Link>*/}
          <Link 
          to="/departments" 
          className="hover:bg-purple-600 px-3 py-2 rounded transition">Departments
          </Link>

          <Link
            to="/employees"
            className="hover:bg-purple-600 px-3 py-2 rounded transition"
          >
            Employees
          </Link>
        </nav>
      </div>
    </header>
  );
}
