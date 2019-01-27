require("babel-core/register");
require("babel-polyfill");
import Eos from 'eosjs';
import { assert } from 'chai';
import 'mocha';
const fs = require('fs');
const path = require('path');

const host = () => {
    const h = process.env.NETWORK_HOST;
    const p = process.env.NETWORK_PORT;
    return `http://${h}:${p}`;
};

describe('BancorNetwork Contract', () => {
    const converter = 'cnvtaa';
    const converter2 = 'cnvtbb';
    const networkContract = 'bancornetwrk';
    const networkTokenSymbol = "BNT";
    const networkToken = 'bnt';
    const tokenSymbol = "TKNA";
    const tokenSymbol2 = "TKNB";
    const testUser = 'test1';
    const tokenContract= 'aa';
    const keyFile = JSON.parse(fs.readFileSync(path.resolve(process.env.ACCOUNTS_PATH, `${testUser}.json`)).toString());
    const codekey = keyFile.privateKey;
    const _self = Eos({ httpEndpoint:host(), keyProvider:codekey });
    const _selfopts = { authorization:[`${testUser}@active`] };
    
    it('simple convert', async function() {
        var minReturn = 0.100;
        const token = await _self.contract(networkToken)
        let res = await token.transfer({ from: testUser, to: networkContract, quantity: `2.0000000000 ${networkTokenSymbol}`, memo: `1,${converter} ${tokenSymbol},${minReturn},${testUser}` }, _selfopts);
        var events = res.processed.action_traces[0].inline_traces[2].inline_traces[1].console.split("\n");
        // console.log(events)
        const convertEvent = JSON.parse(events[0]);
        const priceDataEvent = JSON.parse(events[1]);
        // assert.equal(convertEvent.return, 1.99996000, "unexpected conversion result");
        assert.equal(priceDataEvent.reserve_ratio, 0.5, "unexpected reserve_ratio");
        // console.log("result",jObj.target_amount);
    });

    it('2 hop convert', async function() {
        var minReturn = 0.100;
        const token = await _self.contract(tokenContract)
        let res = await token.transfer({ from: testUser, to: networkContract, quantity: `1.00000000 ${tokenSymbol}`, memo: `1,${converter} ${networkTokenSymbol} ${converter2} ${tokenSymbol2},${minReturn},${testUser}` }, _selfopts);
        var events = res.processed.action_traces[0].inline_traces[2].inline_traces[1].console.split("\n");
        console.log(events)
        let convertEvent = JSON.parse(events[0]);
        let priceDataEvent = JSON.parse(events[1]);
        assert.equal(convertEvent.return, 1.0000299998, "unexpected conversion result");
        assert.equal(priceDataEvent.reserve_ratio, 0.5, "unexpected reserve_ratio");
        
        events = res.processed.action_traces[0].inline_traces[2].inline_traces[2].inline_traces[2].inline_traces[1].console.split("\n");
        console.log(events)
        convertEvent = JSON.parse(events[0]);
        priceDataEvent = JSON.parse(events[1]);
        assert.equal(convertEvent.return, 0.99802094, "unexpected conversion result");
        assert.equal(convertEvent.conversion_fee, 0.00099951, "unexpected conversion result");
        assert.equal(priceDataEvent.reserve_ratio, 0.5, "unexpected reserve_ratio");
    });

});
