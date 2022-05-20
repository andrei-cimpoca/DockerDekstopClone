import * as React from 'react';
import Box from '@mui/material/Box';
import Toolbar from '@mui/material/Toolbar';
import MainMenu, {DrawerWidth} from "../../fragments/mainmenu/MainMenu";
import {
    Backdrop,
    Button, Checkbox,
    CircularProgress,
    Dialog,
    DialogActions,
    DialogContent,
    DialogContentText,
    DialogTitle, Drawer, FormControl, FormControlLabel,
    Grid,
    IconButton, InputLabel, ListItemText, MenuItem, OutlinedInput,
    Paper, Select, SelectChangeEvent,
    Tab,
    Table,
    TableBody,
    TableCell,
    TableContainer,
    TableHead,
    TableRow,
    Typography
} from "@mui/material";
import {useParams} from "react-router-dom";
import Client from "../client/Client";
import ClientService from "../client/ClientService";
import {DatePicker, TabContext, TabList, TabPanel} from "@mui/lab";
import {dateToDateTimeStr, dateToDay} from "../../util/DateUtil";
import CalendarService from "../calendar/CalendarService";
import CalendarEventClient from "../calendar/CalendarEventClient";
import DeleteIcon from "@mui/icons-material/Delete";
import {bookingStatusMap} from "../calendar/BookingStatus";
import ClientSubscription from "../subscription/ClientSubscription";
import ClientSubscriptionService, {ClientSubscriptionFilters} from "../subscription/ClientSubscriptionService";
import EditIcon from "@mui/icons-material/Edit";
import TextField from "@mui/material/TextField";
import {DiscountType, discountTypes} from "../coupon/DiscountType";
import LocalizationProvider from "@mui/lab/LocalizationProvider";
import AdapterDateFns from "@mui/lab/AdapterDateFns";
import roLocale from "date-fns/locale/ro";
import CouponForm from "../coupon/CouponForm";
import CouponService from "../coupon/CouponService";
import {useSnackbar, VariantType} from "notistack";
import ClientSubscriptionForm from "../subscription/ClientSubscriptionForm";

const drawerWidth = DrawerWidth;

