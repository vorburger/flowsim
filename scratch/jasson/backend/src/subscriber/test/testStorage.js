
(function(){

var db  = require('../../database');
var stg = require('../storage');

var database = new db.Database({
  database: {
    database: 'flowsim',
    user: 'flogdev',
    pass: 'flogdev',
    dialect: 'postgres'
  }
});
var storage = new stg.Storage(database);

function handler(err, result) {
    if(err) {
      console.log('insert sub err: ' + JSON.stringify(err));
    } else if(result) {
      console.log('insert sub succ: ' + JSON.stringify(result));
      console.log(typeof result);
    } else {
      console.log('insert sub no params');
    }
}

storage.insertSubscriber(
  'asson@flowgrammable.com',
  'passwordishard',
  new Date(),
  '10.0.0.1',
  'asdfasdf',
  handler
);

storage.insertSubscriber(
  'jasson@flowgrammable.com',
  'passwordishard',
  new Date(),
  '10.0.0.1',
  'asdfasdf',
  handler
);

})();
