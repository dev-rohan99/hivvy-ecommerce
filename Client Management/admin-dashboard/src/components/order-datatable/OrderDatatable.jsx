import React, { useRef, useState } from 'react';
import { useDispatch, useSelector } from 'react-redux';
import { TbFileInvoice } from "react-icons/tb";
import DataTable from 'datatables.net-dt';
import Swal from 'sweetalert2';
import moment from "moment";
import useInputControl from '../../hooks/useInputControl';
import Modal from '../modal/Modal';
import createToast from '../../utilities/createToast';
import DetailsModal from '../modal/DetailsModal';
import "../../assets/css/invoice.css";
import { FaPrint, FaFilePdf, FaPlus, FaRegEdit, FaRegTrashAlt } from "react-icons/fa";
import { FaRegTrashCan } from "react-icons/fa6";
import { TbUserDollar } from "react-icons/tb";
import html2canvas from 'html2canvas';
import jsPDF from 'jspdf';
import { deleteOrder, getSingleOrder, updateOrder } from '../../app/features/admin/adminApiSlice';


const OrderDatatable = () => {

    const printRef = useRef();
    const [modal, setModal] = useState(false);
    const [currentId, setCurrentId] = useState("");
    const [invoiceModal, setInvoiceModal] = useState(false);
    const [employeeInvoiceModal, setEmployeeInvoiceModal] = useState(false);
	const { input, setInput, handleInputChange, resetForm } = useInputControl({
		client: "",
		works: [{ description: '', hours: null, hourlyRate: null }],
		employeeWorks: [{ name: '', hoursBreakdown: null, hoursAdjustment: null }],
		status: "",
		projectName: "",
		clientCompany: "",
		month: "",
		freelancerName: "",
		freelancerCompany: "",
		freelancerCountry: "",
		adjustments: ""
	});
    const { isLoading, orders, clients, invoice } = useSelector((state) => state.admin);
	const dispatch = useDispatch();

    const handleInvoiceView = (id) => {
        dispatch(getSingleOrder(id));
    }

    const handleEmployeeInvoiceView = (id) => {
        dispatch(getSingleOrder(id));
    }

    const handleWorkChange = (index, event) => {
		const { name, value } = event.target;
		const newWorks = input.works.map((work, i) => {
			if (i !== index) return work;
			return { ...work, [name]: value };
		});
		setInput({ ...input, works: newWorks });
	};
	
	const addWork = () => {
		setInput({
			...input,
			works: [...input.works, { description: '', hours: null, hourlyRate: null }]
		});
	};
	
	const removeWork = (index) => {
		const newWorks = input.works.filter((_, i) => i !== index);
		setInput({ ...input, works: newWorks });
	};
	
	const handleEmployeeWorksChange = (index, event) => {
		const { name, value } = event.target;
		const newEmployeeWorks = input.employeeWorks.map((employeeWork, i) => {
			if (i !== index) return employeeWork;
			return { ...employeeWork, [name]: value };
		});
		setInput({ ...input, employeeWorks: newEmployeeWorks });
	};
	
	const addEmployeeWork = () => {
		setInput({
			...input,
			employeeWorks: [...input.employeeWorks, { name: '', hoursBreakdown: null, hoursAdjustment: null }]
		});
	};
	
	const removeEmployeeWork = (index) => {
		const newEmployeeWorks = input.employeeWorks.filter((_, i) => i !== index);
		setInput({ ...input, employeeWorks: newEmployeeWorks });
	};

    const handleOrderUpdate = (e, id) => {
        e.preventDefault();
        if(!input.client){
			createToast("Please, fill out the form!", "warn");
		}else{
			dispatch(updateOrder({ id, input }));
			resetForm();
			setModal(false);
		}
    }

    const handleOrderDelete = (id) => {
        Swal.fire({
            title: "Are you sure?",
            text: "You won't be able to revert this!",
            icon: "warning",
            showCancelButton: true,
            confirmButtonColor: "#3085d6",
            cancelButtonColor: "#d33",
            confirmButtonText: "Yes, delete it!"
        }).then((result) => {
            if(result.isConfirmed){
                dispatch(deleteOrder(id));
            }
        })
    }

    const handlePrint = () => {
        const printContent = printRef.current.innerHTML;
        const originalContent = document.body.innerHTML;

        document.body.innerHTML = printContent;
        window.print();
        document.body.innerHTML = originalContent;
    };

    const handleExportPdf = () => {
        const input = printRef.current;
        html2canvas(input)
            .then((canvas) => {
                const imgData = canvas.toDataURL('image/png');
                const pdf = new jsPDF('p', 'mm', 'a4');
                const imgWidth = 210;
                const pageHeight = 295;
                const imgHeight = (canvas.height * imgWidth) / canvas.width;
                let heightLeft = imgHeight;
                let position = 0;

                pdf.addImage(imgData, 'PNG', 0, position, imgWidth, imgHeight);
                heightLeft -= pageHeight;

                while (heightLeft >= 0) {
                    position = heightLeft - imgHeight;
                    pdf.addPage();
                    pdf.addImage(imgData, 'PNG', 0, position, imgWidth, imgHeight);
                    heightLeft -= pageHeight;
                }
                
                pdf.save('invoice.pdf');
            })
            .catch(error => console.error('Could not export PDF', error));
    };


    return (
        <>
        
        
            {orders ? (<table className="datatable table table-hover table-center mb-0">
                <thead>
                    <tr>
                        <th>Invoice ID</th>
                        <th>Client</th>
                        <th>Project</th>
                        <th>Invoice Status</th>
                        <th>Created At</th>
                        <th>Actions</th>
                    </tr>
                </thead>
                <tbody>
                    {
                        [...orders]?.reverse().map((data, index) => 
                            <tr key={index}>
                                <td>
                                    <h2 className="table-avatar font-weight-bold">#{data?.invoiceNumber}</h2>
                                </td>
                                <td>
                                    <h2 className="table-avatar">{clients.find(client => data.client == client._id)?.name}</h2>
                                </td>
                                <td>{data?.projectName}</td>
                                <td><span className={`btn btn-sm ${data?.status === "Paid" ? "bg-success-light" : "bg-danger-light"}`} >{data?.status}</span></td>
                                <td>{moment(data?.createdAt).format('LLL')}</td>

                                <td>
                                    
                                    <button 
                                        onClick={() => {
                                            handleInvoiceView(data?._id)
                                            setInvoiceModal(true);
                                            setCurrentId(data._id);
                                        }} className="btn btn-sm bg-success-light mr-2"
                                    >
                                            <TbFileInvoice style={{fontSize: "15px", margin:"auto"}} />
                                    </button>

                                    {invoiceModal && data?._id === currentId && <DetailsModal modalClose={setInvoiceModal}>

                                        <div className="page-content py-5">
                                            <div className="page-header text-blue-d2 px-5">
                                                <h1 className="page-title text-secondary-d1">
                                                    Invoice
                                                    <small className="page-info">
                                                        <i className="fa fa-angle-double-right text-80"></i>
                                                        ID: #{invoice?.invoiceNumber}
                                                    </small>
                                                </h1>

                                                <div className="page-tools">
                                                    <div className="action-buttons">
                                                        <a onClick={handlePrint} className="btn bg-white btn-light mx-1px text-95 mr-3" href="#" data-title="Print">
                                                            <FaPrint className="mr-1 fa fa-print text-primary-m1 text-120 w-2"/>
                                                            Print
                                                        </a>
                                                        <a onClick={handleExportPdf} className="btn bg-white btn-light mx-1px text-95" href="#" data-title="PDF">
                                                            <FaFilePdf className="mr-1 fa fa-file-pdf-o text-danger-m1 text-120 w-2"/>
                                                            Export
                                                        </a>
                                                    </div>
                                                </div>
                                            </div>

                                            <div ref={printRef} className="px-5">
                                                <div className="row mt-4">
                                                    <div className="col-12 col-lg-12">
                                                        <div className="row">
                                                            <div className="col-12">
                                                                <div className="text-center text-150">
                                                                    <i className="fa fa-book fa-2x text-success-m2 mr-1"></i>
                                                                    <span className="text-default-d3">{invoice?.clientCompany}</span>
                                                                </div>
                                                            </div>
                                                        </div>
                                                        
                                                        <hr className="row brc-default-l1 mx-n1 mb-4" />

                                                        <div className="row">
                                                            <div className="col-sm-6">
                                                                <div className="mt-1 mb-2 text-secondary-m1 text-600 text-125">Invoice for</div>

                                                                <div>
                                                                    <span className="text-sm text-grey-m2 align-middle fw-bold">To: </span>
                                                                    <span className="text-600 text-110 text-blue align-middle ml-2"> {clients.find(client => data.client == client._id)?.name}</span>
                                                                </div>
                                                                <div className="text-grey-m2">
                                                                    <div className="my-1">
                                                                        Company: <span className="text-600">{invoice?.projectName}</span>
                                                                    </div>
                                                                    <div className="my-1">
                                                                        Location: <span className="text-600">{clients.find(client => data.client == client._id)?.address}</span>
                                                                    </div>
                                                                </div>
                                                            </div>
                                                            

                                                            <div className="text-95 col-sm-6 align-self-start d-sm-flex justify-content-end">
                                                                <hr className="d-sm-none" />
                                                                <div className="text-grey-m2">
                                                                    <div className="mt-1 mb-2 text-secondary-m1 text-600 text-125">Payable to</div>

                                                                    <div className="my-2"><span className="text-600 text-90">ID:</span> #{invoice?.invoiceNumber}</div>

                                                                    <div className="my-2"><span className="text-600 text-90">Issue Date:</span> {moment(data?.issueDate).format('LLL')}</div>

                                                                    <div className="my-2"><span className="text-600 text-90">Status:</span> <span className={`badge ${invoice?.status === "Paid" ? "badge-success" : "badge-warning"} badge-pill px-25`}>{invoice?.status}</span></div>
                                                                </div>
                                                            </div>
                                                            
                                                        </div>

                                                        <div className="mt-4">
                                                            
                                                            <hr />

                                                            <div className="row border-b-2 brc-default-l2"></div>

                                                            <div className="row">
                                                                <div className="col-12">
                                                                    <div className="text-center text-150">
                                                                    Project: <i className="fa fa-book fa-2x text-success-m2 mr-1"></i>
                                                                        <span className="text-default-d3 font-weight-600"> {invoice?.projectName}</span>
                                                                    </div>
                                                                </div>
                                                            </div>
                                                            
                                                            <hr className="row brc-default-l1 mx-n1 mb-4" />

                                                            <div className="table-responsive">
                                                                {invoice?.works?.length > 0 ? (<table className="table table-striped table-borderless border-0 border-b-2 brc-default-l1">
                                                                    <thead className="bg-none bgc-default-tp1">
                                                                        <tr className="text-white">
                                                                            <th className="opacity-2">#</th>
                                                                            <th>Memo</th>
                                                                            <th>Hours</th>
                                                                            <th>Hourly Rate</th>
                                                                            <th width="140">Amount</th>
                                                                        </tr>
                                                                    </thead>

                                                                    <tbody className="text-95 text-secondary-d3">
                                                                        <tr></tr>

                                                                        {
                                                                            invoice?.works.map((data, index) => <tr key={index}>
                                                                                <td>{index}</td>
                                                                                <td>{data.description}</td>
                                                                                <td>{data.hours}</td>
                                                                                <td className="text-95">${data.hourlyRate}</td>
                                                                                <td className="text-secondary-d2">${data.hours * data.hourlyRate}</td>
                                                                            </tr>)
                                                                        }

                                                                        <tr>
                                                                            <th>Total Hours</th>
                                                                            <th></th>
                                                                            <th>{invoice?.totalHours}hr</th>
                                                                            <th className="text-95"></th>
                                                                            <th className="text-secondary-d2"></th>
                                                                        </tr> 

                                                                    </tbody>
                                                                </table>) : (<h2 className="text-center">Sorry, you have not uploaded any work yet!</h2>)}
                                                            </div>

                                                            <hr />

                                                            <div className="row mt-3">
                                                                <div className="col-12 col-sm-7 text-grey-d2 text-95 mt-2 mt-lg-0 d-flex justify-content-between">Total Calculations</div>

                                                                <div className="col-12 col-sm-5 text-grey text-90 order-first order-sm-last">
                                                                    <div className="row my-2">
                                                                        <div className="col-8 text-right">
                                                                            Subtotal
                                                                        </div>
                                                                        <div className="col-4">
                                                                            <span className="text-120 text-secondary-d1">${invoice?.subTotal}</span>
                                                                        </div>
                                                                    </div>

                                                                    <div className="row my-2">
                                                                        <div className="col-8 text-right">
                                                                            Adjustments
                                                                        </div>
                                                                        <div className="col-4">
                                                                            <span className="text-110 text-secondary-d1">${invoice?.adjustments}</span>
                                                                        </div>
                                                                    </div>

                                                                    <div className="row my-2 align-items-center bgc-primary-l3 p-2">
                                                                        <div className="col-8 text-right">
                                                                            Total Amount
                                                                        </div>
                                                                        <div className="col-4">
                                                                            <span className="text-150 text-success-d3 opacity-2 font-bold">${invoice?.totalAmount}</span>
                                                                        </div>
                                                                    </div>
                                                                </div>
                                                            </div>

                                                            <hr />

                                                            <div>
                                                                <span className="text-secondary-d1 text-105">Thank you for your business</span>
                                                                <a href="#" className="btn btn-info btn-bold px-4 float-right mt-3 mt-lg-0">Pay Now</a>
                                                            </div>
                                                        </div>
                                                    </div>
                                                </div>
                                            </div>
                                        </div>

                                    </DetailsModal>}

                                    <button 
                                        onClick={() => {
                                            handleEmployeeInvoiceView(data?._id)
                                            setEmployeeInvoiceModal(true);
                                            setCurrentId(data._id);
                                        }} className="btn btn-sm bg-success-light mr-2"
                                    >
                                            <TbUserDollar style={{fontSize: "15px", margin:"auto"}} />
                                    </button>

                                    {employeeInvoiceModal && data?._id === currentId && <DetailsModal modalClose={setEmployeeInvoiceModal}>

                                        <div className="page-content py-5">
                                            <div className="page-header text-blue-d2 px-5">
                                                <h1 className="page-title text-secondary-d1">
                                                    Invoice
                                                    <small className="page-info">
                                                        <i className="fa fa-angle-double-right text-80"></i>
                                                        ID: #{invoice?.invoiceNumber}
                                                    </small>
                                                </h1>

                                                <div className="page-tools">
                                                    <div className="action-buttons">
                                                        <a onClick={handlePrint} className="btn bg-white btn-light mx-1px text-95 mr-3" href="#" data-title="Print">
                                                            <FaPrint className="mr-1 fa fa-print text-primary-m1 text-120 w-2"/>
                                                            Print
                                                        </a>
                                                        <a onClick={handleExportPdf} className="btn bg-white btn-light mx-1px text-95" href="#" data-title="PDF">
                                                            <FaFilePdf className="mr-1 fa fa-file-pdf-o text-danger-m1 text-120 w-2"/>
                                                            Export
                                                        </a>
                                                    </div>
                                                </div>
                                            </div>

                                            <div ref={printRef} className="px-5">
                                                <div className="row mt-4">
                                                    <div className="col-12 col-lg-12">
                                                        <div className="row">
                                                            <div className="col-12">
                                                                <div className="text-center text-150">
                                                                    <i className="fa fa-book fa-2x text-success-m2 mr-1"></i>
                                                                    <span className="text-default-d3">{invoice?.clientCompany}</span>
                                                                </div>
                                                            </div>
                                                        </div>
                                                        
                                                        <hr className="row brc-default-l1 mx-n1 mb-4" />

                                                        <div className="row">
                                                            <div className="col-sm-6">
                                                                <div className="mt-1 mb-2 text-secondary-m1 text-600 text-125">Invoice for</div>

                                                                <div>
                                                                    <span className="text-sm text-grey-m2 align-middle fw-bold">To: </span>
                                                                    <span className="text-600 text-110 text-blue align-middle ml-2"> {clients.find(client => data.client == client._id)?.name}</span>
                                                                </div>
                                                                <div className="text-grey-m2">
                                                                    <div className="my-1">
                                                                        Company: <span className="text-600">{invoice?.projectName}</span>
                                                                    </div>
                                                                    <div className="my-1">
                                                                        Location: <span className="text-600">{clients.find(client => data.client == client._id)?.address}</span>
                                                                    </div>
                                                                </div>
                                                            </div>
                                                            

                                                            <div className="text-95 col-sm-6 align-self-start d-sm-flex justify-content-end">
                                                                <hr className="d-sm-none" />
                                                                <div className="text-grey-m2">
                                                                    <div className="mt-1 mb-2 text-secondary-m1 text-600 text-125">Payable to</div>

                                                                    <div className="my-2"><span className="text-600 text-90">ID:</span> #{invoice?.invoiceNumber}</div>

                                                                    <div className="my-2"><span className="text-600 text-90">Issue Date:</span> {moment(data?.issueDate).format('LLL')}</div>

                                                                    <div className="my-2"><span className="text-600 text-90">Status:</span> <span className={`badge ${invoice?.status === "Paid" ? "badge-success" : "badge-warning"} badge-pill px-25`}>{invoice?.status}</span></div>
                                                                </div>
                                                            </div>
                                                            
                                                        </div>

                                                        <div className="mt-4">

                                                            <hr />
                                                            <div className="row border-b-2 brc-default-l2"></div>

                                                            <div className="table-responsive">

                                                                {invoice?.works?.length > 0 && <table className="table table-striped table-borderless border-0 border-b-2 brc-default-l1">
                                                                    <thead className="bg-none bgc-default-tp1">
                                                                        <tr className="text-white">
                                                                            <th>Employee Name</th>
                                                                            <th>Hours Breakdown</th>
                                                                            <th>Hours Adjusment</th>
                                                                        </tr>
                                                                    </thead>

                                                                    <tbody className="text-95 text-secondary-d3">
                                                                        <tr></tr>

                                                                        {
                                                                            invoice?.employeeWorks.map((data, index) => <tr key={index}>
                                                                                <td>{data.name}</td>
                                                                                <td>{data.hoursBreakdown}</td>
                                                                                <td className="text-95">{data.hoursAdjustment}</td>
                                                                            </tr>)
                                                                        }

                                                                        <tr>
                                                                            <th>Total Hours</th>
                                                                            <th>{invoice?.employeeWorks.reduce((acc, work) => acc + work.hoursBreakdown, 0)}hr</th>
                                                                            <th className="text-secondary-d2">{invoice?.employeeWorks.reduce((acc, work) => acc + work.hoursAdjustment, 0)}hr</th>
                                                                        </tr> 

                                                                    </tbody>
                                                                </table>}

                                                            </div>
                                                            
                                                            <hr />

                                                            <div className="text-center">
                                                                <span className="text-secondary-d1 text-105">Thank you for your business</span>
                                                            </div>
                                                        </div>
                                                    </div>
                                                </div>
                                            </div>
                                        </div>

                                    </DetailsModal>}

                                    <button 
                                        onClick={() => {
                                            setInput({
                                                client: data.client, 
                                                works: data.works,
                                                employeeWorks: data.employeeWorks,
                                                status: data.status,
                                                projectName: data.projectName,
                                                clientCompany: data.clientCompany,
                                                month: data.month,
                                                freelancerName: data.freelancerName,
                                                freelancerCompany: data.freelancerCompany,
                                                freelancerCountry: data.freelancerCountry,
                                                adjustments: data.adjustments
                                            });
                                            setCurrentId(data._id);
                                            setModal(true);
                                        }} className="btn btn-sm bg-info-light mr-2"
                                    >
                                            <FaRegEdit style={{fontSize: "15px", margin:"auto"}} />
                                    </button>

                                    {modal && data?._id === currentId &&  <Modal title={"Order update"}  modalClose={setModal}>
                                        <form onSubmit={(e) => handleOrderUpdate(e, data?._id)}>
                                            <div className="row form-row">
						
                                                <div className="col-12">

                                                    <div className="form-group p-1">
                                                        <label>Client Company Name:</label>
                                                        <input name="projectName" type="text" value={input.projectName} onChange={handleInputChange} className="form-control" required />
                                                    </div>

                                                    <div className="form-group p-1">
                                                        <label>Client Company URL:</label>
                                                        <input name="clientCompany" type="text" value={input.clientCompany} onChange={handleInputChange} className="form-control" required />
                                                    </div>
                                                    
                                                    <div className="form-group p-1">

                                                        <div className="form-row">
                                                            <div className="col-6">
                                                                <div className="">
                                                                    <label>Status:</label>
                                                                    <select name="status" value={input.status} onChange={handleInputChange} className="form-control mb-2">
                                                                        <option value="Unpaid">Unpaid</option>
                                                                        <option value="Paid">Paid</option>
                                                                    </select>
                                                                </div>
                                                            </div>

                                                            <div className="col-6">
                                                                <div className="">
                                                                    <label>Client:</label>
                                                                    <select name="client" value={input.client} onChange={handleInputChange} className="form-control mb-2" required>
                                                                        <option value="">Select a client</option>
                                                                        {clients.map((client, index) => (
                                                                            <option key={index} value={client._id}>
                                                                                {client.name}
                                                                            </option>
                                                                        ))}
                                                                    </select>
                                                                </div>
                                                            </div>
                                                        </div>
                                                        
                                                    </div>
                                                    
                                                    <div className="form-group p-1">

                                                        <div className="form-row">
                                                            <div className="col-6">
                                                                <div className="">
                                                                    <label>Month:</label>
                                                                    <input name="month" type="text" value={input.month} onChange={handleInputChange} className="form-control" required />
                                                                </div>
                                                            </div>

                                                            <div className="col-6">
                                                                <div className="">
                                                                    <label>Adjustments:</label>
                                                                    <input name="adjustments" type="number" value={input.adjustments} onChange={handleInputChange} className="form-control" required />
                                                                </div>
                                                            </div>
                                                        </div>
                                                        
                                                    </div>

                                                    <div className="form-group p-1">
                                                        
                                                        <div className="mb-2 d-flex justify-content-between align-items-center">
                                                            <label>Agency details:</label>
                                                        </div>

                                                        <div className="form-row mb-3">
                                                            <div className="col-12 d-flex justify-content-between align-items-center">
                                                                <input
                                                                    type="text"
                                                                    name="freelancerName"
                                                                    value={input.freelancerName}
                                                                    onChange={handleInputChange}
                                                                    placeholder="Freelancer Name"
                                                                    className="form-control mb-2"
                                                                    required
                                                                />
                                                                <input
                                                                    type="text"
                                                                    name="freelancerCompany"
                                                                    value={input.freelancerCompany}
                                                                    onChange={handleInputChange}
                                                                    placeholder="Agency Name"
                                                                    className="form-control mb-2 ml-2"
                                                                    required
                                                                />
                                                            </div>

                                                            <div className="col-12">
                                                                <input
                                                                    type="text"
                                                                    name="freelancerCountry"
                                                                    value={input.freelancerCountry}
                                                                    onChange={handleInputChange}
                                                                    placeholder="Country"
                                                                    className="form-control"
                                                                    required
                                                                />
                                                            </div>
                                                        </div>

                                                        <div className="mb-3 d-flex justify-content-between align-items-center">
                                                            <label>Works:</label>
                                                            <button type="button" onClick={addWork} className="btn btn-sm bg-info-light"><FaPlus /></button>
                                                        </div>
                                                        {input.works.map((work, index) => (
                                                            <div key={index} className="form-row mb-3">
                                                                <div className="col-12 d-flex justify-content-between align-items-center">
                                                                    <input
                                                                        type="text"
                                                                        name="description"
                                                                        value={work.description}
                                                                        onChange={(e) => handleWorkChange(index, e)}
                                                                        placeholder="Description"
                                                                        className="form-control mb-2"
                                                                        required
                                                                    />
                                                                    <input
                                                                        type="number"
                                                                        name="hours"
                                                                        value={work.hours}
                                                                        onChange={(e) => handleWorkChange(index, e)}
                                                                        placeholder="Hours"
                                                                        className="form-control mb-2 ml-2"
                                                                        required
                                                                    />
                                                                </div>

                                                                <div className="col-12 d-flex justify-content-between align-items-center position-relative">
                                                                    <input
                                                                        type="number"
                                                                        name="hourlyRate"
                                                                        value={work.hourlyRate}
                                                                        onChange={(e) => handleWorkChange(index, e)}
                                                                        placeholder="Hourly Rate"
                                                                        className="form-control mb-2"
                                                                        required
                                                                    />
                                                                    
                                                                    <button type="button" onClick={() => removeWork(index)} className="btn btn-sm bg-danger-light mb-2 position-absolute" style={{right: "9px"}}><FaRegTrashCan /></button>
                                                                </div>
                                                            </div>
                                                        ))}

                                                        <div className="mb-3 d-flex justify-content-between align-items-center">
                                                            <label>Employee Works:</label>
                                                            <button type="button" onClick={addEmployeeWork} className="btn btn-sm bg-info-light"><FaPlus /></button>
                                                        </div>
                                                        {input.employeeWorks.map((employeeWorks, index) => (
                                                            <div key={index} className="form-row mb-3">
                                                                <div className="col-12 d-flex justify-content-between align-items-center">
                                                                    <input
                                                                        type="text"
                                                                        name="name"
                                                                        value={employeeWorks.name}
                                                                        onChange={(e) => handleEmployeeWorksChange(index, e)}
                                                                        placeholder="Name"
                                                                        className="form-control mb-2"
                                                                        required
                                                                    />
                                                                    <input
                                                                        type="number"
                                                                        name="hoursBreakdown"
                                                                        value={employeeWorks.hoursBreakdown}
                                                                        onChange={(e) => handleEmployeeWorksChange(index, e)}
                                                                        placeholder="Hours breakdown"
                                                                        className="form-control mb-2 ml-2"
                                                                        required
                                                                    />
                                                                </div>

                                                                <div className="col-12 d-flex justify-content-between align-items-center position-relative">
                                                                    <input
                                                                        type="number"
                                                                        name="hoursAdjustment"
                                                                        value={employeeWorks.hoursAdjustment}
                                                                        onChange={(e) => handleEmployeeWorksChange(index, e)}
                                                                        placeholder="Hours adjustment"
                                                                        className="form-control mb-2"
                                                                        required
                                                                    />
                                                                    
                                                                    <button type="button" onClick={() => removeEmployeeWork(index)} className="btn btn-sm bg-danger-light mb-2 position-absolute" style={{right: "9px"}}><FaRegTrashCan /></button>
                                                                </div>
                                                            </div>
                                                        ))}
                                                    </div>

                                                </div>
                                                
                                            </div>
                                            <button type="submit" className="btn btn-primary btn-block">Update</button>
                                        </form>
                                    </Modal>}

                                    <button onClick={() => handleOrderDelete(data?._id)} className="btn btn-sm bg-danger-light"><FaRegTrashAlt style={{fontSize: "15px", margin:"auto"}} /></button>
                                </td>
                            </tr>
                        )
                    }
                </tbody>
            </table>) : (
                <h3 className="mt-6 mb-6 text-center py-5">Sorry, order data not found!</h3>
            )}
        
        
        </>
    )
}

export default OrderDatatable;
