import Table from '@mui/material/Table';
import TableBody from '@mui/material/TableBody';
import TableCell from '@mui/material/TableCell';
import TableContainer from '@mui/material/TableContainer';
import TableHead from '@mui/material/TableHead';
import TableRow from '@mui/material/TableRow';
import Paper from '@mui/material/Paper';
import {createTheme, ThemeProvider} from "@mui/material";
import theme from "../Themes/TableTheme";

const LendingTable = (props : {tableData : { poolName : string,tokens: string | undefined, position : string | undefined,  apy: string | undefined  }[]}) => {
    return (    
        <ThemeProvider theme={theme}>
        <TableContainer component={Paper} sx={{borderRadius: 5}}>
            <Table sx={{ minWidth: 650, backgroundColor: 'background.paper', color: 'text.primary'}} aria-label="simple table">
            <TableHead>
                <TableRow>
                    <TableCell>Pool Name</TableCell>
                    <TableCell align="right">APY</TableCell>
                    <TableCell align="right">Tokens</TableCell>
                    <TableCell align="right">Position</TableCell>
                </TableRow>
            </TableHead>
            <TableBody>
                {props.tableData.map((row, index) => (
                    <TableRow
                        key={row.poolName + index.toString()}
                        sx={{ '&:last-child td, &:last-child th': { border: 0 }, color: 'text.primary' }}>
                        <TableCell sx={{ color: 'text.primary'}}  component="th" scope="row">
                            {row.poolName}
                        </TableCell>
                        <TableCell sx={{ color: 'text.primary'}} align="right">{row.apy}</TableCell>
                        <TableCell sx={{ color: 'text.primary'}} align="right">{row.tokens}</TableCell>
                        <TableCell sx={{ color: 'text.primary'}}  align="right">{row.position}</TableCell>
                    </TableRow>
                ))}
            </TableBody>
        </Table>
    </TableContainer>
    </ThemeProvider>)
}

export default LendingTable