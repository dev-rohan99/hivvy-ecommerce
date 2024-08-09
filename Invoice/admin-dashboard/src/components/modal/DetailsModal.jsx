import React from 'react';


const DetailsModal = ({title, modalClose, children}) => {



    return (
        <>
        
            <div className="modal fade show d-block" id="Add_Specialities_details" style={{overflowY:"scroll"}} aria-modal="true">
				<div className="modal-dialog modal-dialog-centered detailsModal" role="document" >
					<div className="modal-content">
						<div className="modal-header">
							{title && <h5 className="modal-title">{title}</h5>}
							<button type="button" className="close" onClick={() => modalClose(false)}>
								<span>&times;</span>
							</button>
						</div>
						<div className="modal-body">

                            {children}
							
						</div>
					</div>
				</div>
			</div>
        
        </>
    )
}

export default DetailsModal;
