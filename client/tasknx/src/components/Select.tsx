import React, { useState } from 'react'
import { ChevronDownIcon, ChevronUpIcon } from "@heroicons/react/24/solid"

interface SelectProps {
    options: string[],
    value?: string,
    isDisabled: boolean,
    getValue: (value:string) => void
}

const Select: React.FC<SelectProps> = ({ options, value, isDisabled, getValue }) => {

    const [isSelectOpen, setisSelectOpen] = useState(false)
    const [option, setOption] = useState(value)

    const handleClick = (value: string): void => {
        setOption(value)
        getValue(value)
        setisSelectOpen(!isSelectOpen)
    }

    const toggleSelect = (): void => {
        if (!isDisabled) {
            return
        }
        setisSelectOpen(!isSelectOpen)
    }

    return (
        <div className="flex flex-col relative">
            <div onClick={toggleSelect} className='cursor-pointer flex items-center bg-zinc-950 rounded pr-2'>
                <input value={option} type="text" className=" cursor-pointer outline-none h-12 w-28 pl-2 bg-transparent" readOnly />
                {
                    isSelectOpen
                        ?
                        <ChevronUpIcon className='h-3 w-3 text-white' />
                        :
                        <ChevronDownIcon className='h-3 w-3 text-white' />
                }
            </div>
            <div className={isSelectOpen ? "absolute translate-y-14" : "hidden absolute translate-y-14"}>
                <ul className="border-2 border-gray-400 rounded w-28 p-2 bg-zinc-950">
                    {
                        options.map((option, idx) => <li key={idx} onClick={() => handleClick(option)} className=" cursor-pointer hover:bg-blue-700 px-1 ">{option}</li>)
                    }
                </ul>
            </div>
        </div>
    )
}

export default Select