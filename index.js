import dotenv from 'dotenv'
dotenv.config()

import igClient from './ig.js'

var ig = new igClient()

ig.connect()

function wait(ig) {
    if(!ig.header)
    {
        for (let i=0; i<2000000000; i++)
        {
            let a = i * 2
        }
    }
}

if(await ig.headers)
{
    const pos = await ig.getPositions()
    
    var row = []
    for(const [key,value] of Object.entries(pos)) {
        for(const [key,entry] of Object.entries(value)) {
            row.push([entry.position.dealSize,entry.market.instrumentName,entry.position.direction,entry.position.openLevel,entry.position.limitLevel])
            
        }
    }
    console.table(row)

    var row = []
    const acc = await ig.getAccounts()
    for(const [key,value] of Object.entries(acc)) {
        //console.log(value)
        for(const [key,entry] of Object.entries(value)) {
            row.push([entry.accountName,entry.balance.balance,entry.balance.available,entry.balance.profitLoss])
            //console.log(entry)
        }
    }
    console.table(row)
}



