import { useState } from "react";


const useInputControl = (initialState) => {

    const [input, setInput] = useState(initialState);

    const handleInputChange = (event) => {
        setInput((prevState) => ({
            ...prevState,
            [event.target.name] : event.target.value
        }));
    }

    const resetForm = () => {
        setInput(initialState);
    }

    return { input, setInput, handleInputChange, resetForm };
}

export default useInputControl;
