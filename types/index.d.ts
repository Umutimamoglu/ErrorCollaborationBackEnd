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
    _id: string
    name: string;
    user: IUser | string;
    isFixed: boolean;
    image?: string;
    language: string;
    color?: string;
    type?: string;
}