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
    InputAdornment,
    InputLabel,
    OutlinedInput,
    Paper,
    Table,
    TableBody,
    TableCell,
    TableContainer,
    TableHead,
    TableRow,
    Typography
} from "@mui/material";
import ChevronRightIcon from '@mui/icons-material/ChevronRight';
import DeleteIcon from '@mui/icons-material/Delete';
import EditIcon from '@mui/icons-material/Edit';
import ExpandMoreIcon from '@mui/icons-material/ExpandMore';
import {useSnackbar, VariantType} from "notistack";
import {dateToDateTimeStr} from "../../util/DateUtil";
import AddCircleIcon from "@mui/icons-material/AddCircle";
import StaffMemberService from "./StaffMemberService";
import UserRole from "./UserRole";
import StaffMember from "./StaffMember";
import TextField from "@mui/material/TextField";
import {Visibility, VisibilityOff} from "@mui/icons-material";
import {TreeItem, TreeView} from "@mui/lab";
import StaffMemberForm from "./StaffMemberForm";

const drawerWidth = DrawerWidth;

export default function StaffMemberPage() {
    const {enqueueSnackbar} = useSnackbar();

    const [loadingWheelVisible, setLoadingWheelVisible] = React.useState(false);
    const [staffMembers, setStaffMembers] = React.useState<StaffMember[]>([]);
    const [roles, setRoles] = React.useState<UserRole[]>([]);

    const [drawerShown, setDrawerShown] = React.useState(false);
    const [editId, setEditId] = React.useState<number | null>(null);
    const [formName, setFormName] = React.useState('');
    const [formEmail, setFormEmail] = React.useState('');
    const [formPassword, setFormPassword] = React.useState('');
    const [formPasswordShow, setFormPasswordShow] = React.useState(false);
    const [formPermissions, setFormPermissions] = React.useState<Set<string>>(new Set);
    const [formActive, setFormActive] = React.useState(true);

    const [deleteId, setDeleteId] = React.useState<number>(0);
    const [deleteDialogOpen, setDeleteDialogOpen] = React.useState(false);

    const getRoles = () => {
        setLoadingWheelVisible(true);
        StaffMemberService.getRoles()
            .then(roles => {
                setLoadingWheelVisible(false);
                setRoles(roles);
            });
    }

    const getStaffMembers = () => {
        setLoadingWheelVisible(true);
        StaffMemberService.getList()
            .then((staffMembers) => {
                setLoadingWheelVisible(false);
                setStaffMembers(staffMembers);
            });
    }

    React.useEffect(() => {
        getRoles();
        getStaffMembers();
    }, []);

    const onDeleteDialogClose = () => {
        setDeleteDialogOpen(false);
    }

    const onDeleteDialogNoClick = () => {
        setDeleteDialogOpen(false);
    }

    const onDeleteDialogYesClick = () => {
        setDeleteDialogOpen(false);
        StaffMemberService.delete(deleteId)
            .then(() => getStaffMembers());
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
        setFormName('');
        setFormEmail('');
        setFormPassword('');
        setFormPermissions(new Set);
        setFormActive(true);

        setDrawerShown(true);
    };

    const onEditClick = (id: string) => {
        let staffMember = staffMembers.find(value => value.id == Number.parseInt(id));
        if (undefined == staffMember) {
            return;
        }
        setEditId(staffMember.id);
        setFormName(staffMember.name);
        setFormEmail(staffMember.email);
        setFormPassword('');
        setFormPermissions(new Set(staffMember.user.permissions));
        setFormActive(staffMember.user.active);

        setDrawerShown(true);
    }

    const onDeleteClick = (id: string) => {
        setDeleteId(Number.parseInt(id));
        setDeleteDialogOpen(true);
    }

    const onSaveClick = () => {
        const form = new StaffMemberForm(formName, formEmail, formPassword, Array.from(formPermissions), formActive);

        setLoadingWheelVisible(true);

        StaffMemberService.save(editId, form)
            .then((response) => {
                if (200 === response.status) {
                    setDrawerShown(false);

                    const variant: VariantType = 'success';
                    enqueueSnackbar('Succes', {variant});
                    getStaffMembers();
                } else {
                    response.json().then(json => {
                        const variant: VariantType = 'error';
                        enqueueSnackbar(json.message, {variant});
                    });
                }
            }).finally(() => setLoadingWheelVisible(false));
    }

    const onFormPermissionsChange = (event: React.ChangeEvent<HTMLInputElement>) => {
        const mustAdd = event.currentTarget.checked;
        const values = event.currentTarget.value.split('#');
        values.forEach(value => mustAdd ? formPermissions.add(value) : formPermissions.delete(value));
        setFormPermissions(new Set(formPermissions));
    };

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
                                <TableCell>Email</TableCell>
                                <TableCell>Activ</TableCell>
                                <TableCell>Creat la data</TableCell>
                                <TableCell/>
                            </TableRow>
                        </TableHead>
                        <TableBody>

                            {staffMembers.map((staffMember) => (
                                <TableRow
                                    key={staffMember.id}
                                    sx={{'&:last-child td, &:last-child th': {border: 0}}}
                                >
                                    <TableCell>{staffMember.name}</TableCell>
                                    <TableCell>{staffMember.email}</TableCell>
                                    <TableCell>{staffMember.user.active ? 'da' : 'nu'}</TableCell>
                                    <TableCell>{dateToDateTimeStr(staffMember.createdAt)}</TableCell>
                                    <TableCell align="right">
                                        <IconButton aria-label="delete" size="small" color="success"
                                                    onClick={() => onEditClick(staffMember.id.toString())}>
                                            <EditIcon fontSize="small"/>
                                        </IconButton>
                                        <IconButton aria-label="delete" size="small" color="error"
                                                    onClick={() => onDeleteClick(staffMember.id.toString())}>
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
                    {editId ? 'Editeaza membru personal' : 'Adauga membru personal'}
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
                        <Grid item xs={12}>
                            <Typography variant="subtitle1" display="block" gutterBottom>Drepturi</Typography>
                            <Paper variant="outlined">
                                <TreeView
                                    defaultCollapseIcon={<ExpandMoreIcon/>}
                                    defaultExpandIcon={<ChevronRightIcon/>}
                                    sx={{height: 120, flexGrow: 1, overflowY: 'auto'}}
                                >
                                    {roles.map((role) => (
                                        <TreeItem
                                            key={role.id} nodeId={role.id}
                                            label={
                                                <FormControlLabel
                                                    control={
                                                        <Checkbox
                                                            value={role.getFullRightsString()}
                                                            checked={formPermissions.has(role.id)}
                                                            onChange={onFormPermissionsChange}
                                                            onClick={e => e.stopPropagation()}
                                                        />
                                                    }
                                                    onClick={e => e.stopPropagation()}
                                                    label={role.name}
                                                    key={role.id}
                                                />
                                            }
                                        >
                                            {role.permissions.map((permission) => (
                                                <TreeItem
                                                    key={permission.id} nodeId={permission.id}
                                                    label={
                                                        <FormControlLabel
                                                            control={
                                                                <Checkbox
                                                                    value={permission.id}
                                                                    checked={formPermissions.has(permission.id)}
                                                                    onChange={onFormPermissionsChange}
                                                                    onClick={e => e.stopPropagation()}
                                                                />
                                                            }
                                                            onClick={e => e.stopPropagation()}
                                                            label={permission.name}
                                                            key={permission.id}
                                                        />
                                                    }
                                                >
                                                </TreeItem>
                                            ))}
                                        </TreeItem>
                                    ))}
                                </TreeView>
                            </Paper>
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
                        Sigur vrei sa stergi acest membru?
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