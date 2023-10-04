
const { AptosClient, AptosAccount, TxnBuilderTypes, HexString} = require("aptos");

const util = require('util');
const exec = util.promisify(require('child_process').exec);
const fs = require("fs");


const init_command = 'aptos move init --name sample-coin';
const create_module = "touch sources/coinbucket.move";



// to send the success response of the endpoints
sendResponse = (res, data, resCode) => {
	resCode = resCode || 200;
	data = data === undefined ? {} : data;
	let message = {
		code: resCode,
		status: "success",
		data: data,
	};
	res.status(resCode);
	res.json(message);
	res.end();
};

//to send error response of the endpoints
sendError = (res, err, resCode) => {
	err = err || "Internal Server error";
	resCode = resCode || 500;
	req = res.req;
	err_message = { code: resCode || 500, message: err };
	let message = {
		code: resCode,
		status: "erRor",
		message: err,
	};
	console.log(message);
	res.status(resCode);
	res.json(message);
	res.end();
};

// check if the coin is initialized => return bool
checkCoinRegister = async (coinType) => {
	let aptosClient = await new AptosClient(process.env["APTOS_DEV_NODE_URL"], {WITH_CREDENTIALS: false});
	return aptosClient.view({
			arguments: [],
			function: "0x1::coin::is_coin_initialized",
			type_arguments: [`0x${process.env["APTOS_ACCOUNT"]}::CoinBucket::${coinType}`]
		})
		.then((res) => {
			console.log(res);
			return Boolean(res[0])
		})
		.catch((err) => console.log(err));
}

// checks if the cointype already published in the module => returns bool
checkType = async (coinType) => {
	return new Promise(async function(resolve, reject){

		let client = await new AptosClient(process.env["APTOS_DEV_NODE_URL"], {WITH_CREDENTIALS: false});
		return client.getAccountModule(process.env["APTOS_ACCOUNT"], "CoinBucket")
			.then(dat => (dat.abi?.structs.map(s => s.name)))
			.then((existingCoins) => {
				if (checkExistence(existingCoins, coinType)) {
					resolve(false);
				}
				resolve(true);
			})
			.catch(_ => resolve(true))
	})
}

// sets up aptos move package and compiles and publishes the cointype to the existing module
publishModule =  (dir, coinType) => {

	return new Promise( async function(resolve, reject){
		const aptosClient = await new AptosClient(process.env["APTOS_DEV_NODE_URL"], {WITH_CREDENTIALS: false});
		let app_account = new AptosAccount(HexString.ensure(process.env["APTOS_PRIVATE_KEY"]).toUint8Array());
		let {p, m} = await setupAndCompile(dir, aptosClient, `0x${process.env["APTOS_ACCOUNT"]}`, coinType)
					.then((metadata) => {
						return {p: metadata.p, m: metadata.m}
					})
					.catch(err => reject(err));
		console.log("SET up and compilation completed")
		await aptosClient.publishPackage(app_account, new HexString(p.toString("hex")).toUint8Array(), [
			new TxnBuilderTypes.Module(new HexString(m.toString("hex")).toUint8Array()),
		])
			.then(txnHash => aptosClient.waitForTransaction(txnHash, { checkSuccess: true }))
			.then(res => console.log("Published"))
			.then(_ => resolve());
	});
}



// generates and compiles move package and returns the metadata for publishing
setupAndCompile = async (dir, client, addr, coinType) => {
	let package_meta_hex = "";
    let module_hex = "";
    let source = await checkAndGenerateModule(client, addr, coinType);

	// console.log("THe source", source);

	return new Promise(function(resolve, reject){
		exec(`rm -rf ${dir} && mkdir ${dir} && cd ${dir}/ && ${init_command} && ${create_module}`, (error, _stdout, stderr) => {
			if (error | stderr) {
				// throw new Error("Failed to setup");
				reject(error | stderr);
			}
			fs.writeFile(`./${dir}/sources/coinbucket.move`, source, (error) => {
				if (error) {
					// throw new Error("Failed to setup");
					reject(error);
				}
				exec(`cd ${dir}/ && aptos move compile --save-metadata`, async (error, stdout, stderr) => {
					if (error) {
						// throw new Error("Failed to compile");
						reject(error);
					}
					exec(`cat ${dir}/build/sample-coin/package-metadata.bcs | od -v -t x1 -A n | tr -d ' \n'`, (error, stdout, stderr) => {
						package_meta_hex = stdout;
						exec(`cat ${dir}/build/sample-coin/bytecode_modules/CoinBucket.mv | od -v -t x1 -A n | tr -d ' \n'`, (error, stdout, stderr) => {
							module_hex = stdout;
							exec(`rm -rf ${dir}`, (error, stdout, stderr) => {
								if (error) {
									// throw new Error("Failed to compile");
									reject(error);
								}
								resolve({p: package_meta_hex, m: module_hex});
							})

						})
					});
				});
			});
		});
	});
}


// checks if the module exits under the address
checkModule = async (client, addr) => {
	return client.getAccountModule(addr, "CoinBucket").then(_ => true).catch(_ => false);
}


// checks and generate the source of the module
checkAndGenerateModule = async (client, addr, coinType) => {
	if (await checkModule(client, addr) == true) {
		return client.getAccountModule(addr, "CoinBucket")
			.then(dat => (dat.abi?.structs.map(s => s.name)))
			.then((existingCoins) => {
				let t = existingCoins.map(token => `struct ${token.toUpperCase()} {}`).join("\n");
				return `module ${addr}::CoinBucket {
					${t}
					struct ${coinType.toUpperCase()} {}
			}`.toString();
			})
		} else {
			return `module ${addr}::CoinBucket {
				struct ${coinType.toUpperCase()} {}
			}`.toString();
		}
}

// checks if the given coinType exists in the coins
checkExistence = (coins, coinType) => {
	if (coins.includes(coinType.toUpperCase())) {
		return true;
	} else {
		return false;
	}
}


module.exports = {sendResponse, sendError, publishModule, checkType, checkCoinRegister }