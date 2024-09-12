import { OptionType } from "./props.models";

export interface Token {
    accessToken: string;
    refreshToken: string;
}

export interface Role {
    id: number;
    name: string;
}

export interface StatusOrder {
    id: number;
    name: string;
    description: string;
}

export interface UserBase {
    id: number;
    email: string;
    name: string;
    lastName: string;
    phone: string;
}

export interface User extends UserBase{
    roles: Role[];
    isActive: boolean;
}

export interface Client extends User{
    office: Office;
    branches: Branch[];
}

export interface Office {
    id: number;
    name: string;
}

export interface BranchInfo {
    city: string;
    address: string;
}

export interface Branch extends BranchInfo{
    id: number;
}

export interface Credentials {
    username: string;
    password: string;
}

export interface SignUpCredentials extends Credentials {
    confirmPassword: string;
}

export interface OfficeResponse{
    id: number;
    name: string;
    branches: Branch[] | BranchInfo[]
}

export interface BranchResponse{
    id: number;
    city: string;
    address: string;
    office: Office;
}

export interface Contact{
    id: number;
    name: string;
    lastName: string;
    phone: string;
    office: Office;
    branches: Branch[]
}

export interface ContactOptionType extends OptionType {
    phone: string;
    office: Office;
    branches: Branch[];
}

export interface Order{
    id: number;
    client: User | null;
    originBranch: BranchResponse;
    destinationBranch: BranchResponse | null;
    contacts: Contact[];
    deliveryDate: string;
    receiverName: string;
    receiverPhone: string;
    destinationAddress: string;
    couriers: User[];
    currentStatus: StatusOrder;
}