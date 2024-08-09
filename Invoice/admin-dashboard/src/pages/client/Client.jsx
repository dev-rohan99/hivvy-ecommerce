import React, { useEffect, useState } from 'react';
import ClientDatatable from '../../components/client-datatable/ClientDatatable';
import Modal from '../../components/modal/Modal';
import useInputControl from '../../hooks/useInputControl';
import { useDispatch, useSelector } from 'react-redux';
import { setAdminMessageEmpty } from '../../app/features/admin/adminSlice';
import { createNewClient } from '../../app/features/admin/adminApiSlice';
import createToast from '../../utilities/createToast';


const Client = () => {

    const [modal, setModal] = useState(false);
	const { input, setInput, handleInputChange } = useInputControl({
		name: "",
		password: "",
		email: "",
		phone: "",
		address: "",
	});
	const dispatch = useDispatch();
    const { isLoading, error, message } = useSelector((state) => state.admin);

    const handleClientCreate = (e) => {
        e.preventDefault();
        if(!input.name || !input.email || !input.password || !input.phone || !input.address){
            createToast("Please, fill out the form!", "warn");
        }else{
            dispatch(createNewClient(input)).unwrap().then((response) => {
                createToast("Client created successfully!", "success");
                setInput({
                    name: "",
                    password: "",
                    email: "",
                    phone: "",
                    address: "",
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
								<h3 className="page-title">Client</h3>
								<ul className="breadcrumb">
									<li className="breadcrumb-item"><a href="index.html">Dashboard</a></li>
									<li className="breadcrumb-item active">Client</li>
								</ul>
							</div>
						</div>
					</div>



                    <div className="row">
						<div className="col-sm-12">
								
						<button onClick={() => {
							setModal(true);
						}} className="btn btn-sm bg-primary-light mb-4">Add new client</button>

							<div className="card">
								<div className="card-body">
									<div className="table-responsive">

                                        <ClientDatatable/>

									</div>
								</div>
							</div>
						</div>			
					</div>


                </div>
            </div>

            {modal && <Modal title={"Add new client"} modalClose={setModal}>
				<form onSubmit={handleClientCreate}>
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

							<div className="form-group">
								<label>Password</label>
								<input name="password" onChange={handleInputChange} value={input.password} type="password" className="form-control"/>
							</div>

							<div className="form-group">
								<label>Phone</label>
								<input name="phone" onChange={handleInputChange} value={input.phone} type="number" className="form-control"/>
							</div>

							<div className="form-group">
								<label>Address</label>
								<input name="address" onChange={handleInputChange} value={input.address} type="text" className="form-control"/>
							</div>
							
						</div>
						
					</div>
					<button type="submit" className="btn btn-primary btn-block">{isLoading ? "Creating . . ." : "Create"}</button>
				</form>
			</Modal>}


        </div>
    )
}

export default Client
