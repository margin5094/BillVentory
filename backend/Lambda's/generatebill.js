const AWS = require("aws-sdk");
const dynamoDB = new AWS.DynamoDB.DocumentClient();
const snsTopicArn = "arn:aws:sns:us-east-1:723056485403:emailSystem";
const sns = new AWS.SNS();

exports.handler = async (event, context) => {
  try {
    const billId = generateRandomId();

    const jsonPayload = JSON.parse(event.body);

    const billItems = jsonPayload.items;

    let totalBill = 0;

    let itemsToUpdate = [];

    for (const item of billItems) {
      const { productId, productName, productPrice, productQuantity } = item;
      const itemTotal = parseInt(productPrice) * parseInt(productQuantity);
      totalBill += itemTotal;

      const getItemParams = {
        TableName: "products",
        Key: { productId: productId },
      };
      const data = await dynamoDB.get(getItemParams).promise();
      const existingItem = data.Item;

      const currentQuantity = parseInt(existingItem.productQuantity);
      const updatedQuantity = currentQuantity - parseInt(productQuantity);

      const updatedItem = {
        ...existingItem,
        productQuantity: String(updatedQuantity),
      };
      itemsToUpdate.push(updatedItem);

      console.log("Item Details:");
      console.log("Product ID:", productId);
      console.log("Product Name:", productName);
      console.log("Product Price:", productPrice);
      console.log("Product Quantity:", productQuantity);
      console.log("Item Total:", itemTotal);
    }

    const batchUpdateParams = {
      RequestItems: {
        products: itemsToUpdate.map((item) => ({
          PutRequest: {
            Item: item,
          },
        })),
      },
    };

    await dynamoDB.batchWrite(batchUpdateParams).promise();

    const lowQuantityProducts = [];
    for (const item of itemsToUpdate) {
      const { productId, productName, productQuantity } = item;
      const currentQuantity = parseInt(productQuantity);
      console.log(currentQuantity);
      if (currentQuantity < 10) {
        lowQuantityProducts.push(productName);
      }
    }
    console.log("Products with Quantity Less than 10:", lowQuantityProducts);
    const email = jsonPayload.email;
    if (lowQuantityProducts.length >= 1) {
      const lowMessage = `You have follow products with low quantity ${lowQuantityProducts}. As soon as order it to keep inventory full.`;
      const snsLoginSuccessParams = {
        Message: lowMessage,
        Subject: "LOW QUANTITY ALERT!",
        TopicArn: snsTopicArn,
        MessageAttributes: {
          email: {
            DataType: "String",
            StringValue: email,
          },
        },
      };

      await sns.publish(snsLoginSuccessParams).promise();
    }

    const billInfo = {
      billId: billId,
      billItems: billItems,
      totalBill: String(totalBill),
    };
    const putBillParams = {
      TableName: "bills",
      Item: billInfo,
    };
    await dynamoDB.put(putBillParams).promise();

    console.log("Total Bill:", totalBill);

    return {
      statusCode: 200,
      headers: {
        "Content-Type": "application/json",
        "Access-Control-Allow-Origin": "*",
      },
      body: JSON.stringify(
        "Bill details logged and product quantities updated successfully."
      ),
    };
  } catch (error) {
    console.error("Error:", error);
    return {
      statusCode: 500,
      headers: {
        "Content-Type": "application/json",
        "Access-Control-Allow-Origin": "*",
      },
      body: JSON.stringify("Error occurred while processing the bill."),
    };
  }
};

function generateRandomId() {
  const timestamp = Date.now();
  const randomNum = Math.floor(Math.random() * 1000000);
  return `${timestamp}-${randomNum}`;
}
