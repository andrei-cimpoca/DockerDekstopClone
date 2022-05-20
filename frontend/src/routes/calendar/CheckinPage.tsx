import * as React from 'react';
import Box from '@mui/material/Box';
import Toolbar from '@mui/material/Toolbar';
import MainMenu, {DrawerWidth} from "../../fragments/mainmenu/MainMenu";
import TextField from '@mui/material/TextField';
import DateRangePicker, {DateRange} from '@mui/lab/DateRangePicker';
import AdapterDateFns from '@mui/lab/AdapterDateFns';
import LocalizationProvider from '@mui/lab/LocalizationProvider';
import roLocale from 'date-fns/locale/ro';
import {
    Autocomplete,
    Backdrop,
    Button,
    ButtonGroup,
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
    InputLabel,
    MenuItem,
    Paper,
    Select,
    SelectChangeEvent,
    Table,
    TableBody,
    TableCell,
    TableContainer,
    TableHead,
    TableRow,
    Typography
} from "@mui/material";
import CalendarService, {EventFilters} from "./CalendarService";
import CheckCircleIcon from '@mui/icons-material/CheckCircle';
import DeleteIcon from '@mui/icons-material/Delete';
import DoDisturbOnIcon from '@mui/icons-material/DoDisturbOn';
import StopCircleIcon from "@mui/icons-material/StopCircle";
import LocationService from "../location/LocationService";
import Location from "../location/Location";
import CalendarEvent from "./CalendarEvent";
import {dateToDateStr, dateToDay, dateToTimeStr} from "../../util/DateUtil";
import TrainingClassService from "../trainingclass/TrainingClassService";
import TrainingClass from "../trainingclass/TrainingClass";
import {useSnackbar, VariantType} from "notistack";
import Client from "../client/Client";
import ClientService from "../client/ClientService";
import AuthenticationService from "../account/AuthenticationService";
import AddCircleIcon from "@mui/icons-material/AddCircle";
import BookingCreateForm from "./BookingCreateForm";
import {BookingStatus} from "./BookingStatus";

const drawerWidth = DrawerWidth;

const today = new Date();
const oneWeekFromNow = new Date();
oneWeekFromNow.setDate(oneWeekFromNow.getDate() + 7);

