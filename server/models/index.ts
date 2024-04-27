
export type TaskInput = {
    title: string;
    description?: string;
    status: string;
    userID: string;
} & {
    file: {
        url: string | null;
        name: string | null;
    } | null;
}


export type UserInput = { email: string, password: string }