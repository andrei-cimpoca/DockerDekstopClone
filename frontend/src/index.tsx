import React from 'react';
import ReactDOM from 'react-dom';
import './index.css';
import App from './routes/app/App';
import {BrowserRouter, Navigate, Outlet, Route, Routes, useLocation} from "react-router-dom";
import CssBaseline from "@mui/material/CssBaseline";
import CalendarPage from "./routes/calendar/CalendarPage";
import SignIn from "./routes/account/SignIn";
import {SnackbarProvider} from "notistack";
import BookingsPage from "./routes/calendar/BookingsPage";
import AuthenticationService from "./routes/account/AuthenticationService";
import StaffMemberPage from "./routes/staffmember/StaffMemberPage";
import CheckinPage from "./routes/calendar/CheckinPage";
import SubscriptionPage from "./routes/subscription/SubscriptionPage";
import CouponPage from "./routes/coupon/CouponPage";
import ClientPage from "./routes/client/ClientPage";
import PaymentPage from "./routes/payment/PaymentPage";
import ClientInfoPage from "./routes/client/ClientInfoPage";
import LocationPage from "./routes/location/LocationPage";
import TrainingClassPage from "./routes/trainingclass/TrainingClassPage";

export const AuthenticatedWrapper = () => {
    const location = useLocation();
    return AuthenticationService.isAuthenticated() ? (
        <Outlet/>
    ) : (
        <Navigate
            to={AuthenticationService.signInRoute}
            replace
            state={{location}}
        />
    )
};

ReactDOM.render(
    <BrowserRouter>
        <CssBaseline/>
        <SnackbarProvider maxSnack={5}>
            <Routes>
                <Route path={AuthenticationService.signInRoute} element={<SignIn/>}/>
                <Route path="/" element={<AuthenticatedWrapper/>}>
                    <Route path="/" element={<App/>}/>
                    <Route path="calendar" element={<CalendarPage/>}/>
                    <Route path="checkin" element={<CheckinPage/>}/>
                    <Route path="calendar/bookings/:eventId" element={<BookingsPage/>}/>
                    <Route path="client" element={<ClientPage/>}/>
                    <Route path="client/info/:clientId" element={<ClientInfoPage/>}/>
                    <Route path="payment" element={<PaymentPage/>}/>
                    <Route path="staff-member" element={<StaffMemberPage/>}/>
                    <Route path="training-class" element={<TrainingClassPage/>}/>
                    <Route path="location" element={<LocationPage/>}/>
                    <Route path="subscription" element={<SubscriptionPage/>}/>
                    <Route path="coupon" element={<CouponPage/>}/>
                </Route>
            </Routes>
        </SnackbarProvider>
    </BrowserRouter>,
    document.getElementById('root')
);

// If you want to start measuring performance in your app, pass a function
// to log results (for example: reportWebVitals(console.log))
// or send to an analytics endpoint. Learn more: https://bit.ly/CRA-vitals
// reportWebVitals(console.log);
