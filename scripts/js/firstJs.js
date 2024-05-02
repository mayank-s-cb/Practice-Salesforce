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
  function runFirstScript() {
    const condition = conditionMet();
    const stringValue = getStringValue();

    core.setOutput('isSuccess',condition);
    core.setOutput('stringValue',stringValue);
    
    console.log(`Condition: ${condition}`);
    console.log(`String Value: ${stringValue}`);
    
    // Return the condition as a string to be captured by the GitHub Action
    return condition.toString();
  }
  
  // Execute the script
  runFirstScript();