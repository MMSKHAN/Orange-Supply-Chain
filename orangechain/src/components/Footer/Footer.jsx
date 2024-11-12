import React from 'react'
import { Facebook, Instagram, Linkedin, Twitter } from 'react-bootstrap-icons'
import logo from "./images/logo.png"
import "./Footer.css"
import { NavLink } from 'react-router-dom'
function Footer() {
  return (
    <>
      <div className="footercontainer">
        <div className="footerSection1">
            <NavLink to={'/'} className="footerlogo">
                <img src={logo} alt="footer" />
               
            </NavLink>
            <p className='orangechain' > <span> Orange </span> Chain</p> 
        </div>
        <div className="footerSection2">
             <p>Developer Contact</p>
             <p>Customer support</p>
          </div>

    

    
<div className="brandicons">
  <a href="https://www.facebook.com/profile.php?id=100086752873999" > <Facebook style={{color:"rgb(0 79 245)"}} /></a>
  <a href="https://www.instagram.com/msaud_220/?next=%2F"> <Instagram  style={{color:"#6B2A53"}}/> </a>
  <a href="/https://www.linkedin.com/in/muhammad-saud-982638282?utm_source=share&utm_campaign=share_via&utm_content=profile&utm_medium=android_app"> <Linkedin style={{color:"#0072b1"}}/></a>
 <a href="/"> <Twitter style={{color:"#00acee "}}/></a>
</div>
</div>
<p className='copy' >© Copyright Orange Chain All Rights Reserved</p>

     
    </>
  )
}

export default Footer
