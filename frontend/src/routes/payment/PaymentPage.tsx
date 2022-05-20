import * as React from 'react';
import Box from '@mui/material/Box';
import Toolbar from '@mui/material/Toolbar';
import MainMenu, {DrawerWidth} from "../../fragments/mainmenu/MainMenu";
import {DataGrid, GridRenderCellParams, GridRowModel} from "@mui/x-data-grid";
import PaymentService, {PaymentFilters} from "./PaymentService";
import {dateToDateTimeStr} from "../../util/DateUtil";
import Client from "../client/Client";
import LocalizationProvider from "@mui/lab/LocalizationProvider";
import AdapterDateFns from "@mui/lab/AdapterDateFns";
import roLocale from "date-fns/locale/ro";
import {Autocomplete, Button, FormControl, Grid, InputLabel, MenuItem, Select, SelectChangeEvent} from "@mui/material";
import DateRangePicker, {DateRange} from "@mui/lab/DateRangePicker";
import TextField from "@mui/material/TextField";
import ClientService from "../client/ClientService";
import {PaymentMethod, paymentMethods} from "./PaymentMethod";
import {PaymentStatus, paymentStatuses} from "./PaymentStatus";

const drawerWidth = DrawerWidth;

interface RowsState {
    page: number;
    pageSize: number;
}

