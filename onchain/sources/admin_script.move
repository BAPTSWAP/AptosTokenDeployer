script {
    use bapt_framework::Deployer;

    fun init(bapt_framework: &signer, fee: u64, owner: address) {//change the fee accordingly
        Deployer::init(bapt_framework, fee, owner);
    }

    
}

script {
    use bapt_framework::Deployer;

    fun update_fee(bapt_framework: &signer, new_fee: u64) {
        Deployer::update_fee(bapt_framework, new_fee);
    }
}

script {
    use bapt_framework::Deployer;

    fun update_owner(bapt_framework: &signer, new_owner: address) {
        Deployer::update_owner(bapt_framework, new_owner);
    }
}