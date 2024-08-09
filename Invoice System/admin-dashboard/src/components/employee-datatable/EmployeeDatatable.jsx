import React, { useEffect, useRef, useState } from 'react';
import { useDispatch, useSelector } from 'react-redux';
import { FaRegEdit, FaRegTrashAlt } from 'react-icons/fa';
import DataTable from 'datatables.net-dt';
import Swal from 'sweetalert2';
import moment from "moment";
import useInputControl from '../../hooks/useInputControl';
import Modal from '../modal/Modal';
import createToast from '../../utilities/createToast';
import { deleteEmployee, updateEmployee } from '../../app/features/admin/adminApiSlice';
import { setAdminMessageEmpty } from '../../app/features/admin/adminSlice';


const EmployeeDatatable = () => {

    const [modal, setModal] = useState(false);
	const { input, setInput, handleInputChange } = useInputControl({
		name: "",
		email: "",
		phone: "",
		address: ""
	});
    const [currentId, setCurrentId] = useState("");
	const dispatch = useDispatch();
    const { isLoading, error, message, employees } = useSelector((state) => state.admin);

    const handleEmployeeUpdate = (e, id) => {
        e.preventDefault();
        if(!input.name || !input.email){
			createToast("Please, fill out the form!", "warn");
		}else{
			dispatch(updateEmployee({ id, input }));
			resetForm();
			setModal(false);
		}
    }

    const handleEmployeeDelete = (id) => {
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
                dispatch(deleteEmployee(id));
            }
        })
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
        

        {employees ? (<table className="datatable table table-hover table-center mb-0">
                <thead>
                    <tr>
                        <th>Name</th>
                        <th>Email</th>
                        <th>Status</th>
                        <th>Created At</th>
                        <th>Actions</th>
                    </tr>
                </thead>
                <tbody>
                    {
                        [...employees]?.reverse().map((data, index) => 
                            <tr key={index}>
                                <td>
                                    <h2 className="table-avatar font-weight-bold">{data?.name}</h2>
                                </td>
                                <td>{data?.email}</td>
                                <td><span className={`btn btn-sm ${data?.status ? "bg-success-light" : "bg-danger-light"}`} >{data?.status ? "Active" : "Inactive"}</span></td>
                                <td>{moment(data?.createdAt).format('LLL')}</td>

                                <td>

                                    <button 
                                        onClick={() => {
                                            setInput({
                                                name: data.name, 
                                                email: data.email,
                                            });
                                            setCurrentId(data._id);
                                            setModal(true);
                                        }} className="btn btn-sm bg-info-light mr-2"
                                    >
                                            <FaRegEdit style={{fontSize: "15px", margin:"auto"}} />
                                    </button>

                                    {modal && data?._id === currentId &&  <Modal title={"Employee update"}  modalClose={setModal}>
                                        <form onSubmit={(e) => handleEmployeeUpdate(e, data?._id)}>
                                            <div className="row form-row">
						
                                                <div className="col-12">

                                                    <div className="form-group p-1">
                                                        <label>Employee Name:</label>
                                                        <input name="name" type="text" value={input.name} onChange={handleInputChange} className="form-control" required />
                                                    </div>

                                                    <div className="form-group p-1">
                                                        <label>Email:</label>
                                                        <input name="email" type="text" value={input.email} onChange={handleInputChange} className="form-control" />
                                                    </div>

                                                    <div className="form-group p-1">
                                                        <label>Phone:</label>
                                                        <input name="phone" type="text" value={input.phone} onChange={handleInputChange} className="form-control" />
                                                    </div>

                                                    <div className="form-group p-1">
                                                        <label>Address:</label>
                                                        <input name="address" type="text" value={input.address} onChange={handleInputChange} className="form-control" />
                                                    </div>

                                                </div>
                                                
                                            </div>
                                            <button type="submit" className="btn btn-primary btn-block">Update</button>
                                        </form>
                                    </Modal>}

                                    <button onClick={() => handleEmployeeDelete(data?._id)} className="btn btn-sm bg-danger-light"><FaRegTrashAlt style={{fontSize: "15px", margin:"auto"}} /></button>
                                </td>
                            </tr>
                        )
                    }
                </tbody>
            </table>) : (
                <h3 className="mt-6 mb-6 text-center py-5">Sorry, employee data not found!</h3>
            )}


        </div>
    )
}

export default EmployeeDatatable
