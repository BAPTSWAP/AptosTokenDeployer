

export const ABI = {
    "address":"0x1",
    "name":"code",
    "friends":[],
    "exposed_functions":[
        {
            "name":"publish_package_txn",
            "visibility":"public",
            "is_entry":true,
            "is_view":false,
            "generic_type_params":[],
            "params":[
                "&signer",
                "vector<u8>",
                "vector<vector<u8>>"
            ],
            "return":[]
        }
    ],
    "structs": [],
} as const