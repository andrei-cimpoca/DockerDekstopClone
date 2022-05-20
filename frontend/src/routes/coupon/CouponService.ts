import BackendService from "../../config/BackendService";
import Coupon from "../coupon/Coupon";
import CouponForm from "./CouponForm";

export default class CouponService {
    static getList(): Promise<Coupon[]> {
        return BackendService.getJson('/api/v1/coupon')
            .then(items => items.map((item: any) => new Coupon(item)));
    }

    static save(id: number | null, form: CouponForm): Promise<Response> {
            return (null == id)
                ? BackendService.postJson("/api/v1/coupon", form)
                : BackendService.putJson("/api/v1/coupon/" + id, form);
    }

    static delete(id: number): Promise<Response> {
        return BackendService.delete("/api/v1/coupon/" + id);
    }
}
