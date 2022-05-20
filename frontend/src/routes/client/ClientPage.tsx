import * as React from 'react';
import Box from '@mui/material/Box';
import Toolbar from '@mui/material/Toolbar';
import MainMenu, {DrawerWidth} from "../../fragments/mainmenu/MainMenu";
import {
    Backdrop,
    Button,
    Checkbox,
    CircularProgress,
    Dialog,
    DialogActions,
    DialogContent,
    DialogContentText,
    DialogTitle,
    Drawer,
    FormControl,
    FormControlLabel,
    Grid,
    IconButton, Input,
    InputAdornment,
    InputLabel,
    OutlinedInput,
    Typography
} from "@mui/material";
import DeleteIcon from '@mui/icons-material/Delete';
import EditIcon from '@mui/icons-material/Edit';
import InfoIcon from '@mui/icons-material/Info';
import {useSnackbar, VariantType} from "notistack";
import {dateToDateTimeStr} from "../../util/DateUtil";
import AddCircleIcon from "@mui/icons-material/AddCircle";
import ClientService, {ClientFilters} from "./ClientService";
import Client from "./Client";
import TextField from "@mui/material/TextField";
import {Search, Visibility, VisibilityOff} from "@mui/icons-material";
import ClientForm from "./ClientForm";
import LocalizationProvider from "@mui/lab/LocalizationProvider";
import AdapterDateFns from "@mui/lab/AdapterDateFns";
import roLocale from "date-fns/locale/ro";
import {DatePicker} from "@mui/lab";
import {DataGrid, GridRenderCellParams, GridRowModel} from "@mui/x-data-grid";
import {PaymentStatus} from "../payment/PaymentStatus";
import {useNavigate} from "react-router-dom";

const drawerWidth = DrawerWidth;

interface RowsState {
    page: number;
    pageSize: number;
}

