import {Connection, PublicKey} from "@solana/web3.js";
import {useCallback, useEffect, useState} from "react";
import BN from "bn.js";
import {FormatLPInfo} from "francium-sdk/dist/model/price/types";
import FranciumSDK from 'francium-sdk';
import FarmTable from "./FarmTable"
import Box from '@mui/material/Box';
import LendingTable from "./LendingTable";
const fr = new FranciumSDK({
    connection: new Connection('https://free.rpcpool.com')
});
type DashboardProps = {
    publicKey: string
}


const Dashboard = (props: DashboardProps) => {
    const [data, setData] = useState<{
        id: any,
        lpAmount: import("bn.js"),
        priceKey: any,
        lpDecimals: any,
        borrowed: {
            symbol: any,
            amount: import("bn.js"),
        }[]}[] | undefined>(undefined);
    const [pairPrices, setPairPrices] = useState<{[x :string]: FormatLPInfo} | undefined>(undefined);
    const [tokenPrices, setTokenPrices] = useState<{[x :string]: number} | undefined>(undefined);
    const [lendingPosition, setLendingPosition] = useState<{
        pool: string;
        scale: number;
        rewardPosition: any;
        balancePosition: any;
        totalPosition: any;
        totalAmount: number;
    }[]| undefined>(undefined);
    useEffect(() => {
          fr.getUserFarmPosition(new PublicKey(props.publicKey)).then(res => setData(res));
          fr.getFarmLPPriceInfo().then(res => setPairPrices(res));
          fr.getTokenPriceInfo().then(res => setTokenPrices(res.tokenPrice));
          fr.getUserLendingPosition(new PublicKey(props.publicKey)).then(res => console.log(res));
          },[]);

    const getTotalBorrowed = (borrowedTokens : {symbol : string, amount : BN}[]) =>
    {
        if(!tokenPrices)
        {
            return 0;
        }
        let sum : number = 0;
        borrowedTokens.map(bt =>
            sum += tokenPrices[bt.symbol] * bt.amount.toNumber() / 10**6
        );
        return sum;
    }

    return (
        <>
           {/*{ poolName : string, lpTokens: number , borrowed : number, total : number, apy : number, apr : number }*/}
            <h1>Dashboard</h1>
            <Box>
                {data && (<>
                <h2>Leveraged Farming</h2>
                <FarmTable tableData={data.map(pool => {return {
                    poolName : pool.id,
                    lpTokens: (pool.lpAmount.toNumber()/ 10**pool.lpDecimals).toFixed(2),
                    borrowed : '$' + getTotalBorrowed(pool.borrowed).toFixed(2),
                    total : pairPrices && '$' + (pairPrices[pool.priceKey].priceAmm! * pool.lpAmount.toNumber()/ 10**pool.lpDecimals).toFixed(2),
                    equity : pairPrices && '$' + (pairPrices[pool.priceKey].priceAmm! * pool.lpAmount.toNumber()/ 10**pool.lpDecimals - getTotalBorrowed(pool.borrowed)).toFixed(2)
                }})} />
                </>)
                }
                {lendingPosition && (<>
                    <h2>Lending</h2>
                    <LendingTable tableData={lendingPosition.map(lend => {return {poolName: lend.pool, position: lend.totalPosition, apy: "x"}})} />
                </>)}
                {/*// pool.lpAmount.toNumber() != 0 && (*/}
                {/*//     <div>*/}
                {/*//         <h2>{pool.id}</h2>*/}
                {/*//         <p> Total: ${pairPrices && (pairPrices[pool.priceKey].priceAmm! * pool.lpAmount.toNumber()/ 10**pool.lpDecimals).toFixed(2)} </p>*/}
                {/*//         <p> Total borrowed: ${getTotalBorrowed(pool.borrowed).toFixed(2)}</p>*/}
                {/*//         <p> Equity: ${pairPrices && (pairPrices[pool.priceKey].priceAmm! * pool.lpAmount.toNumber()/ 10**pool.lpDecimals - getTotalBorrowed(pool.borrowed)).toFixed(2) } </p>*/}
                {/*//     </div>*/}
                {/*// ))*/}
            </Box>


        </>
    );
};

export default Dashboard;