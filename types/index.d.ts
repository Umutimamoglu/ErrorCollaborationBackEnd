

export interface IUser {
    email: string,
    name: string,
    password: string,
    image: string | null,
    positionTitle: string | null
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
    color?: IColor;
    type?: string;
    howDidIFix?: string;
}

export interface IChat {
    _id: string;
    members: (IUser | string)[];
    createdAt: Date;
    updatedAt: Date;
}

export interface IMessage {
    _id: string;
    chatId: string;
    sender: IUser | string;
    message: string;
    timestamp: Date;
}