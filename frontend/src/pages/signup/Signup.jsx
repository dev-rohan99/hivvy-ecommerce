import React, { useState } from 'react';
import { Link } from 'react-router-dom';
import { FaUserCircle } from "react-icons/fa";
import { AiOutlineEye, AiOutlineEyeInvisible } from "react-icons/ai";
import createToast from '../../utilities/toast.js';
import { useUserSignupMutation } from '../../redux/api/apiSlice.js';
import { useDispatch } from 'react-redux';
import { userSignupFailed, userSignupRequest, userSignupSuccess } from '../../redux/slices/authSlice.js';


const Signup = () => {

    const [input, setInput] = useState({
        name : "",
        email : "",
        password : "",
        avatar : null
    });
    const [visible, setVisible] = useState(false);

    const [ userSignup ] = useUserSignupMutation();
    const dispatch = useDispatch();

    const handleFileInputChange = (e) => {
        const reader = new FileReader();
        reader.onload = () => {
            if(reader.readyState == 2){
                setInput({
                    ...input,
                    avatar: reader.result
                });
            }
        };
        reader.readAsDataURL(e.target.files[0]);
        
        // if(e.target.files){
        //     const img = URL.createObjectURL(e.target.files[0]);
        //     setInput({
        //         ...input,
        //         avatar: img
        //     });
        // }
    }

    const handleInputChange = (e) => {
        setInput((prevState) => ({
            ...prevState,
            [e.target.name] : e.target.value
        }));
    }

    const handleSignupFormSubmit = async (e) => {
        e.preventDefault();
        try{

            dispatch(userSignupRequest());
            await userSignup(input).unwrap().then((res) => {
                
                dispatch(userSignupSuccess(res.message));
                createToast(res.data.message, "success");

            }).catch((err) => {
                console.log(err);
                dispatch(userSignupFailed(err.data.message));
                createToast(err.data.message, "error");
            });
            

        }catch(err){
            console.log(err);
            createToast(err.data.message, "error");
            dispatch(userSignupFailed(err.data.message));
        }
    }

    return (
        <>
            
            <div className="py-[100px] flex items-center justify-center flex-col">

                <div className="w-[600px] mx-auto p-6 bg-[#fff] rounded-md shadow-xl mb-4">
                    <h1 className="text-[#161616] text-center text-[30px] font-bold mb-7 uppercase">Sign Up Now</h1>

                    <form onSubmit={handleSignupFormSubmit} className="w-[100%]">
                        <div className="">
                            <div className="mb-4">
                                <label className="text-[14px] font-semibold text-lightGray cursor-pointer" htmlFor="fullName">Enter your full name<span className="text-[#d40707] text-[17px] mb-1">*</span></label>
                                <input name="name" value={input.name} onChange={handleInputChange} id="fullName" type="text" className="inputField" placeholder="Please enter your phone or email" required/>
                            </div>

                            <div className="mb-4">
                                <label className="text-[14px] font-semibold text-lightGray cursor-pointer" htmlFor="email">Enter your email address<span className="text-[#d40707] text-[17px] mb-1">*</span></label>
                                <input name="email" value={input.email} onChange={handleInputChange} id="email" type="email" className="inputField" placeholder="Enter your email address" required/>
                            </div>

                            <div className="relative">
                                <label className="text-[14px] font-semibold text-lightGray cursor-pointer" htmlFor="password">Enter your password<span className="text-[#d40707] text-[17px] mb-1">*</span></label>
                                <input name="password" value={input.password} onChange={handleInputChange} id="password" type={visible ? "text" : "password"} className="inputField" placeholder="Please enter your password" required/>
                                <span onClick={() => setVisible(!visible)} className="absolute right-4 bottom-3 cursor-pointer">
                                    {visible ? <AiOutlineEye className="text-2xl" /> : <AiOutlineEyeInvisible className="text-2xl" />}
                                </span>
                            </div>

                            <div className="mt-4">
                                <div className="flex justify-start items-center">
                                    {input.avatar ? <img className="avatarImgPrev" src={input.avatar} alt=""/> : <FaUserCircle className="w-[40px] h-[40px] rounded-full" />}
                                    
                                    <label className="avatarBtn" htmlFor="avatarInput">
                                        <span>Upload a file<span className="text-[#d40707] text-[17px] mb-1">*</span></span>
                                        <input name='avatar' onChange={handleFileInputChange} accept=".jpg,.png,.jpeg" id="avatarInput" type="file" hidden required/>
                                    </label>
                                </div>
                            </div>

                            <div className="flex justify-start w-[100%] mb-3 mt-3">
                                <div className="flex justify-start items-center">
                                    <span className="text-[gray] font-semibold">Have a account? -</span>
                                    <Link to="/login" className="linkBtn ml-3">Login</Link>
                                </div>
                            </div>

                            <button type='submit' className="outline-none p-[10px] w-[100%] rounded-lg border-[2px] border-primary bg-[#009FE3] hover:bg-[#3fcaf0] text-[17px] font-semibold text-[#fff] bg-primary mb-3">SIGNUP</button>

                        </div>
                    </form>

                </div>
            </div>
            
        </>
    )
}

export default Signup;
