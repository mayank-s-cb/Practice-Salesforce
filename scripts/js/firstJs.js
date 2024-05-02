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
    
    const condition = conditionMet();
    const stringValue = getStringValue();

        
    console.log(`Condition: ${condition}`);
    console.log(`String Value: ${stringValue}`);
    
    core.setOutput('isSuccess',condition);
    core.setOutput('stringValue',stringValue);

    // Return the condition as a string to be captured by the GitHub Action
    return condition;
  }
  
  // Execute the script
  runFirstScript().then((data) => {
    console.log(data);
  });