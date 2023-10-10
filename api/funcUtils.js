
const { AptosClient } = require("aptos");

const util = require('util');
const exec = util.promisify(require('child_process').exec);
const fs = require("fs");


const init_command = 'aptos move init --name sample-coin1';
const create_module = "touch sources/coincollection.move";



// to send the success response of the endpoints
const sendResponse = (res, data, resCode) => {
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
const sendError = (res, err, resCode) => {
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
const checkCoinRegister = async (addr, coinType) => {
	let aptosClient = await new AptosClient(process.env["APTOS_DEV_NODE_URL"], {WITH_CREDENTIALS: false});
	return aptosClient.view({
			arguments: [],
			function: "0x1::coin::is_coin_initialized",
			type_arguments: [`${addr}::CoinCollection::${coinType}`]
		})
		.then((res) => {
			return Boolean(res[0])
		})
		.catch((err) => {console.log(err); return false});
}

// checks if the cointype already published in the module => returns bool
const checkType = async (addr, coinType) => {
	return new Promise(async function(resolve, reject){

		let client = await new AptosClient(process.env["APTOS_DEV_NODE_URL"], { WITH_CREDENTIALS: false });
		return client.getAccountModule(addr, "CoinCollection")
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



// generates and compiles move package and returns the metadata for publishing
const setupAndCompile = async (dir, client, addr, coinType) => {
	let package_meta_hex = "";
    let module_hex = "";
    let source = await checkAndGenerateModule(client, addr, coinType);


	return new Promise(function(resolve, reject){
		exec(`rm -rf ${dir} && mkdir ${dir} && cd ${dir}/ && ${init_command} && ${create_module}`, (error, _stdout, stderr) => {
			if (error | stderr) {
				// throw new Error("Failed to setup");
				reject(error | stderr);
			}
			fs.writeFile(`./${dir}/sources/coincollection.move`, source, (error) => {
				if (error) {
					// throw new Error("Failed to setup");
					reject(error);
				}
				exec(`cd ${dir}/ && aptos move compile --save-metadata`, async (error, stdout, stderr) => {
					if (error) {
						// throw new Error("Failed to compile");
						reject(error);
					}
					exec(`cat ${dir}/build/sample-coin1/package-metadata.bcs | od -v -t x1 -A n | tr -d ' \n'`, (error, stdout, stderr) => {
						package_meta_hex = stdout;
						exec(`cat ${dir}/build/sample-coin1/bytecode_modules/CoinCollection.mv | od -v -t x1 -A n | tr -d ' \n'`, (error, stdout, stderr) => {
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
const checkModule = async (client, addr) => {
	return client.getAccountModule(addr, "CoinCollection").then(_ => true).catch(_ => false);
}


// checks and generate the source of the module
const checkAndGenerateModule = async (client, addr, coinType) => {
	if (await checkModule(client, addr) == true) {
		return client.getAccountModule(addr, "CoinCollection")
			.then(dat => (dat.abi?.structs.map(s => s.name)))
			.then(async (existingCoins) => {
				let t = existingCoins.map(token => `struct ${token.toUpperCase()} {}`).join("\n");
				if (await checkExistence(existingCoins, coinType) == true) {
					return `
module ${addr}::CoinCollection {
${t}
}`.toString();
				} else {
				return `
module ${addr}::CoinCollection {
${t}
struct ${coinType.toUpperCase()} {}
}`.toString(); }
			})
		} else {
			return `
module ${addr}::CoinCollection {
struct ${coinType.toUpperCase()} {}
}`.toString();
		}
}

// checks if the given coinType exists in the coins
const checkExistence = (coins, coinType) => {
	if (coins.includes(coinType.toUpperCase())) {
		return true;
	} else {
		return false;
	}
}


const simpleCompileMove = async (addr, coinType) => {
		const client = await new AptosClient(process.env["APTOS_DEV_NODE_URL"], {WITH_CREDENTIALS: false});
		return await setupAndCompile(addr, client, addr, coinType)
						.then((metadata) => {
							if (!metadata.p || !metadata.m ) {
								throw new Error("Failed to Compile")
							}
							return {p: metadata.p, m: metadata.m}
						})
						.catch(err => new Error(err))
}



module.exports = {sendResponse, sendError, checkType, checkCoinRegister, simpleCompileMove }