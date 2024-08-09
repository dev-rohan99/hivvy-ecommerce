import React, { useState, useEffect } from 'react';
import OrderDatatable from '../../components/order-datatable/OrderDatatable';

const Invoice = () => {
    

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

        </div>
    );
};

export default Invoice;


