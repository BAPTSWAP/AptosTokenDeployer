script {
    use bapt_framework::deployer;

    fun init(bapt_framework: &signer, fee: u64, owner: address) {//change the fee accordingly
        deployer::init(bapt_framework, fee, owner);
    }

    
}

script {
    use bapt_framework::deployer;

    fun update_fee(bapt_framework: &signer, new_fee: u64) {
        deployer::update_fee(bapt_framework, new_fee);
    }
}

script {
    use bapt_framework::deployer;

    fun update_owner(bapt_framework: &signer, new_owner: address) {
        deployer::update_owner(bapt_framework, new_owner);
    }
}