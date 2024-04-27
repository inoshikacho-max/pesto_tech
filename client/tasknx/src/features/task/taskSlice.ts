import { createSlice } from '@reduxjs/toolkit'
import type { PayloadAction } from '@reduxjs/toolkit'
import type { RootState } from '../../app/store'

export interface File_ {
    url?: string
    name?: string
}

export interface Task {
    id: string,
    title: string,
    description?: string,
    file?: File_
    status: string,
}

interface TaskState {
    tasks: Task[]
}

const initialState: TaskState = {
    tasks: [
        {
            id: "1",
            title: "Test",
            description: "Test",
            file: { url: "https://via.placeholder.com/150", name: "example" },
            status: "Todo",
        },
        // {
        //     id: "2",
        //     title: "Add color diffrence to the task",
        //     description: "",
        //     // file: { url: "https://via.placeholder.com/150", name: "example" },
        //     status: "Pending",
        //     createdAt: Date.now(),
        // },
        // {
        //     id: "3",
        //     title: "Add Task filter",
        //     description: "filter should show only Tasks with specific status",
        //     // file: { url: "https://via.placeholder.com/150", name: "example" },
        //     status: "Completed",
        //     createdAt: Date.now(),
        // },
    ],
}

export const taskSlice = createSlice({
    name: 'taskSlice',
    initialState,
    reducers: {
        addTask: (state, action: PayloadAction<Task>) => {
            const task = action.payload;
            if (!task.id) {
                throw new Error("Must specify an ID when adding a task");
            } else if (state.tasks.find(t => t.id === task.id)) {
                throw new Error(`A task with this ID "${task.id}" already exists.`);
            }
            // todo - save task to database

            state.tasks.unshift(task)
        },
        updateTask: (state, action: PayloadAction<{ id: string; updates: Partial<Task> }>) => {
            const index = state.tasks.findIndex((task) => task.id === action.payload.id);
            if (index > -1) {
                // Create a new object to avoid mutating the original task
                const updatedTask = { ...state.tasks[index], ...action.payload.updates };
                
                // Replace the old task with the updated one in the tasks array
                const updatedTasks = [...state.tasks];
                updatedTasks[index] = updatedTask;
        
                // Update the state with the new tasks array
                state.tasks = updatedTasks;
        
                console.log("Task updated successfully:", updatedTask);
                
                // todo - update the Task in database
            } else {
                console.log("Given ID was not found in store");
            }
        },
        
        deleteTask: (state, action: PayloadAction<string>) => {
            state.tasks = state.tasks.filter((task) => task.id !== action.payload)

            // TODO : delete task with given Id from DB as well
        },
    },
})

export const { addTask, updateTask, deleteTask } = taskSlice.actions

export const selectTask = (state: RootState) => state.taskReducer.tasks;

export default taskSlice.reducer