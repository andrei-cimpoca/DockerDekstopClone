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
    Backdrop,
    Button,
    ButtonGroup,
    Checkbox,
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
    ToggleButton,
    ToggleButtonGroup,
    Typography
} from "@mui/material";
import CalendarService, {EventFilters} from "./CalendarService";
import AddCircleIcon from '@mui/icons-material/AddCircle';
import DeleteIcon from '@mui/icons-material/Delete';
import EditIcon from '@mui/icons-material/Edit';
import LocationService from "../location/LocationService";
import StaffMemberService from "../staffmember/StaffMemberService";
import Location from "../location/Location";
import StaffMember from "../staffmember/StaffMember";
import CalendarEvent from "./CalendarEvent";
import {dateToDateStr, dateToDay, dateToTimeStr} from "../../util/DateUtil";
import TrainingClassService from "../trainingclass/TrainingClassService";
import TrainingClass from "../trainingclass/TrainingClass";
import CalendarEventGenerateForm from "./CalendarEventGenerateForm";
import {DatePicker, TimePicker} from "@mui/lab";
import {useSnackbar, VariantType} from "notistack";
import CalendarEventEditForm from "./CalendarEventEditForm";
import {Link} from "react-router-dom";

const drawerWidth = DrawerWidth;

const today = new Date();
const oneWeekFromNow = new Date();
oneWeekFromNow.setDate(oneWeekFromNow.getDate() + 7);

