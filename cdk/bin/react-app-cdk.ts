#!/usr/bin/env node
import "source-map-support/register";
import * as cdk from "@aws-cdk/core";
import { ReactAppCdkStack } from "../lib/react-app-cdk-stack";
import { config } from "dotenv-safe";
import { join } from "path";
import { Aws } from "@aws-cdk/core";

config({
  path: join(__dirname, "../../.env"),
  example: join(__dirname, "../../.env.example"),
  allowEmptyValues: true
});

const {
  DOMAIN_NAME,
  SSL_CERT_ARN,
  AWS_ACCOUNT_ID,
  REACT_APP_ALIASES
} = process.env;

const app = new cdk.App({ });

new ReactAppCdkStack(app, "ReactAppCdkStack", {
  variables: {
    domainName: DOMAIN_NAME,
    certificateArn: SSL_CERT_ARN,
    reactAppAliases: REACT_APP_ALIASES?.split(",")
  },
  env: {
      region: 'us-east-1',
      account: AWS_ACCOUNT_ID
  }
});
