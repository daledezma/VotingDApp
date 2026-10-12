var Voting = artifacts.require("./Voting.sol");
module.exports = function(deployer) {
        const listOfCandidates = ['Johnny', 'Amber', 'Daniel']
        deployer.deploy(Voting, listOfCandidates.map(name => web3.utils.asciiToHex(name) ));
};
