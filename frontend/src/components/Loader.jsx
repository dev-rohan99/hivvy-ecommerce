import React from 'react'

const Loader = () => {


    return (
        <>
        
            <div className="h-[100%] flex justify-center items-center">
                <div className="w-[300px] h-[300px] rounded-lg overflow-hidden">
                    <img className="w-[100%] h-[100%] object-cover" src="../assets/images/loader2.gif" alt="loader" />
                </div>
            </div>
        
        </>
    )
}

export default Loader