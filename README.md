﻿# Bancor Protocol Contracts v0.4 (alpha)

Bancor is a decentralized liquidity network that provides users with a simple, low-cost way to buy and sell tokens. Bancor’s open-source protocol empowers tokens with built-in convertibility directly through their smart contracts, allowing integrated tokens to be instantly converted for one another, without needing to match buyers and sellers in an exchange. The Bancor Wallet enables automated token conversions directly from within the wallet, at prices that are more predictable than exchanges and resistant to manipulation. To convert tokens instantly, including ETH, EOS, DAI and more, visit the [Bancor Web App](https://www.bancor.network/communities/5a780b3a287443a5cdea2477?utm_source=social&utm_medium=github&utm_content=readme), join the [Bancor Telegram group](https://t.me/bancor) or read the Bancor Protocol™ [Whitepaper](https://www.bancor.network/whitepaper) for more information.

## Overview
The Bancor protocol represents the first technological solution for the classic problem in economics known as the “Double Coincidence of Wants”, in the domain of asset exchange. For barter, the coincidence of wants problem was solved through money. For money, exchanges still rely on labor, via bid/ask orders and trade between external agents, to make markets and supply liquidity. 

Through the use of smart-contracts, Smart Tokens can be created that hold one or more other tokens as connectors. Tokens may represent existing national currencies or other types of assets. By using a connector token model and algorithmically-calculated conversion rates, the Bancor Protocol creates a new type of ecosystem for asset exchange, with no central control. This decentralized hierarchical monetary system lays the foundation for an autonomous decentralized global exchange with numerous and substantial advantages.

## Warning

Bancor is a work in progress. Make sure you understand the risks before using it.

# The Bancor Standards

Bancor protocol is implemented using multiple contracts. The main ones are SmartToken, BancorConverter.
BancorConverter is responsible for converting between a token and its connectors.
SmartToken represents a converter aware eos token.

## Run locally
```
./run.sh
```


## Collaborators

* **[Yudi Levi](https://github.com/yudilevi)**
* **[Ilana Pinhas](https://github.com/ilanapi)**
* **[Or Dadosh](https://github.com/ordd)**
* **[Barak Manos](https://github.com/barakman)**
* **[Martin Holst Swende](https://github.com/holiman)**
* **[Tal Muskal](https://github.com/tmuskal)**



## License

Bancor Protocol is open source and distributed under the Apache License v2.0
