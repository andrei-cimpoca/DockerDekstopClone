import { Backdrop, Box, CircularProgress, IconButton, Paper, Table, TableBody, TableCell, TableContainer, TableHead, TableRow, Toolbar } from "@mui/material";
import React from "react";
import { DockerService } from "../../config/DockerService";
import Network from "./Network";

export default function NetworkPage() {
  const [loadingWheelVisible, setLoadingWheelVisible] = React.useState(false);
  const [networks, setNetworks] = React.useState<Network[]>([]);

  const refreshNetworks = () => {
    setLoadingWheelVisible(true);
    DockerService.getNetworks().then((networks: Network[]) => {
      setNetworks(networks);
      setLoadingWheelVisible(false);
    });
  }

  React.useEffect(() => {
    refreshNetworks();
}, []);

  return (
    <>
      {loadingWheelVisible ?
        (
          <Backdrop sx={{ color: '#fff', zIndex: (theme) => theme.zIndex.drawer + 1 }}
            open={loadingWheelVisible}>
            <CircularProgress color="inherit" />
          </Backdrop>
        )
        : ''
      }
      <TableContainer component={Paper}>
        <Table>
          <TableHead>
            <TableRow>
              <TableCell>ID</TableCell>
              <TableCell>Name</TableCell>
              <TableCell>Type</TableCell>
              <TableCell>IPv6</TableCell>
              <TableCell>Internal</TableCell>
              <TableCell>Scope</TableCell>
              <TableCell>Created</TableCell>
              <TableCell />
            </TableRow>
          </TableHead>
          <TableBody>

            {networks.map((network: Network) => (
              <TableRow
                key={network.id}
                sx={{ '&:last-child td, &:last-child th': { border: 0 } }}
              >
                <TableCell>{network.id}</TableCell>
                <TableCell>{network.name}</TableCell>
                <TableCell>{network.driver}</TableCell>
                <TableCell>{network.ipv6}</TableCell>
                <TableCell>{network.internal}</TableCell>
                <TableCell>{network.scope}</TableCell>
                <TableCell>{network.createdAt}</TableCell>
                <TableCell align="right">
                  {/* <IconButton aria-label="run" size="small" color="success"
                      onClick={() => onRunImageClick(image.id)}>
                      <PlayArrowIcon fontSize="small" />
                    </IconButton>
                    <IconButton aria-label="delete" size="small" color="error"
                      onClick={() => onDeleteClick(image.id)}>
                      <DeleteIcon fontSize="small" />
                    </IconButton> */}

                </TableCell>
              </TableRow>
            ))}
          </TableBody>
        </Table>
      </TableContainer>
    </>
                
  );
}
