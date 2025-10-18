import { useState, useCallback, useEffect } from "react";
import { useLocation } from "react-router-dom";
import { findAllParent, findMenuItem, getTwoColumnMenuItems } from "@/helpers/menu";

// components
import IconMenu from "./IconMenu";
import MainMenu from "./MainMenu";
import { useLayoutContext } from "@/context/useLayoutContext.jsx";
const LeftSidebar = () => {
  const location = useLocation();
  const menuItems = getTwoColumnMenuItems();
  const [activeMenuItems, setActiveMenuItems] = useState([]);
  const {
    menu,
    changeMenuSize
  } = useLayoutContext();

  /*
   * toggle the menus
   */
  const toggleMenu = (menuItem, show) => {
    if (menuItem.children) {
      if (menu.size === "condensed") changeMenuSize('default');
    }
    if (show) setActiveMenuItems([menuItem["key"], ...findAllParent(menuItems, menuItem)]);
  };

  /**
   * activate the menuitems
   */

  const activeMenu = useCallback(() => {
    const div = document.getElementById("sidebar-content");
    let matchingMenuItem = null;
    if (div) {
      const items = div.getElementsByClassName("nav-link-ref");
      for (let i = 0; i < items.length; ++i) {
        const trimmedURL = location?.pathname;
        if (trimmedURL === items[i]?.pathname) {
          matchingMenuItem = items[i];
          break;
        }
      }
      if (matchingMenuItem) {
        const mid = matchingMenuItem.getAttribute("data-menu-key");
        const activeMt = findMenuItem(menuItems, mid);
        if (activeMt) {
          setActiveMenuItems([activeMt["key"], ...findAllParent(menuItems, activeMt)]);
        }
      }
    }
  }, [location, menuItems]);
  useEffect(() => {
    activeMenu();
  }, [activeMenu]);
  useEffect(() => {
    if (activeMenuItems && activeMenuItems.length && activeMenuItems.length === 1) {
      const parentLevel0 = findMenuItem(menuItems, activeMenuItems[0]);
      const hasChildren = parentLevel0 && parentLevel0["children"] && parentLevel0["children"].length;
      if (!hasChildren && (menu.size === "default" || menu.size === "compact")) {
        changeMenuSize('condensed');
      } else {
        changeMenuSize(menu.size);
      }
    }
  }, [activeMenuItems, menu.size, menuItems]);
  return <>
            <div className="left-side-menu show" id="sidebar-content">
                <IconMenu menuItems={getTwoColumnMenuItems()} toggleMenu={toggleMenu} activeMenuItems={activeMenuItems} />

                <MainMenu menuItems={menuItems} activeMenuItems={activeMenuItems} toggleMenu={toggleMenu} />
                <div className="clearfix" />
            </div>
        </>;
};
export default LeftSidebar;