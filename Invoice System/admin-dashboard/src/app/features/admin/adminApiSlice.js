import { createAsyncThunk } from "@reduxjs/toolkit";
import axios from "axios";
import serverUri from "../../../utilities/serverUri";
import Swal from "sweetalert2";



export const adminLogin = createAsyncThunk("admin/adminLogin", async (data) => {
    try{

        const response = await axios.post(`${serverUri}/admin/admin-login`, data, {
            withCredentials: true
        });
        return response.data;

    }catch(err){
        throw new Error(err.response.data.message);
    }
});

export const adminLogout = createAsyncThunk("admin/adminLogout", async () => {
    try{

        const response = await axios.post(`${serverUri}/admin/admin-logout`, "", {
            withCredentials: true
        });
        return response.data;

    }catch(err){
        throw new Error(err.response.data.message);
    }
});

export const getLoggedinAdmin = createAsyncThunk("admin/getLoggedinAdmin", async () => {
    try{

        const response = await axios.get(`${serverUri}/admin/me`, {
            withCredentials: true
        });
        return response.data;

    }catch(err){
        throw new Error(err.response.data.message);
    }
});

export const createNewClient = createAsyncThunk("admin/createNewClient", async (input) => {
    try {
        const response = await axios.post(`${serverUri}/admin/add-new-client`, input, {
            withCredentials: true
        });
        return response.data;
    } catch (err) {
        throw new Error(err.response.data.message);
    }
});

export const getAllClient = createAsyncThunk("admin/getAllClient", async () => {
    try{

        const response = await axios.get(`${serverUri}/admin/all-client`, {
            withCredentials: true
        });
        return response.data;

    }catch(err){
        throw new Error(err.response.data.message);
    }
});

export const updateClientStatus = createAsyncThunk("admin/updateClientStatus", async () => {
    try{

        const response = await axios.post(`${serverUri}/admin/all-client`, {
            withCredentials: true
        });
        return response.data;

    }catch(err){
        throw new Error(err.response.data.message);
    }
});

export const updateClient = createAsyncThunk("admin/updateClient", async ({id, input}) => {
    try{

        const response = await axios.patch(`${serverUri}/admin/clients/${id}`, input, {
            withCredentials: true
        });

        if (response.data) {
            Swal.fire({
                title: "Updated!",
                text: "Your file has been updated.",
                icon: "success"
            });
        }

        return response.data;

    }catch(err){
        throw new Error(err.response.data.message);
    }
});

export const deleteClient = createAsyncThunk("admin/deleteClient", async (id) => {
    try{

        const response = await axios.delete(`${serverUri}/admin/clients/${id}`, {
            withCredentials: true
        });

        if (response.data) {
            Swal.fire({
                title: "Deleted!",
                text: "Your file has been deleted.",
                icon: "success"
            });
        }

        return response.data;

    }catch(err){
        throw new Error(err.response.data.message);
    }
});

export const createNewOrder = createAsyncThunk("admin/createNewOrder", async (input) => {
    try{

        const response = await axios.post(`${serverUri}/admin/client/add-new-order`, input, {
            withCredentials: true
        });
        return response.data;

    }catch(err){
        throw new Error(err.response.data.message);
    }
});

export const getAllOrder = createAsyncThunk("admin/getAllOrder", async () => {
    try{

        const response = await axios.get(`${serverUri}/admin/client/all-order`, {
            withCredentials: true
        });
        return response.data;

    }catch(err){
        throw new Error(err.response.data.message);
    }
});

export const getSingleOrder = createAsyncThunk("admin/getSingleOrder", async (id) => {
    try{

        const response = await axios.get(`${serverUri}/admin/client/orders/${id}`, {
            withCredentials: true
        });
        return response.data;

    }catch(err){
        throw new Error(err.response.data.message);
    }
});

export const getAllOrderByClient = createAsyncThunk("admin/getAllOrderByClient", async ({id, startDate, month}) => {
    try{

        const response = await axios.get(`${serverUri}/admin/client/all-orders/${id}`, {
            params: { startDate, month },
            withCredentials: true
        });
        return response.data;

    }catch(err){
        throw new Error(err.response.data.message);
    }
});

export const updateOrder = createAsyncThunk("admin/updateOrder", async ({id, input}) => {
    try{

        const response = await axios.patch(`${serverUri}/admin/client/orders/${id}`, input, {
            withCredentials: true
        });

        if (response.data) {
            Swal.fire({
                title: "Updated!",
                text: "Your file has been updated.",
                icon: "success"
            });
        }

        return response.data;

    }catch(err){
        throw new Error(err.response.data.message);
    }
});

export const deleteOrder = createAsyncThunk("admin/deleteOrder", async (id) => {
    try{

        const response = await axios.delete(`${serverUri}/admin/client/orders/${id}`, {
            withCredentials: true
        });

        if (response.data) {
            Swal.fire({
                title: "Deleted!",
                text: "Your file has been deleted.",
                icon: "success"
            });
        }

        return response.data;

    }catch(err){
        throw new Error(err.response.data.message);
    }
});





export const createNewEmployee = createAsyncThunk("admin/createNewEmployee", async (input) => {
    try {
        const response = await axios.post(`${serverUri}/admin/add-new-employee`, input, {
            withCredentials: true
        });
        return response.data;
    } catch (err) {
        throw new Error(err.response.data.message);
    }
});

export const getAllEmployee = createAsyncThunk("admin/getAllEmployee", async () => {
    try{

        const response = await axios.get(`${serverUri}/admin/all-employee`, {
            withCredentials: true
        });
        return response.data;

    }catch(err){
        throw new Error(err.response.data.message);
    }
});

export const updateEmployee = createAsyncThunk("admin/updateEmployee", async ({id, input}) => {
    try{

        const response = await axios.patch(`${serverUri}/admin/employees/${id}`, input, {
            withCredentials: true
        });

        if (response.data) {
            Swal.fire({
                title: "Updated!",
                text: "Your file has been updated.",
                icon: "success"
            });
        }

        return response.data;

    }catch(err){
        throw new Error(err.response.data.message);
    }
});

export const deleteEmployee = createAsyncThunk("admin/deleteEmployee", async (id) => {
    try{

        const response = await axios.delete(`${serverUri}/admin/employees/${id}`, {
            withCredentials: true
        });

        if (response.data) {
            Swal.fire({
                title: "Deleted!",
                text: "Your file has been deleted.",
                icon: "success"
            });
        }

        return response.data;

    }catch(err){
        throw new Error(err.response.data.message);
    }
});

