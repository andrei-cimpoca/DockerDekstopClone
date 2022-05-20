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
import {useSnackbar, VariantType} from "notistack";
import {dateToDateTimeStr} from "../../util/DateUtil";
import AddCircleIcon from "@mui/icons-material/AddCircle";
import TrainingClassService from "./TrainingClassService";
import TrainingClass from "./TrainingClass";
import TextField from "@mui/material/TextField";
import TrainingClassForm from "./TrainingClassForm";
import MultiLanguageText from "../../util/MultiLanguageText";

const drawerWidth = DrawerWidth;

export default function TrainingClassPage() {
    const {enqueueSnackbar} = useSnackbar();

    const [loadingWheelVisible, setLoadingWheelVisible] = React.useState(false);
    const [trainingClasses, setTrainingClasses] = React.useState<TrainingClass[]>([]);

    const [drawerShown, setDrawerShown] = React.useState(false);
    const [editId, setEditId] = React.useState<number | null>(null);
    const [formName, setFormName] = React.useState('');
    const [formDescription, setFormDescription] = React.useState<MultiLanguageText>(new MultiLanguageText({ro : '', en: ''}));
    const [formActive, setFormActive] = React.useState(true);

    const [deleteId, setDeleteId] = React.useState<number>(0);
    const [deleteDialogOpen, setDeleteDialogOpen] = React.useState(false);

    const getTrainingClasses = () => {
        setLoadingWheelVisible(true);
        TrainingClassService.getList()
            .then((trainingClasses) => {
                setLoadingWheelVisible(false);
                setTrainingClasses(trainingClasses);
            });
    }

    React.useEffect(() => {
        getTrainingClasses();
    }, []);

    const onDeleteDialogClose = () => {
        setDeleteDialogOpen(false);
    }

    const onDeleteDialogNoClick = () => {
        setDeleteDialogOpen(false);
    }

    const onDeleteDialogYesClick = () => {
        setDeleteDialogOpen(false);
        TrainingClassService.delete(deleteId)
            .then(() => getTrainingClasses());
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
        setFormDescription(new MultiLanguageText({ro : '', en: ''}));
        setFormActive(true);

        setDrawerShown(true);
    };

    const onEditClick = (id: string) => {
        let trainingClass = trainingClasses.find(value => value.id == Number.parseInt(id));
        if (undefined == trainingClass) {
            return;
        }
        setEditId(trainingClass.id);
        setFormName(trainingClass.name);
        setFormDescription(trainingClass.description);
        setFormActive(trainingClass.active);

        setDrawerShown(true);
    }

    const onDeleteClick = (id: string) => {
        setDeleteId(Number.parseInt(id));
        setDeleteDialogOpen(true);
    }

    const onSaveClick = () => {
        const form = new TrainingClassForm(formName,
            formDescription,
            formActive);

        setLoadingWheelVisible(true);

        TrainingClassService.save(editId, form)
            .then((response) => {
                if (200 === response.status) {
                    setDrawerShown(false);

                    const variant: VariantType = 'success';
                    enqueueSnackbar('Succes', {variant});
                    getTrainingClasses();
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
                                <TableCell>Creat la data</TableCell>
                                <TableCell/>
                            </TableRow>
                        </TableHead>
                        <TableBody>

                            {trainingClasses.map((trainingClass) => (
                                <TableRow
                                    key={trainingClass.id}
                                    sx={{'&:last-child td, &:last-child th': {border: 0}}}
                                >
                                    <TableCell>{trainingClass.name}</TableCell>
                                    <TableCell>{trainingClass.active ? 'da' : 'nu'}</TableCell>
                                    <TableCell>{dateToDateTimeStr(trainingClass.createdAt)}</TableCell>
                                    <TableCell align="right">
                                        <IconButton aria-label="delete" size="small" color="success"
                                                    onClick={() => onEditClick(trainingClass.id.toString())}>
                                            <EditIcon fontSize="small"/>
                                        </IconButton>
                                        <IconButton aria-label="delete" size="small" color="error"
                                                    onClick={() => onDeleteClick(trainingClass.id.toString())}>
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
                    {editId ? 'Editeaza clasa' : 'Adauga clasa'}
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
                                    label="Descriere (RO)"
                                    variant="outlined"
                                    value={formDescription.ro}
                                    multiline
                                    onChange={(event) => {
                                        let description = new MultiLanguageText(formDescription);
                                        description.ro = event.target.value as string;
                                        setFormDescription(description);
                                    }}
                                />
                            </FormControl>
                        </Grid>
                        <Grid item xs={12}>
                            <FormControl sx={{width: '100%'}}>
                                <TextField
                                    id="outlined-basic"
                                    label="Descriere (EN)"
                                    variant="outlined"
                                    value={formDescription.en}
                                    multiline
                                    onChange={(event) => {
                                        let description = new MultiLanguageText(formDescription);
                                        description.en = event.target.value as string;
                                        setFormDescription(description);
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
                        Sigur vrei sa stergi aceasta adresa?
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