export default function ClientPage() {
    const {enqueueSnackbar} = useSnackbar();
    const navigate = useNavigate();
    const [rowsState, setRowsState] = React.useState<RowsState>({
        page: 0,
        pageSize: 5,
    });

    const [data, setData] = React.useState<GridRowModel[]>([]);
    const [rowCount, setRowCount] = React.useState<number | undefined>(undefined);
    const [rowCountState, setRowCountState] = React.useState(rowCount || 0);
    const [isLoading, setIsLoading] = React.useState<boolean>(false);
    const [searchText, setSearchText] = React.useState<string>('');

    const fetchRows = () => {
        let active = true;

        setIsLoading(true);
        setRowCount(undefined);

        const clientFilters = new ClientFilters(null, searchText, rowsState.page, rowsState.pageSize);
        ClientService.getFilteredList(clientFilters).then(response => {
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

    React.useEffect(fetchRows, [searchText, rowsState]);

    React.useEffect(() => {
        setRowCountState((prevRowCountState) =>
            rowCount !== undefined ? rowCount : prevRowCountState,
        );
    }, [rowCount, setRowCountState]);

    const [loadingWheelVisible, setLoadingWheelVisible] = React.useState(false);
    const [clients, setClients] = React.useState<Client[]>([]);

    const [drawerShown, setDrawerShown] = React.useState(false);
    const [editId, setEditId] = React.useState<number | null>(null);
    const [formFirstName, setFormFirstName] = React.useState('');
    const [formLastName, setFormLastName] = React.useState('');
    const [formEmail, setFormEmail] = React.useState('');
    const [formMobilePhone, setFormMobilePhone] = React.useState('');
    const [formPassword, setFormPassword] = React.useState('');
    const [formPasswordShow, setFormPasswordShow] = React.useState(false);
    const [formCountry, setFormCountry] = React.useState('');
    const [formRegion, setFormRegion] = React.useState('');
    const [formCity, setFormCity] = React.useState('');
    const [formAddress, setFormAddress] = React.useState('');
    const [formPostalCode, setFormPostalCode] = React.useState('');
    const [formBirthDate, setFormBirthDate] = React.useState<Date | null>(new Date());
    const [formActive, setFormActive] = React.useState(true);

    const [deleteId, setDeleteId] = React.useState<number>(0);
    const [deleteDialogOpen, setDeleteDialogOpen] = React.useState(false);

    const getClients = () => {
        setLoadingWheelVisible(true);
        ClientService.getList()
            .then((clients) => {
                setLoadingWheelVisible(false);
                setClients(clients);
            });
    }

    React.useEffect(() => {
        getClients();
    }, []);

    const onDeleteDialogClose = () => {
        setDeleteDialogOpen(false);
    }

    const onDeleteDialogNoClick = () => {
        setDeleteDialogOpen(false);
    }

    const onDeleteDialogYesClick = () => {
        setDeleteDialogOpen(false);
        ClientService.delete(deleteId)
            .then(() => getClients());
    }

    const onAddDrawerClose = (event: React.KeyboardEvent | React.MouseEvent) => {
        if (
            event.type === 'keydown' &&
            ((event as React.KeyboardEvent).key === 'Tab' ||
                (event as React.KeyboardEvent).key === 'Shift')
        ) {
            return;
        }
        setDrawerShown(false);
    };

    const onAddButtonClick = (event: React.KeyboardEvent | React.MouseEvent) => {
        if (
            event.type === 'keydown' &&
            ((event as React.KeyboardEvent).key === 'Tab' ||
                (event as React.KeyboardEvent).key === 'Shift')
        ) {
            return;
        }
        setEditId(null);
        setFormFirstName('');
        setFormLastName('');
        setFormMobilePhone('');
        setFormPassword('');
        setFormCountry('');
        setFormRegion('');
        setFormCity('');
        setFormAddress('');
        setFormPostalCode('');
        setFormBirthDate(new Date());
        setFormActive(true);

        setDrawerShown(true);
    };

    const onEditClick = (id: string) => {
        let client = clients.find(value => value.id == Number.parseInt(id));
        if (undefined == client) {
            return;
        }
        setEditId(client.id);
        setFormFirstName(client.firstName);
        setFormLastName(client.lastName);
        setFormMobilePhone(client.mobilePhone);
        setFormPassword('');
        setFormCountry(client.country);
        setFormRegion(client.region);
        setFormCity(client.city);
        setFormAddress(client.address);
        setFormPostalCode(client.postalCode);
        setFormBirthDate(client.birthDate);
        setFormActive(client.user.active);

        setDrawerShown(true);
    }

    const onDeleteClick = (id: string) => {
        setDeleteId(Number.parseInt(id));
        setDeleteDialogOpen(true);
    }

    const onSaveClick = () => {
        const form = new ClientForm(
            formFirstName,
            formLastName,
            formEmail,
            formMobilePhone,
            formPassword,
            formCountry,
            formRegion,
            formCity,
            formAddress,
            formPostalCode,
            formBirthDate,
            formActive
        );

        setLoadingWheelVisible(true);

        ClientService.save(editId, form)
            .then((response) => {
                if (200 === response.status) {
                    setDrawerShown(false);

                    const variant: VariantType = 'success';
                    enqueueSnackbar('Succes', {variant});
                    getClients();
                } else {
                    response.json().then(json => {
                        const variant: VariantType = 'error';
                        enqueueSnackbar(json.message, {variant});
                    });
                }
            }).finally(() => setLoadingWheelVisible(false));
    }

    const columns = [
        {
            field: "id",
            headerName: "ID",
            width: 70,
        },
        {
            field: "firstName",
            headerName: "Prenume",
            width: 150,
        },
        {
            field: "lastName",
            headerName: "Nume",
            width: 150,
        },
        {
            field: "email",
            headerName: "Email",
            width: 300,
        },
        {
            field: "mobilePhone",
            headerName: "Telefon",
            width: 150,
        },
        {
            field: "createdAt",
            headerName: "Creat la data",
            width: 250,
            editable: false,
            renderCell: (params: GridRenderCellParams<Date>) => dateToDateTimeStr(params.value),
        },
        {
            field: "status",
            headerName: "Actiuni",
            width: 100,
            editable: false,
            renderCell: (params: GridRenderCellParams<PaymentStatus>) => (
                <strong>
                    <IconButton aria-label="info" size="small" color="success"
                                onClick={() => navigate('/client/info/' + params.row.id)}>
                        <InfoIcon fontSize="small"/>
                    </IconButton>
                    <IconButton aria-label="edit" size="small" color="success"
                                onClick={() => onEditClick(params.row.id)}>
                        <EditIcon fontSize="small"/>
                    </IconButton>
                    <IconButton aria-label="delete" size="small" color="error"
                                onClick={() => onDeleteClick(params.row.id)}>
                        <DeleteIcon fontSize="small"/>
                    </IconButton>
                </strong>
            ),
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

                {loadingWheelVisible ?
                    (
                        <Backdrop sx={{color: '#fff', zIndex: (theme) => theme.zIndex.drawer + 1}}
                                  open={loadingWheelVisible}>
                            <CircularProgress color="inherit"/>
                        </Backdrop>
                    )
                    : ''
                }

                <div style={{ height: 400, width: '100%' }}>
                    <Button onClick={onAddButtonClick} variant="outlined" color="success">
                        <AddCircleIcon fontSize="small"/>
                    </Button>
                    <Box sx={{ display: 'flex', alignItems: 'flex-end', mb: 1, mt: 1 }}>
                        <Search sx={{ color: 'action.active', mr: 1, my: 0.5 }} />
                        <TextField
                            id="input-with-sx"
                            label="Filtreaza"
                            variant="standard"
                            value={searchText}
                            onChange={(event) => setSearchText(event.target.value as string)}
                        />
                    </Box>
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

            <Drawer
                anchor='right'
                open={drawerShown}
                onClose={onAddDrawerClose}
            >
                <Typography component="h2" variant="h6" color="primary" px={2} py={1}>
                    {editId ? 'Editeaza client' : 'Adauga client'}
                </Typography>
                <Box sx={{width: 420, px: 2}}>
                    <Grid container spacing={2}>
                        <Grid item xs={6}>
                            <FormControl sx={{width: '100%'}}>
                                <TextField
                                    id="outlined-basic"
                                    label="Prenume"
                                    variant="outlined"
                                    value={formFirstName}
                                    onChange={(event) => {
                                        setFormFirstName(event.target.value as string);
                                    }}
                                />
                            </FormControl>
                        </Grid>
                        <Grid item xs={6}>
                            <FormControl sx={{width: '100%'}}>
                                <TextField
                                    id="outlined-basic"
                                    label="Nume"
                                    variant="outlined"
                                    value={formLastName}
                                    onChange={(event) => {
                                        setFormLastName(event.target.value as string);
                                    }}
                                />
                            </FormControl>
                        </Grid>
                        <Grid item xs={12}>
                            <FormControl sx={{width: '100%'}}>
                                <TextField
                                    id="outlined-basic"
                                    label="Email"
                                    variant="outlined"
                                    value={formEmail}
                                    onChange={(event) => {
                                        setFormEmail(event.target.value as string);
                                    }}
                                />
                            </FormControl>
                        </Grid>
                        <Grid item xs={12}>
                            <FormControl sx={{width: '100%'}}>
                                <TextField
                                    id="outlined-basic"
                                    label="Telefon mobil"
                                    variant="outlined"
                                    value={formMobilePhone}
                                    onChange={(event) => {
                                        setFormMobilePhone(event.target.value as string);
                                    }}
                                />
                            </FormControl>
                        </Grid>
                        <Grid item xs={12}>
                            <FormControl sx={{width: '100%'}} variant="outlined">
                                <InputLabel htmlFor="outlined-adornment-password">Parola</InputLabel>
                                <OutlinedInput
                                    id="outlined-adornment-password"
                                    type={formPasswordShow ? 'text' : 'password'}
                                    value={formPassword}
                                    onChange={(event) => {
                                        setFormPassword(event.target.value as string);
                                    }}
                                    endAdornment={
                                        <InputAdornment position="end">
                                            <IconButton
                                                aria-label="toggle password visibility"
                                                onClick={() => setFormPasswordShow(!formPasswordShow)}
                                                onMouseDown={(event) => event.preventDefault()}
                                                edge="end"
                                            >
                                                {formPasswordShow ? <VisibilityOff/> : <Visibility/>}
                                            </IconButton>
                                        </InputAdornment>
                                    }
                                    label="Password"
                                />
                            </FormControl>
                        </Grid>
                        <Grid item xs={6}>
                            <FormControl sx={{width: '100%'}}>
                                <TextField
                                    id="outlined-basic"
                                    label="Tara"
                                    variant="outlined"
                                    value={formCountry}
                                    onChange={(event) => {
                                        setFormCountry(event.target.value as string);
                                    }}
                                />
                            </FormControl>
                        </Grid>
                        <Grid item xs={6}>
                            <FormControl sx={{width: '100%'}}>
                                <TextField
                                    id="outlined-basic"
                                    label="Regiune / Judet"
                                    variant="outlined"
                                    value={formRegion}
                                    onChange={(event) => {
                                        setFormRegion(event.target.value as string);
                                    }}
                                />
                            </FormControl>
                        </Grid>
                        <Grid item xs={12}>
                            <FormControl sx={{width: '100%'}}>
                                <TextField
                                    id="outlined-basic"
                                    label="Oras / Localitate"
                                    variant="outlined"
                                    value={formCity}
                                    onChange={(event) => {
                                        setFormCity(event.target.value as string);
                                    }}
                                />
                            </FormControl>
                        </Grid>
                        <Grid item xs={12}>
                            <FormControl sx={{width: '100%'}}>
                                <TextField
                                    id="outlined-basic"
                                    label="Adresa"
                                    variant="outlined"
                                    value={formAddress}
                                    onChange={(event) => {
                                        setFormAddress(event.target.value as string);
                                    }}
                                />
                            </FormControl>
                        </Grid>
                        <Grid item xs={6}>
                            <FormControl sx={{width: '100%'}}>
                                <TextField
                                    id="outlined-basic"
                                    label="Cod postal"
                                    variant="outlined"
                                    value={formPostalCode}
                                    onChange={(event) => {
                                        setFormPostalCode(event.target.value as string);
                                    }}
                                />
                            </FormControl>
                        </Grid>
                        <Grid item xs={6}>
                            <FormControl sx={{width: '100%'}}>
                                <LocalizationProvider dateAdapter={AdapterDateFns} locale={roLocale}>
                                    <DatePicker
                                        label="Data nastere"
                                        value={formBirthDate}
                                        onChange={(newValue) => {
                                            setFormBirthDate(newValue);
                                        }}
                                        renderInput={(params) => <TextField {...params} />}
                                    />
                                </LocalizationProvider>
                            </FormControl>
                        </Grid>
                        <Grid item xs={12}>
                            <FormControl sx={{width: '100%'}} variant="outlined">
                                <FormControlLabel control={<Checkbox
                                    checked={formActive}
                                    onClick={() => setFormActive(!formActive)}
                                />} label="Activ"/>
                            </FormControl>
                        </Grid>

                        <Grid item xs={12}>
                            <FormControl sx={{width: '100%'}}>
                                <Button variant="contained" onClick={onSaveClick}>Salveaza</Button>
                            </FormControl>
                        </Grid>
                    </Grid>

                </Box>
            </Drawer>

            <Dialog
                open={deleteDialogOpen}
                onClose={onDeleteDialogClose}
                aria-labelledby="alert-dialog-title"
                aria-describedby="alert-dialog-description"
            >
                <DialogTitle id="alert-dialog-title">
                    {"Confirmare pentru stergere"}
                </DialogTitle>
                <DialogContent>
                    <DialogContentText id="alert-dialog-description">
                        Sigur vrei sa stergi acest client?
                    </DialogContentText>
                </DialogContent>
                <DialogActions>
                    <Button onClick={onDeleteDialogNoClick} autoFocus>Nu</Button>
                    <Button onClick={onDeleteDialogYesClick}>Da</Button>
                </DialogActions>
            </Dialog>

        </Box>
    );
}