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
    InputLabel, ListItemText,
    MenuItem, OutlinedInput,
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
import CouponService from "./CouponService";
import Coupon from "./Coupon";
import TextField from "@mui/material/TextField";
import CouponForm from "./CouponForm";
import {DiscountType, discountTypes} from "./DiscountType";
import LocalizationProvider from "@mui/lab/LocalizationProvider";
import AdapterDateFns from "@mui/lab/AdapterDateFns";
import roLocale from "date-fns/locale/ro";
import {DatePicker} from "@mui/lab";
import SubscriptionService from "../subscription/SubscriptionService";
import Subscription from "../subscription/Subscription";

const drawerWidth = DrawerWidth;

const ITEM_HEIGHT = 48;
const ITEM_PADDING_TOP = 8;
const MenuProps = {
    PaperProps: {
        style: {
            maxHeight: ITEM_HEIGHT * 4.5 + ITEM_PADDING_TOP,
            width: 250,
        },
    },
};

export default function CouponPage() {
    const {enqueueSnackbar} = useSnackbar();

    const [loadingWheelVisible, setLoadingWheelVisible] = React.useState(false);
    const [coupons, setCoupons] = React.useState<Coupon[]>([]);
    const [subscriptions, setSubscriptions] = React.useState<Subscription[]>([]);
    const [subscriptionMap, setSubscriptionMap] = React.useState<Map<number, string>>(new Map);

    const [drawerShown, setDrawerShown] = React.useState(false);
    const [editId, setEditId] = React.useState<number | null>(null);
    const [formName, setFormName] = React.useState('');
    const [formCode, setFormCode] = React.useState('');
    const [formDiscountValue, setFormDiscountValue] = React.useState<number | null>(null);
    const [formDiscountType, setFormDiscountType] = React.useState<DiscountType>(DiscountType.PERCENT);
    const [formActivationDate, setFormActivationDate] = React.useState<Date | null>(null);
    const [formExpirationDate, setFormExpirationDate] = React.useState<Date | null>(null);
    const [formMaxUses, setFormMaxUses] = React.useState<number | null>(null);
    const [formActive, setFormActive] = React.useState<boolean>(true);
    const [formAllowedSubscriptionIds, setFormAllowedSubscriptionIds] = React.useState<number[]>([]);

    const [deleteId, setDeleteId] = React.useState<number>(0);
    const [deleteDialogOpen, setDeleteDialogOpen] = React.useState<boolean>(false);

    const getCoupons = () => {
        setLoadingWheelVisible(true);
        CouponService.getList()
            .then((coupons) => {
                setLoadingWheelVisible(false);
                setCoupons(coupons);
            });
    }

    const getSubscriptions = () => {
        setLoadingWheelVisible(true);
        SubscriptionService.getList()
            .then((subscriptions) => {
                setLoadingWheelVisible(false);
                let map = new Map();
                subscriptions.forEach(subscription => map.set(subscription.id, subscription.name));
                setSubscriptionMap(map);
                setSubscriptions(subscriptions);
            });
    }

    React.useEffect(() => {
        getCoupons();
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
        CouponService.delete(deleteId)
            .then(() => getCoupons());
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

        setDrawerShown(true);
    };

    const onEditClick = (id: string) => {
        let coupon = coupons.find(value => value.id == Number.parseInt(id));
        if (undefined == coupon) {
            return;
        }
        setEditId(coupon.id);
        setFormName(coupon.name);
        setFormCode(coupon.code);
        setFormDiscountValue(coupon.discountValue);
        setFormDiscountType(coupon.discountType);
        setFormActivationDate(coupon.activationDate);
        setFormExpirationDate(coupon.expirationDate);
        setFormMaxUses(coupon.maxUses);
        setFormActive(coupon.active);
        setFormAllowedSubscriptionIds(coupon.allowedSubscriptionIds);

        setDrawerShown(true);
    }

    const onDeleteClick = (id: string) => {
        setDeleteId(Number.parseInt(id));
        setDeleteDialogOpen(true);
    }

    const onSaveClick = () => {
        //TODO add proper validation
        if (
            null == formCode
            || null == formDiscountValue
        ) {
            return;
        }
        const form = new CouponForm(
            formName, formCode,
            formDiscountValue, formDiscountType,
            formActivationDate, formExpirationDate,
            formMaxUses,
            formActive,
            formAllowedSubscriptionIds
        );

        setLoadingWheelVisible(true);

        CouponService.save(editId, form)
            .then((response) => {
                if (200 === response.status) {
                    setDrawerShown(false);

                    setEditId(null);
                    setFormName('');
                    setFormCode('');
                    setFormDiscountValue(null);
                    setFormDiscountType(DiscountType.PERCENT);
                    setFormActivationDate(null);
                    setFormExpirationDate(null);
                    setFormMaxUses(null);
                    setFormActive(true);
                    setFormAllowedSubscriptionIds([]);

                    const variant: VariantType = 'success';
                    enqueueSnackbar('Succes', {variant});
                    getCoupons();
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
                                <TableCell>Cod</TableCell>
                                <TableCell>Activ</TableCell>
                                <TableCell>Valoare</TableCell>
                                <TableCell>Tip</TableCell>
                                <TableCell>Valabil de la</TableCell>
                                <TableCell>Pana pe</TableCell>
                                <TableCell>Max utilizari</TableCell>
                                <TableCell/>
                            </TableRow>
                        </TableHead>
                        <TableBody>

                            {coupons.map((coupon) => (
                                <TableRow
                                    key={coupon.id}
                                    sx={{'&:last-child td, &:last-child th': {border: 0}}}
                                >
                                    <TableCell>{coupon.name}</TableCell>
                                    <TableCell>{coupon.code}</TableCell>
                                    <TableCell>{coupon.active ? 'da' : 'nu'}</TableCell>
                                    <TableCell>{coupon.discountValue}</TableCell>
                                    <TableCell>{discountTypes.get(coupon.discountType)}</TableCell>
                                    <TableCell>{null == coupon.activationDate ? '' : dateToDateTimeStr(coupon.activationDate)}</TableCell>
                                    <TableCell>{null == coupon.expirationDate ? '' : dateToDateTimeStr(coupon.expirationDate)}</TableCell>
                                    <TableCell>{coupon.maxUses}</TableCell>
                                    <TableCell align="right">
                                        <IconButton aria-label="delete" size="small" color="success"
                                                    onClick={() => onEditClick(coupon.id.toString())}>
                                            <EditIcon fontSize="small"/>
                                        </IconButton>
                                        <IconButton aria-label="delete" size="small" color="error"
                                                    onClick={() => onDeleteClick(coupon.id.toString())}>
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
                                    label="Cod"
                                    variant="outlined"
                                    value={formCode}
                                    onChange={(event) => {
                                        setFormCode(event.target.value as string);
                                    }}
                                />
                            </FormControl>
                        </Grid>

                        <Grid item xs={6}>
                            <FormControl sx={{width: '100%'}}>
                                <TextField
                                    id="outlined-basic"
                                    label="Valoare"
                                    variant="outlined"
                                    value={formDiscountValue}
                                    onChange={(event) => {
                                        setFormDiscountValue(Number.parseFloat(event.target.value));
                                    }}
                                />
                            </FormControl>
                        </Grid>
                        <Grid item xs={6}>
                            <FormControl sx={{width: '100%'}}>
                                <InputLabel id="coupon-type-label">Tip discount</InputLabel>
                                <Select
                                    labelId="coupon-type-label"
                                    id="coupon-type"
                                    value={formDiscountType}
                                    label="Tip discount"
                                    onChange={(event: SelectChangeEvent<DiscountType>) => {
                                        const value: DiscountType | undefined = event.target.value as DiscountType;
                                        setFormDiscountType(value);
                                    }}
                                >
                                    <MenuItem value={DiscountType.AMOUNT}>{discountTypes.get(DiscountType.AMOUNT)}</MenuItem>
                                    <MenuItem value={DiscountType.PERCENT}>{discountTypes.get(DiscountType.PERCENT)}</MenuItem>
                                </Select>
                            </FormControl>
                        </Grid>

                        <Grid item xs={6}>
                            <FormControl sx={{width: '100%'}}>
                                <LocalizationProvider dateAdapter={AdapterDateFns} locale={roLocale}>
                                    <DatePicker
                                        label="Data inceput"
                                        // date={formActivationDate}
                                        value={formActivationDate}
                                        onChange={(newValue) => {
                                            setFormActivationDate(newValue);
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
                                        value={formExpirationDate}
                                        onChange={(newValue) => {
                                            setFormExpirationDate(newValue);
                                        }}
                                        renderInput={(params) => <TextField {...params} />}
                                    />
                                </LocalizationProvider>
                            </FormControl>
                        </Grid>

                        <Grid item xs={6}>
                            <FormControl sx={{width: '100%'}}>
                                <TextField
                                    id="form-sessions-per-day"
                                    label="Max utilizari"
                                    variant="outlined"
                                    value={formMaxUses}
                                    onChange={(event) => {
                                        setFormMaxUses(Number.parseInt(event.target.value));
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
                            <FormControl sx={{width: '100%'}}>
                                <InputLabel id="subscriptions-label">Abonamente</InputLabel>
                                <Select
                                    labelId="subscriptions-label"
                                    id="subscriptions"
                                    multiple
                                    value={formAllowedSubscriptionIds}
                                    input={<OutlinedInput label="Tag" />}
                                    label="Abonamente"
                                    MenuProps={MenuProps}
                                    renderValue={(selected) => selected.map(selected => subscriptionMap.get(selected)).join(', ')}
                                    onChange={(event: SelectChangeEvent<number[]>) => {
                                        setFormAllowedSubscriptionIds(event.target.value as number[]);
                                    }}
                                >
                                    {subscriptions.map((subscription) => (
                                        <MenuItem key={subscription.id} value={subscription.id}>
                                            <Checkbox checked={formAllowedSubscriptionIds.indexOf(subscription.id) > -1} />
                                            <ListItemText primary={subscription.name} />
                                        </MenuItem>
                                    ))}
                                </Select>
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
                        Sigur vrei sa stergi acest cupon?
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