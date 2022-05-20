import {convertToDate} from "../../util/DateUtil";
import User from "../account/User";
import BillingData from "./BillingData";

export default class Client {
    id: number;
    firstName: string;
    lastName: string;
    email: string;
    mobilePhone: string;
    country: string;
    region: string;
    city: string;
    address: string;
    postalCode: string;
    receivePromotionEmails: boolean;
    birthDate: Date;
    createdAt: Date;
    updatedAt: Date;
    user: User;
    billingData: BillingData;

    constructor(client: any) {
        this.id = client.id;
        this.firstName = client.firstName;
        this.lastName = client.lastName;
        this.email = client.email;
        this.mobilePhone = client.mobilePhone;
        this.country = client.country;
        this.region = client.region;
        this.city = client.city;
        this.address = client.address;
        this.postalCode = client.postalCode;
        this.receivePromotionEmails = client.receivePromotionEmails;
        // @ts-ignore
        this.birthDate = convertToDate(client.birthDate);
        // @ts-ignore
        this.createdAt = convertToDate(client.createdAt);
        // @ts-ignore
        this.updatedAt = convertToDate(client.updatedAt);
        this.user = client.user;
        this.user = client.user;
        this.billingData = new BillingData(client.billingData);
    }
}