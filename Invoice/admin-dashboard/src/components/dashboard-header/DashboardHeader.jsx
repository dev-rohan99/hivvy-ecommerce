import React, { useEffect } from 'react';
import dashLogo from "../../assets/logo.png";
import { MdOutlineNotificationsNone } from "react-icons/md";
import useDropdownModalControl from '../../hooks/useDropdownModalControl';
import { useDispatch, useSelector } from 'react-redux';
import { adminLogout } from '../../app/features/admin/adminApiSlice';
import useAdminHook from '../../hooks/useAdminHook';
import { Link } from 'react-router-dom';

const Dashboardheader = () => {

    const { isOpen, toggle, dropdownRef } = useDropdownModalControl();
    const { isOpen: isNotification, toggle: toggleNotification, dropdownRef: dropdownNotificationRef } = useDropdownModalControl();

    const dispatch = useDispatch();
    const { admin } = useAdminHook();

    const handleadminLogout = (e) => {
        e.preventDefault();
        dispatch(adminLogout());
    }

    // useEffect(() => {
    //     if(admin){
    //         console.log(admin);
    //     }
    // }, [admin]);

    return (
        <>
        
            <div className="header">
                    
                <div className="header-left">
                    <a href="index.html" className="logo">
                        <img src={dashLogo} alt="Logo"/>
                    </a>
                    <a href="index.html" className="logo logo-small">
                        <img src={dashLogo} alt="Logo" width="30" height="30"/>
                    </a>
                </div>
                
                <a href="javascript:void(0);" id="toggle_btn">
                    <i className="fe fe-text-align-left"></i>
                </a>
                
                <div className="top-nav-search">
                    <form>
                        <input type="text" className="form-control" placeholder="Search here"/>
                        <button className="btn" type="submit"><i className="fa fa-search"></i></button>
                    </form>
                </div>
                
                <a className="mobile_btn" id="mobile_btn">
                    <i className="fa fa-bars"></i>
                </a>
                
                <ul className="nav admin-menu">

                    <li ref={dropdownNotificationRef} id='navavav' className="nav-item dropdown noti-dropdown">
                        <a href="" onClick={toggleNotification} className="dropdown-toggle nav-link" data-toggle="dropdown">
                            <MdOutlineNotificationsNone style={{fontSize: "30px"}} /> <span className="badge badge-pill">3</span>
                        </a>
                        {isNotification && <div className="dropdown-menu notifications d-block end-0">
                            <div className="topnav-dropdown-header">
                                <span className="notification-title">Notifications</span>
                                <a href="javascript:void(0)" className="clear-noti"> Clear All </a>
                            </div>
                            <div className="noti-content">
                                <ul className="notification-list">
                                    <li className="notification-message">
                                        <a href="#">
                                            <div className="media">
                                                <span className="avatar avatar-sm">
                                                    <img className="avatar-img rounded-circle" alt="admin Image" src="https://cdn.pixabay.com/photo/2015/10/05/22/37/blank-profile-picture-973460_960_720.png"/>
                                                </span>
                                                <div className="media-body">
                                                    <p className="noti-details"><span className="noti-title">Dr. Ruby Perrin</span> Schedule <span className="noti-title">her appointment</span></p>
                                                    <p className="noti-time"><span className="notification-time">4 mins ago</span></p>
                                                </div>
                                            </div>
                                        </a>
                                    </li>
                                    <li className="notification-message">
                                        <a href="#">
                                            <div className="media">
                                                <span className="avatar avatar-sm">
                                                    <img className="avatar-img rounded-circle" alt="admin Image" src="https://cdn.pixabay.com/photo/2015/10/05/22/37/blank-profile-picture-973460_960_720.png"/>
                                                </span>
                                                <div className="media-body">
                                                    <p className="noti-details"><span className="noti-title">Charlene Reed</span> has booked her appointment to <span className="noti-title">Dr. Ruby Perrin</span></p>
                                                    <p className="noti-time"><span className="notification-time">6 mins ago</span></p>
                                                </div>
                                            </div>
                                        </a>
                                    </li>
                                    <li className="notification-message">
                                        <a href="#">
                                            <div className="media">
                                                <span className="avatar avatar-sm">
                                                    <img className="avatar-img rounded-circle" alt="admin Image" src="https://cdn.pixabay.com/photo/2015/10/05/22/37/blank-profile-picture-973460_960_720.png"/>
                                                </span>
                                                <div className="media-body">
                                                <p className="noti-details"><span className="noti-title">Travis Trimble</span> sent a amount of $210 for his <span className="noti-title">appointment</span></p>
                                                <p className="noti-time"><span className="notification-time">8 mins ago</span></p>
                                                </div>
                                            </div>
                                        </a>
                                    </li>
                                    <li className="notification-message">
                                        <a href="#">
                                            <div className="media">
                                                <span className="avatar avatar-sm">
                                                    <img className="avatar-img rounded-circle" alt="admin Image" src="https://cdn.pixabay.com/photo/2015/10/05/22/37/blank-profile-picture-973460_960_720.png"/>
                                                </span>
                                                <div className="media-body">
                                                    <p className="noti-details"><span className="noti-title">Carl Kelly</span> send a message <span className="noti-title"> to his doctor</span></p>
                                                    <p className="noti-time"><span className="notification-time">12 mins ago</span></p>
                                                </div>
                                            </div>
                                        </a>
                                    </li>
                                </ul>
                            </div>
                            <div className="topnav-dropdown-footer">
                                <a href="#">View all Notifications</a>
                            </div>
                        </div>}
                    </li>
                    
                    <li ref={dropdownRef} className="nav-item dropdown has-arrow">
                        <a href="" onClick={toggle} className="dropdown-toggle nav-link" data-toggle="dropdown">
                            <span className="admin-img"><img className="rounded-circle" src="https://cdn.pixabay.com/photo/2015/10/05/22/37/blank-profile-picture-973460_960_720.png" width="31" alt="Ryan Taylor"/></span>
                        </a>
                        {isOpen && <div className="dropdown-menu d-block sjgdhsgdf">
                            <div className="admin-header">
                                <div className="avatar avatar-sm">
                                    <img src="https://cdn.pixabay.com/photo/2015/10/05/22/37/blank-profile-picture-973460_960_720.png" alt="admin Image" className="avatar-img rounded-circle"/>
                                </div>
                                <div className="admin-text">
                                    <h6>{admin?.name ? admin?.name : "Anounmus"}</h6>
                                    <p className="text-muted mb-0">{admin?.role ? admin?.role : "None"}</p>
                                </div>
                            </div>
                            <Link className="dropdown-item" to="/dashboard/profile">My Profile</Link>
                            <Link className="dropdown-item" to="/dashboard/settings">Settings</Link>
                            <a className="dropdown-item" onClick={handleadminLogout} href="">Logout</a>
                        </div>}
                    </li>
                    
                </ul>
                
            </div>
        
        </>
    )
}

export default Dashboardheader;