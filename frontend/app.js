// =====================================================
// BLOCKESTATE - BLOCKCHAIN PROPERTY REGISTRATION
// DIRECT GANACHE VERSION
// =====================================================


// =====================================================
// GANACHE + CONTRACT SETTINGS
// =====================================================

const ganacheURL = "http://127.0.0.1:7545";

const contractAddress =
    "0x6A285b55C1F699978241Cd49a62acAA1919A4800";


// =====================================================
// VARIABLES
// =====================================================

let provider;
let signer;
let contract;


// =====================================================
// CONTRACT ABI
// =====================================================

const contractABI = [

    // registerProperty
    {
        "inputs": [
            {
                "internalType": "uint256",
                "name": "_propertyId",
                "type": "uint256"
            },
            {
                "internalType": "string",
                "name": "_location",
                "type": "string"
            },
            {
                "internalType": "string",
                "name": "_propertyType",
                "type": "string"
            },
            {
                "internalType": "uint256",
                "name": "_area",
                "type": "uint256"
            },
            {
                "internalType": "string",
                "name": "_documentHash",
                "type": "string"
            }
        ],
        "name": "registerProperty",
        "outputs": [],
        "stateMutability": "nonpayable",
        "type": "function"
    },

    // getProperty
    {
        "inputs": [
            {
                "internalType": "uint256",
                "name": "_propertyId",
                "type": "uint256"
            }
        ],
        "name": "getProperty",
        "outputs": [
            {
                "internalType": "uint256",
                "name": "",
                "type": "uint256"
            },
            {
                "internalType": "string",
                "name": "",
                "type": "string"
            },
            {
                "internalType": "string",
                "name": "",
                "type": "string"
            },
            {
                "internalType": "uint256",
                "name": "",
                "type": "uint256"
            },
            {
                "internalType": "string",
                "name": "",
                "type": "string"
            },
            {
                "internalType": "address",
                "name": "",
                "type": "address"
            },
            {
                "internalType": "uint256",
                "name": "",
                "type": "uint256"
            },
            {
                "internalType": "bool",
                "name": "",
                "type": "bool"
            }
        ],
        "stateMutability": "view",
        "type": "function"
    }
];


// =====================================================
// CONNECT TO GANACHE
// =====================================================

document
    .getElementById("connectButton")
    .addEventListener("click", async function () {

        try {

            setConnectButtonLoading(true);

            // Connect directly to Ganache
            provider =
                new ethers.JsonRpcProvider(
                    ganacheURL
                );


            // Check Ganache network
            const network =
                await provider.getNetwork();


            console.log(
                "Ganache Chain ID:",
                network.chainId.toString()
            );


            // Get Ganache unlocked account
            signer =
                await provider.getSigner();


            // Get account address
            const signerAddress =
                await signer.getAddress();


            console.log(
                "Ganache Account:",
                signerAddress
            );


            // Check contract
            const code =
                await provider.getCode(
                    contractAddress
                );


            if (code === "0x") {

                throw new Error(
                    "Smart contract not found. Check Ganache workspace and contract address."
                );

            }


            // Create contract
            contract =
                new ethers.Contract(
                    contractAddress,
                    contractABI,
                    signer
                );


            // Update button
            document
                .getElementById("connectButton")
                .innerText =
                "✓ Ganache Connected";


            // Display account
            document
                .getElementById("walletAddress")
                .innerText =
                signerAddress;


            // Display contract address
            const contractDisplay =
                document.getElementById(
                    "contractAddressDisplay"
                );

            if (contractDisplay) {

                contractDisplay.innerText =
                    shortenAddress(contractAddress);

            }


            // Display chain ID
            const chainIdDisplay =
                document.getElementById("chainId");

            if (chainIdDisplay) {

                chainIdDisplay.innerText =
                    network.chainId.toString();

            }


            // Get current block
            await updateBlockNumber();


            console.log(
                "Contract:",
                contractAddress
            );


            console.log(
                "Connected successfully!"
            );


            showStatus(
                "registrationStatus",
                "success",
                "✓ Successfully connected to Ganache blockchain."
            );


        } catch (error) {

            console.error(
                "Ganache Connection Error:",
                error
            );


            showStatus(
                "registrationStatus",
                "error",
                "❌ Could not connect to Ganache. Make sure Ganache is running."
            );

        } finally {

            setConnectButtonLoading(false);

        }

    });


