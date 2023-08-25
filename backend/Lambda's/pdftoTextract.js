const AWS = require("aws-sdk");
const textract = new AWS.Textract();
const s3 = new AWS.S3();

AWS.config.update({
  region: "us-east-1",
});

const dynamodb = new AWS.DynamoDB.DocumentClient();

function convert_table_to_array(table_content) {
  const header_row = table_content.slice(0, 6);
  const product_rows = [];
  for (let i = 6; i < table_content.length; i += 6) {
    product_rows.push(table_content.slice(i, i + 6));
  }

  const products = product_rows.map((row) => {
    const product = {};
    row.forEach((cell_text, idx) => {
      product[header_row[idx]] = cell_text;
    });
    return product;
  });

  return { products };
}

async function handler(event, context) {
  try {
    if ("Records" in event) {
      const file_obj = event["Records"][0];
      const bucketname = file_obj["s3"]["bucket"]["name"];
      const filename = decodeURIComponent(
        file_obj["s3"]["object"]["key"].replace(/\+/g, " ")
      );

      console.log(`Bucket: ${bucketname} ::: Key: ${filename}`);

      const response = await textract
        .detectDocumentText({
          Document: {
            S3Object: {
              Bucket: bucketname,
              Name: filename,
            },
          },
        })
        .promise();

      const raw_text = [];
      for (const block of response["Blocks"]) {
        if (block["BlockType"] === "LINE") {
          raw_text.push(block["Text"]);
        }
      }

      const result = convert_table_to_array(raw_text);
      const requestBody = JSON.stringify(result);
      const requestBodyObject = JSON.parse(requestBody);
      const products = requestBodyObject.products;
      console.log(products);
      const putPromises = products.map((product) => {
        const params = {
          TableName: "products",
          Item: product,
        };

        return dynamodb.put(params).promise();
      });

      await Promise.all(putPromises);
    }
  } catch (error) {
    console.error(error);
  }

  return {
    statusCode: 500,
    body: JSON.stringify("Error processing the document!"),
  };
}

exports.handler = handler;
