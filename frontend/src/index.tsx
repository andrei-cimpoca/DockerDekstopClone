import React from 'react';
import ReactDOM from 'react-dom';
import './index.css';
import App from './routes/app/App';
import {HashRouter, Navigate, Outlet, Route, Routes, useLocation} from "react-router-dom";
import CssBaseline from "@mui/material/CssBaseline";
import {SnackbarProvider} from "notistack";
import ImagePage from './routes/image/ImagePage';
import ContainerPage from './routes/container/ContainerPage';
import NetworkPage from './routes/network/NetworkPage';

ReactDOM.render(

    
    <HashRouter>
        <App>
            <CssBaseline />
            <SnackbarProvider maxSnack={5}>
                <Routes>
                    <Route path="/" element={<></>} />
                    <Route path="/images" element={<ImagePage />} />
                    <Route path="/containers" element={<ContainerPage />} />
                    <Route path="/networks" element={<NetworkPage />} />
                </Routes>

            </SnackbarProvider>
        </App>
    </HashRouter>
    ,
    document.getElementById('root')
);

// If you want to start measuring performance in your app, pass a function
// to log results (for example: reportWebVitals(console.log))
// or send to an analytics endpoint. Learn more: https://bit.ly/CRA-vitals
// reportWebVitals(console.log);
