import { Link } from "react-router-dom";

function Header() {
    return (
        <header className="bg-black text-white p-4 flex justify-between items-center">
            <h1 className="text-2xl font-bold">Investment Portfolio</h1>
            <nav>
                <Link to="/dashboard" className="mr-4 hover:underline">Dashboard</Link>
                <Link to="/manage-investments" className="mr-4 hover:underline">Manage Investments</Link>
                <Link to="/portfolio" className="hover:underline">My Portfolio</Link>
            </nav>
        </header>
    );
}

export default Header;
