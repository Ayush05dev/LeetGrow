import { sendTestcasePromptToGeminiAPI, sendAnalyzeCodeToGeminiAPI, sendApproachHintPromptToGeminiAPI, sendThinkTestcasesPromptToGeminiAPI } from './aiApi.js';



chrome.action.onClicked.addListener((tab) => {
  console.log('Extension icon clicked!');

  // Step 1: Ping content script to check if already injected
  chrome.tabs.sendMessage(tab.id, { ping: true }, (response) => {
    if (chrome.runtime.lastError || !response) {
      // Content script not injected
      console.log('Content script not found, injecting now.');

      chrome.scripting.executeScript({
        target: { tabId: tab.id },
        files: ['content.js']
      }, () => {
        console.log('content.js injected.');
        chrome.tabs.sendMessage(tab.id, { action: "toggleFloatingWindow" });
      });

    } else {
      // Content script already injected
      console.log('Content script already exists.');
      chrome.tabs.sendMessage(tab.id, { action: "toggleFloatingWindow" });
    }
  });
});



chrome.runtime.onMessage.addListener((message, sender, sendResponse) => {
  console.log('Background received message:', message);

  if (message.action === "generateTestCases") {
    const { content } = message.payload;

    (async () => {
      try {
        const testCases = await sendTestcasePromptToGeminiAPI(content); // you have to implement this
        console.log(testCases)
        sendResponse({ testCases });
      } catch (error) {
        console.error('Error generating testcases:', error);
        sendResponse({ testCases: "Error generating testcases." });
      }
    })();

    return true;
  }


  if (message.action === "analyzeCode") {
    const { content, code } = message.payload;

   ( async()=>{
      try{
         const res = await sendAnalyzeCodeToGeminiAPI(content, code);
         console.log("analysis:" ,res)
        let rawResponse = res.trim();

      // Remove ```json and ``` if present
      if (rawResponse.startsWith("```json") || rawResponse.startsWith("```")) {
        rawResponse = rawResponse.replace(/^```(?:json)?/, "").trim();
        rawResponse = rawResponse.replace(/```$/, "").trim();
      }

    const parsed = JSON.parse(rawResponse);
    console.log(parsed);
  parsed.forEach((item, index) => {
  console.log(`Issue ${index + 1}:`);
  console.log("Heading:", item.issueHeading);
  console.log("Detail:", item.detail);
  console.log("Solution:", item.solution);
});

        sendResponse({parsed});
      }
      catch(error){
        console.error("Error analyzing code:", error);
        sendResponse({analysis:"Error generating analyzed code"});
      }
   })();
    
    return true; // IMPORTANT: allow async response
  }


  if (message.action === "approachHintGenerate") {
    const { content } = message.payload;

   ( async()=>{
      try{
        const approachHint = await sendApproachHintPromptToGeminiAPI(content);
        console.log("ApproachHint: ",approachHint)
        sendResponse({approachHint});
      }
      catch(error){
        console.error("Error in generating approach hint:", error);
        sendResponse({approachHint:"Error generating approach hint"});
      }
   })();
    
    return true; // IMPORTANT: allow async response
  }


  if (message.action === "thinkTestcasesGenerate") {
    const { content } = message.payload;

   ( async()=>{
      try{
        const thinkTestCases = await sendThinkTestcasesPromptToGeminiAPI(content);
        console.log("Think TestCases:",thinkTestCases);
        sendResponse({thinkTestCases});
      }
      catch(error){
        console.error("Error in generating approach hint:", error);
        sendResponse({thinkTestCases:"Error generating approach hint"});
      }
   })();
    
    return true; // IMPORTANT: allow async response
  }
  
  
  return false; // If other messages come, don't keep connection open
});
  


  
  