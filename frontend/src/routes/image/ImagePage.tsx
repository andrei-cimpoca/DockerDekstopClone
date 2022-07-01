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
import EnvironmentVariable from './EnvironmentVariable';
import { milliseconds } from 'date-fns';

const drawerWidth = DrawerWidth;

export default function ImagePage() {
    const {enqueueSnackbar} = useSnackbar();

    const [loadingWheelVisible, setLoadingWheelVisible] = React.useState(false);
    const [installedImages, setInstalledImages] = React.useState<InstalledImage[]>([]);

    const [drawerShown, setDrawerShown] = React.useState(false);
    const [imageToRun, setImageToRun] = React.useState('');
    const [containerName, setContainerName] = React.useState('');
    const [containerPort, setContainerPort] = React.useState('');
    const [volumeMappings, setVolumeMappings] = React.useState<Volume[]>([])
    const [envVariables, setEnvVariables] = React.useState<EnvironmentVariable[]>([])

    const [deleteId, setDeleteId] = React.useState('');
    const [deleteDialogOpen, setDeleteDialogOpen] = React.useState(false);

    const [addImageName, setAddImageName] = React.useState('');
    const [addImageDialogOpen, setAddImageDialogOpen] = React.useState(false)

    const getImages = () => {
        setLoadingWheelVisible(true);
        DockerService.getInstalledImages()
            .then((images: InstalledImage[]) => {
                setLoadingWheelVisible(false);
                setInstalledImages(images);
            });
    }

    React.useEffect(() => {
        getImages();
    }, []);

    const refreshImagesIn = (milliseconds: number) => {
        window.setTimeout(() => {
            getImages()
        }, milliseconds);
    }

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

    const onSetEnvVariableName = (index: number, event: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement>) => {
        setEnvVariables(oldEnvVariables => {
            const newEnvVariables = [...oldEnvVariables]
            newEnvVariables[index].name = event.target.value
            return newEnvVariables
        })
    }

    const onSetEnvVariableValue = (index: number, event: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement>) => {
        setEnvVariables(oldEnvVariables => {
            const newEnvVariables = [...oldEnvVariables]
            newEnvVariables[index].value = event.target.value
            return newEnvVariables
        })
    }

    const onDeleteDialogClose = () => {
        setDeleteDialogOpen(false);
    }

    const onDeleteDialogNoClick = () => {
        setDeleteDialogOpen(false);
    }

    const onDeleteDialogYesClick = () => {
        setDeleteDialogOpen(false);
        refreshImagesIn(2000)
        DockerService.deleteImage(deleteId)
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
        setAddImageName("")
        setAddImageDialogOpen(true)
    };

    const onCloseAddImageDialog = () => {
        setAddImageDialogOpen(false)
    }
    
    const onAddImageDialogNoClick = () => {
        setAddImageDialogOpen(false)
    }

    const onAddImageDialogYesClick = () => {
        setAddImageDialogOpen(false)

        enqueueSnackbar("Pulling image...")
        DockerService.pullImage(addImageName)
        refreshImagesIn(2000)
    }

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
        setImageToRun(id);
    }

    const onDeleteClick = (id: string) => {
        setDeleteId(id);
        setDeleteDialogOpen(true);
    }

    const onAddVolume = () => {
        setVolumeMappings(oldVolumes => [...oldVolumes, new Volume("", "")])
    }

    const onDeleteVolume = (index: number) => {
        setVolumeMappings([...volumeMappings.slice(0, index), ...volumeMappings.slice(index + 1)]);
    }

    const onAddEnvVariable = () => {
        setEnvVariables(oldEnvVariables => [...oldEnvVariables, new EnvironmentVariable("", "")])
    }

    const onDeleteEnvVariable = (index: number) => {
        setEnvVariables([...envVariables.slice(0, index), ...envVariables.slice(index + 1)]);
    }

    const onRunImage = () => {
        setDrawerShown(false);
        enqueueSnackbar(`Starting ${containerName}...`)

        DockerService.runImage(imageToRun, containerName, containerPort, volumeMappings, envVariables)
    }

    return (
        <Box sx={{display: 'flex'}}>
            <MainMenu/>
            <Box
                component="main"
                sx={{backgroundColor: '#f7f7f7', flexGrow: 1, p: 3, width: {sm: `calc(100% - ${drawerWidth}px)`}}}
            >
                <Toolbar/>

                <Button variant="contained" onClick={onAddButtonClick} autoFocus>Add</Button>

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
                                    <FormControl sx={{width: '45%'}}>
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
                                    <FormControl sx={{width: '45%'}}>
                                    <TextField
                                            id="outlined-basic"
                                            label="Container path"
                                            variant="outlined"
                                            value={volume.containerPath}
                                            onChange={(event) => {
                                                onSetVolumeContainerPath(index, event)
                                            }}/>
                                    </FormControl>
                                    <FormControl sx={{width: '5%'}}>
                                        <IconButton aria-label="deleteVolume" size="small" color="error"
                                            onClick={() => onDeleteVolume(index)}>
                                            <DeleteIcon fontSize="large"/>
                                        </IconButton>
                                    </FormControl>
                                </Grid>
                            })
                        }
                        <Grid item xs={12}>
                            <FormControl sx={{width: '100%'}}>
                                <Button variant="outlined" onClick={onAddVolume}>Add volume</Button>
                            </FormControl>
                        </Grid>
                        {
                            envVariables.map((variable, index) => {
                                return <Grid item xs={12}>
                                    <FormControl sx={{width: '45%'}}>
                                        <TextField
                                            id="outlined-basic"
                                            label="Name"
                                            variant="outlined"
                                            value={variable.name}
                                            onChange={(event) => {
                                                onSetEnvVariableName(index, event)
                                            }}/>
                                    </FormControl>
                                    <FormControl sx={{width: '45%'}}>
                                    <TextField
                                            id="outlined-basic"
                                            label="Value"
                                            variant="outlined"
                                            value={variable.value}
                                            onChange={(event) => {
                                                onSetEnvVariableValue(index, event)
                                            }}/>
                                    </FormControl>
                                    <FormControl sx={{width: '5%'}}>
                                        <IconButton aria-label="deleteEnvVar" size="small" color="error"
                                            onClick={() => onDeleteEnvVariable(index)}>
                                            <DeleteIcon fontSize="large"/>
                                        </IconButton>
                                    </FormControl>
                                </Grid>
                            })
                        }
                        <Grid item xs={12}>
                            <FormControl sx={{width: '100%'}}>
                                <Button variant="outlined" onClick={onAddEnvVariable}>Add enviroment variable</Button>
                            </FormControl>
                        </Grid>
                        
                        <Grid item xs={12}>
                            <FormControl sx={{width: '100%'}}>
                                <Button variant="contained" onClick={onRunImage}>Run image</Button>
                            </FormControl>
                        </Grid>
                    </Grid>

                </Box>
            </Drawer>}

            <Dialog
                open={deleteDialogOpen}
                onClose={onDeleteDialogClose}
                aria-labelledby="alert-dialog-title"
                aria-describedby="alert-dialog-description"
            >
                <DialogTitle id="alert-dialog-title">
                    {"Confirm deletion of image"}
                </DialogTitle>
                <DialogContent>
                    <DialogContentText id="alert-dialog-description">
                        Do you really want to delete this container
                    </DialogContentText>
                </DialogContent>
                <DialogActions>
                    <Button onClick={onDeleteDialogNoClick} variant="contained" autoFocus>No</Button>
                    <Button onClick={onDeleteDialogYesClick} variant="outlined">Yes</Button>
                </DialogActions>
            </Dialog>

            <Dialog open={addImageDialogOpen} onClose={onCloseAddImageDialog}>
                <DialogTitle>Enter image name</DialogTitle>
                <DialogContent>
                    <DialogContentText>
                        Enter the name of the image that should be pulled.
                    </DialogContentText>
                    <TextField
                        autoFocus
                        margin="dense"
                        id="newImageName"
                        label="Image name"
                        type="text"
                        fullWidth
                        variant="standard"
                        value={addImageName}
                        onChange={(event) => {
                            setAddImageName(event.target.value)
                        }}
                    />
                </DialogContent>
                <DialogActions>
                    <Button onClick={onAddImageDialogNoClick} variant="outlined">Cancel</Button>
                    <Button onClick={onAddImageDialogYesClick} variant="contained" autoFocus>Add</Button>
                </DialogActions>
      </Dialog>

        </Box>
    );
}