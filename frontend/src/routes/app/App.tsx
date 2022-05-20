import * as React from 'react';
import Box from '@mui/material/Box';
import Toolbar from '@mui/material/Toolbar';
import Typography from '@mui/material/Typography';
import MainMenu, {DrawerWidth} from "../../fragments/mainmenu/MainMenu";

const drawerWidth = DrawerWidth;

export default function App() {
    return (
        <Box sx={{display: 'flex'}}>
            <MainMenu/>
            <Box
                component="main"
                sx={{flexGrow: 1, p: 3, width: {sm: `calc(100% - ${drawerWidth}px)`}}}
            >
                <Toolbar/>
                <Typography paragraph>
                    document content
                </Typography>
            </Box>
        </Box>
    );
}