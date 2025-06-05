
const contractAddress = "0x8cede102e2ce12aed631f51fcec30db6d4ad93f2";
const abi = [  // Shortened for brevity
    {"inputs":[],"name":"claimReward","outputs":[],"stateMutability":"nonpayable","type":"function"},
    {"inputs":[{"internalType":"uint256","name":"amount","type":"uint256"}],"name":"stake","outputs":[],"stateMutability":"nonpayable","type":"function"},
    {"inputs":[],"name":"withdraw","outputs":[],"stateMutability":"nonpayable","type":"function"},
    {"inputs":[{"internalType":"address","name":"user","type":"address"}],"name":"calculateReward","outputs":[{"internalType":"uint256","name":"","type":"uint256"}],"stateMutability":"view","type":"function"},
    {"inputs":[],"name":"token","outputs":[{"internalType":"contract IERC20","name":"","type":"address"}],"stateMutability":"view","type":"function"},
    {"inputs":[],"name":"rewardRatePerSecond","outputs":[{"internalType":"uint256","name":"","type":"uint256"}],"stateMutability":"view","type":"function"},
    {"inputs":[],"name":"owner","outputs":[{"internalType":"address","name":"","type":"address"}],"stateMutability":"view","type":"function"},
    {"inputs":[{"internalType":"address","name":"","type":"address"}],"name":"stakes","outputs":[{"internalType":"uint256","name":"amount","type":"uint256"},{"internalType":"uint256","name":"startTime","type":"uint256"},{"internalType":"uint256","name":"rewardClaimed","type":"uint256"}],"stateMutability":"view","type":"function"}
];

let provider, signer, contract;

async function connectWallet() {
    if (window.ethereum) {
        try {
            const accounts = await ethereum.request({ method: 'eth_requestAccounts' });
            provider = new ethers.providers.Web3Provider(window.ethereum);
            signer = provider.getSigner();
            contract = new ethers.Contract(contractAddress, abi, signer);
            document.getElementById("wallet").innerText = accounts[0];
            updateStakedInfo(accounts[0]);
        } catch (error) {
            alert("Wallet connection failed.");
        }
    } else {
        alert("MetaMask not detected.");
    }
}

async function stake() {
    const amount = document.getElementById("amount").value;
    if (contract && amount > 0) {
        try {
            const tx = await contract.stake(ethers.utils.parseUnits(amount, 18));
            await tx.wait();
            alert("Stake successful!");
        } catch (err) {
            alert("Stake failed: " + err.message);
        }
    }
}

async function claimReward() {
    if (contract) {
        try {
            const tx = await contract.claimReward();
            await tx.wait();
            alert("Rewards claimed!");
        } catch (err) {
            alert("Claim failed: " + err.message);
        }
    }
}

async function withdraw() {
    if (contract) {
        try {
            const tx = await contract.withdraw();
            await tx.wait();
            alert("Withdraw successful!");
        } catch (err) {
            alert("Withdraw failed: " + err.message);
        }
    }
}

async function updateStakedInfo(user) {
    try {
        const staked = await contract.stakes(user);
        const earned = await contract.calculateReward(user);
        document.getElementById("staked").innerText = ethers.utils.formatUnits(staked.amount, 18);
        document.getElementById("earned").innerText = ethers.utils.formatUnits(earned, 18) + " LYDIA";
    } catch (err) {
        console.log("Fetch failed:", err);
    }
}
