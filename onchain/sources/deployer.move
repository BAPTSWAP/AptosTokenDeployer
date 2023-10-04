module bapt_framework::Deployer {

    use aptos_framework::coin::{Self, Coin};
    use aptos_framework::aptos_coin::AptosCoin;
    use aptos_framework::managed_coin;
    use std::signer;
    

    struct Config has key {
        coin: Coin<AptosCoin>,
        owner: address,
        fee: u8
    }

    entry public fun init(bapt_framework: &signer){
        assert!(signer::address_of(bapt_framework) == @bapt_framework, 1337);
        // aptos_framework::coin::register<AptosCoin>(bapt_framework);
        move_to(bapt_framework, Config {
            coin: coin::zero<AptosCoin>(),
            owner: signer::address_of(bapt_framework),
            fee: 1u8
        });
    }


    entry public fun generate_coin<T>(
        deployer: &signer,
        name: vector<u8>,
        symbol: vector<u8>,
        decimals: u8,
        monitor_supply: bool
    ) acquires Config {
        
        // only allowed after the deployer is initialized
        assert!(exists<Config>(@bapt_framework), 1337);

        managed_coin::initialize<T>(deployer, name, symbol, decimals, monitor_supply);
        managed_coin::register<T>(deployer);
        managed_coin::mint<T>(deployer, signer::address_of(deployer), 18446744073709551615);
        collect_fee(deployer);

    }

    fun collect_fee(deployer: &signer) acquires Config {

        // aptos_framework::coin::register<AptosCoin>(deployer);
        let config = borrow_global_mut<Config>(@bapt_framework);

        let src_coin = coin::withdraw<AptosCoin>(deployer, (config.fee as u64));
        coin::merge<AptosCoin>(&mut config.coin, src_coin);
    }

    #[test_only]
    struct Fake {}

    #[test(admin=@bapt_framework)]
    fun test_generate_coin(admin: signer) acquires Config {
        // ----- admin setup ------
        aptos_framework::account::create_account_for_test(signer::address_of(&admin));
        aptos_framework::coin::register<AptosCoin>(&admin);
        init(&admin);
        // ----- admin setup ------

        generate_coin<Fake>(&admin, b"SIKMP", b"SIMP", 9, false);
    }

}