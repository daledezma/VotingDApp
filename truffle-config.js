module.exports = {
  migrations_directory: "./migrations",
  networks: {
    development: {
      host: "ec2-3-238-159-13.compute-1.amazonaws.com",
      port: 8545,
      network_id: "*" // Match any network id
    }
  }
}
