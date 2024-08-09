import { createSlice } from "@reduxjs/toolkit";
import { adminLogin, adminLogout, createNewClient, createNewEmployee, createNewOrder, deleteClient, deleteEmployee, deleteOrder, getAllClient, getAllEmployee, getAllOrder, getAllOrderByClient, getLoggedinAdmin, getSingleOrder, updateClient, updateEmployee, updateOrder } from "./adminApiSlice";


const adminReducer = createSlice({
    name: "admin",
    initialState: {
        admin: null,
        clients: null,
        employees: null,
        orders: null,
        invoice: null,
        invoices: null,
        error: null,
        message: null,
        isLoading: null
    },
    reducers: {
        setAdminMessageEmpty: (state) => {
            state.message = null;
            state.error = null;
        }
    },
    extraReducers: (builder) => {
        
        builder.addCase(adminLogin.pending, (state) => {
            state.isLoading = true;
        }).addCase(adminLogin.fulfilled, (state, action) => {
            state.isSuccess = true;
            state.isLoading = false;
            state.admin = action.payload.admin;
            localStorage.setItem("admin", JSON.stringify(action.payload.admin));
            state.message = action.payload.message;
        }).addCase(adminLogin.rejected, (state, action) => {
            state.isLoading = false;
            state.error = action.error.message;
            state.admin = null;
            localStorage.removeItem("admin");
        })
        
        .addCase(getLoggedinAdmin.pending, (state) => {
            state.isLoading = true;
        }).addCase(getLoggedinAdmin.fulfilled, (state, action) => {
            state.isSuccess = true;
            state.isLoading = false;
            state.admin = action.payload.admin;
        }).addCase(getLoggedinAdmin.rejected, (state, action) => {
            state.isLoading = false;
            state.error = action.error.message;
            state.admin = null;
            localStorage.removeItem("admin");
        })

        .addCase(adminLogout.pending, (state) => {
            state.isLoading = true;
        }).addCase(adminLogout.fulfilled, (state, action) => {
            state.isSuccess = true;
            state.isLoading = false;
            state.admin = null;
            state.message = action.payload.message;
            localStorage.removeItem("admin");
        }).addCase(adminLogout.rejected, (state, action) => {
            state.isLoading = false;
            state.error = action.error.message;
        })

        .addCase(createNewClient.pending, (state) => {
            state.isLoading = true;
        }).addCase(createNewClient.fulfilled, (state, action) => {
            state.isSuccess = true;
            state.isLoading = false;
            state.clients.push(action.payload.client);
        }).addCase(createNewClient.rejected, (state, action) => {
            state.isLoading = false;
            state.error = action.error.message;
        })
        
        .addCase(getAllClient.pending, (state) => {
            state.isLoading = true;
        }).addCase(getAllClient.fulfilled, (state, action) => {
            state.isSuccess = true;
            state.isLoading = false;
            state.clients = action.payload.clients;
        }).addCase(getAllClient.rejected, (state, action) => {
            state.isLoading = false;
            state.error = action.error.message;
        })

        .addCase(updateClient.pending, (state) => {
            state.isLoading = true;
        }).addCase(updateClient.fulfilled, (state, action) => {
            state.isSuccess = true;
            state.isLoading = false;
            state.clients[
                state.clients.findIndex(
                    (data) => data._id == action.payload.client._id
                )
            ] = action.payload.client;
        }).addCase(updateClient.rejected, (state, action) => {
            state.isLoading = false;
            state.error = action.error.message;
        })

        .addCase(deleteClient.pending, (state) => {
            state.isLoading = true;
        }).addCase(deleteClient.fulfilled, (state, action) => {
            state.isSuccess = true;
            state.isLoading = false;
            if (action.payload.client && action.payload.client._id) {
                state.clients = state.clients.filter((data) => data._id !== action.payload.client._id);
            } else {
                state.clients = state.clients.filter((data) => data._id !== action.payload.client._id);
            }
        }).addCase(deleteClient.rejected, (state, action) => {
            state.isLoading = false;
            state.error = action.error.message;
        })
        
        .addCase(createNewOrder.pending, (state) => {
            state.isLoading = true;
        }).addCase(createNewOrder.fulfilled, (state, action) => {
            state.isSuccess = true;
            state.isLoading = false;
            state.orders.push(action.payload.order);
        }).addCase(createNewOrder.rejected, (state, action) => {
            state.isLoading = false;
            state.error = action.error.message;
        })

        .addCase(getAllOrder.pending, (state) => {
            state.isLoading = true;
        }).addCase(getAllOrder.fulfilled, (state, action) => {
            state.isSuccess = true;
            state.isLoading = false;
            state.orders = action.payload.orders;
        }).addCase(getAllOrder.rejected, (state, action) => {
            state.isLoading = false;
            state.error = action.error.message;
        })

        .addCase(getSingleOrder.pending, (state) => {
            state.isLoading = true;
        }).addCase(getSingleOrder.fulfilled, (state, action) => {
            state.isSuccess = true;
            state.isLoading = false;
            state.invoice = action.payload.order;
        }).addCase(getSingleOrder.rejected, (state, action) => {
            state.isLoading = false;
            state.error = action.error.message;
        })

        .addCase(getAllOrderByClient.pending, (state) => {
            state.isLoading = true;
        }).addCase(getAllOrderByClient.fulfilled, (state, action) => {
            state.isSuccess = true;
            state.isLoading = false;
            state.invoices = action.payload.orders;
        }).addCase(getAllOrderByClient.rejected, (state, action) => {
            state.isLoading = false;
            state.error = action.error.message;
        })

        .addCase(updateOrder.pending, (state) => {
            state.isLoading = true;
        }).addCase(updateOrder.fulfilled, (state, action) => {
            state.isSuccess = true;
            state.isLoading = false;
            state.orders[
                state.orders.findIndex(
                    (data) => data._id == action.payload.order._id
                )
            ] = action.payload.order;
        }).addCase(updateOrder.rejected, (state, action) => {
            state.isLoading = false;
            state.error = action.error.message;
        })

        .addCase(deleteOrder.pending, (state) => {
            state.isLoading = true;
        }).addCase(deleteOrder.fulfilled, (state, action) => {
            state.isSuccess = true;
            state.isLoading = false;
            if (action.payload.order && action.payload.order._id) {
                state.orders = state.orders.filter((data) => data._id !== action.payload.order._id);
            } else {
                state.orders = state.orders.filter((data) => data._id !== action.payload.order._id);
            }
        }).addCase(deleteOrder.rejected, (state, action) => {
            state.isLoading = false;
            state.error = action.error.message;
        })

        .addCase(createNewEmployee.pending, (state) => {
            state.isLoading = true;
        }).addCase(createNewEmployee.fulfilled, (state, action) => {
            state.isSuccess = true;
            state.isLoading = false;
            state.employees.push(action.payload.employee);
        }).addCase(createNewEmployee.rejected, (state, action) => {
            state.isLoading = false;
            state.error = action.error.message;
        })
        
        .addCase(getAllEmployee.pending, (state) => {
            state.isLoading = true;
        }).addCase(getAllEmployee.fulfilled, (state, action) => {
            state.isSuccess = true;
            state.isLoading = false;
            state.employees = action.payload.employees;
        }).addCase(getAllEmployee.rejected, (state, action) => {
            state.isLoading = false;
            state.error = action.error.message;
        })
        
        .addCase(updateEmployee.pending, (state) => {
            state.isLoading = true;
        }).addCase(updateEmployee.fulfilled, (state, action) => {
            state.isSuccess = true;
            state.isLoading = false;
            state.employees[
                state.employees.findIndex(
                    (data) => data._id == action.payload.employee._id
                )
            ] = action.payload.employee;
        }).addCase(updateEmployee.rejected, (state, action) => {
            state.isLoading = false;
            state.error = action.error.message;
        })
        
        .addCase(deleteEmployee.pending, (state) => {
            state.isLoading = true;
        }).addCase(deleteEmployee.fulfilled, (state, action) => {
            state.isSuccess = true;
            state.isLoading = false;
            if (action.payload.employee && action.payload.employee._id) {
                state.employees = state.employees.filter((data) => data._id !== action.payload.employee._id);
            } else {
                state.employees = state.employees.filter((data) => data._id !== action.payload.employee._id);
            }
        }).addCase(deleteEmployee.rejected, (state, action) => {
            state.isLoading = false;
            state.error = action.error.message;
        })        

    }
});


// actions
export const { setAdminMessageEmpty } = adminReducer.actions;

export default adminReducer.reducer;
