import React from 'react'
import logo from '../images/ParcelX_Logo.svg'
import {NavLink } from "react-router-dom";
import SubscribeForm from '../component/forms/SubscribeForm';
export default function Footer({ homeHref = null, description = "ParcelX offers AI-based smoother, easier, reliable and smartest platform to manage your end to end shipping needs for your business.", quickLinks = null, usefulLinks = null }) {
  return (
    <div>
      <footer>
        <div className='footer-bg'>
            <div className='container-fluid'>
                <div className='col-md-11 mx-auto'>
                    <div className='row mb-5'>
                        <div className='col-md-6'>
                            {homeHref ? <a className="navbar-brand" href={homeHref}><img src={logo} alt='footer logo' className='img-fluid footer-logo' /></a> : <NavLink className="navbar-brand" to="/"><img src={logo} alt='footer logo' className='img-fluid footer-logo' /></NavLink>}
                            <p>{description}</p>
                            <h5 className='subtitle'>Subscribe to our Newsletter!</h5>
                            {/* <div className="d-flex">
                                <input className="form-control me-3" placeholder="Enter Email id" type="text" />
                                <button className="btn btn-primary footer-btn" type="submit">Subscribe</button>
                            </div> */}
                            <SubscribeForm />
                        </div>
                        <div className='col-md-6'>
                            <ul className='social'>
                                <a href="https://x.com/Parcelx_in" target="_blank" rel="noreferrer">
                                    <li className='social-media'>
                                        <i className="fab fa-twitter"></i>
                                    </li>
                                </a>
                                <a href="https://www.facebook.com/p/Parcel-X-100065408592406/" target="_blank" rel="noreferrer">
                                    <li className='social-media'>
                                        <i className="fab fa-facebook-f"></i>
                                    </li>
                                </a>
                                <a href="https://www.instagram.com/parcelx.in" target="_blank" rel="noreferrer">
                                    <li className='social-media'>
                                        <i className="fab fa-instagram"></i>    
                                    </li>
                                </a>
                                <a href="https://in.linkedin.com/company/parcel-x" target="_blank" rel="noreferrer">
                                    <li className='social-media'>
                                        <i className="fab fa-linkedin"></i>
                                    </li>
                                </a>
                                <a href="https://www.youtube.com/@ParcelX" target="_blank" rel="noreferrer">
                                    <li className='social-media'>
                                        <i className="fab fa-youtube"></i>
                                    </li>
                                </a>
                            </ul>
                            <div className='footer-link'>
                                <ul className="social-link">
                                    {quickLinks ? quickLinks.map((link) => <li className="nav-item" key={link.label}><a className="nav-link" href={link.href}>{link.label}</a></li>) : <>
                                    <h5 className='link-heading'>Quick Links</h5>
                                    <li className="nav-item">
                                        <NavLink className="nav-link" aria-current="page" to="features">Features</NavLink>
                                    </li>
                                    <li className="nav-item">
                                        <NavLink className="nav-link" to="pricing">Pricing</NavLink>
                                    </li>
                                    <li className="nav-item">
                                        <NavLink className="nav-link" to="about">About</NavLink>
                                    </li>
                                    <li className="nav-item">
                                        <NavLink className="nav-link" to="contact-us">Contact</NavLink>
                                    </li>
                                
                                    </>}
                                </ul>
                                <ul className="social-link">
                                    {usefulLinks ? usefulLinks.map((link) => <li className="nav-item" key={link.label}><a className="nav-link" href={link.href}>{link.label}</a></li>) : <>
                                    <h5 className='link-heading'>Useful Links</h5>
                                    <li className="nav-item">
                                        <NavLink className="nav-link" aria-current="page" to="privacy">Privacy Policy</NavLink>
                                    </li>
                                    <li className="nav-item">
                                        <NavLink className="nav-link" to="terms">Terms & Conditions</NavLink>
                                    </li>
                                    <li className="nav-item">
                                        <NavLink className="nav-link" to="refund-cancellation">Refund & Cancellation Policy</NavLink>
                                    </li>
                                    <li className="nav-item">
                                        <NavLink className="nav-link" to="general-data">Data protection</NavLink>
                                    </li>
                                    <li className="nav-item">
                                        <NavLink className="nav-link" to="policy-compliance">Compliance</NavLink>
                                    </li>
                                
                                    </>}
                                </ul>
                            </div>
                        </div>
                    </div>
                    <p className='mb-0'>© Copyright 2026, All Rights Reserved</p>
                </div>
            </div>
        </div>
      </footer>
    </div>
  )
}