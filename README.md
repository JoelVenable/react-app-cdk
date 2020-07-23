# React CDK Deployment Demo

This project is a short demonstration of how to deploy a React application using Amazon Web Services Cloud Development Kit.

### Prerequisites

An Amazon Web Services account.
Either:
1.  AWS CLI installed on your machine with a profile configured, preferably with a credential helper such as [aws-vault](https://github.com/99designs/aws-vault).
2.  An AWS Access Key stored in your environment variables (**NOT SECURE**).


### Install Dependencies

This project was created using the [pnpm package manager](https://pnpm.js.org/); there is an `install-deps` npm script that will load all project dependencies using pnpm:

```
npm run install-deps
```

### Environment Variables

Copy the `.env.example` file to `.env`.  

The only variable required to run the deployment is your `AWS_ACCOUNT_ID`.  This will deploy the app to an S3 bucket with a CloudFront CDN distribution.  The resulting domain would look something like this: `d2kscedsvms13q.cloudfront.net`.

To deploy to an actual domain name requires a bit of configuration in the AWS Console.  
Prerequisites for hosting to `mydomain.com`:
1.  You own the domain and have the nameservers pointing to AWS Route 53.  
2.  Have a configured SSL/TLS certificate for your domain using AWS Secrets Manager.  Copy the ARN of the certificate to the `SSL_CERT_ARN` environment variable in your `.env` file.
3.  Input the apex domain in the `DOMAIN_NAME` variable.
4.  Input a comma separated list of all subdomains for the React application in the `REACT_APP_ALIASES` variable.

Example:
```
DOMAIN_NAME=mydomain.com
AWS_ACCOUNT_ID=123456789012
SSL_CERT_ARN=arn:aws:acm:us-east-1:123456789012:certificate/0random0-guid-here-8704-2a548e225c90
REACT_APP_ALIASES=mydomain.com,react.mydomain.com
```

### Deployment 
```
npm run deploy
```
This script will build a deployment for the React app located in the `client` directory, and push it to a new S3 bucket backed by CloudFront CDN.

The S3-CloudFront structure results in a high performance deployment with very low cost.  For demonstration projects with low site visits, the deployment costs around $1/month.  


### Cleanup
```
npm run destroy
```

This script deletes all resources created from this project.

