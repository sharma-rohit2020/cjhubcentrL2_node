
const Logger = require('../logs/log.js');
const logger = new Logger('app');
  function jsonConcat(o1, o2) {
    for (var key in o2) {
    o1[key] = o2[key];
    }
    return o1;
  }
  exports.errorCJ_401 = (res, message) => {
    
    var output={
      "code": "CJ-401"
    }
    output=jsonConcat(output,message);
    return res.status(401).send(output);
    
  };
  exports.errorCJ_422 = (res, message) => {
    
    var output={
      "code": "CJ-422"
    }
    output=jsonConcat(output,message);
    return res.status(422).send(output);
    
  };
  exports.errorCJ_500 = (res, message='') => {
    
    var output={
      "code": "CJ-500",
      'message': "System failure / Internal server error  / Downstream system(s) is down./ Unhandled exceptions"
    }
    // logger.setLogData(error);
    var err=message.error;
    var error_object={
      'api':message.api,
      'error':err.stack
    }
    logger.error(output.message,error_object)
    //output=jsonConcat(output,message);
    return res.status(500).send(output);
    
  }
  
  exports.errorCJ_400 = (res, message) => {
    
    var output={
      "code": "CJ-400",     
    }
    output=jsonConcat(output,message);
    return res.status(400).send(output);
    
  };
  
  exports.success = (res, message) => {
    
    var output={
      "code": "CJ-200"
    }
    output=jsonConcat(output,message);
    return res.status(200).send(output);
    
  };