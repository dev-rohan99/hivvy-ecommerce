import React, { useState } from 'react'
import { Link } from 'react-router-dom';
import { FcGoogle } from "react-icons/fc";
import { FaFacebookSquare } from "react-icons/fa";
import { AiOutlineEye, AiOutlineEyeInvisible } from "react-icons/ai";


const Login = () => {

    const [input, setInput] = useState({
        phoneOrEmail : "",
        password : "",
    });
    const [visible, setVisible] = useState(false);

    const handleInputChange = (e) => {
        setInput((prevState) => ({
            ...prevState,
            [e.target.name] : e.target.value
        }));
    }

    const handleLoginFormSubmit = () => {



    }


    return (
        <>
        
            <div className="py-[100px] flex items-center justify-center flex-col">

                <div className="w-[600px] mx-auto p-6 bg-[#fff] rounded-md shadow-xl mb-4">
                    <h1 className="text-[#161616] text-center text-[30px] font-bold mb-7 uppercase">Login to your account</h1>

                    <form onSubmit={handleLoginFormSubmit} className="w-[100%]">
                        <div className="">
                            <div className="mb-4">
                                <label className="text-[14px] font-semibold text-lightGray cursor-pointer" htmlFor="phoneOrEmail">Enter your phone or email<span className="text-[#d40707] text-[17px] mb-1">*</span></label>
                                <input name="phoneOrEmail" value={input.phoneOrEmail} onChange={handleInputChange} id="phoneOrEmail" type="text" className="inputField" placeholder="Please enter your phone or email"/>
                            </div>

                            <div className="relative">
                                <label className="text-[14px] font-semibold text-lightGray cursor-pointer" htmlFor="password">Password<span className="text-[#d40707] text-[17px] mb-1">*</span></label>
                                <input name="password" value={input.password} onChange={handleInputChange} id="password" type={visible ? "text" : "password"} className="inputField" placeholder="Please enter your password"/>
                                <span onClick={() => setVisible(!visible)} className="absolute right-4 bottom-3 cursor-pointer">
                                    {visible ? <AiOutlineEye className="text-2xl" /> : <AiOutlineEyeInvisible className="text-2xl" />}
                                </span>
                            </div>

                            <div className="flex justify-between w-[100%] mb-3 mt-3">
                                <Link to="/forgot-password" className="linkBtn">Forgot password</Link>

                                <div className="flex justify-end items-center">
                                    <span className="text-[gray] font-semibold">Don{`'`}t have a account? -</span>
                                    <Link to="/signup" className="linkBtn ml-3">Sign Up</Link>
                                </div>
                            </div>

                            <button type='submit' className="outline-none p-[10px] w-[100%] rounded-lg border-[2px] border-primary bg-[#009FE3] hover:bg-[#3fcaf0] text-[17px] font-semibold text-[#fff] bg-primary mb-3">LOGIN</button>

                            <h6 className="text-[14px] text-center text-[gray] font-semibold mb-2">OR LOGIN WITH</h6>

                            <button className="flex items-center justify-center bg-white border border-gray-300 rounded-lg shadow-md p-[10px] text-lg font-bold text-gray-800 hover:bg-gray-200 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-gray-500 mb-3 w-[100%] uppercase">
                                <FcGoogle className="text-xl mr-3"/>
                                <span>Continue with Google</span>
                            </button>

                            <button type="button" className="p-[10px] w-[100%] flex justify-center items-center bg-blue-600 hover:bg-blue-700 text-lg focus:ring-blue-500 focus:ring-offset-blue-200 text-white transition ease-in duration-200 text-center font-semibold shadow-md focus:outline-none focus:ring-2 focus:ring-offset-2 rounded-lg uppercase">
                                <FaFacebookSquare className="text-xl mr-3 text-white"/>
                                <span>Sign in with Facebook</span>
                            </button>

                        </div>
                    </form>

                </div>
            </div>
        
        </>
    )
}

export default Login;
