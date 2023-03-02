const createTemplateURL = (bucketName, folderArray, templateFileName) => {
  let folderPath = '';
  folderPath = folderArray.join('/');
  return `https://${bucketName}.s3.amazonaws.com/${folderPath}/${templateFileName}`;
};

module.exports = { createTemplateURL };
