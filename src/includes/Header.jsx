import React, { useEffect, useState } from 'react';
import logo from '../images/ParcelX_Logo.svg';
import {NavLink } from "react-router-dom";
function Header({item="About", item1="Features", item2="Videsh", item3="Pacex",item4="Career", item5="Courier Partners", item6="Channel Integration", item7="Pricing", item8="Tracking", item9="Contact", nav_button="Sign Up", nav_button2="Login", customLinks=null, loginHref="/dashboard", signupHref="/dashboard"}) {
    const [scrolled, setScrolled] = useState(false);

    useEffect(() => {
        const handleScroll = () => {
            setScrolled(window.scrollY > 50); // trigger after 50px scroll
        };

        window.addEventListener("scroll", handleScroll);

        return () => window.removeEventListener("scroll", handleScroll);
    }, []);
    return (
        <div className={`sticky-top ${scrolled ? "header-top" : ""}`}>
            <nav className="navbar navbar-expand-lg navbar-light ">
                <div className="container-fluid px-0">
                    <NavLink className="navbar-brand" to="/">
                        <img src={logo} className="img-fluid" width={150} alt="Logo" />
                    </NavLink>
                    <button className="navbar-toggler" type="button" data-bs-toggle="collapse" data-bs-target="#navbarSupportedContent" aria-controls="navbarSupportedContent" aria-expanded="false"aria-label="Toggle navigation" >
                        <span className="navbar-toggler-icon"></span>
                    </button>
                    <div className="collapse navbar-collapse" id="navbarSupportedContent">
                        <ul className="navbar-nav ms-auto mb-2 mb-lg-0 align-items-center">
                            {customLinks ? customLinks.map((link) => (
                                <li className="nav-item" key={link.label}>
                                    <a className={link.active ? "nav-active" : ""} href={link.href}>{link.label}</a>
                                </li>
                            )) : <>

                            <li className="nav-item">
                                <NavLink className={(e)=>{return e.isActive?"nav-active": ""}}  aria-current="page" to="/about">{item}</NavLink>
                            </li>
                            <li className="nav-item">
                                <NavLink className={(e)=>{return e.isActive?"nav-active": ""}}  to="/features">{item1}</NavLink>
                            </li>
                            <li className="nav-item">
                                <NavLink className={(e)=>{return e.isActive?"nav-active": ""}}  to="/parcel-videsh">{item2}</NavLink>
                            </li>
                            <li className="nav-item">
                                <NavLink className={(e)=>{return e.isActive?"nav-active": ""}}  to="/pacex">{item3}</NavLink>
                            </li>
                            <li className="nav-item">
                                <NavLink className={(e)=>{return e.isActive?"nav-active": ""}}  to="/career">{item4}</NavLink>
                            </li>
                            <li className="nav-item">
                                <NavLink className={(e)=>{return e.isActive?"nav-active": ""}}  to="/courier-partners">{item5}</NavLink>
                            </li>
                            <li className="nav-item">
                                <NavLink className={(e)=>{return e.isActive?"nav-active": ""}}  to="/channel-integration">{item6}</NavLink>
                            </li>
                            <li className="nav-item">
                                <NavLink className={(e)=>{return e.isActive?"nav-active": ""}}  to="/pricing">{item7}</NavLink>
                            </li>
                            <li className="nav-item">
                                <NavLink className={(e)=>{return e.isActive?"nav-active": ""}}  to="/tracking">{item8}</NavLink>
                            </li>
                            <li className="nav-item">
                                <NavLink className={(e)=>{return e.isActive?"nav-active": ""}}  to="/contact-us">{item9}</NavLink>
                            </li>
                            <li className='d-lg-none d-block'>
                                {loginHref.startsWith("http") ? <a href={loginHref} className="btn btn-secondary me-2">{nav_button2}</a> : <NavLink to={loginHref} className="btn btn-secondary me-2">{nav_button2}</NavLink>}
                                {signupHref.startsWith("http") ? <a href={signupHref} className="btn btn-primary">{nav_button}</a> : <NavLink to={signupHref} className="btn btn-primary">{nav_button}</NavLink>}
                            </li>
                        
                            </>}
                        </ul>
                    </div>
                    <div className='d-lg-block d-none'>
                        {loginHref.startsWith("http") ? <a href={loginHref} className="btn btn-secondary me-2">{nav_button2}</a> : <NavLink to={loginHref} className="btn btn-secondary me-2">{nav_button2}</NavLink>}
                        {signupHref.startsWith("http") ? <a href={signupHref} className="btn btn-primary">{nav_button}</a> : <NavLink to={signupHref} className="btn btn-primary">{nav_button}</NavLink>}
                    </div>
                </div>
            </nav> 
        </div>
    );
}

export default Header
