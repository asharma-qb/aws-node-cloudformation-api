const express = require('express');
const router = express.Router();
const {
  CloudFormationClient,
  CreateStackCommand,
  DeleteStackCommand,
  UpdateStackCommand,
} = require('@aws-sdk/client-cloudformation');
const { createTemplateURL } = require('../../utils/helper');
const { ACMClient, RequestCertificateCommand } = require('@aws-sdk/client-acm');

const credentials = {
  accessKeyId: process.env.ACCESSKEYID,
  secretAccessKey: process.env.SECRETACCESSKEY,
};

const client = new CloudFormationClient({
  credentials,
});

router.post('/create', async (req, res) => {
  try {
    /* const acmConfig = {
      credentials,
      region: `us-east-1`,
    };
    const acmInput = {
      DomainName: req.body.domainName,
      ValidationMethod: 'DNS',
      DomainValidationOptions: [
        {
          DomainName: req.body.domainName,
          ValidationDomain: `${req.body.domainName}`,
        },
      ],
    };
    const acmClient = new ACMClient(acmConfig);
    const acmCommand = new RequestCertificateCommand(acmInput);
    const acmResponse = await acmClient.send(acmCommand);
    const { CertificateArn } = acmResponse;
    console.log(acmResponse); */
    const { stackName, templateBody, templateFileName, parameters } = req.body;
    const bucketName = `cloudformationtemplatebucketforqb`;
    const folderPath = [`templates`];
    const templateURL = createTemplateURL(
      bucketName,
      folderPath,
      templateFileName
    );
    /* parameters.push({
      ParameterKey: 'CertificateArn',
      ParameterValue:
        'arn:aws:acm:us-east-1:978397049254:certificate/c14c7d97-5df1-41ba-b23e-663f95f97718',
    }); */
    const createStackCommand = new CreateStackCommand({
      StackName: stackName,
      TemplateBody: templateBody,
      TemplateURL: templateURL,
      Capabilities: ['CAPABILITY_NAMED_IAM'],
      Parameters: parameters,
    });

    const response = await client.send(createStackCommand);
    return res.status(200).json({ data: response });
  } catch (err) {
    return res.send({ data: err, message: err.message });
  }
});

router.put('/update', async (req, res) => {
  try {
    const { stackName, templateBody, templateFileName, parameters } = req.body;
    const bucketName = `cloudformationtemplatebucketforqb`;
    const folderPath = [`templates`];

    const templateURL = createTemplateURL(
      bucketName,
      folderPath,
      templateFileName
    );
    const updateStackCommand = new UpdateStackCommand({
      StackName: stackName,
      TemplateBody: templateBody,
      TemplateURL: templateURL,
      Capabilities: ['CAPABILITY_NAMED_IAM'],
      Parameters: parameters,
    });

    const response = await client.send(updateStackCommand);
    return res.status(200).json({ data: response });
  } catch (err) {
    return res.send({ data: err, message: err.message });
  }
});

router.delete('/delete/:stackName', async (req, res) => {
  try {
    const stackName = req.params.stackName;
    const { clientRequestToken, retainResources, roleARN } = req.body;
    const deleteStackCommand = new DeleteStackCommand({
      StackName: stackName,
      TemplateBody: templateBody,
      stackName,
      ClientRequestToken: clientRequestToken,
      RetainResources: retainResources,
      RoleARN: roleARN,
    });

    const response = await client.send(deleteStackCommand);
    return res.status(200).json({ data: response });
  } catch (err) {
    return res.send({ data: err, message: err.message });
  }
});

module.exports = router;
