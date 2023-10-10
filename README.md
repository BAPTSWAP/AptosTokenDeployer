# Coin Deployer


## Setup

### Move package
- initialize the aptos: `aptos init`
    - choose the desired network and provide the `BAPT_FRAMEWORK_PRIV_KEY`
- compile and publish the modules: `aptos move publish --profile yourprofile`
- run the script to initialize the module: `aptos move run-script --compiled-script-path build/coin-deployer/bytecode_scripts/init.mv --profile default --args u64:200000000 address:0xa9f131d24d37f1539c248c6dffd8ac04e58e55258b41528b9c4b8afaed6f6702`

This publishes the `Deployer` module under the `BAPT_FRAMEWORK_ADDRESS`


### API
- set the secrets in .env
    ```bash
    #devnet
    APTOS_DEV_NODE_URL="https://fullnode.devnet.aptoslabs.com"



    APTOS_PRIVATE_KEY="BAPT_FRAMEWORK_PRIV_KEY"
    APTOS_PUBLIC_KEY="BAPT_FRAMEWORK_PUB_KEY"
    APTOS_ACCOUNT="BAPT_FRAMEWORK_ACCOUNT_ADDRESS"

    ```
- install the dependencies: `npm install` 
- start the API server: `npm run dev`
Note: Currently the API has cors enabled, please disable it during production release.(app configuration)

Note: use the same key-pair while setting up the move package and API.


### Client 
- Update the params `GENERATOR_ENDPOINT`, `DEV_NODE` and `BAPT_FRAMEWORK_ADDRESS` accordingly.
- install the deps
- start the client
Note: Currently the API has cors enabled, please disable it during production release.(`publishType` function)


## Usage
- Go to the /coindeployer
- Check for the type that you desire to publish and generate coin
- Fill the publish/deploy from with desired values and wait for publishing of the type and sign the transaction to pay fee and generate coin.
- You can check the status of the txn in the explorer and if the txn is executed sucessfully the coins are minted the specified supply and sent to your address and you can see them in your wallet.
