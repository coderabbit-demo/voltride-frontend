import { Link, NavLink } from "react-router-dom";

export function Header() {
  return (
    <header className="site-header">
      <Link to="/" className="logo">
        ⚡ VoltRide
      </Link>
      <nav>
        <NavLink to="/">Shop</NavLink>
        <NavLink to="/cart">Cart</NavLink>
      </nav>
    </header>
  );
}
