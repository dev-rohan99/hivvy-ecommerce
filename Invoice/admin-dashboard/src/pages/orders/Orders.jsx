import React, { useState, useEffect } from 'react';
import OrderDatatable from '../../components/order-datatable/OrderDatatable';
import Modal from '../../components/modal/Modal';
import createToast from '../../utilities/createToast';
import { useDispatch, useSelector } from 'react-redux';
import { FaPlus } from "react-icons/fa";
import { FaRegTrashCan } from "react-icons/fa6";
import { createNewOrder } from '../../app/features/admin/adminApiSlice';
import useInputControl from '../../hooks/useInputControl';


const Orders = () => {

    const [modal, setModal] = useState(false);
	const { input, setInput, handleInputChange, resetForm } = useInputControl({
		client: "",
		works: [{ description: '', hours: null, hourlyRate: null }],
		employeeWorks: [{ name: '', hoursBreakdown: null, hoursAdjustment: null }],
		status: 'Unpaid',
		projectName: "",
		clientCompany: "",
		month: "",
		freelancerName: "Mirza Ovinoor",
		freelancerCompany: "CFS - Code For Site",
		freelancerCountry: "Bangladesh",
		adjustments: ""
	});

    const { isLoading, clients, employees } = useSelector((state) => state.admin);
	const dispatch = useDispatch();

    const handleWorkChange = (index, event) => {
		const { name, value } = event.target;
		const newWorks = input.works.map((work, i) => {
			if (i !== index) return work;
			return { ...work, [name]: value };
		});
		setInput({ ...input, works: newWorks });
	};
	
	const addWork = () => {
		const lastWork = input.works[input.works.length - 1] || {};
    
		setInput({
			...input,
			works: [
				...input.works,
				{
					description: '',
					hours: lastWork.hours || null,
					hourlyRate: lastWork.hourlyRate || null
				}
			].reverse()
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

	const handleOrderSubmit = async (e) => {
        e.preventDefault();
        if(!input.client || !input.projectName || input.works.length === 0 || !input.employeeWorks.length === 0 || !input.status || !input.month || !input.freelancerName || !input.freelancerCompany || !input.freelancerCountry){
            createToast("Please, fill out the form!", "warn");
        }else{
			dispatch(createNewOrder({
				...input,
				client: input.client
			})).unwrap().then((response) => {
                createToast("Client created successfully!", "success");
                setInput({
                    client: "",
					works: [{ description: '', hours: null, hourlyRate: null }],
					employeeWorks: [{ name: '', hoursBreakdown: null, hoursAdjustment: null }],
					status: 'Unpaid',
					projectName: "",
					clientCompany: "",
					month: "",
					freelancerName: "Mirza Ovi",
					freelancerCompany: "CFS - Code For Site",
					freelancerCountry: "Bangladesh",
					adjustments: ""
                });
				setModal(false);
            }).catch((err) => {
                createToast(err.message, "error");
            });
        }
    };

    
    return (
        <div>
        

            <div className="page-wrapper">
                <div className="content container-fluid">
					
					<div className="page-header">
						<div className="row">
							<div className="col">
								<h3 className="page-title">Orders</h3>
								<ul className="breadcrumb">
									<li className="breadcrumb-item"><a href="index.html">Dashboard</a></li>
									<li className="breadcrumb-item active">Orders</li>
								</ul>
							</div>
						</div>
					</div>



                    <div className="row">
						<div className="col-sm-12">
								
							<button onClick={() => setModal(true)} className="btn btn-sm bg-primary-light mb-4">Create new order</button>

							<div className="card">
								<div className="card-body">
									<div className="table-responsive">

                                        <OrderDatatable/>

									</div>
								</div>
							</div>
						</div>			
					</div>


                </div>
            </div>

			{modal && <Modal title={"Add new order"} modalClose={setModal}>
				<form onSubmit={handleOrderSubmit}>
					<div className="row form-row">
						
						<div className="col-12">

							<div className="form-group p-1">
								<label>Client Company Name:</label>
								<input name="projectName" type="text" value={input.projectName} onChange={handleInputChange} className="form-control" required />
							</div>

							<div className="form-group p-1">
								<label>Client Company URL:</label>
								<input name="clientCompany" type="text" value={input.clientCompany} onChange={handleInputChange} className="form-control" />
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
											<input name="month" type="month" value={input.month} onChange={handleInputChange} className="form-control" required />
										</div>
									</div>

									<div className="col-6">
										<div className="">
											<label>Adjustments (optional):</label>
											<input name="adjustments" type="text" value={input.adjustments} onChange={handleInputChange} className="form-control" />
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
												type="text"
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
												type="text"
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
											<select name="name" value={employeeWorks.name} onChange={(e) => handleEmployeeWorksChange(index, e)} className="form-control mb-2" required>
												<option value="">Select a employee</option>
												{employees.map((employee, index) => (
													<option key={index} value={employee._id}>
														{employee.name}
													</option>
												))}
											</select>

											<input
												type="text"
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
												type="text"
												name="hoursAdjustment"
												value={employeeWorks.hoursAdjustment}
												onChange={(e) => handleEmployeeWorksChange(index, e)}
												placeholder="Hours adjustment (Optional)"
												className="form-control mb-2"
											/>
											
											<button type="button" onClick={() => removeEmployeeWork(index)} className="btn btn-sm bg-danger-light mb-2 position-absolute" style={{right: "9px"}}><FaRegTrashCan /></button>
										</div>
									</div>
								))}
							</div>

						</div>

					</div>
					<button type="submit" className="btn btn-primary btn-block">
						{isLoading ? "Creating . . ." : "Create Order"}
					</button>
				</form>
			</Modal>}

        </div>
    )
}

export default Orders;
