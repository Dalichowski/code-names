import React, { Component } from 'react';
import Logo from '../assets/codeNameLogo4.jpg';

import './NavBar.css';

class NavBar extends Component{
    render(){
        return(
            <div>
                <ul className="nav justify-content-center">
                    <li className="nav-item">
                        <img src={Logo} alt="Logo" width="200"></img>
                    </li>
                </ul>
            </div>
        )
    }
}

export default NavBar;
