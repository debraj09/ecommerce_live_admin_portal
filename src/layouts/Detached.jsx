import React, { Suspense, useEffect, useState } from "react";
import { Container } from "react-bootstrap";

// utils
import { useViewport } from "@/hooks/useViewPort";
import { toggleDocumentAttribute } from "@/utils";
import { useLayoutContext } from "@/context/useLayoutContext.jsx";

// code splitting and lazy loading
// https://blog.logrocket.com/lazy-loading-components-in-react-16-6-6cea535c0b52
const Topbar = React.lazy(() => import("./Topbar"));
const LeftSidebar = React.lazy(() => import("./LeftSidebar"));
const Footer = React.lazy(() => import("./Footer"));
const RightSidebar = React.lazy(() => import("./RightSidebar"));
const loading = () => <div className="text-center"></div>;
const DetachedLayout = ({
  children
}) => {
  const {
    width
  } = useViewport();
  const [isMenuOpened, setIsMenuOpened] = useState(false);
  const {
    topBar,
    menu,
    width: layoutWidth,
    theme,
    showTwoToneIcons,
    showUserInfo,
    toggleUserInfo,
    changeMenuSize,
    themeCustomizer
  } = useLayoutContext();

  /*
  layout defaults
  */

  useEffect(() => {
    if (width < 1140) {
      changeMenuSize('full');
      document.getElementsByTagName("html")[0].classList.add("sidebar-enable");
    } else if (width >= 1140) {
      changeMenuSize('default');
      document.getElementsByTagName("html")[0].classList.remove("sidebar-enable");
    }
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [width]);
  useEffect(() => {
    toggleDocumentAttribute("data-layout-mode", 'default');
    toggleUserInfo();
  }, [showUserInfo]);
  useEffect(() => {
    toggleDocumentAttribute("data-bs-theme", theme);
  }, [theme]);
  useEffect(() => {
    toggleDocumentAttribute("data-layout-width", layoutWidth);
  }, [layoutWidth]);
  useEffect(() => {
    toggleDocumentAttribute("data-menu-position", menu.position);
  }, [menu.position]);
  useEffect(() => {
    toggleDocumentAttribute("data-menu-color", menu.theme);
  }, [menu.theme]);
  useEffect(() => {
    toggleDocumentAttribute("data-sidenav-size", menu.size);
  }, [menu.size]);
  useEffect(() => {
    toggleDocumentAttribute("data-menu-icon", showTwoToneIcons ? "twotones" : "default");
  }, [showTwoToneIcons]);
  useEffect(() => {
    toggleDocumentAttribute("data-topbar-color", topBar.theme);
  }, [topBar.theme]);

  /**
   * Open the menu when having mobile screen
   */
  const openMenu = () => {
    setIsMenuOpened(prevState => !prevState);
    if (document.body) {
      if (isMenuOpened) {
        document.body.classList.add("sidebar-enable");
      } else {
        document.body.classList.remove("sidebar-enable");
      }
    }
  };
  const isCondensed = menu.size === 'condensed';
  return <>
            <div id="wrapper">
                <Suspense fallback={loading()}>
                    <Topbar openLeftMenuCallBack={openMenu} navCssClasses="topnav-navbar topnav-navbar-dark" topbarDark={true} />
                </Suspense>
                <Suspense fallback={loading()}>
                    <LeftSidebar isCondensed={isCondensed} />
                </Suspense>

                <div className="content-page">
                    <div className="content">
                        <Container fluid>
                            <Suspense fallback={loading()}>{children}</Suspense>
                        </Container>
                    </div>

                    <Suspense fallback={loading()}>
                        <Footer />
                    </Suspense>
                </div>
            </div>
            {themeCustomizer.open && <Suspense fallback={loading()}>
                    <RightSidebar />
                </Suspense>}
        </>;
};
export default DetachedLayout;