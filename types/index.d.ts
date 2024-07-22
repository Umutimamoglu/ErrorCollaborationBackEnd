export interface IUser {
    email: string,
    name: string,
    password: string
}


export interface IColor {
    name: string
    id: string
    code: string
}

export interface IIcon {
    name: string
    id: string
    symbol: string
}

export interface IError {
    name: string;
    user: string;
    isFixed: boolean;
    type: string;
    image?: string;
    color?: string;
    icon?: string;
    date: string;
}