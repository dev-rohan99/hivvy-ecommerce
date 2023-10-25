import React, { useEffect, useState } from 'react';
import { useParams } from 'react-router-dom';
import axios from "axios";
import { server } from '../../server.js';


const Activation = () => {

    const { token } = useParams();
    const [error, setError] = useState();

    useEffect(() => {
        if(token){
            const activationByEmail = async () => {
                try{

                    await axios.post(`${server}/user/activation`, {
                        token
                    }).then((res) => {
                        console.log(res.data.message);
                        setError(false);
                    }).catch((err) => {
                        setError(true);
                    })

                }catch(err){
                    setError(true);
                    console.log(err.response.data.message);
                }
            }
            activationByEmail();
        }
    }, []);


    return (
        <>
        
            <div
                style={{
                    width: "100%",
                    height: "100vh",
                    display: "flex",
                    justifyContent: "center",
                    alignItems: "center",
                }}
            >
                {error ? (
                    <p>Your token is expired!</p>
                ) : (
                    <p>Your account has been created suceessfully!</p>
                )}
            </div>
        
        </>
    )
}

export default Activation;
