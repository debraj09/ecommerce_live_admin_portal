import React from "react";
import { Link } from "react-router-dom";

// components
import TopbarSearch from "@/components/TopbarSearch";
import MaximizeScreen from "@/components/MaximizeScreen";
import AppsDropdown from "@/components/AppsDropdown/";
import LanguageDropdown from "@/components/LanguageDropdown";
import NotificationDropdown from "@/components/NotificationDropdown";
import ProfileDropdown from "@/components/ProfileDropdown";
import CreateNew from "@/components/CreateNew";
import MegaMenu from "@/components/MegaMenu";
import profilePic from "@/assets/images/users/user-1.jpg";
import avatar4 from "@/assets/images/users/user-4.jpg";
import logoSm from "@/assets/images/logo-sm.png";
import logoDark from "@/assets/images/logo-dark.png";
import logoDark2 from "@/assets/images/logo-dark-2.png";
import logoLight from "@/assets/images/logo-light.png";
import logoLight2 from "@/assets/images/logo-light-2.png";
import { useViewport } from "@/hooks/useViewPort";
import { useLayoutContext } from "@/context/useLayoutContext.jsx";
import { toggleDocumentAttribute } from "@/utils";
// get the notifications
const Notifications = [{
  id: 1,
  text: "Cristina Pride",
  subText: "Hi, How are you? What about our next meeting",
  avatar: profilePic
}, {
  id: 2,
  text: "Caleb Flakelar commented on Admin",
  subText: "1 min ago",
  icon: "mdi mdi-comment-account-outline",
  bgColor: "primary"
}, {
  id: 3,
  text: "Karen Robinson",
  subText: "Wow ! this admin looks good and awesome design",
  avatar: avatar4
}, {
  id: 4,
  text: "New user registered.",
  subText: "5 hours ago",
  icon: "mdi mdi-account-plus",
  bgColor: "warning"
}, {
  id: 5,
  text: "Caleb Flakelar commented on Admin",
  subText: "1 min ago",
  icon: "mdi mdi-comment-account-outline",
  bgColor: "info"
}, {
  id: 6,
  text: "Carlos Crouch liked Admin",
  subText: "13 days ago",
  icon: "mdi mdi-heart",
  bgColor: "secondary"
}];

// get the profilemenu
const ProfileMenus = [{
  label: "My Account",
  icon: "fe-user",
  redirectTo: "#"
}, {
  label: "Settings",
  icon: "fe-settings",
  redirectTo: "#"
}, {
  label: "Lock Screen",
  icon: "fe-lock",
  redirectTo: "/auth/lock-screen"
}, {
  label: "Logout",
  icon: "fe-log-out",
  redirectTo: "/auth/logout"
}];

// dummy search results
const SearchResults = [{
  id: 1,
  title: "Analytics Report",
  icon: "uil-notes",
  redirectTo: "#"
}, {
  id: 2,
  title: "How can I help you?",
  icon: "uil-life-ring",
  redirectTo: "#"
}, {
  id: 3,
  icon: "uil-cog",
  title: "User profile settings",
  redirectTo: "#"
}];
const otherOptions = [{
  id: 1,
  label: "New Projects",
  icon: "fe-briefcase"
}, {
  id: 2,
  label: "Create Users",
  icon: "fe-user"
}, {
  id: 3,
  label: "Revenue Report",
  icon: "fe-bar-chart-line-"
}, {
  id: 4,
  label: "Settings",
  icon: "fe-settings"
}, {
  id: 4,
  label: "Help & Support",
  icon: "fe-headphones"
}];

