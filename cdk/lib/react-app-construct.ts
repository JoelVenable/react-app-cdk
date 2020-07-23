import * as cdk from "@aws-cdk/core";
import * as s3 from "@aws-cdk/aws-s3";
import { BucketDeployment, Source } from "@aws-cdk/aws-s3-deployment";
import { CloudFrontWebDistribution, OriginAccessIdentity, ViewerCertificate, ViewerProtocolPolicy, AliasConfiguration } from "@aws-cdk/aws-cloudfront";
import { ICertificate } from "@aws-cdk/aws-certificatemanager";
import { RemovalPolicy } from "@aws-cdk/core";

interface ReactAppConstructProps {
  /** Path to the react app's build output directory */
  buildPath: string;
  cert?: ICertificate
  /** Desired domain names for the React app to respond to.  Must be configured on the certificate.
   * 
   * @example [
   *   "mydomain.com",
   *    "reactapp.mydomain.com"
   * ]
   */
  aliases?: string[]
}

export class ReactAppConstruct extends cdk.Construct {
  constructor(scope: cdk.Construct, id: string, props: ReactAppConstructProps) {
    super(scope, id);

    const bucket = new s3.Bucket(this, `${id}-s3bucket`, {
      websiteIndexDocument: "index.html",
      websiteErrorDocument: "index.html",
      removalPolicy: RemovalPolicy.DESTROY
    });

    const depl = new BucketDeployment(
      this,
      `${id}-s3bucket-depl`,
      {
        destinationBucket: bucket,
        sources: [
          Source.asset(props.buildPath),
        ],
      }
    );

    const originAccessIdentity = new OriginAccessIdentity(
      this,
      `${id}-cf-s3access`
    );

    let aliasConfiguration: AliasConfiguration | undefined

    if (props.cert && props.aliases) {
        aliasConfiguration = {
            acmCertRef: props.cert.certificateArn,
            names: props.aliases
        }
    }

    this.cf = new CloudFrontWebDistribution(
      this,
      `${id}-cf-dist`,
      {
        originConfigs: [
          {
            s3OriginSource: {
              s3BucketSource: bucket,
              originAccessIdentity,
            },
            behaviors: [
              {
                isDefaultBehavior: true,
              },
            ],
          },
        ],
        aliasConfiguration,
        defaultRootObject: 'index.html',
        viewerProtocolPolicy: ViewerProtocolPolicy.REDIRECT_TO_HTTPS,
      }
    );

    bucket.grantRead(originAccessIdentity);

    new cdk.CfnOutput(this, `${id} Cloudfront URL`, {
      value: this.cf.distributionDomainName,
    });

  }

  cf: CloudFrontWebDistribution
}
