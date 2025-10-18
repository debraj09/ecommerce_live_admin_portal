import React from "react";
import {useState, useEffect, useCallback} from "react";

// custom hook
import {useViewport} from "@/hooks/useViewPort";

// components
import LayoutMode from "./LayoutMode";
import LayoutTypes from "./LayoutTypes";
import LayoutColor from "./LayoutColor";
import LayoutWidth from "./LayoutWidth";
import LeftSideBarTheme from "./LeftSideBarTheme";
import LeftSideBarSize from "./LeftSideBarSize.jsx";
import TwoToneIcons from "./TwoToneIcons";
import SidebarUserInfo from "./SidebarUserInfo";
import TopBarTheme from "./TopBarTheme.jsx";
import TwoColumnTheme from "./TwoColumnTheme";
import {useLayoutContext} from "@/context/useLayoutContext.jsx";

const ThemeCustomizer = () => {
    const {
        width
    } = useViewport();
    const {
        theme,
        orientation,
        mode,
        width: layoutWidth,
        menu,
        topBar,
        twoColumn,
        showTwoToneIcons,
        showUserInfo,
        changeTheme,
        changeLayoutOrientation,
        changeLayoutMode,
        changeLayoutWidth,
        changeMenuSize,
        changeMenuTheme,
        changeTopBarTheme,
        changeIconMenuTheme,
        toggleTwoToneIcons,
        toggleUserInfo,
        resetSettings
    } = useLayoutContext();
    const [disableSidebarType, setDisableSidebarType] = useState(false);
    const [disableSidebarUser, setDisableSidebarUser] = useState(false);
    const [disableLayoutMode, setDisableLayoutMode] = useState(false);
    const [showTwoColumnTheme, setShowTwoColumnTheme] = useState(false);

    /**
     * change state based on props changes
     */
    const _loadStateFromProps = useCallback(() => {
        setDisableLayoutMode(orientation !== 'horizontal');
        setDisableSidebarType(orientation !== 'horizontal' && orientation !== 'two-column' && width > 991);
        setDisableSidebarUser(orientation !== 'horizontal' && orientation !== 'two-column' && mode !== 'detached');
        setShowTwoColumnTheme(orientation === 'two-column');
    }, [orientation, width, mode]);
    useEffect(() => {
        _loadStateFromProps();
    }, [_loadStateFromProps]);

    /**
     * On layout change
     */
    const changeOrientation = value => {
        switch (value) {
            case "horizontal":
                changeLayoutOrientation('horizontal');
                break;
            case "vertical":
                changeLayoutOrientation('vertical');
                break;
            default:
                changeLayoutOrientation('two-column');
                break;
        }
    };
    const changeMode = value => {
        switch (value) {
            case "fluid":
                changeLayoutMode('fluid');
                break;
            case "detached":
                changeLayoutMode('detached');
                break;
            default:
                changeLayoutMode('fluid');
                break;
        }
    };

    /**
     * Change the layout color
     */
    const changeLayoutTheme = value => {
        switch (value) {
            case "dark":
                changeTheme('dark');
                break;
            default:
                changeTheme('light');
                break;
        }
    };

    /**
     * Change the width mode
     */
    const changeWidth = value => {
        switch (value) {
            case "boxed":
                changeLayoutWidth('boxed');
                break;
            default:
                changeLayoutWidth('fluid');
                break;
        }
    };

    /**
     * Changes the theme
     */
    const changeLeftSidebarTheme = value => {
        switch (value) {
            case "dark":
                changeMenuTheme('dark');
                break;
            case "brand":
                changeMenuTheme('brand');
                break;
            case "gradient":
                changeMenuTheme('gradient');
                break;
            default:
                changeMenuTheme('light');
                break;
        }
    };

    const changeTwoColumnTheme = value => {
        switch (value) {
            case "dark":
                changeIconMenuTheme('dark')
                break;
            case "brand":
                changeIconMenuTheme('brand')
                break;
            case "gradient":
                changeIconMenuTheme('gradient')
                break;
            default:
                changeIconMenuTheme('light')
                break;
        }
    };

    /**
     * Change the leftsiderbar size
     */
    const changeLeftSideBarSize = value => {
        switch (value) {
            case "condensed":
                changeMenuSize('condensed');
                break;
            case "compact":
                changeMenuSize('compact');
                break;
            case "full":
                changeMenuSize('full');
                break;
            case "fullscreen":
                changeMenuSize('fullscreen');
                break;
            default:
                changeMenuSize('default');
                break;
        }
    };

    /*
     * Change topbar theme
     */
    const changeTopBarColor = value => {
        switch (value) {
            case "light":
                changeTopBarTheme('light');
                break;
            case "brand":
                changeTopBarTheme('brand');
                break;
            default:
                changeTopBarTheme('dark');
                break;
        }
    };
    return <React.Fragment>
        <h6 className="fw-medium px-3 m-0 py-2 font-13 text-uppercase bg-light">
            <span className="d-block py-1">Theme Settings</span>
        </h6>
        <div className="p-3">
            <div className="alert alert-warning" role="alert">
                <strong>Customize </strong> the overall color scheme, sidebar menu,
                etc.
            </div>

            {/* Layouts */}
            <LayoutTypes changeOrientation={changeOrientation} orientation={orientation}/>

            {/* Layout Modes */}
            {disableLayoutMode && <LayoutMode changeMode={changeMode} mode={mode}/>}

            <LayoutColor changeLayoutTheme={changeLayoutTheme} theme={theme}/>

            {/* Width */}
            <LayoutWidth changeWidth={changeWidth} width={layoutWidth}/>

            {/* Left Sidebar */}
            <LeftSideBarTheme changeLeftSidebarTheme={changeLeftSidebarTheme} theme={menu.theme}/>

            {/* Left Sidebar Size */}
            {disableSidebarType && <LeftSideBarSize changeLeftSideBarSize={changeLeftSideBarSize} size={menu.size}/>}

            {showTwoColumnTheme && <TwoColumnTheme changeTwoColumnTheme={changeTwoColumnTheme} theme={twoColumn.iconMenuTheme}/>}

            {/* tow-tone icons */}
            <TwoToneIcons toggleTwoToneIconsMode={toggleTwoToneIcons} showTwoToneIcons={showTwoToneIcons}/>

            {/* Topbar */}
            <TopBarTheme changeTopBarTheme={changeTopBarColor} theme={topBar.theme}/>

            {/* User Info */}
            {disableSidebarUser &&
                <SidebarUserInfo toggleLeftSidebarUserInfo={toggleUserInfo} showSidebarUserInfo={showUserInfo}/>}

            <div className="d-grid mt-4">
                <button className="btn btn-primary" id="resetBtn" onClick={resetSettings}>
                    Reset to Default
                </button>
            </div>
        </div>
    </React.Fragment>;
};
export default ThemeCustomizer;