// =====================================================
// REGISTER PROPERTY
// =====================================================

document
    .getElementById("propertyForm")
    .addEventListener("submit", async function (event) {

        event.preventDefault();


        try {

            // Check connection
            if (!contract) {

                showStatus(
                    "registrationStatus",
                    "error",
                    "❌ Please connect to Ganache first."
                );

                return;

            }


            // Get values
            const propertyId =
                document
                    .getElementById("propertyId")
                    .value;


            const location =
                document
                    .getElementById("location")
                    .value
                    .trim();


            const propertyType =
                document
                    .getElementById("propertyType")
                    .value;


            const area =
                document
                    .getElementById("area")
                    .value;


            const documentHash =
                document
                    .getElementById("documentHash")
                    .value
                    .trim();


            // Validation
            if (!propertyId) {

                showStatus(
                    "registrationStatus",
                    "error",
                    "❌ Please enter a Property ID."
                );

                return;

            }


            if (!location) {

                showStatus(
                    "registrationStatus",
                    "error",
                    "❌ Please enter a Location."
                );

                return;

            }


            if (!area) {

                showStatus(
                    "registrationStatus",
                    "error",
                    "❌ Please enter the property Area."
                );

                return;

            }


            if (!documentHash) {

                showStatus(
                    "registrationStatus",
                    "error",
                    "❌ Please enter the Document Hash."
                );

                return;

            }


            // Start loading
            setRegisterLoading(true);


            showStatus(
                "registrationStatus",
                "loading",
                "⏳ Preparing blockchain transaction..."
            );


            console.log(
                "Registering Property:",
                propertyId
            );


            // Estimate gas
            const gasEstimate =
                await contract.registerProperty.estimateGas(
                    propertyId,
                    location,
                    propertyType,
                    area,
                    documentHash
                );


            console.log(
                "Estimated Gas:",
                gasEstimate.toString()
            );


            // Add 20% safety
            const gasLimit =
                gasEstimate * 120n / 100n;


            // Register property
            const transaction =
                await contract.registerProperty(
                    propertyId,
                    location,
                    propertyType,
                    area,
                    documentHash,
                    {
                        gasLimit: gasLimit
                    }
                );


            console.log(
                "Transaction Hash:",
                transaction.hash
            );


            showStatus(
                "registrationStatus",
                "loading",
                "⏳ Transaction submitted. Waiting for blockchain confirmation..."
            );


            // Wait for confirmation
            const receipt =
                await transaction.wait();


            console.log(
                "Transaction Receipt:",
                receipt
            );


            // Update block number
            await updateBlockNumber();


            // Show success
            showStatus(
                "registrationStatus",
                "success",
                "✓ Property registered successfully on the blockchain!"
            );


            // Show recent transaction
            showRecentTransaction(
                propertyId,
                receipt.blockNumber,
                transaction.hash
            );


            // Clear form
            document
                .getElementById("propertyForm")
                .reset();


        } catch (error) {

            console.error(
                "Registration Error:",
                error
            );


            showStatus(
                "registrationStatus",
                "error",
                "❌ Registration failed: " +
                getErrorMessage(error)
            );

        } finally {

            setRegisterLoading(false);

        }

    });


// =====================================================
// SEARCH PROPERTY
// =====================================================

