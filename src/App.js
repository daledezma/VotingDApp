import React, { Component } from 'react'
import Web3 from 'web3'

const GANACHE_URL = "http://ec2-3-238-159-13.compute-1.amazonaws.com:8545"
const CANDIDATES = ['Johnny', 'Amber', 'Daniel']

// web3 v4 requires bytes32 values padded to the full 32 bytes
const toBytes32 = (str) => Web3.utils.padRight(Web3.utils.asciiToHex(str), 64)

class App extends Component {
    state = { web3: null, contract: null, account: '', votes: {} }

    async componentDidMount() {
        const web3 = new Web3(new Web3.providers.HttpProvider(GANACHE_URL))
        const accounts = await web3.eth.getAccounts()
        const networkId = (await web3.eth.net.getId()).toString()
        const jsonData = require('./Voting.json')
        const contract = new web3.eth.Contract(jsonData.abi, jsonData.networks[networkId].address)
        this.setState({ web3, contract, account: accounts[0] }, this.loadVotes)
    }

    loadVotes = async () => {
        const votes = {}
        for (const name of CANDIDATES) {
            votes[name] = Number(await this.state.contract.methods.totalVotesFor(toBytes32(name)).call())
        }
        this.setState({ votes })
    }

    vote = async (name) => {
        const { web3, contract, account } = this.state
        await contract.methods.voteForCandidate(toBytes32(name)).send({
            gas: 140000,
            gasPrice: await web3.eth.getGasPrice(),
            from: account
        })
        this.loadVotes()
    }

    render() {
        return (
            <div className="container text-center mt-5">
                <h1>Voting DApp</h1>
                <div className="my-4">
                    {CANDIDATES.map(name => (
                        <button key={name} className="btn btn-primary m-2" onClick={() => this.vote(name)}>
                            {name} Vote
                        </button>
                    ))}
                </div>
                {CANDIDATES.map(name => (
                    <h5 key={name}>{name} count: {this.state.votes[name] || 0}</h5>
                ))}
            </div>
        );
    }
}

export default App;
