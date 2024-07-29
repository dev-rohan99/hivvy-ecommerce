import React from 'react';
import { Link, useLocation } from "react-router-dom";
import { FaRegIdBadge, FaSitemap } from 'react-icons/fa';
import { MdKeyboardArrowDown, MdOutlineCategory, MdOutlineDashboard, MdOutlineEdgesensorHigh, MdOutlineSettings, MdReportGmailerrorred } from 'react-icons/md';
import { TbNewSection, TbTruckDelivery } from 'react-icons/tb';
import { AiFillShop, AiOutlineTags } from 'react-icons/ai';
import { CgProfile } from 'react-icons/cg';
import { HiOutlineUsers } from 'react-icons/hi2';
import { LiaFileInvoiceDollarSolid, LiaUserCheckSolid } from 'react-icons/lia';
import { BiAccessibility } from 'react-icons/bi';


const DashboardSidebar = () => {

    const location = useLocation();
        
    return (
        <>
        
            <div className="sidebar" id="sidebar">
                <div className="sidebar-inner slimscroll">
                    <div id="sidebar-menu" className="sidebar-menu">
                        <ul>
                            <li className="menu-title"> 
                                <span>Admin</span>
                            </li>
                            <li className={`${location.pathname == "/" ? "active" : ""}`}> 
                                <Link to={"/"}><MdOutlineDashboard style={{fontSize: "23px"}} /> <span>Dashboard</span></Link>
                            </li>
                            <li className={`${location.pathname == "/dashboard/orders" ? "active" : ""}`}> 
                                <Link to={"/dashboard/orders"}><MdOutlineEdgesensorHigh style={{fontSize: "23px"}} /> <span>Orders</span></Link>
                            </li>
                            <li className={`${location.pathname == "/dashboard/clients" ? "active" : ""}`}> 
                                <Link to={"/dashboard/clients"}><HiOutlineUsers style={{fontSize: "23px"}} /> <span>Clients</span></Link>
                            </li>
                            <li className={`${location.pathname == "/dashboard/invoices" ? "active" : ""}`}> 
                                <Link to={"/dashboard/invoices"}><LiaFileInvoiceDollarSolid style={{fontSize: "23px"}} /> <span>Invoices</span></Link>
                            </li>
                            <li className={`${location.pathname == "/dashboard/profile" ? "active" : ""}`}> 
                                <Link to={"/dashboard/profile"}><CgProfile style={{fontSize: "23px"}} /> <span>Profile</span></Link>
                            </li>
                            <li className={`${location.pathname == "/dashboard/settings" ? "active" : ""}`}> 
                                <Link to={"/dashboard/settings"}><MdOutlineSettings style={{fontSize: "23px"}} /> <span>Settings</span></Link>
                            </li>
                            <li className={`${location.pathname == "/dashboard/transactions" ? "active" : ""}`}> 
                                <Link to={"/dashboard/transactions"}><TbNewSection style={{fontSize: "23px"}} /> <span>Transactions</span></Link>
                            </li>
                        </ul>
                    </div>
                </div>
            </div>
        
        </>
    )
}

export default DashboardSidebar;
