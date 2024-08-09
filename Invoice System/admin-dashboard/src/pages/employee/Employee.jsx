import React, { useEffect, useState } from 'react';
import Modal from '../../components/modal/Modal';
import useInputControl from '../../hooks/useInputControl';
import { useDispatch, useSelector } from 'react-redux';
import { setAdminMessageEmpty } from '../../app/features/admin/adminSlice';
import { createNewEmployee } from '../../app/features/admin/adminApiSlice';
import createToast from '../../utilities/createToast';
import EmployeeDatatable from '../../components/employee-datatable/EmployeeDatatable';


const Employee = () => {

    const [modal, setModal] = useState(false);
	const { input, setInput, handleInputChange } = useInputControl({
		name: "",
		email: "",
	});
	const dispatch = useDispatch();
    const { isLoading, error, message } = useSelector((state) => state.admin);

    const handleEmployeeCreate = (e) => {
        e.preventDefault();
        if(!input.name || !input.email){
            createToast("Please, fill out the form!", "warn");
        }else{
            dispatch(createNewEmployee(input)).unwrap().then((response) => {
                createToast("Client created successfully!", "success");
                setInput({
                    name: "",
                    email: "",
                });
            }).catch((err) => {
                createToast(err.message, "error");
            });
        }
    }

    useEffect(() => {
        if(error){
            createToast(error, "warn");
            dispatch(setAdminMessageEmpty());
        }
        if(message){
            createToast(message, "success");
            dispatch(setAdminMessageEmpty());
        }
    }, [error, message, dispatch]);

    return (
        <div>
        

            <div className="page-wrapper">
                <div className="content container-fluid">
					
					<div className="page-header">
						<div className="row">
							<div className="col">
								<h3 className="page-title">Employee</h3>
								<ul className="breadcrumb">
									<li className="breadcrumb-item"><a href="index.html">Dashboard</a></li>
									<li className="breadcrumb-item active">Employee</li>
								</ul>
							</div>
						</div>
					</div>



                    <div className="row">
						<div className="col-sm-12">
								
						<button onClick={() => {
							setModal(true);
						}} className="btn btn-sm bg-primary-light mb-4">Add new employee</button>

							<div className="card">
								<div className="card-body">
									<div className="table-responsive">

                                        <EmployeeDatatable/>

									</div>
								</div>
							</div>
						</div>			
					</div>


                </div>
            </div>

            {modal && <Modal title={"Add new employee"} modalClose={setModal}>
				<form onSubmit={handleEmployeeCreate}>
					<div className="row form-row">

						<div className="col-12">
                            
							<div className="form-group">
								<label>Name</label>
								<input name="name" onChange={handleInputChange} value={input.name} type="text" className="form-control"/>
							</div>

							<div className="form-group">
								<label>Email</label>
								<input name="email" onChange={handleInputChange} value={input.email} type="text" className="form-control"/>
							</div>
							
						</div>
						
					</div>
					<button type="submit" className="btn btn-primary btn-block">{isLoading ? "Creating . . ." : "Create"}</button>
				</form>
			</Modal>}


        </div>
    )
}

export default Employee;
