const AWS = require("aws-sdk");
const sns = new AWS.SNS();
const dynamodb = new AWS.DynamoDB.DocumentClient();

const snsTopicArn = process.env.SNS_TOPIC_ARN;
const userTableName = "users";

exports.handler = async (event) => {
  try {
    const { email, password } = JSON.parse(event.body);

    const userParams = {
      TableName: userTableName,
      Key: { email: email },
    };

    const user = await dynamodb.get(userParams).promise();

    if (user.Item) {
      const loginSuccessMessage = `Welcome back! You have successfully logged in.`;
      const snsLoginSuccessParams = {
        Message: loginSuccessMessage,
        Subject: "Login Success",
        TopicArn: snsTopicArn,
        MessageAttributes: {
          email: {
            DataType: "String",
            StringValue: email,
          },
        },
      };

      await sns.publish(snsLoginSuccessParams).promise();
      return {
        statusCode: 200,
        body: JSON.stringify({
          message:
            "Login successful. Please check your email for Welcome Message!",
        }),
      };
    } else {
      const subscribeParams = {
        Protocol: "email",
        TopicArn: snsTopicArn,
        Endpoint: email,
        Attributes: {
          FilterPolicy: JSON.stringify({ email: [email] }),
        },
      };

      await sns.subscribe(subscribeParams).promise();

      const userData = {
        email: email,
        password: password,
      };

      const putUserParams = {
        TableName: userTableName,
        Item: userData,
      };

      await dynamodb.put(putUserParams).promise();
      return {
        statusCode: 201,
        body: JSON.stringify({
          message:
            "Signup successful. Please check your email for confirmation message.",
        }),
      };
    }
  } catch (error) {
    console.error("Error:", error);
    return {
      statusCode: 500,
      body: JSON.stringify({ message: "Internal Server Error" }),
    };
  }
};
