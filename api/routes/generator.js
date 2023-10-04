const router = require('express').Router();
const { sendResponse, sendError, publishModule, checkType, checkCoinRegister } = require('../funcUtils');



// generate route for publishing the type
router.post("/generate", async (req, res, next) => {

	let {addr, coinType} = req.body;
    let resp = {}

    //validating parms
	if (!addr | !coinType) return sendError(res, "Missing required params!", 406);

    if (await checkType(coinType) == true) {
        publishModule(addr, coinType)
        .then(_ => console.log("Published Sucessfully"))
        .then(_ => sendResponse(res, {stat: "Published sucessfully"}, 200))
        .then(_ => _)
        .catch(err => sendError(res, err, 500));
    } else {
        if (await checkCoinRegister(coinType) == true) {
            resp.initialized_message = "Coin Already Exists and initialized";
            sendError(res, "Coin Already Exists and initialized", 400);
        } //can add else block to register the give type if its not registered.
        sendError(res, "Coin Already but not initialized", 400);
    }
});



module.exports = router;