export default function ClientInfoPage() {
    const {enqueueSnackbar} = useSnackbar();
    const {clientId} = useParams();

    const [loadingWheelVisible, setLoadingWheelVisible] = React.useState(false);
    const [tabPage, setTabPage] = React.useState('profile');
    const [client, setClient] = React.useState<Client | null>(null);
    const [clientBookings, setClientBookings] = React.useState<CalendarEventClient[]>([]);
    const [clientSubscriptions, setClientSubscriptions] = React.useState<ClientSubscription[]>([]);

    const [editClientSubscriptionDrawerShown, setEditClientSubscriptionDrawerShown] = React.useState(false);
    const [editClientSubscriptionId, setEditClientSubscriptionId] = React.useState<number | null>(null);
    const [formClientSubscriptionBeginsAt, setFormClientSubscriptionBeginsAt] = React.useState<Date | null>(null);
    const [formClientSubscriptionEndsAt, setFormClientSubscriptionEndsAt] = React.useState<Date | null>(null);


    const [deleteBookingId, setDeleteBookingId] = React.useState<number>(0);
    const [deleteDialogOpen, setDeleteDialogOpen] = React.useState(false);

    const getClient = () => {
        setLoadingWheelVisible(true);
        ClientService.getClient(Number.parseInt(typeof clientId === "string" ? clientId : "0"))
            .then((client) => {
                setLoadingWheelVisible(false);
                setClient(client);
            });
    }

    const getClientBookings = () => {
        setLoadingWheelVisible(true);
        CalendarService.getClientBookings(Number.parseInt(typeof clientId === "string" ? clientId : "0"))
            .then((bookings) => {
                setLoadingWheelVisible(false);
                setClientBookings(bookings);
            });
    }

    const getClientSubscriptions = () => {
        setLoadingWheelVisible(true);
        let filters = new ClientSubscriptionFilters(
            typeof clientId === "string" ? clientId : "0",
            null, null, null, null, null
        );
        ClientSubscriptionService.getList(filters)
            .then((subscriptions) => {
                setLoadingWheelVisible(false);
                setClientSubscriptions(subscriptions);
            });
    }

    React.useEffect(() => {
        getClient();
        getClientBookings();
        getClientSubscriptions();
    }, []);

    const onDeleteClick = (id: string) => {
        setDeleteBookingId(Number.parseInt(id));
        setDeleteDialogOpen(true);
    }

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
                getClientBookings();
            });
    }

    const onEditSubscriptionClick = (id: string) => {
        let clientSubscription = clientSubscriptions.find(value => value.id == Number.parseInt(id));
        if (undefined == clientSubscription) {
            return;
        }
        setEditClientSubscriptionId(clientSubscription.id);
        setFormClientSubscriptionBeginsAt(clientSubscription.beginsAt);
        setFormClientSubscriptionEndsAt(clientSubscription.endsAt);
        setEditClientSubscriptionDrawerShown(true);
    }

    const onEditClientSubscriptionDrawerClose = (event: React.KeyboardEvent | React.MouseEvent) => {
        if (
            event.type === 'keydown' &&
            ((event as React.KeyboardEvent).key === 'Tab' ||
                (event as React.KeyboardEvent).key === 'Shift')
        ) {
            return;
        }
        setEditClientSubscriptionDrawerShown(false);
    };

    const onEditClientSubscriptionSaveClick = () => {
        //TODO add proper validation
        if (
            null == formClientSubscriptionBeginsAt
            || null == formClientSubscriptionEndsAt
        ) {
            return;
        }
        const form = new ClientSubscriptionForm(
            formClientSubscriptionBeginsAt,
            formClientSubscriptionEndsAt
        );

        setLoadingWheelVisible(true);

        ClientSubscriptionService.save(editClientSubscriptionId, form)
            .then((response) => {
                if (200 === response.status) {
                    setEditClientSubscriptionDrawerShown(false);

                    setEditClientSubscriptionId(null);
                    setFormClientSubscriptionBeginsAt(null);
                    setFormClientSubscriptionEndsAt(null);

                    const variant: VariantType = 'success';
                    enqueueSnackbar('Succes', {variant});
                    getClientSubscriptions();
                } else {
                    response.json().then(json => {
                        const variant: VariantType = 'error';
                        enqueueSnackbar(json.message, {variant});
                    });
                }
            }).finally(() => setLoadingWheelVisible(false));
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
                {client ? (
                    <>
                        <Typography component="h2" variant="h6" color="primary" px={2} py={0}>
                            Detalii client :: {client.firstName} {client.lastName}
                        </Typography>
                        <TabContext value={tabPage}>
                            <Box sx={{borderBottom: 1, borderColor: 'divider'}}>
                                <TabList onChange={(event: React.SyntheticEvent, newValue: string) => {
                                    setTabPage(newValue);
                                }} aria-label="lab API tabs example">
                                    <Tab label="Profil" value="profile"/>
                                    <Tab label="Date facturare" value="billing"/>
                                    <Tab label="Rezervari" value="bookings"/>
                                    <Tab label="Abonamente" value="subscriptions"/>
                                    <Tab label="Plati" value="payments"/>
                                </TabList>
                            </Box>

                            <TabPanel value="profile">
                                <Grid
                                    container
                                    component='dl'
                                    spacing={2}>
                                    <Grid item sm={4} xs={12}>
                                        <Typography className="col-sm-3">Prenume</Typography>
                                    </Grid>
                                    <Grid item sm={8} xs={12}>
                                        <Typography className="col-sm-9">{client.firstName}</Typography>
                                    </Grid>

                                    <Grid item sm={4} xs={12}>
                                        <Typography className="col-sm-3">Nume</Typography>
                                    </Grid>
                                    <Grid item sm={8} xs={12}>
                                        <Typography className="col-sm-9">{client.lastName}</Typography>
                                    </Grid>

                                    <Grid item sm={4} xs={12}>
                                        <Typography className="col-sm-3">Email</Typography>
                                    </Grid>
                                    <Grid item sm={8} xs={12}>
                                        <Typography className="col-sm-9">{client.email}</Typography>
                                    </Grid>

                                    <Grid item sm={4} xs={12}>
                                        <Typography className="col-sm-3">Telefon</Typography>
                                    </Grid>
                                    <Grid item sm={8} xs={12}>
                                        <Typography className="col-sm-9">{client.mobilePhone}</Typography>
                                    </Grid>

                                    <Grid item sm={4} xs={12}>
                                        <Typography className="col-sm-3">Tara</Typography>
                                    </Grid>
                                    <Grid item sm={8} xs={12}>
                                        <Typography className="col-sm-9">{client.country}</Typography>
                                    </Grid>

                                    <Grid item sm={4} xs={12}>
                                        <Typography className="col-sm-3">Judet</Typography>
                                    </Grid>
                                    <Grid item sm={8} xs={12}>
                                        <Typography className="col-sm-9">{client.region}</Typography>
                                    </Grid>

                                    <Grid item sm={4} xs={12}>
                                        <Typography className="col-sm-3">Oras</Typography>
                                    </Grid>
                                    <Grid item sm={8} xs={12}>
                                        <Typography className="col-sm-9">{client.city}</Typography>
                                    </Grid>

                                    <Grid item sm={4} xs={12}>
                                        <Typography className="col-sm-3">Adresa</Typography>
                                    </Grid>
                                    <Grid item sm={8} xs={12}>
                                        <Typography className="col-sm-9">{client.address}</Typography>
                                    </Grid>

                                    <Grid item sm={4} xs={12}>
                                        <Typography className="col-sm-3">Cod postal</Typography>
                                    </Grid>
                                    <Grid item sm={8} xs={12}>
                                        <Typography className="col-sm-9">{client.postalCode}</Typography>
                                    </Grid>

                                    <Grid item sm={4} xs={12}>
                                        <Typography className="col-sm-3">Data nastere</Typography>
                                    </Grid>
                                    <Grid item sm={8} xs={12}>
                                        <Typography className="col-sm-9">{dateToDay(client.birthDate)}</Typography>
                                    </Grid>

                                    <Grid item sm={4} xs={12}>
                                        <Typography className="col-sm-3">Emailuri promotionale</Typography>
                                    </Grid>
                                    <Grid item sm={8} xs={12}>
                                        <Typography
                                            className="col-sm-9">{client.receivePromotionEmails ? 'da' : 'nu'}</Typography>
                                    </Grid>
                                </Grid>
                            </TabPanel>

                            <TabPanel value="billing">
                                <Grid
                                    container
                                    component='dl' // mount a Definition List
                                    spacing={2}>
                                    <Grid item sm={4} xs={12}>
                                        <Typography className="col-sm-3">Tip cumparator</Typography>
                                    </Grid>
                                    <Grid item sm={8} xs={12}>
                                        <Typography className="col-sm-9">{client.billingData.billingType}</Typography>
                                    </Grid>

                                    <Grid item sm={4} xs={12}>
                                        <Typography className="col-sm-3">Metoda de plata</Typography>
                                    </Grid>
                                    <Grid item sm={8} xs={12}>
                                        <Typography className="col-sm-9">{client.billingData.paymentMethod}</Typography>
                                    </Grid>

                                    <Grid item sm={4} xs={12}>
                                        <Typography className="col-sm-3">Nume companie</Typography>
                                    </Grid>
                                    <Grid item sm={8} xs={12}>
                                        <Typography className="col-sm-9">{client.billingData.companyName}</Typography>
                                    </Grid>

                                    <Grid item sm={4} xs={12}>
                                        <Typography className="col-sm-3">Prenume</Typography>
                                    </Grid>
                                    <Grid item sm={8} xs={12}>
                                        <Typography className="col-sm-9">{client.billingData.firstName}</Typography>
                                    </Grid>

                                    <Grid item sm={4} xs={12}>
                                        <Typography className="col-sm-3">Nume</Typography>
                                    </Grid>
                                    <Grid item sm={8} xs={12}>
                                        <Typography className="col-sm-9">{client.billingData.lastName}</Typography>
                                    </Grid>

                                    <Grid item sm={4} xs={12}>
                                        <Typography className="col-sm-3">Cod fiscal</Typography>
                                    </Grid>
                                    <Grid item sm={8} xs={12}>
                                        <Typography className="col-sm-9">{client.billingData.fiscalNumber}</Typography>
                                    </Grid>

                                    <Grid item sm={4} xs={12}>
                                        <Typography className="col-sm-3">CUI</Typography>
                                    </Grid>
                                    <Grid item sm={8} xs={12}>
                                        <Typography
                                            className="col-sm-9">{client.billingData.identityNumber}</Typography>
                                    </Grid>

                                    <Grid item sm={4} xs={12}>
                                        <Typography className="col-sm-3">Tara</Typography>
                                    </Grid>
                                    <Grid item sm={8} xs={12}>
                                        <Typography className="col-sm-9">{client.billingData.country}</Typography>
                                    </Grid>

                                    <Grid item sm={4} xs={12}>
                                        <Typography className="col-sm-3">Judet</Typography>
                                    </Grid>
                                    <Grid item sm={8} xs={12}>
                                        <Typography className="col-sm-9">{client.billingData.county}</Typography>
                                    </Grid>

                                    <Grid item sm={4} xs={12}>
                                        <Typography className="col-sm-3">Oras</Typography>
                                    </Grid>
                                    <Grid item sm={8} xs={12}>
                                        <Typography className="col-sm-9">{client.billingData.city}</Typography>
                                    </Grid>

                                    <Grid item sm={4} xs={12}>
                                        <Typography className="col-sm-3">Adresa</Typography>
                                    </Grid>
                                    <Grid item sm={8} xs={12}>
                                        <Typography className="col-sm-9">{client.billingData.address}</Typography>
                                    </Grid>

                                    <Grid item sm={4} xs={12}>
                                        <Typography className="col-sm-3">Email</Typography>
                                    </Grid>
                                    <Grid item sm={8} xs={12}>
                                        <Typography className="col-sm-9">{client.billingData.email}</Typography>
                                    </Grid>

                                    <Grid item sm={4} xs={12}>
                                        <Typography className="col-sm-3">Telefon</Typography>
                                    </Grid>
                                    <Grid item sm={8} xs={12}>
                                        <Typography className="col-sm-9">{client.billingData.mobilePhone}</Typography>
                                    </Grid>
                                </Grid>
                            </TabPanel>

                            <TabPanel value="bookings">
                                <TableContainer component={Paper}>
                                    <Table>
                                        <TableHead>
                                            <TableRow>
                                                <TableCell>Data</TableCell>
                                                <TableCell>Locatie</TableCell>
                                                <TableCell>Instructor</TableCell>
                                                <TableCell>Creat la data</TableCell>
                                                <TableCell>Status</TableCell>
                                                <TableCell/>
                                            </TableRow>
                                        </TableHead>
                                        <TableBody>

                                            {clientBookings.map((event) => (
                                                <TableRow
                                                    key={event.booking.id}
                                                    sx={{'&:last-child td, &:last-child th': {border: 0}}}
                                                >
                                                    <TableCell>{dateToDateTimeStr(event.beginsAt)}</TableCell>
                                                    <TableCell>{event.location.name}</TableCell>
                                                    <TableCell>{event.staffMember.name}</TableCell>
                                                    <TableCell>{dateToDateTimeStr(event.booking.createdAt)}</TableCell>
                                                    <TableCell>{bookingStatusMap.get(event.booking.status)}</TableCell>
                                                    <TableCell align="right">
                                                        <IconButton aria-label="delete" size="small" color="error"
                                                                    onClick={() => onDeleteClick(event.booking.id.toString())}>
                                                            <DeleteIcon fontSize="small"/>
                                                        </IconButton>
                                                    </TableCell>
                                                </TableRow>
                                            ))}

                                        </TableBody>
                                    </Table>
                                </TableContainer>
                            </TabPanel>

                            <TabPanel value="subscriptions">
                                <TableContainer component={Paper}>
                                    <Table>
                                        <TableHead>
                                            <TableRow>
                                                <TableCell>ID</TableCell>
                                                <TableCell>Nume</TableCell>
                                                <TableCell>Sesiuni</TableCell>
                                                <TableCell>Perioada</TableCell>
                                                <TableCell>Creat la data</TableCell>
                                                <TableCell>Platit</TableCell>
                                                <TableCell>Suspendat</TableCell>
                                                <TableCell/>
                                            </TableRow>
                                        </TableHead>
                                        <TableBody>

                                            {clientSubscriptions.map((subscription) => (
                                                <TableRow
                                                    key={subscription.id}
                                                    sx={{'&:last-child td, &:last-child th': {border: 0}}}
                                                >
                                                    <TableCell>{subscription.id}</TableCell>
                                                    <TableCell>{subscription.name}</TableCell>
                                                    <TableCell>{subscription.bookedSessions + " / " + subscription.maxSessions}</TableCell>
                                                    <TableCell>{(subscription.beginsAt ? dateToDateTimeStr(subscription.beginsAt) : '') + " - " + (subscription.endsAt ? dateToDateTimeStr(subscription.endsAt) : '')}</TableCell>
                                                    <TableCell>{dateToDateTimeStr(subscription.createdAt)}</TableCell>
                                                    <TableCell>{subscription.paid ? 'da' : 'nu'}</TableCell>
                                                    <TableCell>{subscription.suspended ? 'da' : 'nu'}</TableCell>
                                                    <TableCell align="right">
                                                        <IconButton aria-label="delete" size="small" color="success"
                                                                    onClick={() => onEditSubscriptionClick(subscription.id.toString())}>
                                                            <EditIcon fontSize="small"/>
                                                        </IconButton>
                                                    </TableCell>
                                                </TableRow>
                                            ))}

                                        </TableBody>
                                    </Table>
                                </TableContainer>
                            </TabPanel>

                            <TabPanel value="payments">Item 5</TabPanel>

                        </TabContext>
                    </>
                ) : ''}
            </Box>

            <Drawer
                anchor='right'
                open={editClientSubscriptionDrawerShown}
                onClose={onEditClientSubscriptionDrawerClose}
            >
                <Typography component="h2" variant="h6" color="primary" px={2} py={1}>
                    {editClientSubscriptionId ? 'Editeaza abonament' : 'Adauga abonament'}
                </Typography>
                <Box sx={{width: 420, px: 2}}>
                    <Grid container spacing={2}>
                        <Grid item xs={6}>
                            <FormControl sx={{width: '100%'}}>
                                <LocalizationProvider dateAdapter={AdapterDateFns} locale={roLocale}>
                                    <DatePicker
                                        label="Data inceput"
                                        // date={formActivationDate}
                                        value={formClientSubscriptionBeginsAt}
                                        onChange={(newValue) => {
                                            setFormClientSubscriptionBeginsAt(newValue);
                                        }}
                                        renderInput={(params) => <TextField {...params} />}
                                    />
                                </LocalizationProvider>
                            </FormControl>
                        </Grid>
                        <Grid item xs={6}>
                            <FormControl sx={{width: '100%'}}>
                                <LocalizationProvider dateAdapter={AdapterDateFns} locale={roLocale}>
                                    <DatePicker
                                        label="Data sfarsit"
                                        // date={formExpirationDate}
                                        value={formClientSubscriptionEndsAt}
                                        onChange={(newValue) => {
                                            setFormClientSubscriptionEndsAt(newValue);
                                        }}
                                        renderInput={(params) => <TextField {...params} />}
                                    />
                                </LocalizationProvider>
                            </FormControl>
                        </Grid>

                        <Grid item xs={12}>
                            <FormControl sx={{width: '100%'}}>
                                <Button variant="contained" onClick={onEditClientSubscriptionSaveClick}>Salveaza</Button>
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