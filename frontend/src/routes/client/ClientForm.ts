export default class StaffMemberForm {
    firstName: string;
    lastName: string;
    email: string;
    mobilePhone: string;
    password: string | null;
    country: string;
    region: string;
    city: string;
    address: string;
    postalCode: string;
    birthDate: Date | null;
    active: boolean;

    constructor(
        firstName: string,
        lastName: string,
        email: string,
        mobilePhone: string,
        password: string | null,
        country: string,
        region: string,
        city: string,
        address: string,
        postalCode: string,
        birthDate: Date | null,
        active: boolean
    ) {
        this.firstName = firstName;
        this.lastName = lastName;
        this.email = email;
        this.mobilePhone = mobilePhone;
        this.password = '' == password?.trim() ? null : password;
        this.country = country;
        this.region = region;
        this.city = city;
        this.address = address;
        this.postalCode = postalCode;
        this.birthDate = birthDate;
        this.active = active;
    }
}