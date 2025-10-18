import React from "react";
// import { Collapse } from 'react-bootstrap';
// import classNames from 'classnames';
// import SimpleBar from 'simplebar-react';

// helpers
import { getHorizontalMenuItems } from "../../helpers/menu";

// components
import AppMenu from "./Menu";
const Navbar = () => {
  // change the inputTheme value to light for creative theme
  // const inputTheme = 'light';

  return <React.Fragment>
      <div className="app-menu">
        <AppMenu menuItems={getHorizontalMenuItems()} />
      </div>
    </React.Fragment>;
};
export default Navbar;