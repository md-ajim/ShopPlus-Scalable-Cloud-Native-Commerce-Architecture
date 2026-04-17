
export interface AddressType {
    id: number
    name: string
    phone: number
    address: string
    city: string
    state: string
    zip: number
    country: number
    isDefault: boolean
    newsletter: boolean
    smsMarketing: boolean
    emailMarketing: boolean
    user: UserType
}

export interface UserType {
    id: number;
    name: string | null;
    username: string;
    email: string;
    first_name: string;
    last_name: string;
    date_joined: string; // ISO date string
    profile_pic: string | null;
    phone_number: string | null;
    date_of_birth: string | null;
    language: string;
    loyalty_points: number;
}
