import * as React from 'react';
import Box from '@mui/material/Box';
import Toolbar from '@mui/material/Toolbar';
import MainMenu, {DrawerWidth} from "../../fragments/mainmenu/MainMenu";
import TextField from '@mui/material/TextField';
import {
    Autocomplete,
    Backdrop,
    Button,
    CircularProgress,
    Dialog,
    DialogActions,
    DialogContent,
    DialogContentText,
    DialogTitle,
    Drawer,
    FormControl,
    Grid,
    IconButton,
    Paper,
    Table,
    TableBody,
    TableCell,
    TableContainer,
    TableHead,
    TableRow,
    Typography
} from "@mui/material";
import DeleteIcon from '@mui/icons-material/Delete';
import CalendarService from "./CalendarService";
import {useSnackbar, VariantType} from "notistack";
import {useParams} from "react-router-dom";
import CalendarEvent from "./CalendarEvent";
import {dateToDateStr, dateToDateTimeStr} from "../../util/DateUtil";
import AddCircleIcon from "@mui/icons-material/AddCircle";
import Client from "../client/Client";
import ClientService from "../client/ClientService";
import BookingCreateForm from "./BookingCreateForm";

const drawerWidth = DrawerWidth;

export default function BookingsPage() {
    const {enqueueSnackbar} = useSnackbar();
    const {eventId} = useParams();

    const [loadingWheelVisible, setLoadingWheelVisible] = React.useState(false);
    const [clients, setClients] = React.useState<Map<number, Client>>(new Map());
    const [event, setEvent] = React.useState<CalendarEvent | null>(null);

    const [addClientId, setAddClientId] = React.useState('');
    const [addDrawerShown, setAddDrawerShown] = React.useState(false);

    const [deleteBookingId, setDeleteBookingId] = React.useState<number>(0);
    const [deleteDialogOpen, setDeleteDialogOpen] = React.useState(false);

    const getClients = () => {
        setLoadingWheelVisible(true);
        ClientService.getList()
            .then((clientList) => {
                setLoadingWheelVisible(false);
                const clientMap: Map<number, Client> = new Map();
                clientList.map(client => clientMap.set(client.id, client));
                setClients(clientMap);
            });
    }

    const getEvent = () => {
        setLoadingWheelVisible(true);
        CalendarService.getEvent(Number.parseInt(typeof eventId === "string" ? eventId : "0"))
            .then((event) => {
                setLoadingWheelVisible(false);
                setEvent(event);
            });
    }

    React.useEffect(() => {
        getClients();
        getEvent();
    }, []);

    const onDeleteDialogClose = () => {
        setDeleteDialogOpen(false);
    }

    const onDeleteDialogNoClick = () => {
        setDeleteDialogOpen(false);
    }

    const onDeleteDialogYesClick = () => {
        setDeleteDialogOpen(false);
        CalendarService.deleteBooking(deleteBookingId)
            .then(() => {
                getEvent();
            });
    }

    const onAddDrawerClose = (event: React.KeyboardEvent | React.MouseEvent) => {
        if (
            event.type === 'keydown' &&
            ((event as React.KeyboardEvent).key === 'Tab' ||
                (event as React.KeyboardEvent).key === 'Shift')
        ) {
            return;
        }
        setAddDrawerShown(false);
    };

    const onAddButtonClick = (event: React.KeyboardEvent | React.MouseEvent) => {
        if (
            event.type === 'keydown' &&
            ((event as React.KeyboardEvent).key === 'Tab' ||
                (event as React.KeyboardEvent).key === 'Shift')
        ) {
            return;
        }
        setAddDrawerShown(true);
    };

    const onDeleteClick = (id: string) => {
        setDeleteBookingId(Number.parseInt(id));
        setDeleteDialogOpen(true);
    }

    const onAddClick = () => {
        const form = new BookingCreateForm(addClientId, eventId ? eventId : '');
        setLoadingWheelVisible(true);
        CalendarService.createBooking(form)
            .then((response) => {
                if (200 === response.status) {
                    setAddDrawerShown(false);
                    setAddClientId('');
                    setLoadingWheelVisible(false);

                    const variant: VariantType = 'success';
                    enqueueSnackbar('Succes', {variant});
                    getEvent();
                } else {
                    setLoadingWheelVisible(false);
                    response.json().then(json => {
                        const variant: VariantType = 'error';
                        enqueueSnackbar(json.message, {variant});
                    });
                }
            });
    }

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
                {event ? (
                    <TableContainer component={Paper}>
                        <Typography component="h2" variant="h6" color="primary" px={2} py={0}>
                            {event.trainingClass.name} :: {dateToDateStr(event.beginsAt)} :: {event.location.name}
                            &nbsp;:: {event.bookings.length} din {event.maxCapacity} locuri ocupate
                        </Typography>
                        <Button onClick={onAddButtonClick} variant="outlined" color="success" sx={{ml: 2, mt: 2}}>
                            <AddCircleIcon fontSize="small"/>
                        </Button>
                        <Table>
                            <TableHead>
                                <TableRow>
                                    <TableCell>Nume</TableCell>
                                    <TableCell>Email</TableCell>
                                    <TableCell>Telefon</TableCell>
                                    <TableCell>Creat la data</TableCell>
                                    <TableCell/>
                                </TableRow>
                            </TableHead>
                            <TableBody>

                                {event.bookings.map((booking) => (
                                    <TableRow
                                        key={booking.id}
                                        sx={{'&:last-child td, &:last-child th': {border: 0}}}
                                    >
                                        <TableCell>{clients.get(booking.clientId)?.firstName + " " + clients.get(booking.clientId)?.lastName}</TableCell>
                                        <TableCell>{clients.get(booking.clientId)?.email}</TableCell>
                                        <TableCell>{clients.get(booking.clientId)?.mobilePhone}</TableCell>
                                        <TableCell>{dateToDateTimeStr(booking.createdAt)}</TableCell>
                                        <TableCell align="right">
                                            <IconButton aria-label="delete" size="small" color="error"
                                                        onClick={() => onDeleteClick(booking.id.toString())}>
                                                <DeleteIcon fontSize="small"/>
                                            </IconButton>
                                        </TableCell>
                                    </TableRow>
                                ))}

                            </TableBody>
                        </Table>
                    </TableContainer>
                ) : ''}
            </Box>

            <Drawer
                anchor='right'
                open={addDrawerShown}
                onClose={onAddDrawerClose}
            >
                <Typography component="h2" variant="h6" color="primary" px={2} py={1}>
                    Programeaza client
                </Typography>
                <Box sx={{width: 420, px: 2}}>
                    <Grid container spacing={2}>
                        <Grid item xs={12}>
                            <FormControl sx={{width: '100%'}}>
                                <Autocomplete
                                    disablePortal
                                    options={Array.from(clients.values())}
                                    onChange={(event, newValue) => {
                                        setAddClientId(newValue ? newValue.id.toString() : '');
                                    }}
                                    getOptionLabel={(client: Client) => client.firstName + " " + client.lastName + " (" + client.email + ")"}
                                    renderInput={(params) =>
                                        <TextField {...params} label="Cauta client"/>
                                    }
                                />
                            </FormControl>
                        </Grid>
                        <Grid item xs={12}>
                            <FormControl sx={{width: '100%'}}>
                                <Button variant="contained" onClick={onAddClick}>Adauga programare</Button>
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
                        Sigur vrei sa stergi aceasta rezervare?
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