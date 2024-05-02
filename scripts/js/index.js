function myFunction() {
    // Perform some logic to determine the boolean value
    const myBooleanValue = true;
  
    // Define a string value
    const myStringValue = "Hello, world!";
  
    const result = { myBooleanValue, myStringValue };
  
    return JSON.stringify(result);
  }
  
  // Call the function and log the result
  const result = myFunction();
  console.log(result);