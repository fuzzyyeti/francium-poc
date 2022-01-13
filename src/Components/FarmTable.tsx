import Table from '@mui/material/Table';
import TableBody from '@mui/material/TableBody';
import TableCell from '@mui/material/TableCell';
import TableContainer from '@mui/material/TableContainer';
import TableHead from '@mui/material/TableHead';
import TableRow from '@mui/material/TableRow';
import Paper from '@mui/material/Paper';
import {createTheme, ThemeProvider} from "@mui/material";
import theme from "../Themes/TableTheme";

const FarmTable = (props : {tableData : { poolName : string, lpTokens: string | undefined , borrowed : string | undefined , total : string | undefined , equity: string | undefined }[]}) => {
    return (    
        <ThemeProvider theme={theme}>
        <TableContainer component={Paper}  sx={{borderRadius: 5}}>
            <Table sx={{ minWidth: 650, backgroundColor: 'background.paper', color: 'text.primary'}} aria-label="simple table">
            <TableHead>
                <TableRow>
                    <TableCell>Pool Name</TableCell>
                    <TableCell align="right">LP Tokens</TableCell>
                    <TableCell align="right">Borrowed</TableCell>
                    <TableCell align="right">Total</TableCell>
                    <TableCell align="right">Equity</TableCell>
                </TableRow>
            </TableHead>
            <TableBody>
                {props.tableData.map((row, index ) => (
                    <TableRow
                        key={row.poolName + index.toString()}
                        sx={{ '&:last-child td, &:last-child th': { border: 0 }, color: 'text.primary' }}
                    >
                        <TableCell sx={{ color: 'text.primary'}}  component="th" scope="row">
                            {row.poolName}
                        </TableCell>
                        <TableCell sx={{ color: 'text.primary'}} align="right">{row.lpTokens}</TableCell>
                        <TableCell sx={{ color: 'text.primary'}}  align="right">{row.borrowed}</TableCell>
                        <TableCell sx={{ color: 'text.primary'}}  align="right">{row.total}</TableCell>
                        <TableCell sx={{ color: 'text.primary'}}  align="right">{row.equity}</TableCell>
                    </TableRow>
                ))}
            </TableBody>
        </Table>
    </TableContainer>
    </ThemeProvider>)
}

export default FarmTable