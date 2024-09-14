import { OptionType } from "./props.models";

interface Item {
    id: number;
}

export interface Token {
    accessToken: string;
    refreshToken: string;
}

export interface Role extends Item{
    name: string;
}

export interface StatusOrder extends Item{
    name: string;
    description: string;
}

export interface UserBase extends Item{
    email: string;
    name: string;
    lastName: string;
    phone: string;
}

export interface User extends UserBase{
    roles: Role[];
    isActive: boolean;
    office?: Office;
    branches?: Branch[];
}

export interface Client extends User{
    office: Office;
    branches: Branch[];
}

export interface Office extends Item{
    name: string;
}

export interface BranchInfo {
    city: string;
    address: string;
}

/*export interface Branch extends BranchInfo{
    id: number;
}*/
export interface Branch extends Item, BranchInfo {}

export interface Credentials {
    username: string;
    password: string;
}

export interface SignUpCredentials extends Credentials {
    confirmPassword: string;
}

export interface OfficeResponse extends Item{
    name: string;
    branches: Branch[] | BranchInfo[]
}

export interface BranchResponse extends Item{
    city: string;
    address: string;
    office: Office;
}

export interface Contact extends Item{
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

export interface Order extends Item{
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