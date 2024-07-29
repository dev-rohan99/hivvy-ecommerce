import React, { useEffect, useRef, useState } from 'react';
import { useDispatch, useSelector } from 'react-redux';
import { FaFilePdf, FaPrint, FaRegEdit, FaRegTrashAlt } from 'react-icons/fa';
import DataTable from 'datatables.net-dt';
import Swal from 'sweetalert2';
import moment from "moment";
import useInputControl from '../../hooks/useInputControl';
import Modal from '../modal/Modal';
import createToast from '../../utilities/createToast';
import { deleteClient, getAllOrderByClient, updateClient } from '../../app/features/admin/adminApiSlice';
import { TbFileInvoice } from 'react-icons/tb';
import DetailsModal from '../modal/DetailsModal';
import html2canvas from 'html2canvas';
import jsPDF from 'jspdf';


const ClientDatatable = () => {

    const [modal, setModal] = useState(false);
    const printRef = useRef();
    const [invoiceModal, setInvoiceModal] = useState(false);
    const [currentId, setCurrentId] = useState("");
    const [filterDate, setFilterDate] = useState('');
	const { input, setInput, handleInputChange, resetForm } = useInputControl({
		name: "",
		email: "",
		phone: "",
		address: "",
		avatar: "",
	});
    const { isLoading, clients, invoices } = useSelector((state) => state.admin);
	const dispatch = useDispatch();

    const handleBrandStatusUpdate = (status, id) => {
        // dispatch(updateClientStatus({id: id, status}));
    }
    
    const handleAllInvoiceView = (id) => {
        dispatch(getAllOrderByClient({id}));
    }

    const handleDateChange = (e) => {
        setFilterDate(e.target.value);
        if (e.target.value) {
            dispatch(getAllOrderByClient({ id: currentId, startDate: e.target.value }));
        }
    };

    const handleClientUpdate = (e, id) => {
        e.preventDefault();
        if(!input.name || !input.email || !input.phone || !input.address){
			createToast("Please, fill out the form!", "warn");
		}else{
			dispatch(updateClient({ id, input }));
			resetForm();
			setModal(false);
		}
    }

    const handleClientDelete = (id) => {
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
                dispatch(deleteClient(id));
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
        
        
            {clients ? (<table className="datatable table table-hover table-center mb-0">
                <thead>
                    <tr>
                        <th>Name</th>
                        <th>Email</th>
                        <th>Phone</th>
                        <th>Created At</th>
                        <th>Status</th>
                        <th>Actions</th>
                    </tr>
                </thead>
                <tbody>
                    {
                        [...clients]?.reverse().map((data, index) => 
                            <tr key={index}>
                                <td>
                                    <h2 className="table-avatar">{data?.name}</h2>
                                </td>
                                <td>{data?.email}</td>
                                <td>{data?.phone}</td>
                                <td>{moment(data?.createdAt).format('LLL')}</td>
                                
                                <td>
                                    <div className="status-toggle">
                                        <input type="checkbox" id={`status_${index}`} className="check" checked={data.status ? true : false}/>
                                        <label onClick={() => handleBrandStatusUpdate(data?.status, data?._id)} htmlFor={`status_${index}`} className="checktoggle">checkbox</label>
                                    </div>
                                </td>

                                <td>

                                    <button 
                                        onClick={() => {
                                            handleAllInvoiceView(data?._id)
                                            setInvoiceModal(true);
                                            setCurrentId(data._id);
                                        }} className="btn btn-sm bg-success-light mr-2"
                                    >
                                            <TbFileInvoice style={{fontSize: "15px", margin:"auto"}} />
                                    </button>

                                    {invoiceModal && data?._id === currentId && <DetailsModal modalClose={setInvoiceModal}>

                                        <div className="page-content py-5">
                                            <div className="page-header text-blue-d2 px-5 d-flex justify-content-between align-items-center">
                                                {invoices?.invoiceNumber && <h1 className="page-title text-secondary-d1">
                                                    Invoice
                                                    <small className="page-info">
                                                        <i className="fa fa-angle-double-right text-80"></i>
                                                        ID: #{invoices?.invoiceNumber}
                                                    </small>
                                                </h1>}
                                                
                                                <div className="d-flex justify-content-between align-items-center">
                                                    Filter: <input onChange={handleDateChange} value={filterDate} type="date" className="form-control ml-3" />
                                                </div>

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
                                                        {invoices?.clientCompany && <div className="row">
                                                            <div className="col-12">
                                                                <div className="text-center text-150">
                                                                    <i className="fa fa-book fa-2x text-success-m2 mr-1"></i>
                                                                    <span className="text-default-d3">{invoices?.clientCompany}</span>
                                                                </div>
                                                            </div>
                                                        </div>}
                                                        
                                                        <hr className="row brc-default-l1 mx-n1 mb-4" />

                                                        <div className="row">
                                                            <div className="col-sm-6">
                                                                <div className="mt-1 mb-2 text-secondary-m1 text-600 text-125">Invoice for</div>

                                                                <div>
                                                                    <span className="text-sm text-grey-m2 align-middle fw-bold">To: </span>
                                                                    <span className="text-600 text-110 text-blue align-middle ml-2"> {data?.name}</span>
                                                                </div>
                                                                <div className="text-grey-m2">
                                                                    <div className="my-1">
                                                                        Location: <span className="text-600">{data?.address}</span>
                                                                    </div>
                                                                </div>
                                                            </div>
                                                            

                                                            <div className="text-95 col-sm-6 align-self-start d-sm-flex justify-content-end">
                                                                <hr className="d-sm-none" />
                                                                <div className="text-grey-m2">
                                                                    <div className="mt-1 mb-2 text-secondary-m1 text-600 text-125">Payable to</div>

                                                                    {invoices?.invoiceNumber && <div className="my-2"><span className="text-600 text-90">ID:</span> #{invoices?.invoiceNumber}</div>}

                                                                    <div className="my-2"><span className="text-600 text-90">Issue Date:</span> {moment(data?.issueDate).format('LLL')}</div>

                                                                    <div className="my-2"><span className="text-600 text-90">Status:</span> <span className={`badge ${invoices?.status === "Paid" ? "badge-success" : "badge-warning"} badge-pill px-25`}>{invoices?.status}</span></div>
                                                                </div>
                                                            </div>
                                                            
                                                        </div>

                                                        <div className="mt-4">

                                                            {
                                                                invoices?.map((data, index) => 
                                                                
                                                                    <div key={index}>
                                                                        
                                                                        <hr className="row brc-default-l1 mx-n1 mb-3" />
                                                                    
                                                                        <div className="row">
                                                                            <div className="col-12">
                                                                                <div className="text-center text-150">
                                                                                Project: <i className="fa fa-book fa-2x text-success-m2 mr-1"></i>
                                                                                    <span className="text-default-d3 font-weight-600"> {data?.projectName}</span>
                                                                                </div>
                                                                            </div>
                                                                        </div>
                                                                        
                                                                        <hr className="row brc-default-l1 mx-n1 mb-4" />

                                                                        <div className="table-responsive">
                                                                            {data?.works.length > 0 && <table className="table table-striped table-borderless border-0 border-b-2 brc-default-l1">
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
                                                                                        data?.works.map((data, index) => <tr key={index}>
                                                                                            <td>{index}</td>
                                                                                            <td>{data.description}</td>
                                                                                            <td>{data.hours}</td>
                                                                                            <td className="text-95">${data.hourlyRate}</td>
                                                                                            <td className="text-secondary-d2">${data.amount}</td>
                                                                                        </tr>)
                                                                                    }

                                                                                    <tr>
                                                                                        <th>Total Hours</th>
                                                                                        <th></th>
                                                                                        <th>{data?.totalHours}hr</th>
                                                                                        <th className="text-95"></th>
                                                                                        <th className="text-secondary-d2"></th>
                                                                                    </tr> 

                                                                                </tbody>
                                                                            </table>}
                                                                        </div>
                                                                    
                                                                    </div>
                                                                
                                                                )
                                                            }

                                                            <hr />

                                                            <div className="row mt-3">
                                                                <div className="col-12 col-sm-7 text-grey-d2 text-95 mt-2 mt-lg-0 d-flex justify-content-between">Total Calculations</div>

                                                                <div className="col-12 col-sm-5 text-grey text-90 order-first order-sm-last">
                                                                    <div className="row my-2">
                                                                        <div className="col-8 text-right">
                                                                            Subtotal
                                                                        </div>
                                                                        <div className="col-4">
                                                                            <span className="text-120 text-secondary-d1">${invoices?.reduce((acc, order) => acc + (order.subTotal || 0), 0)}</span>
                                                                        </div>
                                                                    </div>

                                                                    <div className="row my-2">
                                                                        <div className="col-8 text-right">
                                                                            Adjustments
                                                                        </div>
                                                                        <div className="col-4">
                                                                            <span className="text-110 text-secondary-d1">${invoices?.reduce((acc, order) => acc + (order.adjustments || 0), 0)}</span>
                                                                        </div>
                                                                    </div>

                                                                    <div className="row my-2 align-items-center bgc-primary-l3 p-2">
                                                                        <div className="col-8 text-right">
                                                                            Total Amount
                                                                        </div>
                                                                        <div className="col-4">
                                                                            <span className="text-150 text-success-d3 opacity-2 font-bold">${invoices?.reduce((acc, order) => acc + (order.totalAmount || 0), 0)}</span>
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
                                            setInput({
                                                name: data?.name,
                                                email: data?.email,
                                                phone: data?.phone,
                                                address: data?.address,
                                            });
                                            setCurrentId(data._id);
                                            setModal(true);
                                        }} className="btn btn-sm bg-info-light mr-2"
                                    >
                                            <FaRegEdit style={{fontSize: "15px", margin:"auto"}} />
                                    </button>

                                    {modal && data?._id === currentId && <Modal title={"Client update"}  modalClose={setModal}>
                                        <form onSubmit={(e) => handleClientUpdate(e, data?._id)}>
                                            <div className="row form-row">

                                                <div className="col-12">
                                                    <div className="form-group">
                                                        <label>Name</label>
                                                        <input type="text" name="name" value={input.name} onChange={handleInputChange} className="form-control"/>
                                                    </div>
                                                </div>

                                                <div className="col-12">
                                                    <div className="form-group">
                                                        <label>Email</label>
                                                        <input type="text" name="name" value={input.email} onChange={handleInputChange} className="form-control"/>
                                                    </div>
                                                </div>

                                                <div className="col-12">
                                                    <div className="form-group">
                                                        <label>Phone</label>
                                                        <input type="text" name="phone" value={input.phone} onChange={handleInputChange} className="form-control"/>
                                                    </div>
                                                </div>

                                                <div className="col-12">
                                                    <div className="form-group">
                                                        <label>Address</label>
                                                        <input type="text" name="address" value={input.address} onChange={handleInputChange} className="form-control"/>
                                                    </div>
                                                </div>
                                                
                                            </div>
                                            <button type="submit" className="btn btn-primary btn-block">Update</button>
                                        </form>
                                    </Modal>}

                                    <button onClick={() => handleClientDelete(data?._id)} className="btn btn-sm bg-danger-light"><FaRegTrashAlt style={{fontSize: "15px", margin:"auto"}} /></button>
                                </td>
                            </tr>
                        )
                    }
                </tbody>
            </table>) : (
                <h3 className="mt-6 mb-6 text-center py-5">Sorry, client data not found!</h3>
            )}
        
        
        </>
    )
}

export default ClientDatatable;
