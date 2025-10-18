import React, { useEffect, useRef, useState, useCallback } from "react";
import { Col, Row } from "react-bootstrap";
import { Link, useLocation } from "react-router-dom";
import classNames from "classnames";

// helpers
import { findAllParent, findMenuItem } from "../../helpers/menu";

// constants

// utils
import { splitArray } from "../../utils/";

// custom hook
import { useViewport } from "../../hooks/useViewPort";
const MenuItemWithChildren = ({
  item,
  tag,
  linkClassName,
  className,
  subMenuClassNames,
  activeMenuItems,
  toggleMenu
}) => {
  const Tag = tag;
  //
  const {
    width
  } = useViewport();
  const [open, setOpen] = useState(activeMenuItems.includes(item.key));
  const showMenu = width <= 768 && open;
  const hasChild = item.children && (item.children || []).filter(child => child.children?.length && child.children);
  const hasGrandChild = !(hasChild.length > 0 && hasChild) && item.children.length >= 15;
  const chunks = hasGrandChild ? splitArray(item.children, 7) : [];
  useEffect(() => {
    setOpen(activeMenuItems.includes(item.key));
  }, [activeMenuItems, item]);

  /**
   * toggles the menu
   */
  const toggleMenuItem = e => {
    e.preventDefault();
    const status = !open;
    setOpen(status);
    if (toggleMenu) toggleMenu(item, status);
    return false;
  };
  const Icon = item.icon;
  return <Tag className={classNames(className, activeMenuItems.includes(item.key) ? "manuitem-active" : "")}>
            <Link to="/#" onClick={toggleMenuItem} data-menu-key={item.key} className={classNames("menu-link", linkClassName, {
      active: activeMenuItems.includes(item.key)
    })}
    // className='menu-link'
    id={item.key} role="button" data-bs-toggle="dropdown" aria-haspopup="true" aria-expanded={open}>
                {Icon && <span className="menu-icon">
            <Icon className="hori-icon me-1" />
          </span>}
                <span className="menu-text"> {item.label} </span>
                <span className="menu-arrow"></span>
            </Link>

            {item.children && (hasGrandChild ? <div className={classNames(subMenuClassNames, "collapse collapse-lg", {
      show: showMenu
    })} aria-labelledby={item.key}>
                        <Row>
                            {(chunks || []).map((child, i) => {
          return <Col key={i} lg={4}>
                                        <MegaMenu item={child} activeMenuItems={activeMenuItems} />
                                    </Col>;
        })}
                        </Row>
                    </div> : <ul className={classNames("collapse sub-menu", subMenuClassNames, {
      show: showMenu
    })} aria-labelledby={item.key}>
                        {(item.children || []).map((child, i) => {
        return <React.Fragment key={i}>
                                    {child.children ? <>
                                            {/* parent */}
                                            <MenuItemWithChildren item={child} tag="li" linkClassName={classNames("dropdown-item", activeMenuItems.includes(child.key) ? "menuitem-active" : "")} activeMenuItems={activeMenuItems} className="menu-item" subMenuClassNames="dropdown-menu" toggleMenu={toggleMenu} />
                                        </> : <>
                                            {/* child */}
                                            <MenuItemLink item={child} className={classNames("dropdown-item", {
              active: activeMenuItems.includes(child.key)
            })} />
                                        </>}
                                </React.Fragment>;
      })}
                    </ul>)}
        </Tag>;
};
const MenuItem = ({
  item,
  className,
  linkClassName
}) => {
  return <li className={classNames("menu-item", className)}>
            <MenuItemLink item={item} className={linkClassName} />
        </li>;
};
const MenuItemLink = ({
  item,
  className
}) => {
  //

  const Icon = item.icon;
  return <li className={classNames("menu-item", className)}>
            <Link to={item.url} target={item.target} className="menu-link" data-menu-key={item.key}>
                {Icon && <span className="menu-icon">
            <Icon className="hori-icon me-1" />
          </span>}
                <span className="menu-text"> {item.label} </span>
            </Link>
        </li>;
};
const MegaMenu = ({
  item,
  activeMenuItems
}) => {
  return <>
            {item.map((child, i) => {
      return <MenuItemLink key={i} item={child} className={classNames("dropdown-item", {
        active: activeMenuItems.includes(child.key)
      })} />;
    })}
        </>;
};

/**
 * Renders the application menu
 */

const AppMenu = ({
  menuItems
}) => {
  const location = useLocation();
  const menuRef = useRef(null);
  const [topnavMenuItems] = useState(menuItems);
  const [activeMenuItems, setActiveMenuItems] = useState([]);

  /*
   * toggle the menus
   */
  const toggleMenu = (menuItem, show) => {
    if (show) setActiveMenuItems([menuItem["key"], ...findAllParent(topnavMenuItems, menuItem)]);
  };

  /**
   * activate the menuitems
   */
  const activeMenu = useCallback(() => {
    const div = document.getElementById("main-side-menu");
    let matchingMenuItem = null;
    if (div) {
      const items = div.getElementsByTagName("a");
      for (let i = 0; i < items.length; ++i) {
        const trimmedURL = location?.pathname;
        if (trimmedURL === items[i]?.pathname) {
          matchingMenuItem = items[i];
          break;
        }
      }
      if (matchingMenuItem) {
        //
        const mid = matchingMenuItem.getAttribute("data-menu-key");
        const activeMt = findMenuItem(topnavMenuItems, mid);
        if (activeMt) {
          setActiveMenuItems([activeMt["key"], ...findAllParent(topnavMenuItems, activeMt)]);
        }
      }
    }
  }, [location.pathname, topnavMenuItems]);
  useEffect(() => {
    if (topnavMenuItems && topnavMenuItems.length > 0) activeMenu();
  }, [activeMenu, topnavMenuItems]);
  return <>
            <ul className="menu" ref={menuRef} id="main-side-menu">
                {(topnavMenuItems || []).map((item, idx) => {
        return <React.Fragment key={idx}>
                            {item.children ? <MenuItemWithChildren item={item} tag="li" className="menu-item" subMenuClassNames="dropdown-menu" activeMenuItems={activeMenuItems} linkClassName="nav-link" toggleMenu={toggleMenu} /> : <MenuItem item={item} className={classNames({
            "menuitem-active": activeMenuItems.includes(item.key)
          })} linkClassName={classNames({
            "menuitem-active": activeMenuItems.includes(item.key)
          })} />}
                        </React.Fragment>;
      })}
            </ul>
        </>;
};
export default AppMenu;