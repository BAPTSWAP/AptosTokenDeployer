const router = require('express').Router();
const { sendResponse, sendError, checkType, checkCoinRegister, simpleCompileMove } = require('../funcUtils');



router.post("/simplecompile" , async (req, res) => {

    let {addr, coinType} = req.body;

    //validating parms
	if (!addr | !coinType) return sendError(res, "Missing required params!", 406);


    if (await checkType(addr, coinType) == true) {
        simpleCompileMove(addr, coinType)
            .then(result => {
                // console.log("The message", result)
                let message = {
                    p: result.p,
                    m: result.m,
                }
                return sendResponse(res, message, 200)
            })
            .catch(err => sendError(res, err, 500));
    } else {
        if (await checkCoinRegister(addr, coinType) == true) {
            return sendResponse(res, "Coin Already Exists and initialized", 400);
        } //can add else block to register the give type if its not registered.
        return sendResponse(res, "Coin Already Exists but not initialized", 400);
    }

});



module.exports = router;