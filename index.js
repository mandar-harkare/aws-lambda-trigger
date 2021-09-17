// const { CodePipelineClient, AcknowledgeJobCommand } = require("@aws-sdk/client-codepipeline");


console.log('Loading function');
        


const aws = require('aws-sdk');

const s3 = new aws.S3({ apiVersion: '2006-03-01' });

exports.handler = async (event, context) => {
    console.log('Received event:', JSON.stringify(event, null, 2));

    // Get the object from the event and show its content type
    const bucket = event.Records[0].s3.bucket.name;
    let key = decodeURIComponent(event.Records[0].s3.object.key.replace(/\+/g, ' '));
    key = key.replace('/', '-');
    key = key.replace('.zip', '');
    console.log('kEY=====>>>', key)

    var params = {
        pipeline: { /* required */
          name: `mh-test-s3-${key}`, /* required */
          roleArn: '', /* required */
          stages: [ /* required */
            {
              actions: [ /* required */
                {
                  actionTypeId: { /* required */
                    category: "Source", /* required */
                    owner: "AWS", /* required */
                    provider: 'CodeStarSourceConnection', /* required */
                    version: '1' /* required */
                  },
                  name: 'Source', /* required */
                  configuration: {
                    FullRepositoryId: "mandar-harkare/codepipeline-for-terraform",
                    BranchName: "master",
                    ConnectionArn: "",
                    OutputArtifactFormat: "CODE_ZIP",
                    /* '<ActionConfigurationKey>': ... */
                  },
                  namespace: 'Source',
                  outputArtifacts: [
                    {
                      name: 'source_output' /* required */
                    },
                    /* more items */
                  ],
                  region: 'us-east-1',
                  roleArn: '',
                  runOrder: 1
                },
                /* more items */
              ],
              name: 'Source', /* required */
              blockers: [
                {
                  name: 'STRING_VALUE', /* required */
                  type: "Schedule" /* required */
                },
                /* more items */
              ]
            },
            {
                actions: [ /* required */
                  {
                    actionTypeId: { /* required */
                      category: "Build", /* required */
                      owner: "AWS", /* required */
                      provider: 'CodeBuild', /* required */
                      version: '1' /* required */
                    },
                    name: 'Build', /* required */
                    configuration: {
                      ProjectName: 'tf-cicd-plan2'
                    },
                    inputArtifacts: [
                      {
                        name: 'source_output' /* required */
                      },
                      /* more items */
                    ],
                    namespace: 'Build',
                    outputArtifacts: [
                      {
                        name: 'build_output' /* required */
                      },
                      /* more items */
                    ],
                    region: 'us-east-1',
                    roleArn: '',
                    runOrder: 1
                  },
                  /* more items */
                ],
                name: 'Build', /* required */
                blockers: [
                  {
                    name: 'STRING_VALUE', /* required */
                    type: "Schedule" /* required */
                  },
                  /* more items */
                ]
              },
            /* more items */
          ],
          artifactStore: {
            location: 'demo-test-mh', /* required */
            type: "S3", /* required */
          },
        },
        tags: [
          {
            key: 'STRING_VALUE', /* required */
            value: 'STRING_VALUE' /* required */
          },
          /* more items */
        ]
      };
      console.log('Creating a pipeline....')
      var codepipeline = new aws.CodePipeline();
      const response = await codepipeline.createPipeline(params).promise();
      console.log('Response event:', JSON.stringify(response, null, 2));

      // , function(err, data) {
      //   if (err) console.log(err, err.stack); // an error occurred
      //   else     console.log(data);           // successful response
      // });


    // const params = {
    //     Bucket: bucket,
    //     Key: key,
    // }; 
    // try {
    //     const { ContentType } = await s3.getObject(params).promise();
    //     console.log('CONTENT TYPE:', ContentType);
    //     return ContentType;
    // } catch (err) {
    //     console.log(err);
    //     const message = `Error getting object ${key} from bucket ${bucket}. Make sure they exist and your bucket is in the same region as this function.`;
    //     console.log(message);
    //     throw new Error(message);
    // }
};