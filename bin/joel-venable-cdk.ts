#!/usr/bin/env node
import 'source-map-support/register';
import * as cdk from '@aws-cdk/core';
import { JoelVenableCdkStack } from '../lib/joel-venable-cdk-stack';

const app = new cdk.App();
new JoelVenableCdkStack(app, 'JoelVenableCdkStack');
