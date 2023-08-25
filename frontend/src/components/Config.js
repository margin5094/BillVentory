const AWS = require("aws-sdk");

function configureAWS() {
  AWS.config.update({
    accessKeyId: "YOUR_ACCESS_KEY",
    secretAccessKey: "YOUR_SECRET_KEY",
    sessionToken: "YOUR_SESSION_TOKEN",
    region: "us-east-1",
  });
}

module.exports = configureAWS;
