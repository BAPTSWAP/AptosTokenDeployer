module bapt_framework::Deployer {

    use aptos_framework::coin::{Self};
    use aptos_framework::aptos_coin::AptosCoin;
    use aptos_framework::managed_coin;
    use std::signer;

    struct Config has key {
        owner: address,
        fee: u64
    }

    // Error Codes 
    const INVALID_BAPT_ACCOUNT: u8 = 0;
    const DEPLOYER_NOT_INITIALIZED: u8 = 1;


    entry public fun init(bapt_framework: &signer, fee: u64, owner: address){
        assert!(signer::address_of(bapt_framework) == @bapt_framework, 0);

        move_to(bapt_framework, Config {
            owner,
            fee
        });
    }

    entry public fun update_fee(bapt_framework: &signer, new_fee: u64) acquires Config {
        assert!(signer::address_of(bapt_framework) == @bapt_framework, 0);
        // only allowed after the deployer is initialized
        assert!(exists<Config>(@bapt_framework), 1);

        let config = borrow_global_mut<Config>(@bapt_framework);
        config.fee = new_fee;
    }

    entry public fun update_owner(bapt_framework: &signer, new_owner: address) acquires Config {
        assert!(signer::address_of(bapt_framework) == @bapt_framework, 0);
        // only allowed after the deployer is initialized
        assert!(exists<Config>(@bapt_framework), 1);

        let config = borrow_global_mut<Config>(@bapt_framework);
        config.owner = new_owner;
    }


    entry public fun generate_coin<T>(
        deployer: &signer,
        name: vector<u8>,
        symbol: vector<u8>,
        decimals: u8,
        total_supply: u64,
        monitor_supply: bool,
    ) acquires Config {        
        // only allowed after the deployer is initialized
        assert!(exists<Config>(@bapt_framework), 1);

        managed_coin::initialize<T>(deployer, name, symbol, decimals, monitor_supply);
        managed_coin::register<T>(deployer);
        managed_coin::mint<T>(deployer, signer::address_of(deployer), total_supply);

        collect_fee(deployer);

    }

    fun collect_fee(deployer: &signer) acquires Config {
        let config = borrow_global_mut<Config>(@bapt_framework);
        coin::transfer<AptosCoin>(deployer, config.owner, config.fee);
    }

}