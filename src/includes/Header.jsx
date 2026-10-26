import React, { useEffect, useState } from "react";
import { NavLink } from "react-router-dom";
import logo from "../images/ParcelX_Logo.svg";
import "./Header.css";

function Header({
  item = "About",
  item1 = "Features",
  item2 = "Videsh",
  item3 = "Pacex",
  item4 = "Career",
  item5 = "Courier Partners",
  item6 = "Channel Integration",
  item7 = "Pricing",
  item8 = "Tracking",
  item9 = "Contact",
  nav_button = "Sign Up",
  nav_button2 = "Login",
}) {
  const [scrolled, setScrolled] = useState(false);
  const [menuOpen, setMenuOpen] = useState(false);

  useEffect(() => {
    const handleScroll = () => setScrolled(window.scrollY > 50);
    window.addEventListener("scroll", handleScroll, { passive: true });
    handleScroll();
    return () => window.removeEventListener("scroll", handleScroll);
  }, []);

  const links = [
    [item, "/about"], [item1, "/features"], [item2, "/parcel-videsh"],
    [item3, "/pacex"], [item4, "/career"], [item5, "/courier-partners"],
    [item6, "/channel-integration"], [item7, "/pricing"], [item8, "/tracking"],
    [item9, "/contact-us"],
  ];

  const closeMenu = () => setMenuOpen(false);

  return (
    <header className={`px-header ${scrolled ? "header-top" : ""}`}>
      <nav className="px-navbar" aria-label="Main navigation">
        <div className="px-nav-inner">
          <NavLink className="px-brand" to="/" onClick={closeMenu} aria-label="ParcelX home">
            <img src={logo} width="150" alt="ParcelX" />
          </NavLink>

          <button
            className={`px-menu-toggle ${menuOpen ? "is-open" : ""}`}
            type="button"
            aria-label={menuOpen ? "Close navigation menu" : "Open navigation menu"}
            aria-expanded={menuOpen}
            onClick={() => setMenuOpen((open) => !open)}
          >
            <span /><span /><span />
          </button>

          <div className={`px-nav-collapse ${menuOpen ? "is-open" : ""}`}>
            <ul className="px-nav-links">
              {links.map(([label, to]) => (
                <li key={to}>
                  <NavLink
                    to={to}
                    onClick={closeMenu}
                    className={({ isActive }) => isActive ? "px-nav-link nav-active" : "px-nav-link"}
                  >
                    {label}
                  </NavLink>
                </li>
              ))}
              <li className="px-mobile-actions">
                <NavLink to="/dashboard" onClick={closeMenu} className="px-btn px-btn-secondary">{nav_button2}</NavLink>
                <NavLink to="/dashboard" onClick={closeMenu} className="px-btn px-btn-primary">{nav_button}</NavLink>
              </li>
            </ul>
          </div>

          <div className="px-desktop-actions">
            <NavLink to="/dashboard" className="px-btn px-btn-secondary">{nav_button2}</NavLink>
            <NavLink to="/dashboard" className="px-btn px-btn-primary">{nav_button}</NavLink>
          </div>
        </div>
      </nav>
    </header>
  );
}

export default Header;
