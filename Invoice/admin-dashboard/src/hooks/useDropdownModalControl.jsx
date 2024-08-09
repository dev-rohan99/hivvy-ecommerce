import { useEffect, useRef, useState } from "react";


const useDropdownModalControl = () => {

    const [isOpen, setIsOpen] = useState(false);
    const dropdownRef = useRef(null);

    const toggle = (e) => {
        e.preventDefault();
        setIsOpen(!isOpen);
    }

    const handleClickOutside = (e) => {
        if(dropdownRef.current && !dropdownRef.current.contains(e.target)){
            setIsOpen(false);
        }
    }

    useEffect(() => {
        document.addEventListener("click", handleClickOutside);
        return () => {
            document.removeEventListener("click", handleClickOutside);
        }
    }, []);

    return { isOpen, toggle, dropdownRef }
}

export default useDropdownModalControl;
