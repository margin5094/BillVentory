exports.handler = async (event) => {
  const AWS = require("aws-sdk");

  AWS.config.update({
    region: "us-east-1",
  });

  const dynamodb = new AWS.DynamoDB.DocumentClient();

  try {
    const requestBody = JSON.parse(event.body);
    const products = requestBody.products;

    const putPromises = products.map((product) => {
      const params = {
        TableName: "products",
        Item: product,
      };

      return dynamodb.put(params).promise();
    });

    await Promise.all(putPromises);
    const responseHeaders = {
      "Access-Control-Allow-Origin": "*",
      "Content-Type": "application/json",
    };

    return {
      statusCode: 200,
      headers: responseHeaders,
      body: JSON.stringify({ message: "Products uploaded successfully" }),
    };
  } catch (error) {
    console.error("Failed to upload products:", error);
    return {
      statusCode: 500,
      headers: { "Access-Control-Allow-Origin": "*" },
      body: JSON.stringify({ message: "Failed to upload products" }),
    };
  }
};
