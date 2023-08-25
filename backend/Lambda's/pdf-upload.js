const AWS = require("aws-sdk");
const s3 = new AWS.S3();

exports.handler = async (event, context) => {
  try {
    const { pdfData, fileName } = JSON.parse(event.body);

    if (!pdfData || !fileName) {
      throw new Error(
        "Both pdfData and fileName must be provided in the request body."
      );
    }

    const contentType = "application/pdf";
    const bucketName = "pdffile-extract";
    const pdfDataBuffer = Buffer.from(pdfData, "base64");

    const params = {
      Bucket: bucketName,
      Key: fileName,
      Body: pdfDataBuffer,
      ContentType: contentType,
    };

    await s3.putObject(params).promise();

    const responseHeaders = {
      "Access-Control-Allow-Origin": "*",
      "Content-Type": "application/json",
    };

    return {
      statusCode: 200,
      headers: responseHeaders,
      body: JSON.stringify({ message: "File uploaded successfully!" }),
    };
  } catch (error) {
    return {
      statusCode: 500,
      headers: { "Access-Control-Allow-Origin": "*" },
      body: JSON.stringify({ error: `Error: ${error.message}` }),
    };
  }
};