export default function CheckinPage() {
    const {enqueueSnackbar} = useSnackbar();

    const staffMemberId = AuthenticationService.getDetails()?.id;

    const [loadingWheelVisible, setLoadingWheelVisible] = React.useState(false);
    const [period, setPeriod] = React.useState<DateRange<Date>>([today, oneWeekFromNow]);
    const [trainingClassId, setTrainingClassId] = React.useState('');
    const [locationId, setLocationId] = React.useState('');
    const [trainingClasses, setTrainingClasses] = React.useState<TrainingClass[]>([]);
    const [locations, setLocations] = React.useState<Location[]>([]);
    const [clients, setClients] = React.useState<Map<number, Client>>(new Map());
    const [eventsByDay, setEventsByDay] = React.useState<Map<string, CalendarEvent[]>>(new Map());

    const [eventId, setEventId] = React.useState('');
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

    const getEvents = () => {
        if (null == period[0] || null == period[1]) {
            return;
        }
        setLoadingWheelVisible(true);
        CalendarService.getEvents(new EventFilters(period[0], period[1], trainingClassId, locationId, staffMemberId))
            .then((events) => {
                setLoadingWheelVisible(false);
                const eventsByDay = new Map<string, CalendarEvent[]>();
                events.forEach((event: CalendarEvent) => {
                    const day: string = dateToDay(event.beginsAt);
                    if (!eventsByDay.has(day)) {
                        eventsByDay.set(day, []);
                    }
                    const dailyEvents: CalendarEvent[] | undefined = eventsByDay.get(day);
                    // @ts-ignore
                    dailyEvents.push(event);
                });
                setEventsByDay(eventsByDay)
            });
    }

    React.useEffect(() => {
        TrainingClassService.getList()
            .then(trainingClasses => setTrainingClasses(trainingClasses));
        LocationService.getList()
            .then(locations => setLocations(locations));
        getClients();
    }, []);

    React.useEffect(() => {
        getEvents();
    }, [trainingClassId, locationId, staffMemberId, period]);

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
                getEvents();
            });
    }

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
                    getEvents();
                } else {
                    setLoadingWheelVisible(false);
                    response.json().then(json => {
                        const variant: VariantType = 'error';
                        enqueueSnackbar(json.message, {variant});
                    });
                }
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

    const onAddButtonClick = (id: string) => {
        setAddDrawerShown(true);
        setEventId(id);
    };

    let tables: JSX.Element;

    const onStatusChangeClick = (id: number, status: BookingStatus) => {
        CalendarService.setBookingStatus(id, status)
            .then(() => {
                getEvents();
            });
    }

    tables =
        <>
            {Array.from(eventsByDay.values()).map((dailyEvents: CalendarEvent[]) => (
                <>
                    <Typography component="h2" variant="h6" color="primary" pt={2}
                                key={dailyEvents[0].beginsAt.getTime()}>
                        {dateToDateStr(dailyEvents[0].beginsAt)}
                    </Typography>
                    {dailyEvents.map((event) => (
                        <Grid item xs={12} md={12} lg={12} pt={2} key={dailyEvents[0].beginsAt.getTime()}>
                            <TableContainer component={Paper}>
                                <Typography px={2}>
                                    {dateToTimeStr(event.beginsAt)} - {dateToTimeStr(event.endsAt)}
                                    &nbsp;:: {event.trainingClass.name}
                                    &nbsp;:: {event.location.name}
                                    &nbsp;:: ( {event.bookings.length} / {event.maxCapacity} )
                                </Typography>
                                <Button onClick={() => onAddButtonClick(event.id.toString())} variant="outlined"
                                        color="success"
                                        value={event.id} sx={{ml: 2, mt: 2}}>
                                    <AddCircleIcon fontSize="small"/>
                                </Button>
                                <Table size="small">
                                    <TableHead>
                                        <TableRow>
                                            <TableCell>Status</TableCell>
                                            <TableCell>Nume</TableCell>
                                            <TableCell>Email</TableCell>
                                            <TableCell>Telefon</TableCell>
                                            <TableCell/>
                                        </TableRow>
                                    </TableHead>
                                    <TableBody>
                                        {event.bookings.map(booking => (
                                            <TableRow
                                                key={booking.id}
                                                sx={{'&:last-child td, &:last-child th': {border: 0}}}
                                            >
                                                <TableCell>
                                                    <ButtonGroup variant="outlined" aria-label="outlined button group">
                                                        <Button color="success" variant={booking.status == BookingStatus.SHOWED_UP ? 'contained' : 'outlined'}
                                                                onClick={() => onStatusChangeClick(booking.id, BookingStatus.SHOWED_UP)}><CheckCircleIcon/></Button>
                                                        <Button color="warning" variant={booking.status == BookingStatus.EARLY_CANCEL ? 'contained' : 'outlined'}
                                                                onClick={() => onStatusChangeClick(booking.id, BookingStatus.EARLY_CANCEL)}><StopCircleIcon/></Button>
                                                        <Button color="error" variant={booking.status == BookingStatus.LATE_CANCEL ? 'contained' : 'outlined'}
                                                                onClick={() => onStatusChangeClick(booking.id, BookingStatus.LATE_CANCEL)}><DoDisturbOnIcon/></Button>
                                                    </ButtonGroup>
                                                </TableCell>
                                                <TableCell>{clients.get(booking.clientId)?.firstName + " " + clients.get(booking.clientId)?.lastName}</TableCell>
                                                <TableCell>{clients.get(booking.clientId)?.email}</TableCell>
                                                <TableCell>{clients.get(booking.clientId)?.mobilePhone}</TableCell>
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
                        </Grid>
                    ))}
                </>
            ))}
        </>;

    return (
        <Box sx={{display: 'flex'}}>
            <MainMenu/>
            <Box
                component="main"
                sx={{backgroundColor: '#f7f7f7', flexGrow: 1, p: 3, width: {sm: `calc(100% - ${drawerWidth}px)`}}}
            >
                <Toolbar/>

                {loadingWheelVisible
                    ? (<Backdrop sx={{color: '#fff', zIndex: (theme) => theme.zIndex.drawer + 1}}
                                 open={loadingWheelVisible}>
                        <CircularProgress color="inherit"/>
                    </Backdrop>) : ''}

                <LocalizationProvider dateAdapter={AdapterDateFns} locale={roLocale}>
                    <Grid container spacing={2}>
                        <Grid item xs={12} sm={12} md={6} lg={4}>
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
                        <Grid item xs={12} sm={12} md={6} lg={4}>
                            <FormControl sx={{width: '100%'}}>
                                <InputLabel id="label1">Clasa</InputLabel>
                                <Select
                                    labelId="label1"
                                    id="select1"
                                    value={trainingClassId}
                                    label="Clasa"
                                    onChange={(event: SelectChangeEvent) => {
                                        setTrainingClassId(event.target.value as string);
                                    }}
                                >
                                    <MenuItem value=''>( toate )</MenuItem>
                                    {trainingClasses.map((trainingClass: TrainingClass) => (
                                        <MenuItem key={trainingClass.id}
                                                  value={trainingClass.id}>{trainingClass.name}</MenuItem>
                                    ))}
                                </Select>
                            </FormControl>
                        </Grid>
                        <Grid item xs={12} sm={12} md={6} lg={4}>
                            <FormControl sx={{width: '100%'}}>
                                <InputLabel id="locationIdLabel">Locatie</InputLabel>
                                <Select
                                    labelId="locationIdLabel"
                                    id="locationId"
                                    value={locationId}
                                    label="Locatie"
                                    onChange={(event: SelectChangeEvent) => {
                                        setLocationId(event.target.value as string);
                                    }}
                                >
                                    <MenuItem value=''>( toate )</MenuItem>
                                    {locations.map((location: Location) => (
                                        <MenuItem key={location.id} value={location.id}>{location.name}</MenuItem>
                                    ))}
                                </Select>
                            </FormControl>
                        </Grid>
                    </Grid>
                </LocalizationProvider>

                {tables}

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