export default function PaymentPage() {
    const [rowsState, setRowsState] = React.useState<RowsState>({
        page: 0,
        pageSize: 5,
    });

    const [clients, setClients] = React.useState<Map<number, Client>>(new Map());
    const [period, setPeriod] = React.useState<DateRange<Date>>([null, null]);
    const [clientId, setClientId] = React.useState('');
    const [paymentMethod, setPaymentMethod] = React.useState<PaymentMethod | undefined>(undefined);
    const [paymentStatus, setPaymentStatus] = React.useState<PaymentStatus | undefined>(undefined);

    const [rowCount, setRowCount] = React.useState<number | undefined>(undefined);
    const [isLoading, setIsLoading] = React.useState<boolean>(false);
    const [data, setData] = React.useState<GridRowModel[]>([]);

    const fetchRows = () => {
        let active = true;

        setIsLoading(true);
        setRowCount(undefined);

        const paymentFilters = new PaymentFilters(null, clientId, paymentMethod, paymentStatus, rowsState.page, rowsState.pageSize);
        PaymentService.getList(paymentFilters).then(response => {
            if (!active) {
                return;
            }
            setData(response.items);
            setIsLoading(false);
            setRowCount(response.totalItems);
        });

        return () => {
            active = false;
        };
    };

    React.useEffect(fetchRows, [period, clientId, paymentMethod, paymentStatus, rowsState]);

    const [rowCountState, setRowCountState] = React.useState(rowCount || 0);

    const getClients = () => {
        ClientService.getList()
            .then((clientList) => {
                const clientMap: Map<number, Client> = new Map();
                clientList.map(client => clientMap.set(client.id, client));
                setClients(clientMap);
            });
    }

    React.useEffect(() => {
        getClients();
    }, []);

    React.useEffect(() => {
        setRowCountState((prevRowCountState) =>
            rowCount !== undefined ? rowCount : prevRowCountState,
        );
    }, [rowCount, setRowCountState]);

    const onApproveClick = (id: number) => {
        PaymentService.approve(id)
            .then(fetchRows);

    }

    const columns = [
        {
            field: "id",
            headerName: "ID",
            width: 100,
        },
        {
            field: "createdAt",
            headerName: "Date",
            width: 250,
            editable: false,
            renderCell: (params: GridRenderCellParams<Date>) => dateToDateTimeStr(params.value),
        },
        {
            field: "client",
            headerName: "Client",
            width: 200,
            editable: false,
            renderCell: (params: GridRenderCellParams<Client>) => params.value.email,
        },
        {
            field: "paymentMethod",
            headerName: "Payment method",
            width: 150,
            editable: false,
            renderCell: (params: GridRenderCellParams<PaymentMethod>) => paymentMethods.get(params.value),
        },
        {
            field: "paymentStatus",
            headerName: "Status",
            width: 150,
            editable: false,
            renderCell: (params: GridRenderCellParams<PaymentStatus>) => paymentStatuses.get(params.value),
        },
        {
            field: "subtotal",
            headerName: "Subtotal",
            width: 100,
            editable: false,
        },
        {
            field: "discountAmount",
            headerName: "Discount",
            width: 100,
            editable: false,
        },
        {
            field: "total",
            headerName: "Total",
            width: 100,
            editable: false,
        },
        {
            field: "status",
            headerName: "Actiuni",
            width: 100,
            editable: false,
            renderCell: (params: GridRenderCellParams<PaymentStatus>) => {
                return params.row.isPendingOP() ? (
                    <strong>
                        <Button
                            variant="contained"
                            color="primary"
                            size="small"
                            style={{ marginLeft: 16 }}
                            onClick={() => onApproveClick(params.row.id)}
                        >
                            Aproba
                        </Button>
                    </strong>
                ) : ''
            },
        },
    ];

    return (
        <Box sx={{display: 'flex'}}>
            <MainMenu/>
            <Box
                component="main"
                sx={{backgroundColor: '#f7f7f7', flexGrow: 1, p: 3, width: {sm: `calc(100% - ${drawerWidth}px)`}}}
            >
                <Toolbar/>

                <LocalizationProvider dateAdapter={AdapterDateFns} locale={roLocale}>
                    <Grid container spacing={2}>
                        <Grid item xs={12} sm={12} md={6} lg={3}>
                            <FormControl>
                                <DateRangePicker
                                    startText="De pe"
                                    endText="Pana pe"
                                    value={period}
                                    onChange={(newValue) => {
                                        setPeriod(newValue);
                                    }}
                                    renderInput={(startProps, endProps) => (
                                        <>
                                            <TextField {...startProps} sx={{mr: 2}}/>
                                            <TextField {...endProps}/>
                                        </>
                                    )}
                                />
                            </FormControl>
                        </Grid>
                        <Grid item xs={12} sm={12} md={6} lg={3}>
                            <FormControl sx={{width: '100%'}}>
                                <Autocomplete
                                    disablePortal
                                    options={Array.from(clients.values())}
                                    onChange={(event, newValue) => {
                                        setClientId(newValue ? newValue.id.toString() : '');
                                    }}
                                    getOptionLabel={(client: Client) => client.firstName + " " + client.lastName + " (" + client.email + ")"}
                                    renderInput={(params) =>
                                        <TextField {...params} label="Cauta client"/>
                                    }
                                />
                            </FormControl>
                        </Grid>
                        <Grid item xs={12} sm={12} md={6} lg={3}>
                            <FormControl sx={{width: '100%'}}>
                                <InputLabel id="paymentMethodLabel">Metoda de plata</InputLabel>
                                <Select
                                    labelId="paymentMethodLabel"
                                    id="paymentMethod"
                                    value={paymentMethod}
                                    label="Metoda de plata"
                                    onChange={(event: SelectChangeEvent<PaymentMethod>) => {
                                        setPaymentMethod(event.target.value as PaymentMethod);
                                    }}
                                >
                                    <MenuItem value=''>( toate )</MenuItem>
                                    {Array.from(paymentMethods.keys()).map((key: PaymentMethod) =>
                                        <MenuItem key={key} value={key}>{paymentMethods.get(key)}</MenuItem>
                                    )}
                                </Select>
                            </FormControl>
                        </Grid>
                        <Grid item xs={12} sm={12} md={6} lg={3}>
                            <FormControl sx={{width: '100%'}}>
                                <InputLabel id="paymentStatusLabel">Status</InputLabel>
                                <Select
                                    labelId="paymentStatusLabel"
                                    id="paymentStatus"
                                    value={paymentStatus}
                                    label="Status"
                                    onChange={(event: SelectChangeEvent<PaymentStatus>) => {
                                        setPaymentStatus(event.target.value as PaymentStatus);
                                    }}
                                >
                                    <MenuItem value=''>( toate )</MenuItem>
                                    {Array.from(paymentStatuses.keys()).map((key: PaymentStatus) =>
                                        <MenuItem key={key} value={key}>{paymentStatuses.get(key)}</MenuItem>
                                    )}
                                </Select>
                            </FormControl>
                        </Grid>
                    </Grid>
                </LocalizationProvider>

                <div style={{ height: 400, width: '100%' }}>
                    <DataGrid
                        columns={columns}
                        rows={data}
                        rowCount={rowCountState}
                        loading={isLoading}
                        rowsPerPageOptions={[5, 10, 20, 50, 100]}
                        pagination
                        {...rowsState}
                        paginationMode="server"
                        onPageChange={(page) => setRowsState((prev) => ({ ...prev, page }))}
                        onPageSizeChange={(pageSize) =>
                            setRowsState((prev) => ({ ...prev, pageSize }))
                        }
                    />
                </div>

            </Box>


        </Box>
    );
}