export default function CalendarPage() {
    const {enqueueSnackbar} = useSnackbar();

    const [loadingWheelVisible, setLoadingWheelVisible] = React.useState(false);
    const [period, setPeriod] = React.useState<DateRange<Date>>([today, oneWeekFromNow]);
    const [trainingClassId, setTrainingClassId] = React.useState('');
    const [locationId, setLocationId] = React.useState('');
    const [staffMemberId, setStaffMemberId] = React.useState('');
    const [trainingClasses, setTrainingClasses] = React.useState<TrainingClass[]>([]);
    const [locations, setLocations] = React.useState<Location[]>([]);
    const [staffMembers, setStaffMembers] = React.useState<StaffMember[]>([]);
    const [eventsByDay, setEventsByDay] = React.useState<Map<string, CalendarEvent[]>>(new Map());

    const [genDrawerShown, setGenDrawerShown] = React.useState(false);
    const [genFormTrainingClassId, setGenFormTrainingClassId] = React.useState('');
    const [genFormLocationId, setGenFormLocationId] = React.useState('');
    const [genFormStaffMemberId, setGenFormStaffMemberId] = React.useState('');
    const [genFormEventGenerationType, setGenFormEventGenerationType] = React.useState('0');
    const [genFormIntervalBegin, setGenFormIntervalBegin] = React.useState<Date | null>(new Date());
    const [genFormIntervalEnd, setGenFormIntervalEnd] = React.useState<Date | null>(null);
    const [genFormWeekdays, setGenFormWeekdays] = React.useState<string[]>(() => []);
    const [genFormBeginsAt, setGenFormBeginsAt] = React.useState<Date | null>(null);
    const [genFormEndsAt, setGenFormEndsAt] = React.useState<Date | null>(null);
    const [genFormMaxCapacity, setGenFormMaxCapacity] = React.useState('6');
    const [genFormWaitingListSize, setGenFormWaitingListSize] = React.useState('1');
    const [genFormMinimumBookingMinutesInterval, setGenFormMinimumBookingMinutesInterval] = React.useState('0');

    const [editDrawerShown, setEditDrawerShown] = React.useState(false);
    const [editFormTrainingClassId, setEditFormTrainingClassId] = React.useState('');
    const [editFormLocationId, setEditFormLocationId] = React.useState('');
    const [editFormStaffMemberId, setEditFormStaffMemberId] = React.useState('');
    const [editFormMaxCapacity, setEditFormMaxCapacity] = React.useState('');
    const [editFormWaitingListSize, setEditFormWaitingListSize] = React.useState('');

    const [deleteDialogOpen, setDeleteDialogOpen] = React.useState(false);

    const [selectedItems, setSelectedItems] = React.useState<number[]>(() => []);

    const getEvents = () => {
        if (null == period[0] || null == period[1]) {
            return;
        }
        setLoadingWheelVisible(true);
        setSelectedItems([]);
        let eventFilters = new EventFilters(
            period[0], period[1],
            trainingClassId,
            locationId,
            staffMemberId ? Number.parseInt(staffMemberId) : undefined);
        CalendarService.getEvents(eventFilters)
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
        StaffMemberService.getList()
            .then(staffMembers => setStaffMembers(staffMembers));
    }, []);

    React.useEffect(() => {
        getEvents();
    }, [trainingClassId, locationId, staffMemberId, period]);

    const toggleEditDrawer = (shown: boolean) => {
        if (shown) {
            setEditFormTrainingClassId('');
            setEditFormLocationId('');
            setEditFormStaffMemberId('');
            setEditFormMaxCapacity('');
            setEditFormWaitingListSize('');
        }
        setEditDrawerShown(shown);
    };

    const onDeleteDialogClose = () => {
        setDeleteDialogOpen(false);
    }

    const onDeleteDialogNoClick = () => {
        setDeleteDialogOpen(false);
    }

    const onDeleteDialogYesClick = () => {
        setDeleteDialogOpen(false);
        CalendarService.delete(selectedItems)
            .then(() => {
            getEvents();
        })
    }

    const onGenerateDrawerClose = (event: React.KeyboardEvent | React.MouseEvent) => {
        if (
            event.type === 'keydown' &&
            ((event as React.KeyboardEvent).key === 'Tab' ||
                (event as React.KeyboardEvent).key === 'Shift')
        ) {
            return;
        }
        setGenDrawerShown(false);
    };

    const onEditDrawerClose = (event: React.KeyboardEvent | React.MouseEvent) => {
        if (
            event.type === 'keydown' &&
            ((event as React.KeyboardEvent).key === 'Tab' ||
                (event as React.KeyboardEvent).key === 'Shift')
        ) {
            return;
        }
        toggleEditDrawer(false);
    };

    const onGenerateButtonClick = (event: React.KeyboardEvent | React.MouseEvent) => {
        if (
            event.type === 'keydown' &&
            ((event as React.KeyboardEvent).key === 'Tab' ||
                (event as React.KeyboardEvent).key === 'Shift')
        ) {
            return;
        }
        setGenDrawerShown(true);
    };

    const onMultipleEditButtonClick = (event: React.KeyboardEvent | React.MouseEvent) => {
        if (
            event.type === 'keydown' &&
            ((event as React.KeyboardEvent).key === 'Tab' ||
                (event as React.KeyboardEvent).key === 'Shift')
        ) {
            return;
        }
        if (0 === selectedItems.length) {
            return;
        }
        toggleEditDrawer(true);
    };

    const onItemCheckboxChange = (event: React.ChangeEvent<HTMLInputElement>) => {
        const newSelectedItems: number[] = JSON.parse(JSON.stringify(selectedItems));
        const value = Number.parseInt(event.target.name);
        const checked = event.target.checked;
        if (checked) {
            newSelectedItems.push(value);
        } else {
            newSelectedItems.splice(newSelectedItems.indexOf(value), 1);
        }
        setSelectedItems(newSelectedItems);
    }

    const onDayCheckboxChange = (event: React.ChangeEvent<HTMLInputElement>) => {
        const newSelectedItems: number[] = JSON.parse(JSON.stringify(selectedItems));
        const dayLabel = event.target.name;
        const checked = event.target.checked;
        // @ts-ignore
        Array.from(eventsByDay.get(dayLabel).values()).map(item => {
            if (checked) {
                newSelectedItems.push(item.id);
            } else {
                newSelectedItems.splice(newSelectedItems.indexOf(item.id), 1);
            }
        });
        setSelectedItems(newSelectedItems);
    }

    const onSingleEditClick = (id: string) => {
        setSelectedItems([Number.parseInt(id)]);
        toggleEditDrawer(true);
    }

    const onSingleDeleteClick = (id: string) => {
        setSelectedItems([Number.parseInt(id)]);
        setDeleteDialogOpen(true);
    }

    const onMultipleDeleteButtonClick = (event: React.KeyboardEvent | React.MouseEvent) => {
        if (
            event.type === 'keydown' &&
            ((event as React.KeyboardEvent).key === 'Tab' ||
                (event as React.KeyboardEvent).key === 'Shift')
        ) {
            return;
        }
        if (0 === selectedItems.length) {
            return;
        }
        setDeleteDialogOpen(true);
    };

    const onGenerateClick = () => {
        if (genFormIntervalBegin && genFormBeginsAt && genFormEndsAt) {
            const form = new CalendarEventGenerateForm(
                genFormTrainingClassId,
                genFormLocationId,
                genFormStaffMemberId,
                genFormEventGenerationType,
                genFormIntervalBegin,
                genFormIntervalEnd,
                genFormWeekdays,
                genFormBeginsAt,
                genFormEndsAt,
                genFormMaxCapacity,
                genFormWaitingListSize,
                genFormMinimumBookingMinutesInterval
            );
            setLoadingWheelVisible(true);
            CalendarService.generateEvents(form)
                .then((response) => {
                    if (200 === response.status) {
                        setGenDrawerShown(false);
                        setLoadingWheelVisible(false);

                        setGenFormTrainingClassId("");
                        setGenFormLocationId("");
                        setGenFormStaffMemberId("");
                        setGenFormEventGenerationType("0");
                        setGenFormIntervalBegin(new Date());
                        setGenFormIntervalEnd(null);
                        setGenFormWeekdays([]);
                        setGenFormBeginsAt(null);
                        setGenFormEndsAt(null);
                        setGenFormMaxCapacity("6");
                        setGenFormWaitingListSize("1");
                        setGenFormMinimumBookingMinutesInterval("0");

                        const variant: VariantType = 'success';
                        enqueueSnackbar('Succes', {variant});
                        getEvents();
                    } else {
                        response.json().then(json => {
                            const variant: VariantType = 'error';
                            enqueueSnackbar(json.message, {variant});
                        });
                    }
                });
        }
    }

    const onSaveClick = () => {
        const form = new CalendarEventEditForm(
            selectedItems,
            editFormTrainingClassId,
            editFormLocationId,
            editFormStaffMemberId,
            editFormMaxCapacity,
            editFormWaitingListSize
        );
        setLoadingWheelVisible(true);
        CalendarService.save(form)
            .then((response) => {
                if (200 === response.status) {
                    setEditDrawerShown(false);
                    setLoadingWheelVisible(false);

                    const variant: VariantType = 'success';
                    enqueueSnackbar('Succes', {variant});
                    getEvents();
                } else {
                    response.json().then(json => {
                        const variant: VariantType = 'error';
                        enqueueSnackbar(json.message, {variant});
                    });
                }
            });
    }

    let tables: JSX.Element;
    if (loadingWheelVisible) {
        tables = <Backdrop sx={{color: '#fff', zIndex: (theme) => theme.zIndex.drawer + 1}} open={loadingWheelVisible}>
            <CircularProgress color="inherit"/>
        </Backdrop>;
    } else {
        tables =
            <>
                {Array.from(eventsByDay.values()).map((dailyEvents: CalendarEvent[]) => (
                    <Grid item xs={12} md={12} lg={12} pt={2} key={dailyEvents[0].beginsAt.getTime()}>
                        <TableContainer component={Paper}>
                            <Typography component="h2" variant="h6" color="primary" px={2} py={0}>
                                {dateToDateStr(dailyEvents[0].beginsAt)}
                            </Typography>
                            <Table size="small">
                                <TableHead>
                                    <TableRow>
                                        <TableCell>
                                            <Checkbox size="small"
                                                      name={dateToDay(dailyEvents[0].beginsAt)}
                                                      onChange={onDayCheckboxChange}/>
                                        </TableCell>
                                        <TableCell>Interval</TableCell>
                                        <TableCell>Rezervari</TableCell>
                                        <TableCell>Clasa</TableCell>
                                        <TableCell>Instructor</TableCell>
                                        <TableCell>Locatie</TableCell>
                                        <TableCell/>
                                    </TableRow>
                                </TableHead>
                                <TableBody>
                                    {dailyEvents.map((event) => (
                                        <TableRow
                                            key={event.id}
                                            sx={{'&:last-child td, &:last-child th': {border: 0}}}
                                        >
                                            <TableCell>
                                                <Checkbox size="small" name={event.id.toString()}
                                                          checked={selectedItems.indexOf(event.id) > -1}
                                                          onChange={onItemCheckboxChange}/>
                                            </TableCell>
                                            <TableCell>{dateToTimeStr(event.beginsAt)} - {dateToTimeStr(event.endsAt)}</TableCell>
                                            <TableCell><Link to={'/calendar/bookings/' + event.id}>{event.bookings.length} / {event.maxCapacity}</Link></TableCell>
                                            <TableCell>{event.trainingClass.name}</TableCell>
                                            <TableCell>{event.staffMember.name}</TableCell>
                                            <TableCell>{event.location.name}</TableCell>
                                            <TableCell align="right">
                                                <IconButton aria-label="edit" size="small" color="success"
                                                            onClick={() => onSingleEditClick(event.id.toString())}>
                                                    <EditIcon fontSize="small"/>
                                                </IconButton>
                                                <IconButton aria-label="delete" size="small" color="error"
                                                            onClick={() => onSingleDeleteClick(event.id.toString())}>
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
            </>;
    }

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
                        <Grid item xs={12} sm={12} md={6} lg={3}>
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
                        <Grid item xs={12} sm={12} md={6} lg={3}>
                            <FormControl sx={{width: '100%'}}>
                                <InputLabel id="staffMemberIdLabel">Instructor</InputLabel>
                                <Select
                                    labelId="staffMemberIdLabel"
                                    id="staffMemberId"
                                    value={staffMemberId}
                                    label="Instructor"
                                    onChange={(event: SelectChangeEvent) => {
                                        setStaffMemberId(event.target.value as string);
                                    }}
                                >
                                    <MenuItem value=''>( toate )</MenuItem>
                                    {staffMembers.map((staffMember: StaffMember) => (
                                        <MenuItem key={staffMember.id}
                                                  value={staffMember.id}>{staffMember.name}</MenuItem>
                                    ))}
                                </Select>
                            </FormControl>
                        </Grid>
                        <Grid item xs={12}>
                            <ButtonGroup variant="outlined" aria-label="outlined button group">
                                <Button onClick={onGenerateButtonClick} color="success">
                                    <AddCircleIcon fontSize="small"/>
                                </Button>
                                {(selectedItems.length > 0) ? (
                                    <>
                                        <Button onClick={onMultipleEditButtonClick} color="success">
                                            <EditIcon fontSize="small"/>
                                        </Button>
                                        <Button color="error" onClick={onMultipleDeleteButtonClick}>
                                            <DeleteIcon fontSize="small"/>
                                        </Button>
                                    </>
                                ) : ''}
                            </ButtonGroup>
                        </Grid>
                    </Grid>
                </LocalizationProvider>

                {tables}

            </Box>

            <Drawer
                anchor='right'
                open={genDrawerShown}
                onClose={onGenerateDrawerClose}
            >
                <Typography component="h2" variant="h6" color="primary" px={2} py={1}>
                    Genereaza program
                </Typography>
                <Box sx={{width: 420, px: 2}}>
                    <FormControl sx={{width: 390, mb: 2}}>
                        <InputLabel id="formTrainingClassIdLabel">Clasa</InputLabel>
                        <Select
                            labelId="formTrainingClassIdLabel"
                            id="formTrainingClassId"
                            value={genFormTrainingClassId}
                            label="Clasa"
                            onChange={(event: SelectChangeEvent) => {
                                setGenFormTrainingClassId(event.target.value as string);
                            }}
                        >
                            <MenuItem value=''>( alege )</MenuItem>
                            {trainingClasses.map((trainingClass: TrainingClass) => (
                                <MenuItem key={trainingClass.id}
                                          value={trainingClass.id}>{trainingClass.name}</MenuItem>
                            ))}
                        </Select>
                    </FormControl>
                    <FormControl sx={{width: 390, mb: 2}}>
                        <InputLabel id="formLocationIdLabel">Locatie</InputLabel>
                        <Select
                            labelId="formLocationIdLabel"
                            id="formLocationId"
                            value={genFormLocationId}
                            label="Locatie"
                            onChange={(event: SelectChangeEvent) => {
                                setGenFormLocationId(event.target.value as string);
                            }}
                        >
                            <MenuItem value=''>( alege )</MenuItem>
                            {locations.map((location: Location) => (
                                <MenuItem key={location.id} value={location.id}>{location.name}</MenuItem>
                            ))}
                        </Select>
                    </FormControl>
                    <FormControl sx={{width: 390, mb: 2}}>
                        <InputLabel id="formStaffMemberIdLabel">Instructor</InputLabel>
                        <Select
                            labelId="formStaffMemberIdLabel"
                            id="formStaffMemberId"
                            value={genFormStaffMemberId}
                            label="Instructor"
                            onChange={(event: SelectChangeEvent) => {
                                setGenFormStaffMemberId(event.target.value as string);
                            }}
                        >
                            <MenuItem value=''>( alege )</MenuItem>
                            {staffMembers.map((staffMember: StaffMember) => (
                                <MenuItem key={staffMember.id} value={staffMember.id}>{staffMember.name}</MenuItem>
                            ))}
                        </Select>
                    </FormControl>
                    <FormControl sx={{width: 390, mb: 2}}>
                        <InputLabel id="formEventGenerationTypeLabel">Tip generare</InputLabel>
                        <Select
                            labelId="formEventGenerationTypeLabel"
                            id="formEventGenerationType"
                            value={genFormEventGenerationType}
                            label="Tip generare"
                            onChange={(event: SelectChangeEvent) => {
                                setGenFormEventGenerationType(event.target.value as string);
                            }}
                        >
                            <MenuItem value='0'>O singura zi</MenuItem>
                            <MenuItem value='1'>Saptamanal</MenuItem>
                        </Select>
                    </FormControl>
                    <FormControl sx={{width: 390, mb: 2}}>
                        <LocalizationProvider dateAdapter={AdapterDateFns} locale={roLocale}>
                            <DatePicker
                                label={'1' === genFormEventGenerationType ? "Data inceput" : "Data"}
                                value={genFormIntervalBegin}
                                onChange={(newValue) => {
                                    setGenFormIntervalBegin(newValue);
                                }}
                                renderInput={(params) => <TextField {...params} />}
                            />
                        </LocalizationProvider>
                    </FormControl>
                    {('1' === genFormEventGenerationType) ? (
                        <FormControl sx={{width: 390, mb: 2}}>
                            <LocalizationProvider dateAdapter={AdapterDateFns} locale={roLocale}>
                                <DatePicker
                                    label="Data sfarsit"
                                    value={genFormIntervalEnd}
                                    onChange={(newValue) => {
                                        setGenFormIntervalEnd(newValue);
                                    }}
                                    renderInput={(params) => <TextField {...params} />}
                                />
                            </LocalizationProvider>
                        </FormControl>
                    ) : ''}
                    {('1' === genFormEventGenerationType) ? (
                        <FormControl sx={{width: 390, mb: 2}}>
                            <ToggleButtonGroup
                                value={genFormWeekdays}
                                onChange={(
                                    event: React.MouseEvent<HTMLElement>,
                                    newValues: string[],
                                ) => {
                                    setGenFormWeekdays(newValues);
                                }}
                                aria-label="Zile din saptamana"
                                color="primary"
                            >
                                <ToggleButton value="0" aria-label="Luni">Lu</ToggleButton>
                                <ToggleButton value="1" aria-label="Marti">Ma</ToggleButton>
                                <ToggleButton value="2" aria-label="Miercuri">Mi</ToggleButton>
                                <ToggleButton value="3" aria-label="Joi">Jo</ToggleButton>
                                <ToggleButton value="4" aria-label="Vineri">Vi</ToggleButton>
                                <ToggleButton value="5" aria-label="Sambata">Sa</ToggleButton>
                                <ToggleButton value="6" aria-label="Duminica">Du</ToggleButton>
                            </ToggleButtonGroup>
                        </FormControl>
                    ) : ''}
                    <LocalizationProvider dateAdapter={AdapterDateFns} locale={roLocale}>
                        <FormControl sx={{width: 190, mb: 2, mr: 1}}>
                            <TimePicker
                                value={genFormBeginsAt}
                                onChange={(newValue) => setGenFormBeginsAt(newValue)}
                                renderInput={(params) => <TextField {...params} />}
                            />
                        </FormControl>
                        <FormControl sx={{width: 190, mb: 2}}>
                            <TimePicker
                                value={genFormEndsAt}
                                onChange={(newValue) => setGenFormEndsAt(newValue)}
                                renderInput={(params) => <TextField {...params} />}
                            />
                        </FormControl>
                    </LocalizationProvider>
                    <FormControl sx={{width: 190, mb: 2, mr: 1}}>
                        <TextField
                            id="outlined-basic"
                            label="Capacitate maxima"
                            variant="outlined"
                            value={genFormMaxCapacity}
                            onChange={(event) => {
                                setGenFormMaxCapacity(event.target.value as string);
                            }}
                        />
                    </FormControl>
                    <FormControl sx={{width: 190, mb: 2}}>
                        <TextField
                            id="outlined-basic"
                            label="Lista asteptare"
                            variant="outlined"
                            value={genFormWaitingListSize}
                            onChange={(event) => {
                                setGenFormWaitingListSize(event.target.value as string);
                            }}
                        />
                    </FormControl>
                    <FormControl sx={{width: 190, mb: 2}}>
                        <TextField
                            id="outlined-basic"
                            label="Minute avans programare"
                            variant="outlined"
                            value={genFormMinimumBookingMinutesInterval}
                            onChange={(event) => {
                                setGenFormMinimumBookingMinutesInterval(event.target.value as string);
                            }}
                        />
                    </FormControl>
                    <FormControl sx={{width: 390, mb: 2}}>
                        <Button variant="contained" onClick={onGenerateClick}>Genereaza</Button>
                    </FormControl>

                </Box>
            </Drawer>

            <Drawer
                anchor='right'
                open={editDrawerShown}
                onClose={onEditDrawerClose}
            >
                <Typography component="h2" variant="h6" color="primary" px={2} py={1}>
                    Editereaza clase
                </Typography>
                <Box sx={{width: 420, px: 2}}>
                    <FormControl sx={{width: 390, mb: 2}}>
                        <InputLabel id="formTrainingClassIdLabel">Clasa</InputLabel>
                        <Select
                            labelId="formTrainingClassIdLabel"
                            id="formTrainingClassId"
                            value={editFormTrainingClassId}
                            label="Clasa"
                            onChange={(event: SelectChangeEvent) => {
                                setEditFormTrainingClassId(event.target.value as string);
                            }}
                        >
                            <MenuItem value=''>( lasa neschimbata )</MenuItem>
                            {trainingClasses.map((trainingClass: TrainingClass) => (
                                <MenuItem key={trainingClass.id}
                                          value={trainingClass.id}>{trainingClass.name}</MenuItem>
                            ))}
                        </Select>
                    </FormControl>
                    <FormControl sx={{width: 390, mb: 2}}>
                        <InputLabel id="formLocationIdLabel">Locatie</InputLabel>
                        <Select
                            labelId="formLocationIdLabel"
                            id="formLocationId"
                            value={editFormLocationId}
                            label="Locatie"
                            onChange={(event: SelectChangeEvent) => {
                                setEditFormLocationId(event.target.value as string);
                            }}
                        >
                            <MenuItem value=''>( lasa neschimbata )</MenuItem>
                            {locations.map((location: Location) => (
                                <MenuItem key={location.id} value={location.id}>{location.name}</MenuItem>
                            ))}
                        </Select>
                    </FormControl>
                    <FormControl sx={{width: 390, mb: 2}}>
                        <InputLabel id="formStaffMemberIdLabel">Instructor</InputLabel>
                        <Select
                            labelId="formStaffMemberIdLabel"
                            id="formStaffMemberId"
                            value={editFormStaffMemberId}
                            label="Instructor"
                            onChange={(event: SelectChangeEvent) => {
                                setEditFormStaffMemberId(event.target.value as string);
                            }}
                        >
                            <MenuItem value=''>( lasa neschimbat )</MenuItem>
                            {staffMembers.map((staffMember: StaffMember) => (
                                <MenuItem key={staffMember.id} value={staffMember.id}>{staffMember.name}</MenuItem>
                            ))}
                        </Select>
                    </FormControl>
                    <FormControl sx={{width: 190, mb: 2, mr: 1}}>
                        <TextField
                            id="outlined-basic"
                            label="Capacitate maxima"
                            variant="outlined"
                            value={editFormMaxCapacity}
                            onChange={(event) => {
                                setEditFormMaxCapacity(event.target.value as string);
                            }}
                        />
                    </FormControl>
                    <FormControl sx={{width: 190, mb: 2}}>
                        <TextField
                            id="outlined-basic"
                            label="Lista asteptare"
                            variant="outlined"
                            value={editFormWaitingListSize}
                            onChange={(event) => {
                                setEditFormWaitingListSize(event.target.value as string);
                            }}
                        />
                    </FormControl>
                    <FormControl sx={{width: 390, mb: 2}}>
                        <Button variant="contained" onClick={onSaveClick}>Salveaza</Button>
                    </FormControl>

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
                        Sigur vrei sa stergi evenimentele selectate?
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