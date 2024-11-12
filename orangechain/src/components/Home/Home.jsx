import React from 'react';
import './Home.css'; // Import the CSS file for styling

import Homepage1 from './Homepage1';
import Homepage2 from './Homepage2';
import Homepage3 from './Homepage3';
import Homepage4 from './Homepage4';
import Homepage5 from './Homepage5';
import HomePage6 from './HomePage6';
const Home = () => {
    return (
        <div className="home">
            <Homepage1/>
            <Homepage2/>
            <Homepage3/>
            <Homepage4/>
            <Homepage5/>
            <HomePage6/>
            </div>
    );
};

export default Home;
