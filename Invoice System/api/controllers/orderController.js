import mongoose from "mongoose";
import { clientModel, orderModel } from "../models/orderModel.js";
import createError from "../utility/createError.js";
import { genHashPassword } from "../utility/hash.js";
import moment from "moment";


/**
 * Client create
 * @param {*} req 
 * @route /api/v1/admin/add-new-client
 * @param {*} res 
 * @method POST
 */

export const addNewClient = async (req, res, next) => {

    try{

        // get form data
        const { name, email, password, phone, address, invoiceNumber } = req.body;

        // validation
        if( !name || !password || !email || !phone || !address ){
            next(createError(400, 'All fields are required!'));
        }

        const clientEmail = await clientModel.findOne({email : email});
        if( clientEmail ){
            return next(createError(400, 'This email already exists!'));
        }

        let invoiceNum;
        let orderFind;

        do{
            invoiceNum = Math.floor(Math.random() * 99999);
            orderFind = await orderModel.findOne({ invoiceNumber: invoiceNum });
        }while(orderFind)

        // create admin
        const client = await clientModel.create({
            ...req.body,
            invoiceNumber: invoiceNum,
            password: genHashPassword(password),
        });

        if (!client) {
            next(createError(404, 'Client not created! Please try again.'));
        }

        if(client){
            
            res.status(200).json({
                message : "Client data created!",
                client : client
            });

        }

    }catch(err){
        next(err);
    }

}

/**
 * All client
 * @param {*} req 
 * @route /api/v1/admin/all-client
 * @param {*} res 
 * @method POST
 */

export const getAllClient = async (req, res, next) => {

    try{

        const client = await clientModel.find();

        if (!client) {
            next(createError(404, 'Client data not Found! Please try again.'));
        }

        if(client){
            
            res.status(200).json({
                message : "Client data founded!",
                clients : client
            });

        }

    }catch(err){
        next(err);
    }

}

/**
 * Update client
 * @param {*} req 
 * @route /api/v1/admin/client
 * @param {*} res 
 * @method PATCH
 */

export const updateClient = async (req, res, next) => {

    try{

        const { id } = req.params;
        const { employeeWorks, billingCriteria } = req.body;

        const parsedEmployeeWorks = employeeWorks.map(work => {
            if (!work.employee || isNaN(parseFloat(work.hoursAdjustment))) {
                throw new Error('Invalid employee work data');
            }
            return {
                employee: work.employee,
                hoursAdjustment: parseFloat(work.hoursAdjustment)
            };
        });

        if (isNaN(parseFloat(billingCriteria.maxHoursPerMonth)) || isNaN(parseFloat(billingCriteria.maxEmployees))) {
            return next(createError(400, 'Invalid billing criteria'));
        }

        const parsedBillingCriteria = {
            maxHoursPerMonth: parseFloat(billingCriteria.maxHoursPerMonth),
            maxEmployees: parseFloat(billingCriteria.maxEmployees)
        };

        const client = await clientModel.findByIdAndUpdate(id, {
            ...req.body,
            employeeWorks: parsedEmployeeWorks,
            billingCriteria: parsedBillingCriteria
        }, { new: true });

        if (!client) {
            next(createError(404, 'Client data not Found! Please try again.'));
        }

        if(client){
            
            res.status(200).json({
                message: "Client data updated successfully!",
                client: client
            });

        }

    }catch(err){
        next(err);
    }

}

/**
 * Delete client
 * @param {*} req 
 * @route /api/v1/admin/all-order
 * @param {*} res 
 * @method DELETE
 */

export const deleteClient = async (req, res, next) => {

    try{

        const { id } = req.params;
        const client = await clientModel.findByIdAndDelete({ _id: id });

        if (!client) {
            next(createError(404, 'Client data not Found! Please try again.'));
        }

        if(client){
            
            res.status(200).json({
                message: "Client data deleted successfully!",
                client: client
            });

        }

    }catch(err){
        next(err);
    }

}

/**
 * Order create
 * @param {*} req 
 * @route /api/v1/admin/add-new-client
 * @param {*} res 
 * @method POST
 */

export const addNewOrder = async (req, res, next) => {

    try {
        // Get form data
        const { projectName, client, works, month, status, employeeWorks, adjustments, clientCompany, issueDate, freelancerName, freelancerCompany, freelancerCountry } = req.body;

        // Validation
        // if (!projectName || !month || !status || !freelancerCountry || !clientCompany || !freelancerName || !freelancerCompany) {
        //     return next(createError(400, 'All fields are required!'));
        // }

        if (!mongoose.Types.ObjectId.isValid(client)) {
            return next(createError(400, 'Invalid client ID'));
        }

        // Check if client exists
        const clientFind = await clientModel.findById(client);
        if (!clientFind) {
            return next(createError(404, 'Client not found!'));
        }
        const subTotalAmountCal = works.reduce((acc, work) => acc + (parseFloat(work.hours) * parseFloat(work.hourlyRate)), 0);
        const totalHoursCal = works.reduce((acc, work) => acc + parseFloat(work.hours), 0);
        const calculatedAdjustments = parseFloat(adjustments) || 0;
        const totalAmountCal = (parseFloat(subTotalAmountCal).toFixed(2) - calculatedAdjustments).toFixed(2);

        let invoiceNum;
        let orderFind;

        do{
            invoiceNum = Math.floor(Math.random() * 99999);
            orderFind = await orderModel.findOne({ invoiceNumber: invoiceNum });
        }while(orderFind)

        // works array with calculated amount
        const preparedWorks = works.map(work => ({
            ...work,
            amount: (work.hours * work.hourlyRate).toFixed(2)
        }))

        if(!orderFind){

            // Create order
            const order = await orderModel.create({
                ...req.body,
                projectName,
                clientCompany,
                client,
                works: preparedWorks,
                employeeWorks,
                status: status,
                issueDate: issueDate ? issueDate : new Date(),
                invoiceNumber: invoiceNum,
                subTotal: parseFloat(subTotalAmountCal).toFixed(2),
                totalAmount: parseFloat(totalAmountCal),
                totalHours: parseFloat(totalHoursCal).toFixed(2),
                finalTotalPayable: totalAmountCal,
                month
            });

            if (!order) {
                return next(createError(404, 'Order not created! Please try again.'));
            }

            res.status(200).json({
                message: 'Order successfully created!',
                order
            });

        }

    } catch (err) {
        next(err);
    }

}

