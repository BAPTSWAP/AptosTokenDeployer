script {
    use bapt_framework::Deployer;

    fun init(bapt_framework: &signer) {
        Deployer::init(bapt_framework);
    }
}