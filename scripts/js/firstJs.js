const core = require('@actions/core');
//const github = require('@actions/github');

function conditionMet() {
    // Your logic to determine if the condition is met
    return true; // For demonstration purposes, always return true
  }
  
  // Function to get a string value
  function getStringValue() {
    return "Hello, world!";
  }
  
  // Main function to execute the script
 async function runFirstScript() {
    const returnData = new Map();
    returnData.set('condition',conditionMet());
    returnData.set('stringValue',getStringValue());
    //const condition = conditionMet();
    //const stringValue = getStringValue();

    //core.setOutput('isSuccess',condition);
    //core.setOutput('stringValue',stringValue);
    
    //console.log(`Condition: ${condition}`);
    //console.log(`String Value: ${stringValue}`);
    
    // Return the condition as a string to be captured by the GitHub Action
    return returnData;
  }
  
  // Execute the script
  runFirstScript().then((data) => {
    console.log(data);
    return data;
  });