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
import EditIcon from '@mui/icons-material/Edit';
import TextSnippetIcon from '@mui/icons-material/TextSnippet';
import PlayArrowIcon from '@mui/icons-material/PlayArrow';
import StopIcon from '@mui/icons-material/Stop';
import {useSnackbar, VariantType} from "notistack";
import AddCircleIcon from "@mui/icons-material/AddCircle";
import TextField from "@mui/material/TextField";
import LocatioContainerFormnForm from "./ContainerForm";
import { DockerService } from '../../config/DockerService';
import Container from './Container';

const drawerWidth = DrawerWidth;

export default function ContainerPage() {
    const {enqueueSnackbar, closeSnackbar} = useSnackbar();

    const [loadingWheelVisible, setLoadingWheelVisible] = React.useState(false);
    const [containers, setContainers] = React.useState<Container[]>([]);

    // const [drawerShown, setDrawerShown] = React.useState(false);
    // const [editId, setEditId] = React.useState<number | null>(null);
    // const [formName, setFormName] = React.useState('');
    // const [formAddress, setFormAddress] = React.useState('');
    // const [formLatitude, setFormLatitude] = React.useState('');
    // const [formLongitude, setFormLongitude] = React.useState('');
    // const [formActive, setFormActive] = React.useState(true);
    const [logId, setLogId] = React.useState('')
    const [logDialogOpen, setLogDialogOpen] = React.useState(false)
    const [containerLog, setContainerLog] = React.useState('');

    const [deleteId, setDeleteId] = React.useState('');
    const [deleteDialogOpen, setDeleteDialogOpen] = React.useState(false);

    const refreshContainers = () => {
        DockerService.getContainers().then((images: Container[]) => {
            setContainers(images);
        });
    }

    React.useEffect(() => {
        refreshContainers();
    }, []);

    const onDeleteDialogClose = () => {
        setDeleteDialogOpen(false);
    }

    const onDeleteDialogNoClick = () => {
        setDeleteDialogOpen(false);
    }

    const onDeleteDialogYesClick = () => {
        setDeleteDialogOpen(false);

        const oldSnackbar = enqueueSnackbar("Deleting container...");
        DockerService.deleteContainer(deleteId).then(() => {
            refreshContainers();

            closeSnackbar(oldSnackbar);
            enqueueSnackbar("Container deleted.");
        });
    }

    const onLogDialogClose = () => {
        setLogDialogOpen(false);
    }

    const onLogDialogNoClick = () => {
        setLogDialogOpen(false);
    }

    const onLogDialogYesClick = () => {
        setLogDialogOpen(false);
    }

    // const onAddDrawerClose = (event: React.KeyboardEvent | React.MouseEvent) => {
    //     if (
    //         event.type === 'keydown' &&
    //         ((event as React.KeyboardEvent).key === 'Tab' ||
    //             (event as React.KeyboardEvent).key === 'Shift')
    //     ) {
    //         return;
    //     }
    //     setDrawerShown(false);
    // };

    // const onAddButtonClick = (event: React.KeyboardEvent | React.MouseEvent) => {
    //     if (
    //         event.type === 'keydown' &&
    //         ((event as React.KeyboardEvent).key === 'Tab' ||
    //             (event as React.KeyboardEvent).key === 'Shift')
    //     ) {
    //         return;
    //     }
    //     setEditId(null);
    //     setFormName('');
    //     setFormAddress('');
    //     setFormLatitude('');
    //     setFormLongitude('');
    //     setFormActive(true);

    //     setDrawerShown(true);
    // };

    // const onEditClick = (id: string) => {
    //     let location = locations.find(value => value.id == Number.parseInt(id));
    //     if (undefined == location) {
    //         return;
    //     }
    //     setEditId(location.id);
    //     setFormName(location.name);
    //     setFormAddress(location.address);
    //     setFormLatitude(location.latitude);
    //     setFormLongitude(location.longitude);
    //     setFormActive(location.active);

    //     setDrawerShown(true);
    // }

    

    const onDeleteClick = (id: string) => {
        setDeleteId(id);
        setDeleteDialogOpen(true);
    }

    const onStartClick = (id: String) => {
        DockerService.start(id).then(() => {
            refreshContainers();
            enqueueSnackbar("Container starting...");
        });
    }

    const onStopClick = (id: String) => {
        enqueueSnackbar("Container stopping...");
        DockerService.stop(id).then(refreshContainers);
    }

    const onViewLogs = (id: string) => {
        setLogId(id)
        DockerService.getContainerLogs(id).then(logs => {
            setContainerLog(logs)
            setLogDialogOpen(true)
        })
    }

    // const onSaveClick = () => {
    //     const form = new LocationForm(formName,
    //         formAddress,
    //         formLatitude,
    //         formLongitude,
    //         formActive);

    //     setLoadingWheelVisible(true);

    //     LocationService.save(editId, form)
    //         .then((response) => {
    //             if (200 === response.status) {
    //                 setDrawerShown(false);

    //                 const variant: VariantType = 'success';
    //                 enqueueSnackbar('Succes', {variant});
    //                 getLocations();
    //             } else {
    //                 response.json().then(json => {
    //                     const variant: VariantType = 'error';
    //                     enqueueSnackbar(json.message, {variant});
    //                 });
    //             }
    //         }).finally(() => setLoadingWheelVisible(false));
    // }

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
                    {/* <Button onClick={onAddButtonClick} variant="outlined" color="success" sx={{ml: 2, mt: 2}}>
                        <AddCircleIcon fontSize="small"/>
                    </Button> */}
                    <Table>
                        <TableHead>
                            <TableRow>
                                <TableCell>ID</TableCell>
                                <TableCell>Image</TableCell>
                                <TableCell>Names</TableCell>
                                <TableCell>Ports</TableCell>
                                <TableCell>State</TableCell>
                                <TableCell/>
                            </TableRow>
                        </TableHead>
                        <TableBody>

                            {containers.map((container: Container) => (
                                <TableRow
                                    key={container.id}
                                    sx={{'&:last-child td, &:last-child th': {border: 0}}}
                                >
                                    <TableCell>{container.id}</TableCell>
                                    <TableCell>{container.image}</TableCell>
                                    <TableCell>{container.names}</TableCell>
                                    <TableCell>{container.ports}</TableCell>
                                    <TableCell>{container.state}</TableCell>
                                    <TableCell align="right">
                                        <IconButton aria-label="logs" size="small" color="default"
                                            onClick={() => onViewLogs(container.id)}>
                                            <TextSnippetIcon fontSize="small"/>
                                        </IconButton>
                                        { container.state === "running" ?
                                            <IconButton aria-label="stop" size="small" color="error"
                                                onClick={() => onStopClick(container.id)}>
                                                <StopIcon fontSize="small"/>
                                            </IconButton>
                                            :
                                            <IconButton aria-label="start" size="small" color="success"
                                                onClick={() => onStartClick(container.id)}>
                                                <PlayArrowIcon fontSize="small"/>
                                            </IconButton>
                                        }
                                        <IconButton aria-label="delete" size="small" color="error"
                                                    onClick={() => onDeleteClick(container.id)}>
                                            <DeleteIcon fontSize="small"/>
                                        </IconButton>
                                        
                                    </TableCell>
                                </TableRow>
                            ))}

                        </TableBody>
                    </Table>
                </TableContainer>
            </Box>

            {/* <Drawer
                anchor='right'
                open={drawerShown}
                onClose={onAddDrawerClose}
            >
                <Typography component="h2" variant="h6" color="primary" px={2} py={1}>
                    {editId ? 'Editeaza locatie' : 'Adauga locatie'}
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
                                    label="Address"
                                    variant="outlined"
                                    value={formAddress}
                                    multiline
                                    onChange={(event) => {
                                        setFormAddress(event.target.value as string);
                                    }}
                                />
                            </FormControl>
                        </Grid>
                        <Grid item xs={12}>
                            <FormControl sx={{width: '100%'}}>
                                <TextField
                                    id="outlined-basic"
                                    label="Latitude"
                                    variant="outlined"
                                    value={formLatitude}
                                    onChange={(event) => {
                                        setFormLatitude(event.target.value as string);
                                    }}
                                />
                            </FormControl>
                        </Grid>
                        <Grid item xs={12}>
                            <FormControl sx={{width: '100%'}}>
                                <TextField
                                    id="outlined-basic"
                                    label="Longitude"
                                    variant="outlined"
                                    value={formLongitude}
                                    onChange={(event) => {
                                        setFormLongitude(event.target.value as string);
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
                                <Button variant="contained" onClick={onSaveClick}>Salveaza</Button>
                            </FormControl>
                        </Grid>
                    </Grid>

                </Box>
            </Drawer> */}

            <Dialog
                open={deleteDialogOpen}
                onClose={onDeleteDialogClose}
                aria-labelledby="alert-dialog-title"
                aria-describedby="alert-dialog-description"
            >
                <DialogTitle id="alert-dialog-title">
                    {"Confirm deletion of container"}
                </DialogTitle>
                <DialogContent>
                    <DialogContentText id="alert-dialog-description">
                        Do you really want to delete this container?
                    </DialogContentText>
                </DialogContent>
                <DialogActions>
                    <Button onClick={onDeleteDialogNoClick} variant="contained" autoFocus>No</Button>
                    <Button onClick={onDeleteDialogYesClick} variant="outlined" >Yes</Button>
                </DialogActions>
            </Dialog>

            <Dialog
                open={logDialogOpen}
                onClose={onLogDialogClose}
                scroll="paper"
                aria-labelledby="scroll-dialog-title"
                aria-describedby="scroll-dialog-description"
                maxWidth="xl"
                fullWidth={true}
            >
                <DialogTitle id="scroll-dialog-title">Logs</DialogTitle>
                <DialogContent dividers={true}>
                    <DialogContentText
                        id="scroll-dialog-description"
                        tabIndex={-1}
                    >
                        {containerLog}
                    </DialogContentText>
                </DialogContent>
            </Dialog>

        </Box>
    );
}