import mongoose from "mongoose";
import { employeeForDBModel, orderModel } from "../models/orderModel.js";
import createError from "../utility/createError.js";
import moment from "moment";


/**
 * Employee create
 * @param {*} req 
 * @route /api/v1/admin/add-new-employee
 * @param {*} res 
 * @method POST
 */

export const addNewEmployee = async (req, res, next) => {

    try{

        // get form data
        const { name, email } = req.body;

        // validation
        if( !name || !email ){
            next(createError(400, 'All fields are required!'));
        }

        const employeeEmail = await employeeForDBModel.findOne({email : email});
        if( employeeEmail ){
            return next(createError(400, 'This email already exists!'));
        }

        // create admin
        const employee = await employeeForDBModel.create({
            ...req.body,
        });

        if (!employee) {
            next(createError(404, 'Employee not created! Please try again.'));
        }

        if(employee){
            
            res.status(200).json({
                message : "Employee data created!",
                employee : employee
            });

        }

    }catch(err){
        next(err);
    }

}


/**
 * All employee
 * @param {*} req 
 * @route /api/v1/admin/all-employee
 * @param {*} res 
 * @method POST
 */

export const getAllEmployee = async (req, res, next) => {

    try{

        const employee = await employeeForDBModel.find();

        if (!employee) {
            next(createError(404, 'Employee data not Found! Please try again.'));
        }

        if(employee){
            
            res.status(200).json({
                message : "Employee data founded!",
                employees : employee
            });

        }

    }catch(err){
        next(err);
    }

}

/**
 * Update employee
 * @param {*} req 
 * @route /api/v1/admin/employee
 * @param {*} res 
 * @method PATCH
 */

export const updateEmployee = async (req, res, next) => {

    try{

        const { id } = req.params;

        const employee = await employeeForDBModel.findByIdAndUpdate(id, {
            ...req.body,
        }, { new: true });

        if (!employee) {
            next(createError(404, 'Employee data not Found! Please try again.'));
        }

        if(employee){
            
            res.status(200).json({
                message: "Employee data updated successfully!",
                employee: employee
            });

        }

    }catch(err){
        next(err);
    }

}

/**
 * Delete employee
 * @param {*} req 
 * @route /api/v1/admin/all-order
 * @param {*} res 
 * @method DELETE
 */

export const deleteEmployee = async (req, res, next) => {

    try{

        const { id } = req.params;
        const employee = await employeeForDBModel.findByIdAndDelete({ _id: id });

        if (!employee) {
            next(createError(404, 'Employee data not Found! Please try again.'));
        }

        if(employee){
            
            res.status(200).json({
                message: "Employee data deleted successfully!",
                employee: employee
            });

        }

    }catch(err){
        next(err);
    }

}


