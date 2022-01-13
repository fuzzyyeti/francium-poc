import {Connection, PublicKey} from "@solana/web3.js";
import {useCallback, useEffect, useState} from "react";
import BN from "bn.js";
import {FormatLPInfo} from "francium-sdk/dist/model/price/types";
import FranciumSDK from 'francium-sdk';
import { utils } from 'francium-sdk'
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
    const [lendingPoolInfo, setLendingPoolInfo] = useState<{
        pool: string;
        scale: number;
        avaliableAmount: import("bn.js");
        borrowedAmount: import("bn.js");
        totalAmount: import("bn.js");
        utilization: number;
        totalShareMintSupply: import("bn.js");
        borrowInterest: number;
        apr: number;
        apy: number;
        aprData: {
            threshold1: any;
            threshold2: any;
            base1: any;
            factor1: any;
            base2: any;
            factor2: any;
            base3: any;
            factor3: any;
        };
    }[] | undefined>(undefined);
    useEffect(() => {
          fr.getUserFarmPosition(new PublicKey(props.publicKey)).then(res => setData(res));
          fr.getFarmLPPriceInfo().then(res => setPairPrices(res));
          fr.getTokenPriceInfo().then(res => setTokenPrices(res.tokenPrice));
          fr.getUserLendingPosition(new PublicKey(props.publicKey)).then(res => setLendingPosition(res));
          fr.getLendingPoolInfo().then(res => setLendingPoolInfo(res));
          },[props.publicKey]);

    const getTotalBorrowed = (borrowedTokens : {symbol : string, amount : BN}[]) =>
    {
        if(!tokenPrices)
        {
            return 0;
        }
        let sum : number = 0;
        borrowedTokens.map(bt =>
            sum += tokenPrices[bt.symbol] * bt.amount.toNumber() / 10**utils.getTokenDecimals(bt.symbol)
        );
        return sum;
    }

    return (
        <>
           {/*{ poolName : string, lpTokens: number , borrowed : number, total : number, apy : number, apr : number }*/}
            <h1>Francium Dashboard</h1>
            <p>Append public key to URL</p>
                <Box>
                {data && (<>
                <h2>Leveraged Farming</h2>
                <FarmTable tableData={data.filter(pool => pool.lpAmount.toNumber() != 0).map(pool => {return {
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
                    <LendingTable tableData={lendingPosition.filter(lend => lend.totalPosition != 0).map(lend => {return {
                        poolName: lend.pool,
                        tokens: (lend.totalAmount).toFixed(2),
                        position: '$' + (lend.totalAmount * tokenPrices![lend.pool]).toFixed(2),
                        apy: lendingPoolInfo!.find(pi => pi.pool === lend.pool)!.apy.toFixed(0) + '%'}})} />
                </>)}
            </Box>
        </>
    );
};

export default Dashboard;