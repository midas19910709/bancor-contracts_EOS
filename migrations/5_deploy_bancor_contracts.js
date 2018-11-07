var Token = artifacts.require("./Token/");
var BancorX = artifacts.require("./BancorX/");
var BancorNetwork = artifacts.require("./BancorNetwork/");
var BancorConverter = artifacts.require("./BancorConverter/");
var XTransferRerouter = artifacts.require("./XTransferRerouter/");

async function regConverter(deployer, token, symbol, networkContract, networkToken, networkTokenSymbol, issuerAccount, issuerPrivateKey) {
    const converter = await deployer.deploy(BancorConverter, `cnvt${token}`);

    const tknContract = await deployer.deploy(Token, token);
    await tknContract.contractInstance.create({
        issuer: tknContract.contract.address,
        maximum_supply: `1000000000.00000000 ${symbol}`},
        { authorization: `${tknContract.contract.address}@active`, broadcast: true, sign: true });

    const tknrlyContract = await deployer.deploy(Token, `tkn${networkToken.contract.address}${token}`);
    var rlySymbol = networkTokenSymbol + symbol;
    await tknrlyContract.contractInstance.create({
        issuer: converter.contract.address,
        maximum_supply: `250000000.0000000000 ${rlySymbol}`},
        { authorization: `${tknrlyContract.contract.address}@active`, broadcast: true, sign: true });

    await converter.contractInstance.init({
        smart_contract: tknrlyContract.contract.address,
        smart_currency: `0.0000000000 ${rlySymbol}`,
        smart_enabled: 0,
        enabled: 1,
        network: networkContract.contract.address,
        require_balance: 0,
        max_fee: 0,
        fee: 0
    }, { authorization: `${converter.contract.address}@active`, broadcast: true, sign: true });        

    await converter.contractInstance.setreserve({
        contract:networkToken.contract.address,
        currency: `0.0000000000 ${networkTokenSymbol}`,
        ratio: 500,
        p_enabled: 1
    }, { authorization: `${converter.contract.address}@active`, broadcast: true, sign: true });
        
    await converter.contractInstance.setreserve({
        contract:tknContract.contract.address,
        currency: `0.00000000 ${symbol}`,
        ratio: 500,
        p_enabled: 1
    }, { authorization: `${converter.contract.address}@active`, broadcast: true, sign: true });

    await tknContract.contractInstance.issue({
        to: converter.contract.address,
        quantity: `100000.00000000 ${symbol}`,
        memo: "setup"
    }, { authorization: `${tknContract.contract.address}@active`, broadcast: true, sign: true });
      
    await tknrlyContract.contractInstance.issue({
        to: converter.contract.address,
        quantity: `100000.0000000000 ${networkTokenSymbol + symbol}`,
        memo: "setup"  
    }, { authorization: `${converter.contract.address}@active`, broadcast: true, sign: true, keyProvider: converter.keys.privateKey });
    await networkToken.contractInstance.issue({
        to: converter.contract.address,
        quantity: `100000.0000000000 ${networkTokenSymbol}`,
        memo: "setup"
    }, { authorization: `${issuerAccount}@active`, broadcast: true, sign: true, keyProvider: issuerPrivateKey });
}

module.exports = async function(deployer, network, accounts) {
    const bancorxContract = await deployer.deploy(BancorX, "bancorx");
    const networkContract = await deployer.deploy(BancorNetwork, "bancornetwrk");
    const tknbntContract = await deployer.deploy(Token, "bnt");
    const rerouterContract = await deployer.deploy(XTransferRerouter, "txrerouter");

    var networkTokenSymbol = "BNT";
    await tknbntContract.contractInstance.create({
        issuer: bancorxContract.contract.address,
        maximum_supply: `250000000.0000000000 ${networkTokenSymbol}`},
        { authorization: `${tknbntContract.contract.address}@active`, broadcast: true, sign: true });

    await bancorxContract.contractInstance.init({
        x_token_name: tknbntContract.contract.address,
        min_reporters: 2,
        min_limit: 1,
        limit_inc: 100000000000000,
        max_issue_limit: 10000000000000000,
        max_destroy_limit: 10000000000000000},
        {authorization: `${bancorxContract.contract.address}@active`,broadcast: true,sign: true});

    await accounts.getCreateAccount('reporter1');
    await accounts.getCreateAccount('reporter2');
    await accounts.getCreateAccount('reporter3');
    await accounts.getCreateAccount('reporter4');
    await accounts.getCreateAccount('test1');

    await bancorxContract.contractInstance.addreporter({
        reporter: 'reporter1'},
        {authorization: `${bancorxContract.contract.address}@active`,broadcast: true,sign: true});

    await bancorxContract.contractInstance.addreporter({
        reporter: 'reporter2'},
        {authorization: `${bancorxContract.contract.address}@active`,broadcast: true,sign: true});

    await bancorxContract.contractInstance.addreporter({
        reporter: 'reporter3'},
        {authorization: `${bancorxContract.contract.address}@active`,broadcast: true,sign: true});

    await bancorxContract.contractInstance.enablext({
        enable: 1},
        {authorization: `${bancorxContract.contract.address}@active`,broadcast: true,sign: true});

    await bancorxContract.contractInstance.enablerpt({
        enable: 1},
        {authorization: `${bancorxContract.contract.address}@active`,broadcast: true,sign: true});

    var contract1 = await bancorxContract.eos.contract(tknbntContract.contract.address);
    await contract1.issue({
        to: 'test1',
        quantity: `100000.0000000000 ${networkTokenSymbol}`,
        memo: "test money"
    }, { authorization: `${bancorxContract.contract.address}@active`, broadcast: true, sign: true });

    contract1.issue({
        to: 'reporter1',
        quantity: `100.0000000000 ${networkTokenSymbol}`,
        memo: "test money"
        },{authorization: `${bancorxContract.contract.address}@active`,broadcast: true,sign: true});

    for (var i = 0; i < tkns.length; i++) {
        const { contract, symbol } = tkns[i];
        await regConverter(deployer, contract, symbol, networkContract, tknbntContract, networkTokenSymbol, bancorxContract.contract.address, bancorxContract.keys.privateKey);    
    }
};

var tkns = [];
tkns.push({ contract: "aa", symbol: "TKNA" });
tkns.push({ contract: "bb", symbol: "TKNB" });
