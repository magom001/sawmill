import React from 'react';
//import PropTypes from 'prop-types';
import {Link} from 'react-router-dom';
import logo from './logo.png';

const Header = () => {
  return (
    <header>
      <nav>
        <ul className='container' role='navigation'>
          <li>
            <Link to="/">Консоль</Link>
          </li>
          <li>
            <Link to="/reports">Отчёты</Link>
          </li>
          <li className='separator'>
            <img src={logo} className='logo' alt='Логотип'/>
          </li>
          <li></li>
        </ul>
      </nav>
    </header>
  );
}

//Header.propTypes = {};

export default Header;
