/*
Copyright 2017 - 2017 Amazon.com, Inc. or its affiliates. All Rights Reserved.
Licensed under the Apache License, Version 2.0 (the "License"). You may not use this file except in compliance with the License. A copy of the License is located at
    http://aws.amazon.com/apache2.0/
or in the "license" file accompanying this file. This file is distributed on an "AS IS" BASIS, WITHOUT WARRANTIES OR CONDITIONS OF ANY KIND, either express or implied.
See the License for the specific language governing permissions and limitations under the License.
*/



const AWS = require('aws-sdk')
const awsServerlessExpressMiddleware = require('aws-serverless-express/middleware')
const bodyParser = require('body-parser')
const express = require('express')
const uuidv1 = require('uuid').v1;

AWS.config.update({ region: process.env.TABLE_REGION });

const dynamodb = new AWS.DynamoDB.DocumentClient();

let tableName = "groups";
if (process.env.ENV && process.env.ENV !== "NONE") {
  tableName = tableName + '-' + process.env.ENV;
}

const partitionKeyName = "guid";
const partitionKeyType = "S";
const sortKeyName = "";
const sortKeyType = "";
const hasSortKey = sortKeyName !== "";
const path = "/groups";
const UNAUTH = 'UNAUTH';
const hashKeyPath = '/:' + partitionKeyName;
const sortKeyPath = hasSortKey ? '/:' + sortKeyName : '';

// declare a new express app
const app = express()
app.use(bodyParser.json())
app.use(awsServerlessExpressMiddleware.eventContext())

// Enable CORS for all methods
app.use(function (req, res, next) {
  res.header("Access-Control-Allow-Origin", "*")
  res.header("Access-Control-Allow-Headers", "*")
  next()
});

// convert url string param to expected Type
const convertUrlType = (param, type) => {
  switch (type) {
    case "N":
      return Number.parseInt(param);
    default:
      return param;
  }
}

/*****************************************
 * HTTP Get method for reading group - 그룹 읽어오기 api *
 *****************************************/

app.get(path + hashKeyPath, function (req, res) {
  let getItemParams = {
    TableName: tableName,
    Key: { [partitionKeyName]: req.params[partitionKeyName] },
  }

  dynamodb.get(getItemParams, (err, data) => {
    if (err) {
      res.statusCode = 500
      res.json({ error: "Could not load items: " + err.message })
    } else if (Object.keys(data).length === 0) {
      res.statusCode = 404
      res.json({ error: "Item not found" })
    } else {
      res.json({ data: data.Item })
    }
  })
})


/*****************************************
 * HTTP put method for adding expense to the group - 비용 추가 api *
 *****************************************/

app.put(`${path}${hashKeyPath}/expenses`, function (req, res) {
  const guid = req.params[partitionKeyName]
  const { expense } = req.body

  if (
    expense === null ||
    expense === undefined ||
    !expense.payer ||
    !expense.amount
  ) {
    res.statusCode = 400
    res.json({ error: "Invalid expense object" })
    return
  }

  let updateItemParams = {
    TableName: tableName,
    Key: {
      [partitionKeyName]: guid,
    },
    UpdateExpression:
      "SET expenses = list_append(if_not_exists(expenses, :empty_list), :vals)",
    ExpressionAttributeValues: {
      ":vals": [expense],
      ":empty_list": [],
    },
  }

  dynamodb.update(updateItemParams, (err, data) => {
    if (err) {
      res.statusCode = 500
      res.json({ error: err })
    } else {
      res.statusCode = 200
      res.json({ data: data })
    }
  })
})

/************************************
* HTTP put method for adding members to the group - 멤버추가 api *
*************************************/

app.put(`${path}${hashKeyPath}/members`, function (req, res) {
  const guid = req.params[partitionKeyName];
  const { members } = req.body;
  if (members == null || !Array.isArray(members) || members.length === 0) {
    res.statusCode = 400;
    res.json({
      error: 'Invalid members'
    })
  }
  let updateItemParams = {
    TableName: tableName,
    Key: {
      [partitionKeyName]: guid,
    },
    UpdateExpression: "SET members = :members",
    ExpressionAttributeValues: {
      ":members": members,
    },
  }
  dynamodb.update(updateItemParams, (err, data) => {
    if (err) {
      res.statusCode = 500;
      res.json({ error: err });
    } else {
      res.statusCode = 200;
      res.json({ data: data });
    }
  });
});

/************************************
* HTTP post method for creating a group - 그룹 생성 API *
*************************************/

app.post(path, function (req, res) {
  const { groupName } = req.body;
  const guid = uuidv1()

  if (groupName == null || groupName.trim().length === 0) {
    res.statusCode = 400;
    res.json({ error: 'invalid group name' });
    return;
  }

  let putItemParams = {
    TableName: tableName,
    Item: {
      groupName,
      guid
    }
  }
  dynamodb.put(putItemParams, (err, data) => {
    if (err) {
      res.statusCode = 500;
      res.json({ error: err });
    } else {
      res.json({
        data: {
          guid
        }
      })
    }
  });
});

/**************************************
* HTTP remove method to delete object *
***************************************/

app.delete(path + '/object' + hashKeyPath + sortKeyPath, function (req, res) {
  const params = {};
  if (req.apiGateway) {
    params[partitionKeyName] = req.apiGateway.event.requestContext.identity.cognitoIdentityId || UNAUTH;
  } else {
    params[partitionKeyName] = req.params[partitionKeyName];
    try {
      params[partitionKeyName] = convertUrlType(req.params[partitionKeyName], partitionKeyType);
    } catch (err) {
      res.statusCode = 500;
      res.json({ error: 'Wrong column type ' + err });
    }
  }
  if (hasSortKey) {
    try {
      params[sortKeyName] = convertUrlType(req.params[sortKeyName], sortKeyType);
    } catch (err) {
      res.statusCode = 500;
      res.json({ error: 'Wrong column type ' + err });
    }
  }

  let removeItemParams = {
    TableName: tableName,
    Key: params
  }
  dynamodb.delete(removeItemParams, (err, data) => {
    if (err) {
      res.statusCode = 500;
      res.json({ error: err, url: req.url });
    } else {
      res.json({ url: req.url, data: data });
    }
  });
});

app.listen(3000, function () {
  console.log("App started")
});

// Export the app object. When executing the application local this does nothing. However,
// to port it to AWS Lambda we will create a wrapper around that will load the app from
// this file
module.exports = app
