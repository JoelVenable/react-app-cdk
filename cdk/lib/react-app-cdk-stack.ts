import * as cdk from "@aws-cdk/core";
import * as route53 from "@aws-cdk/aws-route53";
import * as targets from "@aws-cdk/aws-route53-targets";
import * as certificateManager from "@aws-cdk/aws-certificatemanager";
import { join } from "path";
import { ReactAppConstruct } from "./react-app-construct";

interface Variables {
  domainName: string,
  certificateArn: string,
  reactAppAliases: string[]
}

interface ReactAppStackProps extends cdk.StackProps {
  variables?: Partial<Variables>
}

export class ReactAppCdkStack extends cdk.Stack {
  constructor(scope: cdk.Construct, id: string, props: ReactAppStackProps) {
    super(scope, id, props);

    const { domainName, certificateArn, reactAppAliases } = props.variables ?? {};

    const cert =
      certificateArn
        ? certificateManager.Certificate.fromCertificateArn(
            this,
            `${id}-cert`,
            certificateArn
          )
        : undefined;

    const reactApp = new ReactAppConstruct(this, "reactapp", {
      buildPath: join(__dirname, "../../client/build"),
      cert,
      aliases: reactAppAliases
    });

    if (domainName) {
      const zone = route53.HostedZone.fromLookup(this, "hostedzone", {
        domainName,
      });
      if (!certificateArn)
        throw new Error(
          "Must have a certificate ARN if deploying to a hosted zone!"
        );

      const target = new targets.CloudFrontTarget(reactApp.cf);
      reactAppAliases?.forEach((recordName) => {
        const route = new route53.ARecord(this, `${recordName}--route`, {
          target: {
            aliasTarget: target,
          },
          recordName,
          zone,
        });
      })


    }
  }
}
