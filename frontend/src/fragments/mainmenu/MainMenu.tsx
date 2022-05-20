import * as React from "react";
import Toolbar from "@mui/material/Toolbar";
import Divider from "@mui/material/Divider";
import List from "@mui/material/List";
import ListItem from "@mui/material/ListItem";
import ListItemIcon from "@mui/material/ListItemIcon";
import ListItemText from "@mui/material/ListItemText";
import AppBar from "@mui/material/AppBar";
import IconButton from "@mui/material/IconButton";
import MenuIcon from "@mui/icons-material/Menu";
import Typography from "@mui/material/Typography";
import Box from "@mui/material/Box";
import Drawer from "@mui/material/Drawer";
import {CalendarMonth, Dashboard} from "@mui/icons-material";
import {useNavigate} from "react-router-dom";
import LogoutIcon from '@mui/icons-material/Logout';
import AuthenticationService from "../../routes/account/AuthenticationService";

const drawerWidth = 240;

export default function MainMenu() {
    const [mobileOpen, setMobileOpen] = React.useState(false);
    const navigate = useNavigate();

    const onDrawerToggle = () => {
        setMobileOpen(!mobileOpen);
    };

    const onSignOutClick = () => {
        AuthenticationService.signOut();
        navigate('/sign-in');
    };

    const drawer = (
        <div>
            <Toolbar/>
            <Divider/>
            <List>
                <ListItem button key='Dashboard' onClick={() => navigate('/')}>
                    <ListItemIcon>
                        <Dashboard/>
                    </ListItemIcon>
                    <ListItemText primary='Dashboard'/>
                </ListItem>
                <ListItem button key='Calendar' onClick={() => navigate('/calendar')}>
                    <ListItemIcon>
                        <CalendarMonth/>
                    </ListItemIcon>
                    <ListItemText primary='Calendar'/>
                </ListItem>
                <ListItem button key='Checkin' onClick={() => navigate('/checkin')}>
                    <ListItemIcon>
                        <CalendarMonth/>
                    </ListItemIcon>
                    <ListItemText primary='Checkin'/>
                </ListItem>
                <ListItem button key='Clienti' onClick={() => navigate('/client')}>
                    <ListItemIcon>
                        <CalendarMonth/>
                    </ListItemIcon>
                    <ListItemText primary='Clienti'/>
                </ListItem>
                <ListItem button key='Plati' onClick={() => navigate('/payment')}>
                    <ListItemIcon>
                        <CalendarMonth/>
                    </ListItemIcon>
                    <ListItemText primary='Plati'/>
                </ListItem>
                <ListItem button key='Abonamente' onClick={() => navigate('/subscription')}>
                    <ListItemIcon>
                        <CalendarMonth/>
                    </ListItemIcon>
                    <ListItemText primary='Abonamente'/>
                </ListItem>
                <ListItem button key='Cupoane' onClick={() => navigate('/coupon')}>
                    <ListItemIcon>
                        <CalendarMonth/>
                    </ListItemIcon>
                    <ListItemText primary='Cupoane'/>
                </ListItem>
                <ListItem button key='Membri personal' onClick={() => navigate('/staff-member')}>
                    <ListItemIcon>
                        <CalendarMonth/>
                    </ListItemIcon>
                    <ListItemText primary='Membri personal'/>
                </ListItem>
                <ListItem button key='Clase' onClick={() => navigate('/training-class')}>
                    <ListItemIcon>
                        <CalendarMonth/>
                    </ListItemIcon>
                    <ListItemText primary='Clase'/>
                </ListItem>
                <ListItem button key='Locatii' onClick={() => navigate('/location')}>
                    <ListItemIcon>
                        <CalendarMonth/>
                    </ListItemIcon>
                    <ListItemText primary='Locatii'/>
                </ListItem>
                <ListItem button key='Sign Out' onClick={onSignOutClick}>
                    <ListItemIcon>
                        <LogoutIcon/>
                    </ListItemIcon>
                    <ListItemText primary='Sign Out'/>
                </ListItem>
            </List>
            {/*<Divider/>*/}
        </div>
    );

    return (
        <>
            <AppBar
                position="fixed"
                sx={{
                    width: {sm: `calc(100% - ${drawerWidth}px)`},
                    ml: {sm: `${drawerWidth}px`},
                }}
            >
                <Toolbar>
                    <IconButton
                        color="inherit"
                        aria-label="open drawer"
                        edge="start"
                        onClick={onDrawerToggle}
                        sx={{mr: 2, display: {sm: 'none'}}}
                    >
                        <MenuIcon/>
                    </IconButton>
                    <Typography variant="h6" noWrap component="div">
                        Responsive drawer
                    </Typography>
                </Toolbar>
            </AppBar>
            <Box
                component="nav"
                sx={{width: {sm: drawerWidth}, flexShrink: {sm: 0}}}
                aria-label="mailbox folders"
            >
                {/* The implementation can be swapped with js to avoid SEO duplication of links. */}
                <Drawer
                    variant="temporary"
                    open={mobileOpen}
                    onClose={onDrawerToggle}
                    ModalProps={{
                        keepMounted: true, // Better open performance on mobile.
                    }}
                    sx={{
                        display: {xs: 'block', sm: 'none'},
                        '& .MuiDrawer-paper': {boxSizing: 'border-box', width: drawerWidth},
                    }}
                >
                    {drawer}
                </Drawer>
                <Drawer
                    variant="permanent"
                    sx={{
                        display: {xs: 'none', sm: 'block'},
                        '& .MuiDrawer-paper': {boxSizing: 'border-box', width: drawerWidth},
                    }}
                    open
                >
                    {drawer}
                </Drawer>
            </Box>
        </>
    );
}

export const DrawerWidth = drawerWidth;