document
    .getElementById("searchButton")
    .addEventListener("click", async function () {

        try {

            // Check connection
            if (!contract) {

                showSearchError(
                    "Please connect to Ganache first."
                );

                return;

            }


            // Get Property ID
            const propertyId =
                document
                    .getElementById("searchPropertyId")
                    .value;


            if (!propertyId) {

                showSearchError(
                    "Please enter a Property ID."
                );

                return;

            }


            // Start loading
            setSearchLoading(true);


            document
                .getElementById("propertyResult")
                .innerHTML = `

                    <div class="loading-state">

                        <div class="loader"></div>

                        <p>
                            Searching blockchain...
                        </p>

                    </div>

                `;


            console.log(
                "Searching Property:",
                propertyId
            );


            // Get property
            const property =
                await contract.getProperty(
                    propertyId
                );


            console.log(
                "Property Data:",
                property
            );


            // Property not found
            if (
                property[0].toString() === "0"
            ) {

                document
                    .getElementById("propertyResult")
                    .innerHTML = `

                        <div class="empty-state error-state">

                            <div class="empty-icon">
                                ⚠️
                            </div>

                            <h3>
                                Property Not Found
                            </h3>

                            <p>
                                No property with ID
                                <strong>${propertyId}</strong>
                                exists on the blockchain.
                            </p>

                        </div>

                    `;

                return;

            }


            // Display property
            document
                .getElementById("propertyResult")
                .innerHTML = `

                    <div class="result-success">

                        <div class="result-header">

                            <span class="verified-badge">
                                ✓ BLOCKCHAIN RECORD FOUND
                            </span>

                        </div>

                        <h3>
                            🏠 Property Details
                        </h3>

                        <div class="property-details">

                            <div class="detail-row">

                                <span>Property ID</span>

                                <strong>
                                    ${property[0].toString()}
                                </strong>

                            </div>

                            <div class="detail-row">

                                <span>Location</span>

                                <strong>
                                    ${property[1]}
                                </strong>

                            </div>

                            <div class="detail-row">

                                <span>Property Type</span>

                                <strong>
                                    ${property[2]}
                                </strong>

                            </div>

                            <div class="detail-row">

                                <span>Area</span>

                                <strong>
                                    ${property[3].toString()}
                                    sq.ft
                                </strong>

                            </div>

                            <div class="detail-row">

                                <span>Document Hash</span>

                                <strong class="hash-value">
                                    ${property[4]}
                                </strong>

                            </div>

                            <div class="detail-row">

                                <span>Owner</span>

                                <strong class="hash-value">
                                    ${property[5]}
                                </strong>

                            </div>

                            <div class="detail-row">

                                <span>Verification</span>

                                <strong class="verified-text">
                                    ${
                                        property[7]
                                            ? "✓ VERIFIED"
                                            : "NOT VERIFIED"
                                    }
                                </strong>

                            </div>

                        </div>

                    </div>

                `;


        } catch (error) {

            console.error(
                "Search Error:",
                error
            );


            showSearchError(
                getErrorMessage(error)
            );

        } finally {

            setSearchLoading(false);

        }

    });


// =====================================================
// COPY WALLET ADDRESS
// =====================================================

const copyWalletButton =
    document.getElementById(
        "copyWalletButton"
    );

if (copyWalletButton) {

    copyWalletButton.addEventListener(
        "click",
        async function () {

            if (!signer) {

                alert(
                    "Connect to Ganache first."
                );

                return;

            }

            const address =
                await signer.getAddress();

            copyToClipboard(
                address,
                copyWalletButton
            );

        }
    );

}


// =====================================================
// COPY CONTRACT ADDRESS
// =====================================================

const copyContractButton =
    document.getElementById(
        "copyContractButton"
    );

if (copyContractButton) {

    copyContractButton.addEventListener(
        "click",
        function () {

            copyToClipboard(
                contractAddress,
                copyContractButton
            );

        }
    );

}


// =====================================================
// COPY TRANSACTION HASH
// =====================================================

const copyTransactionButton =
    document.getElementById(
        "copyTransactionButton"
    );

if (copyTransactionButton) {

    copyTransactionButton.addEventListener(
        "click",
        function () {

            const hash =
                document.getElementById(
                    "transactionHash"
                ).innerText;

            if (
                hash &&
                hash !== "-"
            ) {

                copyToClipboard(
                    hash,
                    copyTransactionButton
                );

            }

        }
    );

}


// =====================================================
// UPDATE CURRENT BLOCK
// =====================================================

async function updateBlockNumber() {

    try {

        if (!provider) {
            return;
        }


        const blockNumber =
            await provider.getBlockNumber();


        const blockElement =
            document.getElementById(
                "currentBlock"
            );


        if (blockElement) {

            blockElement.innerText =
                "#" + blockNumber;

        }


    } catch (error) {

        console.error(
            "Block number error:",
            error
        );

    }

}


// =====================================================
// SHOW RECENT TRANSACTION
// =====================================================

function showRecentTransaction(
    propertyId,
    blockNumber,
    transactionHash
) {

    const card =
        document.getElementById(
            "recentTransaction"
        );


    if (!card) {
        return;
    }


    document
        .getElementById(
            "recentPropertyId"
        )
        .innerText =
        propertyId;


    document
        .getElementById(
            "recentBlockNumber"
        )
        .innerText =
        "#" + blockNumber;


    document
        .getElementById(
            "transactionHash"
        )
        .innerText =
        shortenHash(transactionHash);


    card.classList.remove("hidden");

}


