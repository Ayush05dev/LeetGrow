import { sendTestcasePromptToGeminiAPI, sendAnalyzeCodeToGeminiAPI, sendApproachHintPromptToGeminiAPI, sendThinkTestcasesPromptToGeminiAPI, sendFullCodePromptToGeminiAPI } from './services/aiApi.js';



// Enable or disable extension icon based on tab URL
chrome.tabs.onUpdated.addListener(async (tabId, changeInfo, tab) => {
  if (changeInfo.status === "complete" && tab.url) {
    if (tab.url.startsWith("https://leetcode.com/problems/")) {
      await chrome.action.enable(tabId);
      await chrome.action.setIcon({
        tabId,
        path: "icons/icon2.png"
      }).catch(err => {
  console.error("Failed to set icon:", err);
});
    } else {
      await chrome.action.disable(tabId);
      await chrome.action.setIcon({
        tabId,
       path: "icons/disable_icon2.png"  //rember to keep image size in one of these - 16x16 / 48x48 / 128x128 size	These are the supported sizes and must not be jpg

      }).catch(err => {
      console.error("Failed to set icon:", err);
      });

      // 🔁 Set custom tooltip for unsupported pages
      await chrome.action.setTitle({
        tabId,
        title: "Does not work on this site"
      });

    }
  }
});



chrome.action.onClicked.addListener((tab) => {
  console.log('Extension icon clicked!');

  // Step 1: Ping content script to check if already injected
  chrome.tabs.sendMessage(tab.id, { ping: true }, (response) => {
    if (chrome.runtime.lastError || !response) {
      console.log('Content script not found, injecting now.');

      // Step 2: Inject Toastify CSS
      chrome.scripting.insertCSS({
        target: { tabId: tab.id },
        files: ['toastify/toastify.min.css']
      }, () => {
        console.log('Toastify CSS injected.');

        // Step 3: Inject Toastify JS
        chrome.scripting.executeScript({
          target: { tabId: tab.id },
          files: ['toastify/toastify.min.js']
        }, () => {
          console.log('Toastify JS injected.');

          // 👉 Step 4: Inject toastify-error.js 
          chrome.scripting.executeScript({
            target: { tabId: tab.id },
            files: ['services/toastify-error.js']
          }, () => {
            console.log('toastify-error.js injected.');

            // ✅ Step 5: Inject Prism CSS
            chrome.scripting.insertCSS({
              target: { tabId: tab.id },
              files: ['prism/prism.css']
            }, () => {
              console.log('Prism CSS injected.');

              // ✅ Step 6: Inject Prism JS
              chrome.scripting.executeScript({
                target: { tabId: tab.id },
                files: ['prism/prism.js']
              }, () => {
                console.log('Prism JS injected.');

                // ✅ Step 7: Inject your main content script
                chrome.scripting.executeScript({
                  target: { tabId: tab.id },
                  files: ['content.js']
                }, () => {
                  console.log('content.js injected.');
                  chrome.tabs.sendMessage(tab.id, { action: "toggleFloatingWindow" });
                });
              });
            });
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
         const testCases = await sendTestcasePromptToGeminiAPI(content,givenTestcases); 

/*      
// ------ For Testing Purpose ----------
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
*/
      
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
         /* const parsed =`Issue 1:
background.js:106 Heading: Missing Tree Traversal
background.js:107 Detail: The provided solution is incomplete. It doesn't implement the necessary logic to traverse the trees, calculate distances between nodes, and determine the number of targetable nodes for each node in the first tree. The problem requires finding nodes in the second tree within a certain distance 'k'.
background.js:108 Solution: Implement a tree traversal algorithm (like DFS or BFS) for both trees. For each node in the first tree, iterate through the nodes in the second tree and calculate the distance between them. If the distance is less than or equal to 'k', increment the count of targetable nodes for the corresponding node in the first tree.
background.js:105 Issue 2:
background.js:106 Heading: No Distance Calculation
background.js:107 Detail: The code lacks the crucial step of calculating the number of edges (distance) between nodes in the two trees.  The problem statement specifies \`k\` as the maximum number of edges allowed on the path between two nodes. This distance must be calculated for each possible pair of nodes across the trees.
background.js:108 Solution: Implement a function to calculate the shortest path length (number of edges) between two nodes in the two trees.  This could involve BFS or DFS, tracking the number of edges traversed.
background.js:105 Issue 3:
background.js:106 Heading: Handling Tree Structure
background.js:107 Detail: The solution doesn't consider the tree structure.  It simply iterates through nodes and checks for connectivity but doesn't leverage the fact that the input is a tree.  Ignoring the tree structure will lead to incorrect distance calculations.
background.js:108 Solution: Use DFS or BFS to explore the tree structure.  This will allow accurate distance calculation between nodes within the trees. The tree structure matters for determining if a path exists and its length.
background.js:105 Issue 4:
background.js:106 Heading: Incorrect Initialization / Edge Case for k=0
background.js:107 Detail: The code doesn't explicitly handle the edge case when \`k = 0\`. In this case, a node in the first tree can only be targeted by a node in the second tree if they are directly connected. Also, the initial counts for each node in the first tree are not set accurately.
background.js:108 Solution: Initialize a \`target_count\` array of size \`n\` with zeros. Iterate through the edges of both trees. For each edge, if the distance between the connected nodes is less than or equal to \`k\`, increment the \`target_count\` of the corresponding nodes. Handle the case where k=0, where only directly connected nodes in the second tree will be targets.
background.js:105 Issue 5:
background.js:106 Heading: Missing Connection Logic
background.js:107 Detail: The prompt asks to connect one node from the first tree to another in the second tree. The provided code doesn't implement this connection or consider different potential connections.  It implies a direct connection is always desired.
background.js:108 Solution: Iterate through all pairs of nodes in the first tree and all pairs of nodes in the second tree. For each pair, check if the distance is <= k. If it is, increment the count for the corresponding node in the first tree. The number of potential connections will depend on the specific constraints implied by the problem.`
*/
      
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

/*
//         const thinkTestCases=`Think TestCases: 1: Both trees are empty (n=0, m=0). The output should be an empty array.
// 2: The first tree has only one node, and the second tree has only one node. k is any non-negative integer. The output for both trees should be 1.
// 3: The first tree has a star-shaped structure (one central node connected to all other nodes), and the second tree has a line structure (two nodes connected by one edge). k is a small value (e.g., 1). The output should reflect that the central node of the first tree can reach all nodes of the second tree within k edges.
// 4: The first tree is a long chain of n nodes, and the second tree is a long chain of m nodes. k is a large value (e.g., 1000). The output should be n and m respectively, as any node in the first tree can reach any node in the second tree.
// 5: The first tree and the second tree share some common nodes. The edge k is small enough that some nodes in one tree can reach some nodes in the other tree. The output should reflect the maximum number of reachable nodes for each node in the first tree.`
*/

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
  


  
  