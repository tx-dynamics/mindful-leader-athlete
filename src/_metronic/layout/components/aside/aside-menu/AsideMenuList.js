/* eslint-disable no-script-url,jsx-a11y/anchor-is-valid */
import React from "react";
import { useLocation } from "react-router";
import { NavLink } from "react-router-dom";
import SVG from "react-inlinesvg";
import { toAbsoluteUrl, checkIsActive } from "../../../../_helpers";

export function AsideMenuList({ layoutProps }) {
  const location = useLocation();
  const getMenuItemActive = (url, hasSubmenu = false) => {
    return checkIsActive(location, url)
      ? ` ${!hasSubmenu && "menu-item-active"} menu-item-open `
      : "";
  };

  return (
    <>
      {/* begin::Menu Nav */}
      <ul className={`menu-nav ${layoutProps.ulClasses}`}>
        {/*begin::1 Level*/}
        <li
          className={`menu-item ${getMenuItemActive("/dashboard", false)}`}
          aria-haspopup="true"
        >
          <NavLink className="menu-link" to="/dashboard">
            <span className="svg-icon menu-icon">
              <SVG src={toAbsoluteUrl("/media/svg/icons/Design/Layers.svg")} />
            </span>
            <span className="menu-text">Dashboard</span>
          </NavLink>
        </li>
        {/*end::1 Level*/}

        {/*begin::1 Level*/}

        {/*end::1 Level*/}
        {/*begin::1 Level*/}
        {/* 
        <li
          className={`menu-item ${getMenuItemActive("/companies", false)}`}
          aria-haspopup="true"
        >
          <NavLink className="menu-link" to="/companies">
            <span className="svg-icon menu-icon">
              <SVG src={toAbsoluteUrl("/media/svg/icons/Home/Commode1.svg")} />
            </span>
            <span className="menu-text">Companies</span>
          </NavLink>
        </li> */}
        {/*end::1 Level*/}
        {/*begin::1 Level*/}
        {/* <li
          className={`menu-item ${getMenuItemActive("/challanges", false)}`}
          aria-haspopup="true"
        >
          <NavLink className="menu-link" to="/challanges">
            <span className="svg-icon menu-icon">
              <SVG src={toAbsoluteUrl("/media/svg/icons/Home/Cupboard.svg")} />
            </span>
            <span className="menu-text">Challanges</span>
          </NavLink>
        </li> */}
        {/*end::1 Level*/}
        {/*begin::1 Level*/}

        {/*end::1 Level*/}

        {/*begin::1 Level*/}
        <li
          className={`menu-item menu-item-submenu `}
          aria-haspopup="true"
          data-menu-toggle="hover"
        >
          <NavLink className="menu-link menu-toggle" to="/companies">
            <span className="svg-icon menu-icon">
              <SVG src={toAbsoluteUrl("/media/svg/icons/Home/Commode1.svg")} />
            </span>
            <span className="menu-text">Companies</span>
            <i className="menu-arrow" />
          </NavLink>
          <div className="menu-submenu ">
            <i className="menu-arrow" />
            <ul className="menu-subnav">
              <li className="menu-item  menu-item-parent" aria-haspopup="true">
                <span className="menu-link">
                  <span className="menu-text">Companies</span>
                </span>
              </li>

              {/*begin::2 Level*/}
              <li
                className={`menu-item ${getMenuItemActive("/companies")}`}
                aria-haspopup="true"
              >
                <NavLink className="menu-link" to="/companies">
                  {/* <i className="menu-bullet menu-bullet-dot">
                    <span />
                  </i> */}
                  <span className="svg-icon menu-icon">
                    <SVG
                      src={toAbsoluteUrl(
                        "/media/svg/icons/Navigation/Wallet3.svg"
                      )}
                    />
                  </span>
                  <span className="menu-text">Companies</span>
                </NavLink>
              </li>
              {/*end::2 Level*/}

              <li
                className={`menu-item ${getMenuItemActive("/createCompany")}`}
                aria-haspopup="true"
              >
                <NavLink className="menu-link" to="/createCompany">
                  {/* <i className="menu-bullet menu-bullet-dot">
                    <span />
                  </i> */}
                  <span className="svg-icon menu-icon">
                    <SVG
                      src={toAbsoluteUrl("/media/svg/icons/Design/Write.svg")}
                    />
                  </span>
                  <span className="menu-text">Add New Company</span>
                </NavLink>
              </li>
              {/*end::2 Level*/}
            </ul>
          </div>
        </li>
        {/*end::1 Level*/}

        {/*begin::1 Level*/}
        <li
          className={`menu-item menu-item-submenu `}
          aria-haspopup="true"
          data-menu-toggle="hover"
        >
          <NavLink className="menu-link menu-toggle" to="/challanges">
            <span className="svg-icon menu-icon">
              <SVG
                src={toAbsoluteUrl("/media/svg/icons/Design/Component.svg")}
              />
            </span>
            <span className="menu-text">Challanges</span>
            <i className="menu-arrow" />
          </NavLink>
          <div className="menu-submenu ">
            <i className="menu-arrow" />
            <ul className="menu-subnav">
              <li className="menu-item  menu-item-parent" aria-haspopup="true">
                <span className="menu-link">
                  <span className="menu-text">Challanges</span>
                </span>
              </li>

              {/*begin::2 Level*/}
              <li
                className={`menu-item ${getMenuItemActive("/Challanges")}`}
                aria-haspopup="true"
              >
                <NavLink className="menu-link" to="/Challanges">
                  {/* <i className="menu-bullet menu-bullet-dot">
                    <span />
                  </i> */}
                  <span className="svg-icon menu-icon">
                    <SVG
                      src={toAbsoluteUrl(
                        "/media/svg/icons/Navigation/Wallet3.svg"
                      )}
                    />
                  </span>
                  <span className="menu-text">Challanges</span>
                </NavLink>
              </li>
              {/*end::2 Level*/}

              <li
                className={`menu-item ${getMenuItemActive("/createChallange")}`}
                aria-haspopup="true"
              >
                <NavLink className="menu-link" to="/createChallange">
                  {/* <i className="menu-bullet menu-bullet-dot">
                    <span />
                  </i> */}
                  <span className="svg-icon menu-icon">
                    <SVG
                      src={toAbsoluteUrl("/media/svg/icons/Design/Write.svg")}
                    />
                  </span>
                  <span className="menu-text">Add New Challange</span>
                </NavLink>
              </li>
              {/*end::2 Level*/}
            </ul>
          </div>
        </li>
        <li
          className={`menu-item ${getMenuItemActive("/users", false)}`}
          aria-haspopup="true"
        >
          <NavLink className="menu-link" to="/users">
            <span className="svg-icon menu-icon">
              <SVG src={toAbsoluteUrl("/media/svg/icons/Home/Library.svg")} />
            </span>
            <span className="menu-text">Users</span>
          </NavLink>
        </li>
        {/*end::1 Level*/}
      </ul>

      {/* end::Menu Nav */}
    </>
  );
}
