import React from 'react'
import './input.css'
interface CustomInputProps {
    icon?: React.ReactNode;
    type: string;
    placeholder?: string;
    value: string;
    onChange: (event: React.ChangeEvent<HTMLInputElement>) => void;
    name?: string;
}

const CustomInput: React.FC<CustomInputProps> = ({ icon, type, placeholder, value, onChange, name }) => {
    return (
        <>
            <div className="input_wrapp">
                <div className='input_container'>
                    {icon &&
                        <div className="input_icon">
                            {icon}
                        </div>
                    }

                    <input
                        type={type}
                        placeholder={placeholder}
                        value={value}
                        onChange={onChange}
                        name={name}
                    />

                </div>
            </div>
        </>
    )
}


export default CustomInput 