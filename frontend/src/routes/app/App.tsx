import * as React from 'react';
import Box from '@mui/material/Box';
import Toolbar from '@mui/material/Toolbar';
import Typography from '@mui/material/Typography';
import MainMenu, {DrawerWidth} from "../../fragments/mainmenu/MainMenu";
import useMediaQuery from '@mui/material/useMediaQuery';
import { createTheme, ThemeProvider } from '@mui/material/styles';

const drawerWidth = DrawerWidth;

interface AppProps {}

export default function App(props: React.PropsWithChildren<AppProps>) {
    const prefersDarkMode = useMediaQuery('(prefers-color-scheme: dark)');
    const theme = React.useMemo(
        () =>
          createTheme({
            palette: {
              mode: prefersDarkMode ? 'dark' : 'light',
            },
          }),
        [prefersDarkMode],
      );
    
    return (
        <ThemeProvider theme={theme}>
            <Box sx={{display: 'flex'}}>
                <MainMenu/>
                <Box
                    component="main"
                    sx={{flexGrow: 1, p: 3, width: {sm: `calc(100% - ${drawerWidth}px)`}}}
                >
                    <Toolbar/>
                    { props.children }
                </Box>
            </Box>
        </ThemeProvider>
    );
}