import React, { useRef, useState } from 'react'
import Select from "./Select"
import { useAppDispatch, useAppSelector } from '../app/hooks';
import { Task, addTask, selectTask } from '../features/task/taskSlice';
import { nanoid } from '@reduxjs/toolkit';
import TaskItem from './TaskItem';
import { uploadFile } from '../firebase/firebase';
import { ArrowPathIcon } from '@heroicons/react/24/solid';


const statuses = ["Todo", "Pending", "Completed"];

interface Props {
    filter: string
}

const TaskComp: React.FC<Props> = ({ filter }) => {

    const fileChooserRef = useRef<HTMLInputElement>(null);

    const [file, setFile] = useState<File | undefined>(undefined);
    const [url, setUrl] = useState<string | undefined>("")
    const [title, setTitle] = useState("");
    const [description, setDescription] = useState("");
    const [isUploading, setIsUploading] = useState(false);

    const taskList = useAppSelector(selectTask);
    const dispatch = useAppDispatch();


    const handleFileUpload = () => {
        if (fileChooserRef.current) {
            fileChooserRef.current.accept = "*";
            fileChooserRef.current.onchange = async (e: any) => {
                const fileList: FileList | null = (e.target as HTMLInputElement).files;
                if (fileList && fileList.length) {
                    setIsUploading(true);
                    const result = await uploadFile(fileList[0]);
                    setIsUploading(false);
                    if (result) {
                        setUrl(result);
                    }
                    setFile(fileList[0]);
                }
            };
            fileChooserRef.current.click();
        }
    };
    
    const handleAddTask = (): void => {

        let task: Task = {
            id: nanoid(),
            title: title,
            file: {
                url: url,
                name: file == undefined ? "" : file.name
            },
            description: description,
            status: statuses[0],
        }

        dispatch(addTask(task))

        setTitle("")
        setDescription("")
        setFile(undefined)
    }

    const getFilterList = (): Task[] => {
        switch (filter) {
            case 'Todo':
                return taskList.filter((t) => t.status === 'Todo')
            case 'Completed':
                return taskList.filter((t) => t.status === 'Completed')
            case 'Pending':
                return taskList.filter((t) => t.status === 'Pending')
            default:
                return taskList
        }
    }

    const getValue = (value: string) => value

    return (
        <div className="flex gap-5 flex-wrap pb-12">
            <div className=" bg-zinc-950 border-t-4 border-gray-400 h-80 w-80 rounded-md p-5 flex flex-col justify-between">
                <input onChange={(e) => setTitle(e.target.value)} value={title} type="text" placeholder="Title" className="bg-transparent outline-none text-2xl" />
                <textarea onChange={(e) => setDescription(e.target.value)} value={description} placeholder="Description..." className=" bg-transparent outline-none" rows={3} />
                <input ref={fileChooserRef} type="file" hidden />
                {
                    isUploading
                        ?
                        <button onClick={handleFileUpload} className="bg-zinc-900 border-2 border-zinc-600 border-dashed h-8 w-full rounded px-3 text-center">{<ArrowPathIcon className="animate-spin h-5 w-5" />}</button>
                        :
                        <button onClick={handleFileUpload} className="bg-zinc-900 border-2 border-zinc-600 border-dashed h-8 w-full rounded px-3">{file ? file.name : "Upload File"}</button>
                }
                <div className='flex gap-2'>
                    <Select getValue={getValue} isDisabled={true} value={statuses[0]} options={statuses} />
                    {
                        title !== ""
                            ?
                            <button onClick={() => handleAddTask()} className="bg-zinc-900 rounded h-12 flex-1 text-zinc-300">Add Task</button>
                            :
                            <button className="bg-zinc-900 rounded h-12 flex-1 text-zinc-600">Add Task</button>
                    }
                </div>
            </div>
            {
                getFilterList().map((t: Task) => (<TaskItem key={`${t.id}-item`} data={t} />))
            }
        </div>
    )
}

export default TaskComp