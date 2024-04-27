import { useRef, useState } from "react";
import { useAppDispatch } from "../app/hooks";
import { File_, Task, deleteTask, updateTask } from "../features/task/taskSlice";
import Select from "./Select";
import { uploadFile } from "../firebase/firebase";
import { ArrowPathIcon } from "@heroicons/react/24/solid"

interface TaskItemProps {
    data: Task,
}

const statuses = ["Todo", "Pending", "Completed"];

const TaskItem: React.FC<TaskItemProps> = ({ data }) => {

    // const fileChooserRef = useRef<HTMLInputElement>(null);
    // const [updatedFile, setUpdatedFile] = useState<File | undefined>(undefined);

    // const [title, setTitle] = useState({ value: data.title, isDirty: false });
    // const [description, setDescription] = useState({ value: data.description, isDirty: false });
    // const [file, setFile] = useState(data.file);
    // const [status, setStatus] = useState({ value: data.status, isDirty: false });
    // const [allowUpdate, setAllowUpdate] = useState(false);
    // const [url, setUrl] = useState<string | undefined>("");
    // const [isUploading, setIsUploading] = useState(false);

    // const dispatch = useAppDispatch();

    // const [updates,setUpdates] = useState<Partial<Task>>({})

    const fileChooserRef = useRef<HTMLInputElement>(null);
    const [title, setTitle] = useState<string>(data.title);
    const [description, setDescription] = useState<string | undefined>(data.description);
    const [status, setStatus] = useState<string>("");
    const [allowUpdate, setAllowUpdate] = useState<boolean>(false);
    const [url, setUrl] = useState<string | undefined>("");
    const [isUploading, setIsUploading] = useState<boolean>(false);
    // const [updates, setUpdates] = useState<Partial<Task>>({});
    const dispatch = useAppDispatch();
    const [file, setFile] = useState<File_ | undefined>();

    const getStatus = (value: string) => {
        setStatus(value)
    }

    // console.log(status.isDirty,status.value,"status");

    const handleTitleChange = (e: React.ChangeEvent<HTMLInputElement>) => {
        setTitle(e.target.value);
    };

    const handleDescriptionChange = (e: React.ChangeEvent<HTMLTextAreaElement>) => {
        setDescription(e.target.value);
    };

    // console.log(description.isDirty,description.value,"status");

    const handleFileChange = async () => {
        if (fileChooserRef.current) {
            fileChooserRef.current.accept = "*";
            fileChooserRef.current.onchange = async (e: any) => {
                const fileList: FileList | null = (e.target as HTMLInputElement).files
                if (fileList && fileList.length) {
                    setIsUploading(true)
                    const result = await uploadFile(fileList[0])
                    setIsUploading(false);
                    if (result) {
                        setUrl(result);
                    }
                    setFile(fileList[0])
                }
            }
            fileChooserRef.current.click()
        }
    }

    const handleUpdateTaskClick = () => {
        setAllowUpdate(true);
    };

    const handleUpdateTask = () => {
        const updatedTask: Partial<Task> = {
            title: title !== "" ? title : undefined,
            description: description !== "" ? description : undefined,
            status: status !== "" ? status : "Todo",
            file: file ? { url, name: file.name } : undefined,
        };
        if (Object.keys(updatedTask).length > 0) {
            dispatch(updateTask({ id: data.id, updates: updatedTask }));
        }
        setAllowUpdate(false);
    };

    const handleCancelUpdateTask = () => {
        setTitle(data.title);
        setDescription(data.description);
        setFile(data.file);
        setStatus(data.status);
        setAllowUpdate(false);
    };

    const handleDeleteTask = () => {
        if (!window.confirm('Are you sure?')) {
            return;
        }
        dispatch(deleteTask(data.id));
    }

    const statusStyle = {
        Todo: "bg-zinc-950 border-t-4 border-blue-700",
        Completed: "bg-zinc-950 border-t-4 border-emerald-700",
        Pending: "bg-zinc-950 border-t-4 border-rose-700",
    }[data.status];

    return (
        <div className={` w-80 h-80 rounded-md p-5 flex flex-col justify-between ${statusStyle}`}>
            {
                allowUpdate ?
                    <div className="flex flex-col justify-between gap-8">
                        <input
                            onChange={handleTitleChange}
                            className="bg-transparent outline-none text-2xl w-full"
                            value={title}
                        />
                        <textarea
                            onChange={handleDescriptionChange}
                            className="bg-transparent outline-none w-full"
                            value={description}
                            rows={3}
                        />
                        <div className="relative">
                            <input ref={fileChooserRef} type="file" hidden />
                            <button
                                onClick={handleFileChange}
                                className="bg-zinc-900 border-2 border-zinc-600 border-dashed h-8 w-full rounded px-3 text-clip"
                            >
                                { isUploading ? <ArrowPathIcon className="animate-spin h-5 w-5" /> : file ? file.name : "Upload File"}
                            </button>
                        </div>
                    </div>
                    :
                    <div className="flex flex-col justify-between gap-8">
                        <input
                            className="bg-transparent outline-none text-2xl w-full"
                            value={data.title}
                            readOnly
                        />
                        <textarea
                            className="bg-transparent outline-none"
                            value={data.description}
                            rows={3}
                            readOnly
                        />
                        <button
                            className="bg-zinc-900 border-2 border-zinc-600 border-dashed h-8 w-full rounded px-3"
                            disabled
                        >
                            {data.file ? data.file.name : "No File"}
                        </button>
                    </div>
            }
            <div className="flex gap-2">
                <Select getValue={getStatus} isDisabled={allowUpdate} value={statuses[0]} options={statuses} />
                <button
                    onClick={allowUpdate ? handleUpdateTask : handleUpdateTaskClick}
                    className="bg-zinc-900 rounded h-12 flex-1"
                >
                    {allowUpdate ? "Go" : "Edit"}
                </button>
                <button
                    onClick={allowUpdate ? handleCancelUpdateTask : handleDeleteTask}
                    className={`bg-zinc-900 rounded h-12 flex-1 text-rose-700`}
                >
                    {allowUpdate ? "Cancel" : "Delete"}
                </button>
            </div>
        </div>
    )
}

export default TaskItem