/**
 * All order
 * @param {*} req 
 * @route /api/v1/admin/all-order
 * @param {*} res 
 * @method GET
 */

export const getAllOrder = async (req, res, next) => {

    try{

        const orders = await orderModel.find();

        if (!orders) {
            next(createError(404, 'Order data not Found! Please try again.'));
        }

        if(orders){
            
            res.status(200).json({
                message : "Order data founded!",
                orders : orders
            });

        }

    }catch(err){
        next(err);
    }

}

/**
 * Get single order
 * @param {*} req 
 * @route /api/v1/admin/all-order
 * @param {*} res 
 * @method GET
 */

export const getSingleOrder = async (req, res, next) => {

    try{

        const { id } = req.params;
        const order = await orderModel.findOne({ _id: id });

        if (!order) {
            next(createError(404, 'Order data not Found! Please try again.'));
        }

        if(order){
            
            res.status(200).json({
                message : "Order data founded!",
                order : order
            });

        }

    }catch(err){
        next(err);
    }

}

/**
 * All order
 * @param {*} req 
 * @route /api/v1/admin/all-order
 * @param {*} res 
 * @method GET
 */

export const getAllOrderByClient = async (req, res, next) => {

    try{

        const { id } = req.params;
        const { startDate, month } = req.query;

        let query = { client: id };

        if (startDate) {
            const startDateMoment = moment(startDate).startOf('day').toDate();
            const endDateMoment = moment().endOf('day').toDate();
            query = {
                ...query,
                createdAt: { $gte: startDateMoment, $lte: endDateMoment }
            };
        }

        if (month) {
            query = {
                ...query,
                month: month
            };
        }

        const orders = await orderModel.find(query);

        if (!orders || orders.length === 0) {
            next(createError(404, 'Order data not Found! Please try again.'));
        }

        if(orders){
            
            res.status(200).json({
                message : "Order data founded!",
                orders : orders
            });

        }

    }catch(err){
        next(err);
    }

}

/**
 * Update order
 * @param {*} req 
 * @route /api/v1/admin/client/order/:id
 * @param {*} res 
 * @method PATCH
 */

export const updateOrder = async (req, res, next) => {

    try{

        const { id } = req.params;
        const { projectName, client, works, month, status, employeeWorks, adjustments, clientCompany, freelancerName, freelancerCompany, freelancerCountry } = req.body;

        const subTotalAmountCal = works.reduce((acc, work) => acc + (parseFloat(work.hours) * parseFloat(work.hourlyRate)), 0);
        const totalHoursCal = works.reduce((acc, work) => parseFloat(acc) + parseFloat(work.hours), 0);
        const calculatedAdjustments = parseFloat(adjustments) || 0;
        const totalAmountCal = (parseFloat(subTotalAmountCal) - calculatedAdjustments).toFixed(2);

        const preparedWorks = works.map(work => ({
            ...work,
            amount: (work.hours * work.hourlyRate).toFixed(2)
        }))

        const order = await orderModel.findByIdAndUpdate(id, {
            ...req.body,
            works: preparedWorks,
            subTotal: parseFloat(subTotalAmountCal).toFixed(2),
            totalAmount: totalAmountCal,
            totalHours: parseFloat(totalHoursCal).toFixed(2),
            finalTotalPayable: totalAmountCal
        }, { new: true });

        if (!order) {
            next(createError(404, 'Order data not Found! Please try again.'));
        }

        if(order){
            
            res.status(200).json({
                message: "Order data updated successfully!",
                order: order
            });

        }

    }catch(err){
        next(err);
    }

}

/**
 * Delete order
 * @param {*} req 
 * @route /api/v1/admin/all-order
 * @param {*} res 
 * @method DELETE
 */

export const deleteOrder = async (req, res, next) => {

    try{

        const { id } = req.params;
        const order = await orderModel.findByIdAndDelete({ _id: id });

        if (!order) {
            next(createError(404, 'Order data not Found! Please try again.'));
        }

        if(order){
            
            res.status(200).json({
                message: "Order data deleted successfully!",
                order: order
            });

        }

    }catch(err){
        next(err);
    }

}

