import { sendTestcasePromptToGeminiAPI, sendAnalyzeCodeToGeminiAPI, sendApproachHintPromptToGeminiAPI, sendThinkTestcasesPromptToGeminiAPI, sendFullCodePromptToGeminiAPI } from './aiApi.js';



chrome.action.onClicked.addListener((tab) => {
  console.log('Extension icon clicked!');

  // Step 1: Ping content script to check if already injected
  chrome.tabs.sendMessage(tab.id, { ping: true }, (response) => {
    if (chrome.runtime.lastError || !response) {
      // Content script not injected
      console.log('Content script not found, injecting now.');


      // Step 2: Inject Prism CSS
      chrome.scripting.insertCSS({
        target: { tabId: tab.id },
        files: ['prism/prism.css']
      }, () => {
        console.log('Prism CSS injected.');

        // Step 3: Inject Prism JS
        chrome.scripting.executeScript({
          target: { tabId: tab.id },
          files: ['prism/prism.js']
        }, () => {
          console.log('Prism JS injected.');

          // Step 4: Inject your content.js
          chrome.scripting.executeScript({
            target: { tabId: tab.id },
            files: ['content.js']
          }, () => {
            console.log('content.js injected.');
            chrome.tabs.sendMessage(tab.id, { action: "toggleFloatingWindow" });
          });
        });
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
    const { content, givenTestcases } = message.payload;

    (async () => {
      try {
        const testCases = await sendTestcasePromptToGeminiAPI(content,givenTestcases); // you have to implement this
//         const testCases =`[[0,1],[0,2],[2,3],[2,4]]
// [[0,1],[0,2],[0,3],[2,7],[1,4],[4,5],[4,6]]
// 2
// [[0,1],[0,2],[0,3],[0,4]]
// [[0,1],[1,2],[2,3]]
// 1
// [1,9]
// [9]
// 1
// 0
// [5,0,0]
// [0,0,5]
// [1]
// [0]
// `;
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

  if(message.action === "fullCodeGenerate"){
     const { content,lang, code } = message.payload;

   ( async()=>{
      try{
        const fullCode = await sendFullCodePromptToGeminiAPI(content,lang,code);
        console.log("Full Code: ",fullCode)
        sendResponse({fullCode});
      }
      catch(error){
        console.error("Error in generating full code :", error);
        sendResponse({fullCode:"Error generating full code"});
      }
   })();
    
    return true; // IMPORTANT: allow async response
  }
  
  
  return false; // If other messages come, don't keep connection open
});
  


  
  