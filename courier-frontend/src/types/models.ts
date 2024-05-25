
export interface Token {
    accessToken: string;
    refreshToken: string;
}

export interface Role {
    id: number;
    name: string;
}

export interface User {
    id: number;
    email: string;
    name: string;
    lastName: string;
    phone: string;
    roles: Role[];
}

export interface Office {
    id: number;
    name: string;
}

export interface Branch {
    id: number;
    city: string;
    address: string;
}

export interface Client extends User{
    office: Office;
    branches: Branch[];
}

export interface LoginCredentials {
    email: string | null;
    phone: string | null;
    password: string;
}

export interface SignUpCredentials {
    email: string | null;
    phone: string | null;
    passwordOne: string;
    passwordTwo: string;
}