// =====================================================
// COPY TO CLIPBOARD
// =====================================================

async function copyToClipboard(
    text,
    button
) {

    try {

        await navigator.clipboard.writeText(
            text
        );


        const oldText =
            button.innerText;


        button.innerText =
            "✓";


        setTimeout(
            function () {

                button.innerText =
                    oldText;

            },
            1500
        );


    } catch (error) {

        console.error(
            "Copy failed:",
            error
        );

        alert(
            "Could not copy the value."
        );

    }

}


// =====================================================
// SHORTEN ADDRESS
// =====================================================

function shortenAddress(address) {

    if (!address) {
        return "-";
    }

    return (
        address.substring(0, 8) +
        "..." +
        address.substring(address.length - 6)
    );

}


// =====================================================
// SHORTEN HASH
// =====================================================

function shortenHash(hash) {

    if (!hash) {
        return "-";
    }

    return (
        hash.substring(0, 12) +
        "..." +
        hash.substring(hash.length - 10)
    );

}


// =====================================================
// SUCCESS / ERROR / LOADING MESSAGE
// =====================================================

function showStatus(
    elementId,
    type,
    message
) {

    const element =
        document.getElementById(
            elementId
        );


    if (!element) {
        return;
    }


    element.className =
        "status-message " +
        type;


    element.innerHTML =
        message;

}


// =====================================================
// SEARCH ERROR
// =====================================================

function showSearchError(message) {

    document
        .getElementById(
            "propertyResult"
        )
        .innerHTML = `

            <div class="empty-state error-state">

                <div class="empty-icon">
                    ❌
                </div>

                <h3>
                    Search Failed
                </h3>

                <p>
                    ${message}
                </p>

            </div>

        `;

}


// =====================================================
// REGISTER LOADING
// =====================================================

function setRegisterLoading(
    loading
) {

    const button =
        document.getElementById(
            "registerButton"
        );

    const text =
        document.getElementById(
            "registerButtonText"
        );

    const loader =
        document.getElementById(
            "registerLoader"
        );


    if (!button) {
        return;
    }


    button.disabled =
        loading;


    if (loading) {

        if (text) {
            text.innerText =
                "Registering...";
        }

        if (loader) {
            loader.classList.remove(
                "hidden"
            );
        }

    } else {

        if (text) {
            text.innerText =
                "⛓ Register Property";
        }

        if (loader) {
            loader.classList.add(
                "hidden"
            );
        }

    }

}


// =====================================================
// SEARCH LOADING
// =====================================================

function setSearchLoading(
    loading
) {

    const button =
        document.getElementById(
            "searchButton"
        );

    const text =
        document.getElementById(
            "searchButtonText"
        );

    const loader =
        document.getElementById(
            "searchLoader"
        );


    if (!button) {
        return;
    }


    button.disabled =
        loading;


    if (loading) {

        if (text) {
            text.innerText =
                "Searching...";
        }

        if (loader) {
            loader.classList.remove(
                "hidden"
            );
        }

    } else {

        if (text) {
            text.innerText =
                "🔎 Search Blockchain";
        }

        if (loader) {
            loader.classList.add(
                "hidden"
            );
        }

    }

}


// =====================================================
// CONNECT BUTTON LOADING
// =====================================================

function setConnectButtonLoading(
    loading
) {

    const button =
        document.getElementById(
            "connectButton"
        );


    if (!button) {
        return;
    }


    button.disabled =
        loading;


    if (loading) {

        button.innerText =
            "Connecting...";

    } else {

        if (
            !contract
        ) {

            button.innerText =
                "🔗 Connect Ganache";

        }

    }

}


// =====================================================
// ERROR MESSAGE
// =====================================================

function getErrorMessage(error) {

    if (!error) {

        return "Unknown error.";

    }


    if (error.reason) {

        return error.reason;

    }


    if (error.shortMessage) {

        return error.shortMessage;

    }


    if (
        error.info &&
        error.info.error &&
        error.info.error.message
    ) {

        return error.info.error.message;

    }


    if (error.message) {

        return error.message;

    }


    return "Transaction failed.";

}