// get mega-menu options
const MegaMenuOptions = [{
  id: 1,
  title: "UI Components",
  menuItems: ["Widgets", "Nestable List", "Range Sliders", "Masonry Items", "Sweet Alerts", "Treeview Page", "Tour Page"]
}, {
  id: 2,
  title: "Applications",
  menuItems: ["eCommerce Pages", "CRM Pages", "Email", "Calendar", "Team Contacts", "Task Board", "Email Templates"]
}, {
  id: 3,
  title: "Extra Pages",
  menuItems: ["Left Sidebar with User", "Menu Collapsed", "Small Left Sidebar", "New Header Style", "Search Result", "Gallery Pages", "Maintenance & Coming Soon"]
}];
const Topbar = ({
  hideLogo,
  navCssClasses
}) => {
  const {
    width
  } = useViewport();
  const {
    menu,
    orientation,
    changeMenuSize,
    themeCustomizer
  } = useLayoutContext();
  const navbarCssClasses = navCssClasses || "";
  const containerCssClasses = !hideLogo ? "container-fluid" : "";

  /**
   * Toggle the leftmenu when having mobile screen
   */
  const handleLeftMenuCallBack = () => {
    if (width < 1140) {
      if (menu.size === 'full') {
        showLeftSideBarBackdrop();
        toggleDocumentAttribute("class", "sidebar-enable");
      } else {
        changeMenuSize('full');
      }
    } else if (menu.size === "condensed") {
      changeMenuSize('default');
    } else if (menu.size === 'full') {
      showLeftSideBarBackdrop();
      toggleDocumentAttribute("class", "sidebar-enable");
    } else if (menu.size === 'fullscreen') {
      changeMenuSize('default');
      toggleDocumentAttribute("class", "sidebar-enable");
    } else {
      changeMenuSize('condensed');
    }
  };

  // create backdrop for leftsidebar
  function showLeftSideBarBackdrop() {
    const backdrop = document.createElement("div");
    backdrop.id = "custom-backdrop";
    backdrop.className = "offcanvas-backdrop fade show";
    document.body.appendChild(backdrop);
    if (document.getElementsByTagName("html")[0]?.getAttribute("dir") !== "rtl") {
      document.body.style.overflow = "hidden";
      if (width > 1140) {
        document.body.style.paddingRight = "15px";
      }
    }
    backdrop.addEventListener("click", function () {
      toggleDocumentAttribute("class", "sidebar-enable", true);
      changeMenuSize('full');
      hideLeftSideBarBackdrop();
    });
  }
  function hideLeftSideBarBackdrop() {
    const backdrop = document.getElementById("custom-backdrop");
    if (backdrop) {
      document.body.removeChild(backdrop);
      document.body.style.overflow = "visible";
    }
  }
  return <React.Fragment>
            <div className={`navbar-custom ${navbarCssClasses}`}>
                <div className={`topbar ${containerCssClasses}`}>
                    <div className="topbar-menu d-flex align-items-center gap-1">
                        {!hideLogo && <div className="logo-box">
                                <Link to="/" className="logo logo-dark text-center">
                  <span className="logo-sm">
                    <img src={logoSm} alt="" height="22" />
                  </span>
                                    <span className="logo-lg">
                    <img src={orientation === 'two-column' ? logoDark2 : logoDark} alt="" height="20" />
                  </span>
                                </Link>
                                <Link to="/" className="logo logo-light text-center">
                  <span className="logo-sm">
                    <img src={logoSm} alt="" height="22" />
                  </span>
                                    <span className="logo-lg">
                    <img src={orientation === 'two-column' ? logoLight2 : logoLight} alt="" height="20" />
                  </span>
                                </Link>
                            </div>}

                        <button className="button-toggle-menu" onClick={handleLeftMenuCallBack}>
                            <i className="mdi mdi-menu" />
                        </button>

                        <div className="dropdown d-none d-xl-block">
                            <CreateNew otherOptions={otherOptions} />
                        </div>

                        <div className="dropdown dropdown-mega d-none d-xl-block">
                            <MegaMenu subMenus={MegaMenuOptions} />
                        </div>
                    </div>

                    <ul className="topbar-menu d-flex align-items-center">
                        <li className="app-search dropdown d-none d-lg-block">
                            <TopbarSearch items={SearchResults} />
                        </li>
                        {/* <li className="dropdown d-inline-block d-lg-none">
                         <SearchDropdown />
                         </li> */}
                        <li className="dropdown d-none d-lg-inline-block">
                            <MaximizeScreen />
                        </li>
                        <li className="dropdown d-none d-lg-inline-block topbar-dropdown">
                            <AppsDropdown />
                        </li>
                        <li className="dropdown d-none d-lg-inline-block topbar-dropdown">
                            <LanguageDropdown />
                        </li>
                        <li className="dropdown notification-list">
                            <NotificationDropdown notifications={Notifications} />
                        </li>
                        <li className="dropdown">
                            <ProfileDropdown profilePic={profilePic} menuItems={ProfileMenus} username={"Geneva"} userTitle={"Founder"} />
                        </li>
                        <li>
                            <button className="nav-link dropdown-toggle right-bar-toggle waves-effect waves-light btn btn-link shadow-none" onClick={themeCustomizer.toggle}>
                                <i className="fe-settings noti-icon font-22"></i>
                            </button>
                        </li>
                    </ul>
                </div>
            </div>
        </React.Fragment>;
};
export default Topbar;