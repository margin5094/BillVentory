const AWS = require("aws-sdk");

function configureAWS() {
  AWS.config.update({
    accessKeyId: "ASIA2QWMGMQNQLDAV7LI",
    secretAccessKey: "vuoYQ7ad80gITMXpXdNNKi9uDc75voVwnrk7Jmti",
    sessionToken:
      "FwoGZXIvYXdzEFoaDGJyYhf1w3bbks64viLAAcLvQG/Y6DjJDkvXfCsRqNbC2SZY6PbJyfdkiA5ZAPy508uYd4kWY7IDx52Mg1V66U+eac8m2ZBiosT7PC1nRzD5yiNiCczmqzXIpH7kMkSVKQMVK/EAu5vAfu26zT4ih4rC0x9QrOpT9oVV/cUAf25VvH7hIJlfqstB9yXK1v4iN5/2Fh3xUmOxVqKKw9x7oi+Y0FlOu1tRVG0gtpBad0pa8izcgkTTOgv6Jyt9MoOpitVSTqFdkt40Ft0BBviKeCjEwaamBjItt7ViAtNs/oGA/YNjBLI4T1snKBpDN7QhncD5vVv5mEQ65miegW8xMIFHVa07",
    region: "us-east-1",
  });
}

module.exports = configureAWS;
