import { BillingType } from "../payment/BillingType";
import {PaymentMethod} from "../payment/PaymentMethod";

export default class BillingData {
    billingType: BillingType;
    paymentMethod: PaymentMethod;
    companyName: string;
    firstName: string;
    lastName: string;
    fiscalNumber: string;
    identityNumber: string;
    country: string;
    county: string;
    city: string;
    address: string;
    email: string;
    mobilePhone: string;

    constructor(billingData: any) {
        if (!billingData) {
            billingData = {};
        }
        this.billingType = billingData.billingType;
        this.paymentMethod = billingData.paymentMethod;
        this.companyName = billingData.companyName;
        this.firstName = billingData.firstName;
        this.lastName = billingData.lastName;
        this.fiscalNumber = billingData.fiscalNumber;
        this.identityNumber = billingData.identityNumber;
        this.country = billingData.country;
        this.county = billingData.county;
        this.city = billingData.city;
        this.address = billingData.address;
        this.email = billingData.email;
        this.mobilePhone = billingData.mobilePhone;
    }
}
