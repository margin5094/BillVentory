
# BillVentory

Billventory is an Inventory management web-applicaon designed to help businesses efficiently manage their stock levels, streamline billing processes, and receive notifications for low-stock 
items. The app provides four primary  functionalities:


- Manual Entry: Users can input inventory details manually, including product names, quantities, and prices.

- Automated Entry: Billventory lets users upload PDF stock sheets, auto-populating inventory to save time and reduce errors.

- Billing: Users can create bills when customers make purchases, with automatic inventory updates in real-time.

- Low-Stock Alerts: The app notifies users when stock levels drop below a set threshold, helping prevent stockouts by prompting timely reorders.




## Documentation
Services used in this projects are given below:
- Compute: AWS EC2, AWS Lambda
- Storage: AWS DynamoDB, AWS S3
- Network: AWS API gateway
- General: AWS Textract, AWS SNS, AWS SSM

Delivery Model used is combination of three: IaaS, FaaS, and PaaS.\
Deployment Model used is Public Cloud.

Detailed documentation for the project is given below:

[Documentation](https://github.com/margin5094/BillVentory/blob/main/Docs/B00918149_TermAssignment_Report.pdf)




## Cloud Architecture

![App Architecture](https://github.com/margin5094/BillVentory/assets/43315271/ccd4a6b7-71da-4184-aa6c-2dd3a9a12bb5)


## Deployment

To deploy this project firstly upload frontend code to S3 bucket then:

```bash
  Open CloudFormation in AWS console and upload CloudFormation yaml file.
```


## Authors

- [@margin5094](https://github.com/margin5094) Margin Patel

