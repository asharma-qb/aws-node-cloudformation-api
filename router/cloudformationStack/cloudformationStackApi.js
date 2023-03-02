const express = require('express');
const router = express.Router();
const {
  CloudFormationClient,
  CreateStackCommand,
  DeleteStackCommand,
  UpdateStackCommand,
} = require('@aws-sdk/client-cloudformation');
const { createTemplateURL } = require('../../utils/helper');

const client = new CloudFormationClient({
  credentials: {
    accessKeyId: process.env.ACCESSKEYID,
    secretAccessKey: process.env.SECRETACCESSKEY,
  },
});

router.post('/create', async (req, res) => {
  try {
    const { stackName, templateBody, templateFileName, parameters } = req.body;
    const bucketName = `cloudformationtemplatebucketforqb`;
    const folderPath = [`templates`];
    const templateURL = createTemplateURL(
      bucketName,
      folderPath,
      templateFileName
    );

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
