var Chance = require("chance");
var chance = new Chance();
var AWS = require("aws-sdk");

if(process.env.SERVERLESS_STAGE == "local"){
    var credentials = new AWS.SharedIniFileCredentials({profile: 'personal'});
    AWS.config.credentials = credentials;
}


var docClient = new AWS.DynamoDB.DocumentClient({region: 'us-west-2'});

module.exports.startGame = function(pass, fail){    
    var item = {};
    item.gameId = chance.guid();
    item.status = "started";
    
    var params = {
	TableName:process.env.databaseName,
	Item: item
    };

    docClient.put(params, function(err, data) {
	if (err) {
	    console.log(err.message);
            fail("Unable to add item. Error JSON:" +  JSON.stringify(err, null, 2));
	} else {
            pass(item);
	}
    });
}

module.exports.endGame = function(gameId, result, pass, fail) {
    var params = {
	TableName:process.env.databaseName,
	Key:{
	    "gameId": gameId
	},
	UpdateExpression: "set #stat = :s, #res = :r",
	ExpressionAttributeNames:{"#stat":"status", "#res":"result"},
	ExpressionAttributeValues:{
            ":s":"ended",
	    ":r":result
	},
	ReturnValues:"UPDATED_NEW"
    };
    
    docClient.update(params, function(err, data) {
	if (err) {
	    console.log(err.message);
            fail("Unable to update item. Error JSON:", JSON.stringify(err, null, 2));
	} else {
            pass("UpdateItem succeeded:", JSON.stringify(data, null, 2));
	}
    });
}

module.exports.flipCoin = function() {
    return chance.bool() ? "heads" : "tails";
}
