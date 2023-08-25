const AWS = require("aws-sdk");

AWS.config.update({
  region: "us-east-1",
});

const dynamodb = new AWS.DynamoDB.DocumentClient();

exports.handler = async (event) => {
  try {
    const params = {
      TableName: "products",
    };

    const data = await dynamodb.scan(params).promise();

    const products = data.Items.map((item) => ({
      productId: item.productId,
      productName: item.productName,
      productPrice: item.productPrice,
      productCategory: item.productCategory,
      productQuantity: item.productQuantity,
      productManufacturer: item.productManufacturer,
    }));

    return {
      statusCode: 200,
      body: JSON.stringify({ products }),
    };
  } catch (error) {
    console.error("Error fetching products:", error);

    return {
      statusCode: 500,
      body: JSON.stringify({ message: "Failed to fetch products" }),
    };
  }
};
