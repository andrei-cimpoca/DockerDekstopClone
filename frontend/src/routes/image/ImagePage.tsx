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
import PlayArrowIcon from '@mui/icons-material/PlayArrow';
import {useSnackbar, VariantType} from "notistack";
import AddCircleIcon from "@mui/icons-material/AddCircle";
import TextField from "@mui/material/TextField";
import InstalledImageForm from "./InstalledImageForm";
import { DockerService } from '../../config/DockerService';
import InstalledImage from './InstalledImage';
import Volume from './Volume';

const drawerWidth = DrawerWidth;

export default function ImagePage() {
    const {enqueueSnackbar} = useSnackbar();

    const [loadingWheelVisible, setLoadingWheelVisible] = React.useState(false);
    const [installedImages, setInstalledImages] = React.useState<InstalledImage[]>([]);

    const [drawerShown, setDrawerShown] = React.useState(false);
    const [containerName, setContainerName] = React.useState('');
    const [containerPort, setContainerPort] = React.useState('');
    const [volumeMappings, setVolumeMappings] = React.useState<Volume[]>([new Volume("", "")])
    const [formLatitude, setFormLatitude] = React.useState('');
    const [formLongitude, setFormLongitude] = React.useState('');
    const [formActive, setFormActive] = React.useState(true);

     const [deleteId, setDeleteId] = React.useState<number>(0);
     const [deleteDialogOpen, setDeleteDialogOpen] = React.useState(false);

    const getLocations = () => {
        setLoadingWheelVisible(true);
        DockerService.getInstalledImages()
            .then((images: InstalledImage[]) => {
                setLoadingWheelVisible(false);
                setInstalledImages(images);
            });
    }

    React.useEffect(() => {
        getLocations();
    }, []);

    const onSetVolumeContainerPath = (index: number, event: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement>) => {
        setVolumeMappings(oldVolumes => {
            const newVolumes = [...oldVolumes]
            newVolumes[index].containerPath = event.target.value
            return newVolumes
        })
    }

    const onSetVolumeHostPath = (index: number, event: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement>) => {
        setVolumeMappings(oldVolumes => {
            const newVolumes = [...oldVolumes]
            newVolumes[index].hostPath = event.target.value
            return newVolumes
        })
    }

    const onDeleteDialogClose = () => {
        setDeleteDialogOpen(false);
    }

    const onDeleteDialogNoClick = () => {
        setDeleteDialogOpen(false);
    }

    // const onDeleteDialogYesClick = () => {
    //     setDeleteDialogOpen(false);
    //     LocationService.delete(deleteId)
    //         .then(() => getLocations());
    // }

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
        // if (
        //     event.type === 'keydown' &&
        //     ((event as React.KeyboardEvent).key === 'Tab' ||
        //         (event as React.KeyboardEvent).key === 'Shift')
        // ) {
        //     return;
        // }
        // setEditId(null);
        // setFormName('');
        // setFormAddress('');
        // setFormLatitude('');
        // setFormLongitude('');
        // setFormActive(true);

        setDrawerShown(true);
    };

    const onRunImageClick = (id: string) => {
        // let location = locations.find(value => value.id == Number.parseInt(id));
        // if (undefined == location) {
        //     return;
        // }
        // setEditId(location.id);
        // setFormName(location.name);
        // setFormAddress(location.address);
        // setFormLatitude(location.latitude);
        // setFormLongitude(location.longitude);
        // setFormActive(location.active);

        setDrawerShown(true);
    }

    const onDeleteClick = (id: string) => {
        setDeleteId(Number.parseInt(id));
        setDeleteDialogOpen(true);
    }

    const onAddVolume = () => {
        setVolumeMappings(oldVolumes => [...oldVolumes, new Volume("", "")])
    }

    const onSaveClick = () => {
        // const form = new LocationForm(formName,
        //     formAddress,
        //     formLatitude,
        //     formLongitude,
        //     formActive);

        // setLoadingWheelVisible(true);

        // LocationService.save(editId, form)
        //     .then((response) => {
        //         if (200 === response.status) {
        //             setDrawerShown(false);

        //             const variant: VariantType = 'success';
        //             enqueueSnackbar('Succes', {variant});
        //             getLocations();
        //         } else {
        //             response.json().then(json => {
        //                 const variant: VariantType = 'error';
        //                 enqueueSnackbar(json.message, {variant});
        //             });
        //         }
        //     }).finally(() => setLoadingWheelVisible(false));
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
                    <Table>
                        <TableHead>
                            <TableRow>
                                <TableCell>ID</TableCell>
                                <TableCell>Repository</TableCell>
                                <TableCell>Tag</TableCell>
                                <TableCell>Size</TableCell>
                                <TableCell>Created</TableCell>
                                <TableCell/>
                            </TableRow>
                        </TableHead>
                        <TableBody>

                            {installedImages.map((image: InstalledImage) => (
                                <TableRow
                                    key={image.id}
                                    sx={{'&:last-child td, &:last-child th': {border: 0}}}
                                >
                                    <TableCell>{image.id}</TableCell>
                                    <TableCell>{image.repository}</TableCell>
                                    <TableCell>{image.tag}</TableCell>
                                    <TableCell>{image.size}</TableCell>
                                    <TableCell>{image.createdSince}</TableCell>
                                    <TableCell align="right">
                                        <IconButton aria-label="run" size="small" color="success"
                                                    onClick={() => onRunImageClick(image.id)}>
                                            <PlayArrowIcon fontSize="small"/>
                                        </IconButton>
                                        <IconButton aria-label="delete" size="small" color="error"
                                                    onClick={() => onDeleteClick(image.id)}>
                                            <DeleteIcon fontSize="small"/>
                                        </IconButton>
                                        
                                    </TableCell>
                                </TableRow>
                            ))}

                        </TableBody>
                    </Table>
                </TableContainer>
            </Box>

            {<Drawer
                anchor='right'
                open={drawerShown}
                onClose={onAddDrawerClose}
            >
                <Typography component="h2" variant="h6" color="primary" px={2} py={1}>Run image</Typography>
                <Box sx={{width: 420, px: 2}}>
                    <Grid container spacing={2}>
                        <Grid item xs={12}>
                            <FormControl sx={{width: '100%'}}>
                                <TextField
                                    id="outlined-basic"
                                    label="Name"
                                    variant="outlined"
                                    value={containerName}
                                    onChange={(event) => {
                                        setContainerName(event.target.value as string);
                                    }}
                                />
                            </FormControl>
                        </Grid>
                        <Grid item xs={12}>
                            <FormControl sx={{width: '100%'}}>
                                <TextField
                                    id="outlined-basic"
                                    label="Port"
                                    variant="outlined"
                                    value={containerPort}
                                    multiline
                                    onChange={(event) => {
                                        setContainerPort(event.target.value as string);
                                    }}
                                />
                            </FormControl>
                        </Grid>
                        {
                            volumeMappings.map((volume, index) => {
                                return <Grid item xs={12}>
                                    <FormControl sx={{width: '40%'}}>
                                        <TextField
                                            id="outlined-basic"
                                            label="Host path"
                                            variant="outlined"
                                            value={volume.hostPath}
                                            onChange={(event) => {
                                                onSetVolumeHostPath(index, event)
                                                //setFormLatitude(event.target.value as string);
                                            }}/>
                                    </FormControl>
                                    <FormControl sx={{width: '40%'}}>
                                    <TextField
                                            id="outlined-basic"
                                            label="Container path"
                                            variant="outlined"
                                            value={volume.containerPath}
                                            onChange={(event) => {
                                                onSetVolumeContainerPath(index, event)
                                            }}/>
                                    </FormControl>

                                </Grid>
                            })
                        }
                        <Grid item xs={12}>
                            <FormControl sx={{width: '100%'}}>
                                <Button variant="contained" onClick={onAddVolume}>Add volume</Button>
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
            </Drawer>}

            {/* <Dialog
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
                        Sigur vrei sa stergi aceasta adresa?
                    </DialogContentText>
                </DialogContent>
                <DialogActions>
                    <Button onClick={onDeleteDialogNoClick} autoFocus>Nu</Button>
                    <Button onClick={onDeleteDialogYesClick}>Da</Button>
                </DialogActions>
            </Dialog> */}

        </Box>
    );
}