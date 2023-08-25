const AWS = require("aws-sdk");
const dynamoDB = new AWS.DynamoDB.DocumentClient();

exports.handler = async (event, context) => {
  try {
    const scanParams = {
      TableName: "bills",
    };
    const data = await dynamoDB.scan(scanParams).promise();
    const allBills = data.Items;

    console.log("All Bills:", allBills);

    return {
      statusCode: 200,
      body: JSON.stringify(allBills),
    };
  } catch (error) {
    console.error("Error:", error);
    return {
      statusCode: 500,
      body: JSON.stringify("Error occurred while fetching all bills."),
    };
  }
};
