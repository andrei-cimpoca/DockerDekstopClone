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
import DeleteIcon from '@mui/icons-material/Delete';
import EditIcon from '@mui/icons-material/Edit';
import {useSnackbar, VariantType} from "notistack";
import {dateToDateTimeStr} from "../../util/DateUtil";
import AddCircleIcon from "@mui/icons-material/AddCircle";
import SubscriptionService from "./SubscriptionService";
import Subscription from "./Subscription";
import TextField from "@mui/material/TextField";
import {SubscriptionType, subscriptionTypes} from "./SubscriptionType";
import {PromotionType, promotionTypes} from "./PromotionType";
import {ExpirationUnit, expirationUnits} from "./ExpirationUnit";
import {ExpirationType, expirationTypes} from "./ExpirationType";
import SubscriptionForm from "./SubscriptionForm";

const drawerWidth = DrawerWidth;

export default function SubscriptionPage() {
    const {enqueueSnackbar} = useSnackbar();

    const [loadingWheelVisible, setLoadingWheelVisible] = React.useState(false);
    const [subscriptions, setSubscriptions] = React.useState<Subscription[]>([]);

    const [drawerShown, setDrawerShown] = React.useState(false);
    const [editId, setEditId] = React.useState<number | null>(null);
    const [formName, setFormName] = React.useState('');
    const [formDescription, setFormDescription] = React.useState('');
    const [formPrice, setFormPrice] = React.useState<number | null>(null);
    const [formDiscountAmount, setFormDiscountAmount] = React.useState<number | null>(null);
    const [formTaxRate, setFormTaxRate] = React.useState<number | null>(null);
    const [formTaxIncluded, setFormTaxIncluded] = React.useState<boolean>(true);
    const [formSubscriptionType, setFormSubscriptionType] = React.useState<SubscriptionType | undefined>(undefined);
    const [formSessionsVisible, setFormSessionsVisible] = React.useState<boolean>(formSubscriptionType == SubscriptionType.MULTIPLE);
    const [formSessions, setFormSessions] = React.useState<number>(0);
    const [formPromotionType, setFormPromotionType] = React.useState<PromotionType>(PromotionType.NEW_AND_EXISTING);
    const [formExpirationLength, setFormExpirationLength] = React.useState<number | null>(null);
    const [formExpirationUnit, setFormExpirationUnit] = React.useState<ExpirationUnit | undefined>(undefined);
    const [formExpirationType, setFormExpirationType] = React.useState<ExpirationType | undefined>(undefined);
    const [formSessionsPerDay, setFormSessionsPerDay] = React.useState<number>(1);
    const [formActive, setFormActive] = React.useState<boolean>(true);
    const [formRedirectAfterRegistration, setFormRedirectAfterRegistration] = React.useState<boolean>(false);
    const [deleteId, setDeleteId] = React.useState<number>(0);
    const [deleteDialogOpen, setDeleteDialogOpen] = React.useState<boolean>(false);

    const getSubscriptions = () => {
        setLoadingWheelVisible(true);
        SubscriptionService.getList()
            .then((subscriptions) => {
                setLoadingWheelVisible(false);
                setSubscriptions(subscriptions);
            });
    }

    React.useEffect(() => {
        getSubscriptions();
    }, []);

    const onDeleteDialogClose = () => {
        setDeleteDialogOpen(false);
    }

    const onDeleteDialogNoClick = () => {
        setDeleteDialogOpen(false);
    }

    const onDeleteDialogYesClick = () => {
        setDeleteDialogOpen(false);
        SubscriptionService.delete(deleteId)
            .then(() => getSubscriptions());
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

    const resetForm = () => {
        setEditId(null);
        setFormName('');
        setFormDescription('');
        setFormPrice(null);
        setFormDiscountAmount(null);
        setFormTaxRate(null);
        setFormTaxIncluded(true);
        setFormSubscriptionType(undefined);
        setFormSessionsVisible(false);
        setFormSessions(0);
        setFormPromotionType(PromotionType.NEW_AND_EXISTING);
        setFormExpirationLength(null);
        setFormExpirationUnit(undefined);
        setFormExpirationType(undefined);
        setFormSessionsPerDay(1);
        setFormActive(true);
        setFormRedirectAfterRegistration(false);
    };

    const onAddButtonClick = (event: React.KeyboardEvent | React.MouseEvent) => {
        if (
            event.type === 'keydown' &&
            ((event as React.KeyboardEvent).key === 'Tab' ||
                (event as React.KeyboardEvent).key === 'Shift')
        ) {
            return;
        }

        resetForm();
        setDrawerShown(true);
    };

    const onEditClick = (id: string) => {
        let subscription = subscriptions.find(value => value.id == Number.parseInt(id));
        if (undefined == subscription) {
            return;
        }
        setEditId(subscription.id);
        setFormName(subscription.name);
        setFormDescription(subscription.description);
        setFormPrice(subscription.price);
        setFormDiscountAmount(subscription.discountAmount);
        setFormTaxRate(subscription.taxRate);
        setFormTaxIncluded(subscription.taxIncluded);
        setFormSubscriptionType(subscription.subscriptionType);
        setFormSessionsVisible(false);
        setFormSessions(subscription.sessions);
        setFormPromotionType(subscription.promotionType);
        setFormExpirationLength(subscription.expirationLength);
        setFormExpirationUnit(subscription.expirationUnit);
        setFormExpirationType(subscription.expirationType);
        setFormSessionsPerDay(subscription.sessionsPerDay);
        setFormActive(subscription.active);
        setFormRedirectAfterRegistration(subscription.redirectAfterRegistration);

        setDrawerShown(true);
    }

    const onDeleteClick = (id: string) => {
        setDeleteId(Number.parseInt(id));
        setDeleteDialogOpen(true);
    }

    const onSaveClick = () => {
        //TODO add proper validation
        if (
            null == formPrice
            || null == formDiscountAmount
            || null == formTaxRate
            || undefined == formSubscriptionType
            || (0 == formSessions && formSubscriptionType == SubscriptionType.MULTIPLE)
            || null == formExpirationLength
            || undefined == formExpirationUnit
            || undefined == formExpirationType
        ) {
            return;
        }
        const form = new SubscriptionForm(
            formName, formDescription,
            formPrice, formDiscountAmount, formTaxRate, formTaxIncluded,
            formSubscriptionType, formSessions,
            formPromotionType,
            formExpirationLength, formExpirationUnit, formExpirationType,
            formSessionsPerDay,
            formActive,
            formRedirectAfterRegistration
        );

        setLoadingWheelVisible(true);

        SubscriptionService.save(editId, form)
            .then((response) => {
                if (200 === response.status) {
                    setDrawerShown(false);
                    resetForm();
                    const variant: VariantType = 'success';
                    enqueueSnackbar('Succes', {variant});
                    getSubscriptions();
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
                <TableContainer component={Paper}>
                    <Button onClick={onAddButtonClick} variant="outlined" color="success" sx={{ml: 2, mt: 2}}>
                        <AddCircleIcon fontSize="small"/>
                    </Button>
                    <Table>
                        <TableHead>
                            <TableRow>
                                <TableCell>Nume</TableCell>
                                <TableCell>Activ</TableCell>
                                <TableCell>Pret</TableCell>
                                <TableCell>Discount</TableCell>
                                <TableCell>Tip abonament</TableCell>
                                <TableCell>Tip promotie</TableCell>
                                <TableCell>Creat la data</TableCell>
                                <TableCell/>
                            </TableRow>
                        </TableHead>
                        <TableBody>

                            {subscriptions.map((subscription) => (
                                <TableRow
                                    key={subscription.id}
                                    sx={{'&:last-child td, &:last-child th': {border: 0}}}
                                >
                                    <TableCell>{subscription.name}</TableCell>
                                    <TableCell>{subscription.active ? 'da' : 'nu'}</TableCell>
                                    <TableCell>{subscription.price}</TableCell>
                                    <TableCell>{subscription.discountAmount}</TableCell>
                                    <TableCell>{subscriptionTypes.get(subscription.subscriptionType)}</TableCell>
                                    <TableCell>{promotionTypes.get(subscription.promotionType)}</TableCell>
                                    <TableCell>{dateToDateTimeStr(subscription.createdAt)}</TableCell>
                                    <TableCell align="right">
                                        <IconButton aria-label="delete" size="small" color="success"
                                                    onClick={() => onEditClick(subscription.id.toString())}>
                                            <EditIcon fontSize="small"/>
                                        </IconButton>
                                        <IconButton aria-label="delete" size="small" color="error"
                                                    onClick={() => onDeleteClick(subscription.id.toString())}>
                                            <DeleteIcon fontSize="small"/>
                                        </IconButton>
                                    </TableCell>
                                </TableRow>
                            ))}

                        </TableBody>
                    </Table>
                </TableContainer>
            </Box>

            <Drawer
                anchor='right'
                open={drawerShown}
                onClose={onAddDrawerClose}
            >
                <Typography component="h2" variant="h6" color="primary" px={2} py={1}>
                    {editId ? 'Editeaza abonament' : 'Adauga abonament'}
                </Typography>
                <Box sx={{width: 420, px: 2}}>
                    <Grid container spacing={2}>
                        <Grid item xs={12}>
                            <FormControl sx={{width: '100%'}}>
                                <TextField
                                    id="outlined-basic"
                                    label="Nume"
                                    variant="outlined"
                                    value={formName}
                                    onChange={(event) => {
                                        setFormName(event.target.value as string);
                                    }}
                                />
                            </FormControl>
                        </Grid>
                        <Grid item xs={12}>
                            <FormControl sx={{width: '100%'}}>
                                <TextField
                                    id="outlined-basic"
                                    label="Descriere"
                                    variant="outlined"
                                    multiline
                                    value={formDescription}
                                    onChange={(event) => {
                                        setFormDescription(event.target.value as string);
                                    }}
                                />
                            </FormControl>
                        </Grid>

                        <Grid item xs={6}>
                            <FormControl sx={{width: '100%'}}>
                                <TextField
                                    id="outlined-basic"
                                    label="Pret"
                                    variant="outlined"
                                    value={formPrice}
                                    onChange={(event) => {
                                        setFormPrice(Number.parseFloat(event.target.value));
                                    }}
                                />
                            </FormControl>
                        </Grid>

                        <Grid item xs={6}>
                            <FormControl sx={{width: '100%'}}>
                                <TextField
                                    id="outlined-basic"
                                    label="Discount (valoare)"
                                    variant="outlined"
                                    value={formDiscountAmount}
                                    onChange={(event) => {
                                        setFormDiscountAmount(Number.parseFloat(event.target.value));
                                    }}
                                />
                            </FormControl>
                        </Grid>

                        <Grid item xs={6}>
                            <FormControl sx={{width: '100%'}}>
                                <TextField
                                    id="outlined-basic"
                                    label="Taxare (%)"
                                    variant="outlined"
                                    value={formTaxRate}
                                    onChange={(event) => {
                                        setFormTaxRate(Number.parseFloat(event.target.value));
                                    }}
                                />
                            </FormControl>
                        </Grid>
                        <Grid item xs={12}>
                            <FormControl sx={{width: '100%'}} variant="outlined">
                                <FormControlLabel control={<Checkbox
                                    checked={formTaxIncluded}
                                    onClick={() => setFormTaxIncluded(!formTaxIncluded)}
                                />} label="Taxele sunt incluse in pret"/>
                            </FormControl>
                        </Grid>

                        <Grid item xs={formSessionsVisible ? 7 : 12}>
                            <FormControl sx={{width: '100%'}}>
                                <InputLabel id="subscription-type-label">Tip abonament</InputLabel>
                                <Select
                                    labelId="subscription-type-label"
                                    id="subscription-type"
                                    value={formSubscriptionType}
                                    label="Tip abonament"
                                    onChange={(event: SelectChangeEvent<SubscriptionType>) => {
                                        const value: SubscriptionType | undefined = event.target.value as SubscriptionType;
                                        setFormSubscriptionType(value);
                                        setFormSessionsVisible(value == SubscriptionType.MULTIPLE);
                                    }}
                                >
                                    <MenuItem value={undefined}>(alege)</MenuItem>
                                    <MenuItem value={SubscriptionType.ONE_TIME}>{subscriptionTypes.get(SubscriptionType.ONE_TIME)}</MenuItem>
                                    <MenuItem value={SubscriptionType.MULTIPLE}>{subscriptionTypes.get(SubscriptionType.MULTIPLE)}</MenuItem>
                                    <MenuItem value={SubscriptionType.UNLIMITED}>{subscriptionTypes.get(SubscriptionType.UNLIMITED)}</MenuItem>
                                </Select>
                            </FormControl>
                        </Grid>
                        {formSessionsVisible ? (
                            <Grid item xs={5}>
                                <FormControl sx={{width: '100%'}}>
                                    <TextField
                                        id="outlined-basic"
                                        label="Numar de sesiuni"
                                        variant="outlined"
                                        value={formSessions}
                                        onChange={(event) => {
                                            setFormSessions(Number.parseInt(event.target.value));
                                        }}
                                    />
                                </FormControl>
                            </Grid>
                        ) : ''}

                        <Grid item xs={12}>
                            <FormControl sx={{width: '100%'}}>
                                <InputLabel id="promotion-type-label">Tip de promotie</InputLabel>
                                <Select
                                    labelId="subscription-type-label"
                                    id="subscription-type"
                                    value={formPromotionType}
                                    label="Tip de promotie"
                                    onChange={(event: SelectChangeEvent<PromotionType>) => {
                                        const value: PromotionType | undefined = event.target.value as PromotionType;
                                        setFormPromotionType(value);
                                    }}
                                >
                                    <MenuItem value={PromotionType.NEW_ONLY}>{promotionTypes.get(PromotionType.NEW_ONLY)}</MenuItem>
                                    <MenuItem value={PromotionType.EXISTING_ONLY}>{promotionTypes.get(PromotionType.EXISTING_ONLY)}</MenuItem>
                                    <MenuItem value={PromotionType.NEW_AND_EXISTING}>{promotionTypes.get(PromotionType.NEW_AND_EXISTING)}</MenuItem>
                                </Select>
                            </FormControl>
                        </Grid>

                        <Grid item xs={6}>
                            <FormControl sx={{width: '100%'}}>
                                <TextField
                                    id="outlined-basic"
                                    label="Expira dupa"
                                    variant="outlined"
                                    value={formExpirationLength}
                                    onChange={(event) => {
                                        setFormExpirationLength(Number.parseInt(event.target.value));
                                    }}
                                />
                            </FormControl>
                        </Grid>
                        <Grid item xs={6}>
                            <FormControl sx={{width: '100%'}}>
                                <InputLabel id="expiration-unit-label">Unitati de timp</InputLabel>
                                <Select
                                    labelId="expiration-unit-label"
                                    id="expiration-unit"
                                    value={formExpirationUnit}
                                    label="Unitati de timp"
                                    onChange={(event: SelectChangeEvent<ExpirationUnit>) => {
                                        const value: ExpirationUnit | undefined = event.target.value as ExpirationUnit;
                                        setFormExpirationUnit(value);
                                    }}
                                >
                                    <MenuItem value={undefined}>(alege)</MenuItem>
                                    <MenuItem value={ExpirationUnit.DAYS}>{expirationUnits.get(ExpirationUnit.DAYS)}</MenuItem>
                                    <MenuItem value={ExpirationUnit.WEEKS}>{expirationUnits.get(ExpirationUnit.WEEKS)}</MenuItem>
                                    <MenuItem value={ExpirationUnit.MONTHS}>{expirationUnits.get(ExpirationUnit.MONTHS)}</MenuItem>
                                </Select>
                            </FormControl>
                        </Grid>
                        <Grid item xs={6}>
                            <FormControl sx={{width: '100%'}}>
                                <InputLabel id="expiration-type-label">De la data</InputLabel>
                                <Select
                                    labelId="expiration-type-label"
                                    id="expiration-type"
                                    value={formExpirationType}
                                    label="De la data"
                                    onChange={(event: SelectChangeEvent<ExpirationType>) => {
                                        const value: ExpirationType | undefined = event.target.value as ExpirationType;
                                        setFormExpirationType(value);
                                    }}
                                >
                                    <MenuItem value={undefined}>(alege)</MenuItem>
                                    <MenuItem value={ExpirationType.PURCHASE}>{expirationTypes.get(ExpirationType.PURCHASE)}</MenuItem>
                                    <MenuItem value={ExpirationType.FIRST_USAGE}>{expirationTypes.get(ExpirationType.FIRST_USAGE)}</MenuItem>
                                </Select>
                            </FormControl>
                        </Grid>
                        <Grid item xs={6}>
                            <FormControl sx={{width: '100%'}}>
                                <TextField
                                    id="form-sessions-per-day"
                                    label="Sesiuni pe zi"
                                    variant="outlined"
                                    value={formSessionsPerDay}
                                    onChange={(event) => {
                                        setFormSessionsPerDay(Number.parseInt(event.target.value));
                                    }}
                                />
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
                            <FormControl sx={{width: '100%'}} variant="outlined">
                                <FormControlLabel control={<Checkbox
                                    checked={formRedirectAfterRegistration}
                                    onClick={() => setFormRedirectAfterRegistration(!formRedirectAfterRegistration)}
                                />} label="Redirectare dupa inregistrare"/>
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
                        Sigur vrei sa stergi acest abonament?
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