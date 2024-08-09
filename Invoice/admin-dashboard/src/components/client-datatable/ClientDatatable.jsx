import React, { useEffect, useRef, useState } from 'react';
import { useDispatch, useSelector } from 'react-redux';
import { FaFilePdf, FaPlus, FaPrint, FaRegEdit, FaRegTrashAlt } from 'react-icons/fa';
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
import { FaRegTrashCan } from 'react-icons/fa6';
import { PDFDownloadLink } from '@react-pdf/renderer';
import MyDocument from '../my-document/MyDocument';

const getAllEmployeeWork = (invoices) => {
	const allEmployee = invoices?.reduce((acc, invoice) => {
        return acc.concat(invoice.employeeWorks);
    }, []);
    console.log(allEmployee);
    return allEmployee;
};

const calculateProjectHours = (invoices) => {
    return invoices?.map(invoice => {
        const projectName = invoice.projectName;
        const totalHours = invoice.totalHours;
        const adjustments = invoice.adjustments;
        const finalTotalPayable = invoice.finalTotalPayable;
        return { projectName, totalHours, adjustments, finalTotalPayable };
    });
};

const ClientDatatable = () => {

    const [modal, setModal] = useState(false);
    const printRef = useRef();
    const [invoiceModal, setInvoiceModal] = useState(false);
    const [currentId, setCurrentId] = useState("");
    const [filterDate, setFilterDate] = useState('');
    const [filterMonth, setFilterMonth] = useState('');
	const { input, setInput, handleInputChange, resetForm } = useInputControl({
		name: "",
		email: "",
		employeeWorks: [{ employee: '', hoursAdjustment: "" }],
		billingCriteria: { maxHoursPerMonth: "360", maxEmployees: "6" },
		phone: "",
		address: "",
		avatar: "",
	});
	const [allEmployeeWorks, setAllEmployeeWorks] = useState(null);
    const { isLoading, clients, invoices, employees } = useSelector((state) => state.admin);
	const dispatch = useDispatch();

    const handleBolingCriteriaChange = (e) => {
        const { name, value } = e.target;
        setInput(prevInput => ({
            ...prevInput,
            billingCriteria: {
                ...prevInput.billingCriteria,
                [name]: value
            }
        }));
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
			employeeWorks: [...input.employeeWorks, { employee: '', hoursAdjustment: "" }]
		});
	};
	
	const removeEmployeeWork = (index) => {
		const newEmployeeWorks = input.employeeWorks.filter((_, i) => i !== index);
		setInput({ ...input, employeeWorks: newEmployeeWorks });
	};

    const calculateEmployeeWorkTotals = (invoices) => {
        const employeeWorkTotals = {};
      
        invoices?.forEach(invoice => {
          invoice.employeeWorks.forEach(employeeWork => {
            const { name, hoursBreakdown, hoursAdjustment } = employeeWork;
            if (!employeeWorkTotals[name]) {
              employeeWorkTotals[name] = { totalHoursBreakdown: 0, totalHoursAdjustment: 0 };
            }
            employeeWorkTotals[name].totalHoursBreakdown += hoursBreakdown;
            employeeWorkTotals[name].totalHoursAdjustment += hoursAdjustment;
          });
        });
      
        return employeeWorkTotals;
    };

    const employeeWorkTotals = calculateEmployeeWorkTotals(invoices);
    const totalHoursBreakdown = Object.values(employeeWorkTotals).reduce((acc, totals) => acc + totals.totalHoursBreakdown, 0);
    const totalHoursAdjustment = Object.values(employeeWorkTotals).reduce((acc, totals) => acc + totals.totalHoursAdjustment, 0);

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

    const handleMonthChange = (e) => {
        setFilterMonth(e.target.value);
        if (e.target.value) {
            dispatch(getAllOrderByClient({ id: currentId, month: e.target.value }));
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

    const handleExportPdf = async (e) => {
        // const input = printRef.current;
        // html2canvas(input, {
        //     scale: 3,  // Increase scale for better resolution
        //     useCORS: true
        // }).then((canvas) => {
        //     const imgData = canvas.toDataURL('image/png');
        //     const pdf = new jsPDF('p', 'mm', 'a4');
        //     const imgWidth = 210; // A4 width in mm
        //     const pageHeight = 295; // A4 height in mm
        //     const imgHeight = (canvas.height * imgWidth) / canvas.width;
        //     let heightLeft = imgHeight;
        //     let position = 0;

        //     // Function to ensure content doesn't break between pages
        //     const addImageToPdf = (yPosition) => {
        //         if (yPosition + imgHeight <= pageHeight) {
        //             pdf.addImage(imgData, 'PNG', 0, yPosition, imgWidth, imgHeight);
        //         } else {
        //             const remainingHeight = pageHeight - yPosition;
        //             const canvasPart = canvas.getContext('2d').getImageData(0, (imgHeight - heightLeft) * canvas.width / imgWidth, canvas.width, remainingHeight * canvas.width / imgWidth);
        //             const newCanvas = document.createElement('canvas');
        //             newCanvas.width = canvas.width;
        //             newCanvas.height = remainingHeight * canvas.width / imgWidth;
        //             newCanvas.getContext('2d').putImageData(canvasPart, 0, 0);
        //             const newImgData = newCanvas.toDataURL('image/png');
        //             pdf.addImage(newImgData, 'PNG', 0, yPosition, imgWidth, remainingHeight);
        //         }
        //     };

        //     // Add the first page
        //     addImageToPdf(position);
        //     heightLeft -= pageHeight;

        //     // Add new pages if needed
        //     while (heightLeft > 0) {
        //         pdf.addPage();
        //         position = 0;
        //         addImageToPdf(position);
        //         heightLeft -= pageHeight;
        //     }

        //     // Save the PDF
        //     pdf.save('invoice.pdf');
        // }).catch(error => console.error('Could not export PDF', error));

        const element = printRef.current;
    
        try {
        const canvas = await html2canvas(element, {
            scale: 2, // Increase resolution
            useCORS: true, // Enable cross-origin resource sharing for images
        });
        
        const image = canvas.toDataURL('image/png');
        
        // Trigger download
        const link = document.createElement('a');
        link.href = image;
        link.download = 'invoice.png';
        document.body.appendChild(link);
        link.click();
        document.body.removeChild(link);
        } catch (error) {
        console.error('Error exporting image:', error);
        }
    };

    const adjustmentHrFind = clients?.find(client => currentId === client._id)?.employeeWorks || [];
    
    const findEmployeeName = (employeeId) => {
        // const makeInvoiceArr = [...invoices];
        // for (let invoice of makeInvoiceArr) {
        //   for (let work of invoice?.employeeWorks) {
        //     if (work?._id == employeeId) {
        //       return work?.name;
        //     }
        //   }
        // }
        // return 'Unknown';

        if (!Array.isArray(invoices)) {
            console.error("Unexpected Application Error! invoices is not iterable");
            return 'Unknown';
          }
        
          for (const invoice of invoices) {
            if (Array.isArray(invoice.employeeWorks)) {
              for (const work of invoice.employeeWorks) {
                if (work._id === employeeId) {
                  return work.name;
                }
              }
            }
          }
          
          return 'Unknown';
    };

    const projectHours = calculateProjectHours(invoices);

    const totalHoursEveryProject = projectHours?.reduce((sum, project) => sum + project.totalHours, 0);
    const totalTotalPayableEveryProject = projectHours?.reduce((sum, project) => sum + project.finalTotalPayable, 0);

    useEffect(() => {
        if (invoices) {
			const employeeWorks = getAllEmployeeWork(invoices);
			setAllEmployeeWorks(employeeWorks);
		}
    }, [invoices]);


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
                                                    Filter By Date: <input onChange={handleDateChange} value={filterDate} type="date" className="form-control ml-3" />
                                                </div>
                                                
                                                <div className="d-flex justify-content-between align-items-center">
                                                    Filter By Month: <input onChange={handleMonthChange} value={filterMonth} type="month" className="form-control ml-3" />
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

                                                        {/* <PDFDownloadLink document={<MyDocument 
                                                            invoices={invoices}
                                                            employees={employees}
                                                        />} fileName="invoice.pdf">
                                                            {({ loading }) => (loading ? 'Loading document...' : 'Download Invoice')}
                                                        </PDFDownloadLink> */}
                                                    </div>
                                                </div>
                                            </div>

                                            <div ref={printRef} className="px-5">
                                                <div className="row mt-4">
                                                    <div className="col-12 col-lg-12">
                                                        
                                                        <hr className="row brc-default-l1 mx-n1 mb-3" />

                                                        {data?.invoiceNumber && <div className="row">
                                                            <div className="col-12">
                                                                <div className="text-center text-150">
                                                                    <i className="fa fa-book fa-2x text-success-m2 mr-1"></i>
                                                                    <span className="text-default-d3">Invoice ID: #{data?.invoiceNumber}</span>
                                                                </div>
                                                            </div>
                                                        </div>}

                                                        {filterMonth && <div className="row">
                                                            <div className="col-12">
                                                                <div className="text-center text-150">
                                                                    <span className="text-default-d3 text-success font-weight-600" style={{fontSize:"18px"}}>Month Of {filterMonth}</span>
                                                                </div>
                                                            </div>
                                                        </div>}
                                                        
                                                        <hr className="row brc-default-l1 mx-n1 mb-4" />

                                                        <div className="row">
                                                            <div className="col-sm-6">
                                                                <div className="mt-1 mb-2 text-secondary-m1 text-600 text-125">Invoice for</div>

                                                                {data?.invoiceNumber && <div className="my-2"><span className="text-600 text-90">ID:</span> #{data?.invoiceNumber}</div>}

                                                                <div>
                                                                    <span className="text-sm text-grey-m2 align-middle fw-bold">To: </span>
                                                                    <span className="text-600 text-110 text-blue align-middle ml-2"> {data?.name}</span>
                                                                </div>
                                                                <div className="text-grey-m2">
                                                                    {data?.company && <div className="my-1">
                                                                        Company: <span className="text-600">{data?.company}</span>
                                                                    </div>}
                                                                    <div className="my-1">
                                                                        Location: <span className="text-600">{data?.address}</span>
                                                                    </div>
                                                                </div>
                                                            </div>
                                                            

                                                            <div className="text-95 col-sm-6 align-self-start d-sm-flex justify-content-end">
                                                                <hr className="d-sm-none" />
                                                                <div className="text-grey-m2">
                                                                    <div className="mt-1 mb-2 text-secondary-m1 text-600 text-125">Payable to</div>

                                                                    <div>
                                                                        <span className="text-sm text-grey-m2 align-middle fw-bold">Name: </span>
                                                                        <span className="text-600 text-110 text-blue align-middle ml-2"> Mirza Ovinoor</span>
                                                                    </div>
                                                                    
                                                                    <div className="text-grey-m2">
                                                                        <div className="my-1">
                                                                            Agency: <a href="https://codeforsite.com" className="text-blue"><span className="text-600">CFS - Code For Site</span></a>
                                                                        </div>
                                                                        <div className="my-1">
                                                                            Location: <span className="text-600">Bangladesh</span>
                                                                        </div>
                                                                    </div>

                                                                    <div className="my-2"><span className="text-600 text-90">Issue Date:</span> {moment(data?.issueDate).format('LLL')}</div>

                                                                    {/* <div className="my-2"><span className="text-600 text-90">Status:</span> <span className={`badge ${invoices?.status === "Paid" ? "badge-success" : "badge-warning"} badge-pill px-25`}>{invoices?.status ? invoices?.status : "None"}</span></div> */}
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
                                                                                        <th className="tdClass">Memo</th>
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
                                                                                            <td className="tdClass">{data.description}</td>
                                                                                            <td>{data.hours?.toFixed(2)}</td>
                                                                                            <td className="text-95">${data.hourlyRate?.toFixed(2)}</td>
                                                                                            <td className="text-secondary-d2">${data.amount?.toFixed(2)}</td>
                                                                                        </tr>)
                                                                                    }

                                                                                    <tr>
                                                                                        <td className="textInc">Total</td>
                                                                                        <td></td>
                                                                                        <td className="textInc">{data?.totalHours?.toFixed(2)}</td>
                                                                                        <td className="text-95 textInc"></td>
                                                                                        <td className="text-secondary-d2 textInc">${data?.subTotal?.toFixed(2)}</td>
                                                                                    </tr> 

                                                                                </tbody>
                                                                            </table>}
                                                                        </div>
                                                                    
                                                                        <hr />

                                                                        <div className="row mt-3">
                                                                            <div className="col-12 col-sm-6 text-grey-d2 text-95 mt-2 mt-lg-0 d-flex justify-content-between">Total Calculations</div>

                                                                            <div className="col-12 col-sm-6 text-grey text-90 order-first order-sm-last">

                                                                                <div className="row my-2">
                                                                                    <div className="col-8 text-right">
                                                                                        Adjustments
                                                                                    </div>
                                                                                    <div className="col-4">
                                                                                        <span className="text-110 text-secondary-d1">-${data?.adjustments?.toFixed(2)}</span>
                                                                                    </div>
                                                                                </div>

                                                                                <div className="row my-2">
                                                                                    <div className="col-8 text-right">
                                                                                        Total amount
                                                                                    </div>
                                                                                    <div className="col-4">
                                                                                        <span className="text-110 text-secondary-d1 text-success textInc">${data?.totalAmount?.toFixed(2)}</span>
                                                                                    </div>
                                                                                </div>
                                                                            </div>
                                                                        </div>

                                                                    </div>
                                                                
                                                                )
                                                            }


                                                            <hr />

                                                            <div className="row">
                                                                <div className="col-12">
                                                                    <div className="text-center text-150">
                                                                        <span className="text-default-d3 font-weight-600"> Our Total Activity</span>
                                                                    </div>
                                                                </div>
                                                            </div>
                                                            
                                                            <hr className="row brc-default-l1 mx-n1 mb-4" />

                                                            <div className="d-flex justify-content-between items-center">

                                                                <div className="table-responsive mr-3">

                                                                    <table className="table table-striped table-borderless border-0 border-b-2 brc-default-l1">
                                                                        <thead className="bg-none bgc-default-tp1">
                                                                            <tr className="text-white">
                                                                                <th>Employee Name</th>
                                                                                <th className="tableAdjustWd">Working hours</th>
                                                                            </tr>
                                                                        </thead>

                                                                        <tbody className="text-95 text-secondary-d3">
                                                                            <tr></tr>

                                                                            {Object.entries(employeeWorkTotals).map(([name, totals, _id], index) => (
                                                                                <tr key={index}>
                                                                                <td>{employees.find(employee => name == employee._id)?.name}</td>
                                                                                <td className="tableAdjustWd">{totals.totalHoursBreakdown?.toFixed(2)}</td>
                                                                                </tr>
                                                                            ))}

                                                                            <tr>
                                                                                <td className="textInc">Total Hours</td>
                                                                                <td className={`tableAdjustWd textInc ${totalHoursBreakdown >= data.billingCriteria.maxHoursPerMonth ? "text-danger" : "text-success"}`}>{parseFloat(totalHoursBreakdown)?.toFixed(2)}</td>
                                                                            </tr> 

                                                                        </tbody>
                                                                    </table>

                                                                </div>

                                                                <div className="table-responsive">

                                                                    <table className="table table-striped table-borderless border-0 border-b-2 brc-default-l1">
                                                                        <thead className="bg-none bgc-default-tp1">
                                                                            <tr className="text-white">
                                                                                <th>Employee Name</th>
                                                                                <th className="tableAdjustWd">Adjusted hours</th>
                                                                            </tr>
                                                                        </thead>

                                                                        <tbody className="text-95 text-secondary-d3">
                                                                            <tr></tr>

                                                                            {/* {Object.entries(employeeWorkTotals).map(([name, totals, _id], index) => (
                                                                                <tr key={index}>
                                                                                <td>{name}</td>
                                                                                <td className="text-95">{clients?.find(client => currentId == client._id)?.employeeWorks?.hoursAdjustment || 'N/A'}hr</td>
                                                                                </tr>
                                                                            ))} */}

                                                                            {adjustmentHrFind.map((work, index) => (
                                                                                <tr key={index}>
                                                                                    <td>{employees.find(employee => work.employee == employee._id)?.name}</td>
                                                                                    <td className="tableAdjustWd">{work.hoursAdjustment?.toFixed(2) || 'N/A'}</td>
                                                                                </tr>
                                                                            ))}

                                                                            <tr>
                                                                                <td className="textInc">Total Hours</td>
                                                                                <td className={`tableAdjustWd textInc text-secondary-d2 ${data?.employeeWorks?.reduce((acc, order) => acc + (order.hoursAdjustment || 0), 0) >= data.billingCriteria.maxHoursPerMonth || totalHoursBreakdown < data?.employeeWorks?.reduce((acc, order) => acc + (order.hoursAdjustment || 0), 0) ? "text-danger" : "text-success"}`}>{parseFloat(data?.employeeWorks?.reduce((acc, order) => acc + (order.hoursAdjustment || 0), 0))?.toFixed(2)}</td>
                                                                            </tr> 

                                                                        </tbody>
                                                                    </table>

                                                                </div>

                                                            </div>

                                                            <hr className="row brc-default-l1 mx-n1 mb-4" />

                                                            {/* ======== */}

                                                            <div className="d-flex justify-content-between items-center">

                                                                <div className="table-responsive mr-3">

                                                                    <table className="table table-striped table-borderless border-0 border-b-2 brc-default-l1">
                                                                        <thead className="bg-none bgc-default-tp1">
                                                                            <tr className="text-white">
                                                                                <th>Project Name</th>
                                                                                <th className="tableAdjustWd">Hours</th>
                                                                            </tr>
                                                                        </thead>

                                                                        <tbody className="text-95 text-secondary-d3">
                                                                            <tr></tr>

                                                                            {projectHours?.map((project, index) => (
                                                                                <tr key={index}>
                                                                                    <td>{project.projectName}</td>
                                                                                    <td className="tableAdjustWd">{project.totalHours?.toFixed(2)}</td>
                                                                                </tr>
                                                                            ))}

                                                                            <tr>
                                                                                <td className="textInc">Total Hours</td>
                                                                                <td className="text-success textInc tableAdjustWd">{totalHoursEveryProject?.toFixed(2)}</td>
                                                                            </tr> 

                                                                        </tbody>
                                                                    </table>

                                                                </div>

                                                                <div className="table-responsive">

                                                                    <table className="table table-striped table-borderless border-0 border-b-2 brc-default-l1">
                                                                        <thead className="bg-none bgc-default-tp1">
                                                                            <tr className="text-white">
                                                                                <th>Project Name</th>
                                                                                <th className="tableAdjustWd">Amount</th>
                                                                            </tr>
                                                                        </thead>

                                                                        <tbody className="text-95 text-secondary-d3">
                                                                            <tr></tr>

                                                                            {/* {Object.entries(employeeWorkTotals).map(([name, totals, _id], index) => (
                                                                                <tr key={index}>
                                                                                <td>{name}</td>
                                                                                <td className="text-95">{clients?.find(client => currentId == client._id)?.employeeWorks?.hoursAdjustment || 'N/A'}hr</td>
                                                                                </tr>
                                                                            ))} */}

                                                                            {projectHours?.map((project, index) => (
                                                                                <tr key={index}>
                                                                                    <td>{project.projectName}</td>
                                                                                    <td className="tableAdjustWd">${project.finalTotalPayable?.toFixed(2)}</td>
                                                                                </tr>
                                                                            ))}

                                                                            <tr>
                                                                                <td className="textInc">Total Payable Amount</td>
                                                                                <td className="tableAdjustWd textInc text-secondary-d2 text-success">${totalTotalPayableEveryProject?.toFixed(2)}</td>
                                                                            </tr> 

                                                                        </tbody>
                                                                    </table>

                                                                </div>

                                                            </div>

                                                            {/* ======== */}

                                                            {/* <hr />

                                                            <div className="row mt-3">
                                                                <div className="col-12 col-sm-6 text-grey-d2 text-95 mt-2 mt-lg-0 d-flex justify-content-between">Total Calculations</div>

                                                                <div className="col-12 col-sm-6 text-grey text-90 order-first order-sm-last">
                                                                    {data?.employeeWorks?.reduce((acc, order) => acc + (order.hoursAdjustment || 0), 0) > data.billingCriteria.maxHoursPerMonth &&
                                                                    (<div className="row my-2">
                                                                        <div className="col-8 text-right">
                                                                            Adjusted Amount
                                                                        </div>
                                                                        <div className="col-4">
                                                                            <span className="text-120 text-secondary-d1">${parseFloat(data?.employeeWorks?.reduce((acc, order) => acc + (order.hoursAdjustment || 0), 0))?.toFixed(2) * parseFloat(data?.works?.reduce((acc, work) => acc + (work.hourlyRate || 0), 0)).toFixed()} - ${parseFloat(invoices?.reduce((acc, order) => acc + (order.totalAmount || 0), 0))?.toFixed(2)}</span>
                                                                        </div>
                                                                    </div>)}

                                                                    <div className="row my-2">
                                                                        <div className="col-8 text-right">
                                                                            Adjustments
                                                                        </div>
                                                                        <div className="col-4">
                                                                            <span className="text-110 text-secondary-d1">-${parseFloat(invoices?.reduce((acc, order) => acc + (order.adjustments || 0), 0))?.toFixed(2)}</span>
                                                                        </div>
                                                                    </div>

                                                                    <div className="row align-items-center bgc-primary-l3">
                                                                        <div className="col-8 text-right">
                                                                            Total Payable Amount
                                                                        </div>
                                                                        <div className="col-4">
                                                                            <span style={{fontSize:"35px"}} className="text-success font-bold">${parseFloat(invoices?.reduce((acc, order) => acc + (order.totalAmount || 0), 0))?.toFixed(2)}</span>
                                                                        </div>
                                                                    </div>
                                                                </div>
                                                            </div> */}

                                                            <hr />

                                                            <div className='text-center'>
                                                                <span className="text-secondary-d1 text-105">Thank you for your business</span>
                                                                {/* <a href="#" className="btn btn-info btn-bold px-4 float-right mt-3 mt-lg-0">Pay Now</a> */}
                                                            </div>
                                                            
                                                            <hr />
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
                                                employeeWorks: data?.employeeWorks,
                                                billingCriteria: data?.billingCriteria,
                                                address: data?.address,
                                                company: data?.company,
                                            });
                                            dispatch(getAllOrderByClient({id: data._id}))
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
                                                        <label>Company</label>
                                                        <input type="text" name="company" value={input.company} onChange={handleInputChange} className="form-control"/>
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

                                                <div className="col-12">
                                                    <div className="mb-3 d-flex justify-content-between align-items-center">
                                                        <label>Billing Criteria:</label>
                                                    </div>

                                                    <div className="form-row mb-3">
                                                        <div className="col-12 d-flex justify-content-between align-items-center position-relative">
                                                            <input
                                                                type="text"
                                                                name="maxHoursPerMonth"
                                                                value={input.billingCriteria.maxHoursPerMonth}
                                                                onChange={handleBolingCriteriaChange}
                                                                placeholder="Max hours per month"
                                                                className="form-control mb-2"
                                                                required
                                                            />
                                                            <input
                                                                type="text"
                                                                name="maxEmployees"
                                                                value={input.billingCriteria.maxEmployees}
                                                                onChange={handleBolingCriteriaChange}
                                                                placeholder="Max employees"
                                                                className="form-control mb-2 ml-2"
                                                                required
                                                            />
                                                        </div>
                                                    </div>
                                                </div>

                                                <div className="col-12">
                                                    <div className="mb-3 d-flex justify-content-between align-items-center">
                                                        <label>Employee Works:</label>
                                                        <button type="button" onClick={addEmployeeWork} className="btn btn-sm bg-info-light"><FaPlus /></button>
                                                    </div>
                                                    {input.employeeWorks.map((employeeWorks, index) => (
                                                        <div key={index} className="form-row mb-3">
                                                            <div className="col-12 d-flex justify-content-between align-items-center position-relative">
                                                                <select name="employee" value={employeeWorks.employee} onChange={(e) => handleEmployeeWorksChange(index, e)} className="form-control mb-2" required>
                                                                    {employees.map((employee, index) => (
                                                                        <option key={index} value={employee._id}>
                                                                            {employee.name}
                                                                        </option>
                                                                    ))}
                                                                </select>

                                                                <input
                                                                    type="text"
                                                                    name="hoursAdjustment"
                                                                    value={employeeWorks.hoursAdjustment}
                                                                    onChange={(e) => handleEmployeeWorksChange(index, e)}
                                                                    placeholder="Hours adjustment"
                                                                    className="form-control mb-2 ml-2"
                                                                    required
                                                                />

                                                                <button type="button" onClick={() => removeEmployeeWork(index)} className="btn btn-sm bg-danger-light mb-2 position-absolute" style={{right: "9px"}}><FaRegTrashCan /></button>
                                                            </div>

                                                        </div>
                                                    ))}
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
