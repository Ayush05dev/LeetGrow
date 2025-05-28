// import {showToast} from './toastError.js';   not works ??

// function injectToastStyles() {
//   if (document.getElementById("custom-toast-style")) return; // avoid duplicates

//   const style = document.createElement("style");
//   style.id = "custom-toast-style";
//   style.textContent = `
//     .toast-container {
//       position: fixed;
//       bottom: 30px;
//       right: 20px;
//       z-index: 9999;
//       display: flex;
//       flex-direction: column;
//       gap: 10px;
//     }

//     .toast {
//       background: rgba(0, 0, 0, 0.85);
//       color: #fff;
//       padding: 10px 16px;
//       border-radius: 6px;
//       font-size: 14px;
//       box-shadow: 0 4px 8px rgba(0,0,0,0.2);
//       animation: fadein 0.3s, fadeout 0.3s ease-out 2.7s;
//     }

//     @keyframes fadein {
//       from { opacity: 0; transform: translateY(20px); }
//       to { opacity: 1; transform: translateY(0); }
//     }

//     @keyframes fadeout {
//       from { opacity: 1; transform: translateY(0); }
//       to { opacity: 0; transform: translateY(20px); }
//     }
//   `;
//   document.head.appendChild(style);
// }

// function showToast(message, duration = 3000) {
//   injectToastStyles();

//   let container = document.querySelector(".toast-container");
//   if (!container) {
//     container = document.createElement("div");
//     container.className = "toast-container";
//     document.body.appendChild(container);
//   }

//   const toast = document.createElement("div");
//   toast.className = "toast";
//   toast.innerText = message;

//   container.appendChild(toast);

//   setTimeout(() => {
//     toast.remove();
//     if (container.childElementCount === 0) {
//       container.remove();
//     }
//   }, duration);
// }

const leetCodeData = {
  title: null,
  content: null,
  code: null,
  testcases: null,
  hints: null,
  thinkTestCases: null,
  language:null,
  givenTestcases:null,
};

console.log(
  "Extracting full LeetCode question content and code editor content..."
);

/*
// Function to extract question title
// function extractQuestionTitle() {

//   const flexLayoutTab = document.querySelector('div.flexlayout__tab');
//   if (!flexLayoutTab) {
//     return "Title container not found";
//   }

//   const titleAnchor = flexLayoutTab.querySelector('a[href^="/problems/"]');
//   console.log("Title Anchor:", titleAnchor);
//   return titleAnchor ? titleAnchor.innerText.trim() : "Title not found";
// }

// Function to extract question description
// function extractFullQuestionContent() {
//   const descriptionDiv = document.querySelector('div[data-track-load="description_content"]');
//   return descriptionDiv ? descriptionDiv.innerText.trim() : "Question content not found";
// }
*/



// Function to extract question title and store it
function extractQuestionTitle() {
  try {
    const flexLayoutTab = document.querySelector("div.flexlayout__tab");
    if (!flexLayoutTab) throw new Error("Title container not found");

    const titleAnchor = flexLayoutTab.querySelector('a[href^="/problems/"]');
    if (!titleAnchor) throw new Error("Title anchor not found");

    const title = titleAnchor.innerText.trim();
    leetCodeData.title = title;
    return title;
  } catch (err) {
    // showToast("⚠️ Title not found.");
    console.error("Error extracting title:", err.message);
    leetCodeData.title = null; // or fallback string like "Title not found"
    return null;
  }
}

// Function to extract full question content and store it
function extractFullQuestionContent() {
  try {
    const descriptionDiv = document.querySelector(
      'div[data-track-load="description_content"]'
    );
    if (!descriptionDiv) throw new Error("Description not found");

    const content = descriptionDiv.innerText.trim();
    leetCodeData.content = content;
    return content;
  } catch (err) {
    console.error("Error extracting content:", err.message);
    leetCodeData.content = null; // or "Content not found"
    return null;
  }
}

// funcion to extract language selected 
function extractSelectedLanguage() {
  try {
    const editorContainer = document.querySelector('div#editor');
    if (!editorContainer) throw new Error("Editor container not found");

    const languageButton = editorContainer.querySelector('button[aria-haspopup="dialog"]');
    if (!languageButton) throw new Error("Language selector button not found");

    const language = languageButton.innerText.trim();
    leetCodeData.language = language;
    return language;
  } catch (err) {
    // showToast("⚠️ Programming language not found.");
    console.error("Error extracting language:", err.message);
    leetCodeData.language = null;
    return null;
  }
}




// Function to extract code editor content
function extractEditorContent() {

  // return promise
  return new Promise((resolve, reject) => {
    let editorArea = document.querySelector(".monaco-editor");

    const checkExist = setInterval(() => {
      editorArea = document.querySelector(".monaco-editor");

      if (editorArea) {
        // Found the editor
        editorArea.click(); // Focus it

        const lineElements = document.querySelectorAll(
          ".view-lines .view-line"
        );

        if (lineElements.length > 0) {
          clearInterval(checkExist);

          const codeLines = Array.from(lineElements).map(
            (line) => line.innerText
          );
          const fullCode = codeLines.join("\n");

          resolve(fullCode.trim());
        }
      }
    }, 100); // Check every 100ms

    // Timeout after 5 seconds if editor never appears
    setTimeout(() => {
      clearInterval(checkExist);
      reject("Editor not found or code content not loaded in time!");
    }, 5000); // 5 seconds
  });
}


// function to extract given testcases
// function extractGivenTestCases() {
//   try {
//     // Select the CodeMirror content editable container
//     const testCaseEditor = document.querySelector('div.cm-content[contenteditable="true"]');
//     if (!testCaseEditor) throw new Error("Test case editor not found");

//     // Select all individual lines (div.cm-line)
//     const lines = testCaseEditor.querySelectorAll('div.cm-line');
//     if (!lines.length) throw new Error("No test case lines found");

//     // Extract the text from each line and return as array or joined string
//     const testCases = Array.from(lines).map(line => line.innerText.trim());

//     // // Optional: Store or return
//      console.log("Extracted test cases:", testCases);
//     leetCodeData.givenTestcases=testCases;
//     return testCases;

//   } catch (err) {
//     showToast("⚠️ Could not extract test cases.");
//     console.error("Error extracting test cases:", err.message);
//     return null;
//   }
// }

function extractGivenTestCases() {
  try {
    // Select the CodeMirror content editable container
    const testCaseEditor = document.querySelector('div.cm-content[contenteditable="true"]');
    if (!testCaseEditor) throw new Error("Test case editor not found");

    // Select all individual lines (div.cm-line)
    const lines = testCaseEditor.querySelectorAll('div.cm-line');
    if (!lines.length) throw new Error("No test case lines found");

    // Join all lines with \n to match LeetCode's multi-line input format
    const testCases = Array.from(lines).map(line => line.innerText.trim()).join('\n');

    // Log and store for future prompt construction
    console.log("Extracted test cases string:\n", testCases);
    leetCodeData.givenTestcases = testCases;

    return testCases;

  } catch (err) {
    // showToast("⚠️ Could not extract test cases.");
    console.error("Error extracting test cases:", err.message);
    return null;
  }
}



// function to call all scrape leetcode data
function scrapeLeetCodeData() {
  extractQuestionTitle();
  extractFullQuestionContent();
  extractGivenTestCases();
  leetCodeData.code = null; // <-- clear old code
  leetCodeData.testcases = null; // <-- clear old code
  leetCodeData.hints = null; // <-- clear old code
  leetCodeData.thinkTestCases = null; // <-- clear old code
  leetCodeData.language = null; // <-- clear old code
  

  if (leetCodeData.title) {
    const outputHTML = `
  <div class="output-box" style="padding: 3px; color: #FFFFFF; margin-bottom: 20px;">
    <div style="font-size: 20px; font-family: 'Segoe UI', sans-serif; padding:5px 0">Question Title</div>
    <div>${leetCodeData.title}</div>
  </div>
`;


    document.getElementById("output").innerHTML = outputHTML;
  }
}

// function generateTestCases() {
//   const temp = document.createElement("div");
//   temp.style.color = "White";
//   temp.style.marginLeft = "10px";

//   if (!leetCodeData.content) {
//     // const txt="Please scrape the question first!";
//     // temp.textContent=txt;
//     // document.getElementById("output").appendChild(temp);
//     alert("Please scrape the question first!");
//     return;
//   }

//   if (leetCodeData.testcases) {
//     alert("Testcases already generated");
//     return;
//   }

//   const output = document.getElementById("output");

//   const txt = "Generating Test Cases...";
//   temp.textContent = txt;
//   output.appendChild(temp);

//   chrome.runtime.sendMessage(
//     {
//       action: "generateTestCases",
//       payload: {
//         content: leetCodeData.content,
//       },
//     },
//     (response) => {
//       const { testCases } = response || {};
//       output.removeChild(temp);
//       if (testCases) {
//         // Create parent container (styled similar to "Thinking of Test Cases")
//         const TestCasecontainer = document.createElement("div");
//         TestCasecontainer.style.padding = "10px";
//         TestCasecontainer.style.border = "1px solid #ccc";
//         TestCasecontainer.style.borderRadius = "8px";

//         // Add heading
//         const heading = document.createElement("h3");
//         heading.textContent = "Test Cases";
//         heading.style.marginBottom = "15px";
//         heading.style.color = "white";
//         heading.style.fontFamily = "Arial, sans-serif";
//         TestCasecontainer.appendChild(heading);

//         // Create the wrapper div for test cases (with white background and border radius)
//         const testCasesDiv = document.createElement("div");
//         testCasesDiv.style.backgroundColor = "white";
//         testCasesDiv.style.borderRadius = "8px";
//         testCasesDiv.style.padding = "15px";
//         testCasesDiv.style.marginBottom = "15px";

//         const pre = document.createElement("pre");
//         pre.textContent = testCases;
//         pre.style.color = "black";
//         testCasesDiv.appendChild(pre);

//         TestCasecontainer.appendChild(testCasesDiv);

//         output.appendChild(TestCasecontainer);

//         leetCodeData.testcases = testCases;
//       } else {
//         alert("Failed to generate testcases.");
//       }
//     }
//   );
// }

function generateTestCases() {
  const temp = document.createElement("div");
  temp.style.color = "#FFFFFF";
  temp.style.marginLeft = "10px";

  if (!leetCodeData.content) {
    alert("Please scrape the question first!");
    return;
  }

  if (leetCodeData.testcases) {
    alert("Testcases already generated");
    return;
  }

  const output = document.getElementById("output");

  const txt = "Generating Test Cases...";
  temp.textContent = txt;
  output.appendChild(temp);

  chrome.runtime.sendMessage(
    {
      action: "generateTestCases",
      payload: {
        content: leetCodeData.content,
        givenTestcases:leetCodeData.givenTestcases,
      },
    },
    (response) => {
      const { testCases } = response || {};
      output.removeChild(temp);

      if (testCases) {
        // Create main container with modern look
        const testCaseContainer = document.createElement("div");
        testCaseContainer.style.padding = "20px";
        // testCaseContainer.style.backgroundColor = "#1c1c28";  // Dark background
        testCaseContainer.style.backgroundColor = "#1e1e2f";  // Dark background
        // testCaseContainer.style.border = "1px solid #3A82F7"; // Accent border
        testCaseContainer.style.borderRadius = "10px";
        testCaseContainer.style.marginTop = "20px";
        // testCaseContainer.style.boxShadow = "0 4px 12px rgba(58, 130, 247, 0.2)";
        testCaseContainer.style.boxShadow = "0 4px 15px rgba(0, 0, 0, 0.2)";
        testCaseContainer.style.fontFamily = "'Segoe UI', sans-serif";

        // Add heading
        const heading = document.createElement("h3");
        heading.textContent = "Test Cases";
        heading.style.marginBottom = "16px";
        heading.style.color = "#3A82F7";
        heading.style.fontSize = "22px";
        heading.style.fontWeight = "600";
        testCaseContainer.appendChild(heading);

        // Create the content box for test cases
        const testCasesDiv = document.createElement("div");
        testCasesDiv.style.backgroundColor = "#0d1117";
        testCasesDiv.style.borderRadius = "8px";
        testCasesDiv.style.padding = "16px";
        testCasesDiv.style.overflowX = "auto";
        testCasesDiv.style.maxHeight = "400px";
        testCasesDiv.style.border = "1px solid #2c2f36";

        const pre = document.createElement("pre");
        pre.textContent = testCases;
        pre.style.color = "#E5E5E5";
        pre.style.fontSize = "14px";
        pre.style.lineHeight = "1.6";
        pre.style.whiteSpace = "pre-wrap";

        testCasesDiv.appendChild(pre);
        testCaseContainer.appendChild(testCasesDiv);
        output.appendChild(testCaseContainer);

        leetCodeData.testcases = testCases;
      } else {
        alert("Failed to generate testcases.");
      }
    }
  );
}


// async function analyzeCode() {
//   const temp = document.createElement("div");
//   temp.style.color = "White";
//   temp.style.marginLeft = "10px";

//   if (!leetCodeData.content) {
//     alert("Please scrape the question first!");
//     return;
//   }

//   const output = document.getElementById("output");

//   const analyzeContainer = output.getElementsByClassName(
//     "analyzeCodeContainer"
//   )[0];
//   if (analyzeContainer) {
//     output.removeChild(analyzeContainer);
//   }

//   try {
//     const codeContent = await extractEditorContent();
//     leetCodeData.code = codeContent;
//     const txt = "Analyzing your code...";
//     temp.textContent = txt;
//     output.appendChild(temp);

//     chrome.runtime.sendMessage(
//       {
//         action: "analyzeCode",
//         payload: {
//           content: leetCodeData.content,
//           code: leetCodeData.code,
//         },
//       },
//       (response) => {
//         output.removeChild(temp);
//         const { parsed } = response || {};

//         if (parsed) {
//           // Create parent container
//           const analyzeCodeContainer = document.createElement("div");
//           analyzeCodeContainer.className = "analyzeCodeContainer";
//           analyzeCodeContainer.style.padding = "10px";
//           analyzeCodeContainer.style.border = "1px solid #ccc";
//           analyzeCodeContainer.style.borderRadius = "8px";

//           // Add heading
//           const heading = document.createElement("h3");
//           heading.textContent = "Issues and Solutions";
//           heading.style.marginBottom = "15px";
//           heading.style.color = "white";
//           heading.style.fontFamily = "Arial, sans-serif";
//           analyzeCodeContainer.appendChild(heading);

//           parsed.forEach((issue, index) => {
//             // Outer accordion for each issue
//             const outerAccordion = document.createElement("div");
//             outerAccordion.style.marginBottom = "12px";
//             outerAccordion.style.border = "1px solid #ccc";
//             outerAccordion.style.borderRadius = "6px";
//             outerAccordion.style.overflow = "hidden";

//             const issueHeader = document.createElement("button");
//             issueHeader.textContent = issue.issueHeading;
//             issueHeader.style.width = "100%";
//             issueHeader.style.textAlign = "left";
//             issueHeader.style.padding = "10px";
//             issueHeader.style.backgroundColor = "blue";
//             issueHeader.style.color = "white";
//             issueHeader.style.border = "none";
//             issueHeader.style.cursor = "pointer";
//             issueHeader.style.fontWeight = "bold";

//             const issueContent = document.createElement("div");
//             issueContent.style.display = "none";
//             issueContent.style.padding = "10px";
//             // issueContent.style.backgroundColor = "#f9f9f9";
//             issueContent.style.backgroundColor = "orange"

//             // Issue Detail
//             const detailPara = document.createElement("p");
//             detailPara.textContent = issue.detail;
//             detailPara.style.marginBottom = "10px";
//             issueContent.appendChild(detailPara);

//             // Inner accordion for solution
//             const solutionAccordion = document.createElement("div");
//             solutionAccordion.style.border = "1px solid #ddd";
//             solutionAccordion.style.borderRadius = "4px";

//             const solutionHeader = document.createElement("button");
//             solutionHeader.textContent = "Show Solution";
//             solutionHeader.style.width = "100%";
//             solutionHeader.style.textAlign = "left";
//             solutionHeader.style.padding = "8px";
//             solutionHeader.style.backgroundColor = "#555";
//             solutionHeader.style.color = "white";
//             solutionHeader.style.border = "none";
//             solutionHeader.style.cursor = "pointer";
//             solutionHeader.style.fontWeight = "600";

//             const solutionContent = document.createElement("div");
//             solutionContent.style.display = "none";
//             solutionContent.style.padding = "8px";
//             solutionContent.style.backgroundColor = "#eee";
//             solutionContent.style.color = "#333";
//             solutionContent.textContent = issue.solution;

//             // Toggle solution display
//             solutionHeader.addEventListener("click", () => {
//               solutionContent.style.display =
//                 solutionContent.style.display === "none" ? "block" : "none";
//             });

//             solutionAccordion.appendChild(solutionHeader);
//             solutionAccordion.appendChild(solutionContent);

//             // Append inner solution accordion to issueContent
//             issueContent.appendChild(solutionAccordion);

//             // Toggle issue display
//             issueHeader.addEventListener("click", () => {
//               issueContent.style.display =
//                 issueContent.style.display === "none" ? "block" : "none";
//             });

//             // Final assembly
//             outerAccordion.appendChild(issueHeader);
//             outerAccordion.appendChild(issueContent);
//             analyzeCodeContainer.appendChild(outerAccordion);
//             output.appendChild(analyzeCodeContainer);
//           });
//         } else {
//           alert("Failed to analyze code.");
//         }
//       }
//     );
//   } catch (error) {
//     document.getElementById("output").innerText =
//       "Error extracting code: " + error;
//   }
// }

// function approachHintGeneration() {
//   const temp = document.createElement("div");
//   temp.style.color = "White";
//   temp.style.marginLeft = "10px";

//   if (!leetCodeData.content) {
//     alert("Please scrape the question first!");
//     return;
//   }

//   if (leetCodeData.hints) {
//     alert("Hints already generated");
//     return;
//   }

//   const output = document.getElementById("output");

//   const txt = "Generating Hint for solution...";
//   temp.textContent = txt;
//   output.appendChild(temp);

//   chrome.runtime.sendMessage(
//     {
//       action: "approachHintGenerate",
//       payload: {
//         content: leetCodeData.content,
//       },
//     },
//     (response) => {
//       output.removeChild(temp);
//       const { approachHint } = response || {};

//       if (approachHint) {
//         // Create parent container
//         const approachHintContainer = document.createElement("div");
//         approachHintContainer.style.padding = "10px";
//         approachHintContainer.style.border = "1px solid #ccc";
//         approachHintContainer.style.borderRadius = "8px";

//         // Add heading
//         const heading = document.createElement("h3");
//         heading.textContent = "Hints";
//         heading.style.marginBottom = "15px";
//         heading.style.color = "white";
//         heading.style.fontFamily = "Arial, sans-serif";
//         approachHintContainer.appendChild(heading);

//         // Extract hints using regex
//         const hints = approachHint
//           .trim()
//           .split("\n")
//           .filter((line) => /^Hint\s*\d+:/.test(line.trim()));

//         hints.forEach((hintText, index) => {
//           // Create accordion container (individual hint box)
//           const accordionItem = document.createElement("div");
//           accordionItem.style.marginBottom = "8px";
//           accordionItem.style.border = "1px solid #ccc";
//           accordionItem.style.borderRadius = "5px";
//           accordionItem.style.overflow = "hidden";

//           // Create header button
//           const header = document.createElement("button");
//           header.textContent = `Hint ${index + 1}`;
//           header.style.width = "100%";
//           header.style.textAlign = "left";
//           header.style.padding = "10px";
//           header.style.backgroundColor = "blue";
//           header.style.color = "white";
//           header.style.border = "none";
//           header.style.cursor = "pointer";
//           header.style.fontWeight = "bold";

//           // Create content container
//           const content = document.createElement("div");
//           const parts = hintText.split(":");
//           content.textContent =
//             parts.length > 1 ? parts.slice(1).join(":").trim() : hintText;

//           content.style.padding = "10px";
//           content.style.display = "none";
//           content.style.backgroundColor = "#f4f4f4";
//           content.style.color = "#333";

//           // Toggle display on click
//           header.addEventListener("click", () => {
//             content.style.display =
//               content.style.display === "none" ? "block" : "none";
//           });

//           accordionItem.appendChild(header);
//           accordionItem.appendChild(content);
//           approachHintContainer.appendChild(accordionItem);
//         });

//         // Append the whole container to output
//         output.appendChild(approachHintContainer);
//         leetCodeData.hints = approachHint;
//       } else {
//         alert("Failed to generate approach hints.");
//       }
//     }
//   );
// }


async function analyzeCode() {
  const temp = document.createElement("div");
  temp.style.color = "white";
  temp.style.marginLeft = "10px";

  if (!leetCodeData.content) {
    alert("Please scrape the question first!");
    return;
  }

  const output = document.getElementById("output");
  const existing = output.querySelector(".analyzeCodeContainer");
  if (existing) output.removeChild(existing);

  try {
    const codeContent = await extractEditorContent();
    leetCodeData.code = codeContent;

    temp.textContent = "Analyzing your code...";
    output.appendChild(temp);

    chrome.runtime.sendMessage(
      {
        action: "analyzeCode",
        payload: {
          content: leetCodeData.content,
          code: leetCodeData.code,
        },
      },
      (response) => {
        output.removeChild(temp);
        const { parsed } = response || {};

        if (!parsed) {
          alert("Failed to analyze code.");
          return;
        }

        // ✨ Container
        const container = document.createElement("div");
        container.className = "analyzeCodeContainer";
        container.style.backgroundColor = "#1E1E2F";
        container.style.padding = "16px";
        container.style.marginTop = "20px";
        // container.style.border = "1px solid rgba(255,255,255,0.1)";
        container.style.borderRadius = "12px";
        container.style.boxShadow = "0 4px 15px rgba(0,0,0,0.2)";

        // 🏷️ Heading
        const heading = document.createElement("h3");
        heading.textContent = "Issues & Solutions";
        heading.style.color = "#3A82F7";
        heading.style.fontFamily = "'Segoe UI', sans-serif";
        heading.style.fontSize = "20px";
        heading.style.fontWeight = "600";
        heading.style.marginBottom = "20px";
        container.appendChild(heading);

        parsed.forEach((issue, idx) => {
          // 🔹 Issue Card
          const card = document.createElement("div");
          card.style.marginBottom = "16px";
          card.style.borderRadius = "8px";
          card.style.overflow = "hidden";
          card.style.border = "1px solid rgba(58,130,247,0.2)";
          card.style.backgroundColor = "#2C2C3E";

          // ⚠️ Issue Header
          const issueHeader = document.createElement("button");
          issueHeader.textContent = `Issue ${idx + 1}: ${issue.issueHeading}`;
          issueHeader.style.width = "100%";
          issueHeader.style.textAlign = "left";
          issueHeader.style.padding = "12px 16px";
          issueHeader.style.backgroundColor = "#3A82F7";
          issueHeader.style.color = "#FFFFFF";
          issueHeader.style.border = "none";
          issueHeader.style.cursor = "pointer";
          issueHeader.style.fontFamily = "'Segoe UI', sans-serif";
          issueHeader.style.fontSize = "15px";
          issueHeader.style.fontWeight = "600";
          issueHeader.style.transition = "background 0.3s";
          issueHeader.addEventListener("mouseover", () => {
            issueHeader.style.backgroundColor = "#2563EB";
          });
          issueHeader.addEventListener("mouseout", () => {
            issueHeader.style.backgroundColor = "#3A82F7";
          });

          // 📋 Issue Content
          const issueContent = document.createElement("div");
          issueContent.style.maxHeight = "0";
          issueContent.style.overflow = "hidden";
          issueContent.style.backgroundColor = "#1F1F2B";
          issueContent.style.color = "#E0E0E0";
          issueContent.style.padding = "0 16px";
          issueContent.style.transition = "max-height 0.3s ease, padding 0.3s ease";

          // Detail paragraph
          const detail = document.createElement("p");
          detail.textContent = issue.detail;
          detail.style.margin = "16px 0";
          detail.style.lineHeight = "1.6";
          issueContent.appendChild(detail);

          // 🔧 Solution Accordion
          const solHeader = document.createElement("button");
          solHeader.textContent = "Show Solution";
          solHeader.style.width = "100%";
          solHeader.style.textAlign = "left";
          solHeader.style.padding = "10px 16px";
          solHeader.style.backgroundColor = "#555";
          solHeader.style.color = "#FFFFFF";
          solHeader.style.border = "none";
          solHeader.style.cursor = "pointer";
          solHeader.style.fontFamily = "'Segoe UI', sans-serif";
          solHeader.style.fontWeight = "500";
          solHeader.style.transition = "background 0.3s";
          solHeader.addEventListener("mouseover", () => {
            solHeader.style.backgroundColor = "#444";
          });
          solHeader.addEventListener("mouseout", () => {
            solHeader.style.backgroundColor = "#555";
          });

          const solContent = document.createElement("div");
          solContent.textContent = issue.solution;
          solContent.style.maxHeight = "0";
          solContent.style.overflow = "hidden";
          solContent.style.backgroundColor = "#2C2C3E";
          solContent.style.color = "#EAEAEA";
          solContent.style.padding = "0 16px";
          solContent.style.marginBottom = "12px";
          solContent.style.transition = "max-height 0.3s ease, padding 0.3s ease";

          // // Toggle logic
          // issueHeader.addEventListener("click", () => {
          //   const open = issueContent.style.maxHeight !== "0px";
          //   issueContent.style.padding = open ? "0 16px" : "16px";
          //   issueContent.style.maxHeight = open ? "0" : "500px";
          // });

          // solHeader.addEventListener("click", () => {
          //   const open = solContent.style.maxHeight !== "0px";
          //   solContent.style.padding = open ? "0 16px" : "12px 16px";
          //   solContent.style.maxHeight = open ? "0" : "300px";
          // });



          // Toggle logic for the main issue content
issueHeader.addEventListener("click", () => {
  const open = issueContent.style.maxHeight !== "0px";
  if (open) {
    issueContent.style.padding = "0 16px";
    issueContent.style.maxHeight = "0";
    issueContent.style.overflowY = "hidden";
  } else {
    issueContent.style.padding = "16px";
    issueContent.style.maxHeight = "500px";        // same as before
    issueContent.style.overflowY = "auto";         // allow scroll
  }
});

// Toggle logic for the solution content
solHeader.addEventListener("click", () => {
  const open = solContent.style.maxHeight !== "0px";
  if (open) {
    solContent.style.padding = "0 16px";
    solContent.style.maxHeight = "0";
    solContent.style.overflowY = "hidden";
  } else {
    solContent.style.padding = "12px 16px";
    solContent.style.maxHeight = "300px";         // same as before
    solContent.style.overflowY = "auto";           // allow scroll
  }
});


          // Assemble
          card.appendChild(issueHeader);
          card.appendChild(issueContent);
          issueContent.appendChild(solHeader);
          issueContent.appendChild(solContent);
          container.appendChild(card);
        });

        output.appendChild(container);
      }
    );
  } catch (err) {
    document.getElementById("output").innerText =
      "Error extracting code: " + err;
  }
}




function approachHintGeneration() {
  const temp = document.createElement("div");
  temp.style.color = "white";
  temp.style.marginLeft = "10px";

  if (!leetCodeData.content) {
    alert("Please scrape the question first!");
    return;
  }

  if (leetCodeData.hints) {
    alert("Hints already generated");
    return;
  }

  const output = document.getElementById("output");

  const txt = "Generating Hint for solution...";
  temp.textContent = txt;
  output.appendChild(temp);

  chrome.runtime.sendMessage(
    {
      action: "approachHintGenerate",
      payload: {
        content: leetCodeData.content,
      },
    },
    (response) => {
      output.removeChild(temp);
      const { approachHint } = response || {};

      if (approachHint) {
        const approachHintContainer = document.createElement("div");
        approachHintContainer.style.padding = "15px";
        approachHintContainer.style.borderRadius = "10px";
        approachHintContainer.style.backgroundColor = "#1e1e2f";
        approachHintContainer.style.boxShadow = "0 4px 15px rgba(0, 0, 0, 0.2)";
        approachHintContainer.style.marginTop = "15px";

        const heading = document.createElement("h3");
        heading.textContent = "Hints";
        heading.style.marginBottom = "20px";
        heading.style.color = "#3A82F7";
        heading.style.fontFamily = "Segoe UI, sans-serif";
        heading.style.fontSize = "22px";
        heading.style.fontWeight = "600";
        approachHintContainer.appendChild(heading);

        const hints = approachHint
          .trim()
          .split("\n")
          .filter((line) => /^Hint\s*\d+:/.test(line.trim()));

        hints.forEach((hintText, index) => {
          const accordionItem = document.createElement("div");
          accordionItem.style.marginBottom = "10px";
          accordionItem.style.borderRadius = "8px";
          accordionItem.style.overflow = "hidden";
          accordionItem.style.border = "1px solid #333";
          accordionItem.style.backgroundColor = "#2a2a3d";

          const header = document.createElement("button");
          header.textContent = `Hint ${index + 1}`;
          header.style.width = "100%";
          header.style.textAlign = "left";
          header.style.padding = "12px 16px";
          header.style.backgroundColor = "#3A82F7";
          header.style.color = "#FFFFFF";
          header.style.border = "none";
          header.style.cursor = "pointer";
          header.style.fontWeight = "600";
          header.style.fontSize = "15px";
          header.style.borderRadius = "8px 8px 0 0";
          header.style.transition = "background-color 0.3s";

          // Hover effect
          header.addEventListener("mouseover", () => {
            header.style.backgroundColor = "#2563EB";
          });
          header.addEventListener("mouseout", () => {
            header.style.backgroundColor = "#3A82F7";
          });

          const content = document.createElement("div");
          const parts = hintText.split(":");
          content.textContent =
            parts.length > 1 ? parts.slice(1).join(":").trim() : hintText;

          content.style.padding = "14px 18px";
          content.style.display = "none";
          content.style.backgroundColor = "#1F1F2B";
          content.style.color = "#E0E0E0";
          content.style.fontSize = "14px";
          content.style.lineHeight = "1.6";
          content.style.borderTop = "1px solid #444";

          // Optional: Add smooth transition
          content.style.maxHeight = "0";
          content.style.overflow = "hidden";
          content.style.transition = "max-height 0.3s ease, padding 0.3s ease";

          // Toggle animation
          header.addEventListener("click", () => {
            const isVisible = content.style.display === "block";
            if (isVisible) {
              content.style.maxHeight = "0";
              setTimeout(() => {
                content.style.display = "none";
              }, 300);
            } else {
              content.style.display = "block";
              content.style.maxHeight = "300px";
            }
          });

          accordionItem.appendChild(header);
          accordionItem.appendChild(content);
          approachHintContainer.appendChild(accordionItem);
        });

        output.appendChild(approachHintContainer);
        leetCodeData.hints = approachHint;
      } else {
        alert("Failed to generate approach hints.");
      }
    }
  );
}


// function generateThinkTestCases() {
//   const temp = document.createElement("div");
//   temp.style.color = "White";
//   temp.style.marginLeft = "10px";

//   if (!leetCodeData.content) {
//     alert("Please scrape the question first!");
//     return;
//   }
//   if (leetCodeData.thinkTestCases) {
//     alert("Think testcases already generated");
//     return;
//   }

//   const txt = "Generating think testcases.....";
//   temp.textContent = txt;
//   const output = document.getElementById("output");

//   output.appendChild(temp);

//   chrome.runtime.sendMessage(
//     {
//       action: "thinkTestcasesGenerate",
//       payload: {
//         content: leetCodeData.content,
//       },
//     },
//     (response) => {
//       const { thinkTestCases } = response || {};
//       output.removeChild(temp);
//       if (thinkTestCases) {
//         // Create parent container
//         const thinkTestCaseContainer = document.createElement("div");
//         thinkTestCaseContainer.style.padding = "10px";
//         thinkTestCaseContainer.style.border = "1px solid #ccc";
//         thinkTestCaseContainer.style.borderRadius = "8px";

//         // Add heading
//         const heading = document.createElement("h3");
//         heading.textContent = "Thinking of Test Cases";
//         heading.style.marginBottom = "15px";
//         heading.style.color = "white";
//         heading.style.fontFamily = "Arial, sans-serif";
//         thinkTestCaseContainer.appendChild(heading);

//         // Split into individual test cases
//         const cases = thinkTestCases.trim().split("\n");

//         cases.forEach((testCase) => {
//           const testCaseDiv = document.createElement("div");
//           testCaseDiv.textContent = testCase;
//           testCaseDiv.style.marginBottom = "10px";
//           testCaseDiv.style.padding = "8px";
//           testCaseDiv.style.backgroundColor = "#ffffff";
//           testCaseDiv.style.border = "1px solid #ddd";
//           testCaseDiv.style.borderRadius = "5px";
//           testCaseDiv.style.boxShadow = "0 1px 3px rgba(0,0,0,0.05)";
//           thinkTestCaseContainer.appendChild(testCaseDiv);
//         });

//         // Append container to output
//         output.appendChild(thinkTestCaseContainer);
//         leetCodeData.thinkTestCases = thinkTestCases;
//       } else {
//         alert("Failed to generate think testcases.");
//       }
//     }
//   );
// }


function generateThinkTestCases() {
  const temp = document.createElement("div");
  temp.style.color = "white";
  temp.style.marginLeft = "10px";

  if (!leetCodeData.content) {
    alert("Please scrape the question first!");
    return;
  }
  if (leetCodeData.thinkTestCases) {
    alert("Think testcases already generated");
    return;
  }

  const txt = "Generating think testcases...";
  temp.textContent = txt;
  const output = document.getElementById("output");
  output.appendChild(temp);

  chrome.runtime.sendMessage(
    {
      action: "thinkTestcasesGenerate",
      payload: {
        content: leetCodeData.content,
      },
    },
    (response) => {
      const { thinkTestCases } = response || {};
      output.removeChild(temp);

      if (thinkTestCases) {
        // 🌙 Modern Container
        const thinkTestCaseContainer = document.createElement("div");
        thinkTestCaseContainer.style.padding = "16px";
        thinkTestCaseContainer.style.marginTop = "20px";
        thinkTestCaseContainer.style.borderRadius = "10px";
        thinkTestCaseContainer.style.backgroundColor = "#1E1E2F";  // Dark theme card
        thinkTestCaseContainer.style.boxShadow = "0 4px 10px rgba(0,0,0,0.2)";

        // 🏷️ Title
        const heading = document.createElement("h3");
        heading.textContent = "Think Test Cases";
        heading.style.marginBottom = "15px";
        heading.style.color = "#3A82F7";  // Accent color
        heading.style.fontFamily = "'Segoe UI', sans-serif";
        heading.style.fontSize = "22px";
        heading.style.fontWeight = "600";
        thinkTestCaseContainer.appendChild(heading);

        // 📋 Each Test Case Box
        const cases = thinkTestCases.trim().split("\n");
        cases.forEach((testCase) => {
          const testCaseDiv = document.createElement("div");
          testCaseDiv.textContent = testCase;

          testCaseDiv.style.marginBottom = "12px";
          testCaseDiv.style.padding = "12px";
          testCaseDiv.style.borderRadius = "8px";
          testCaseDiv.style.backgroundColor = "#2C2C3E";
          testCaseDiv.style.color = "#EAEAEA";
          testCaseDiv.style.border = "1px solid rgba(58, 130, 247, 0.2)";
          testCaseDiv.style.fontFamily = "Consolas, monospace";
          testCaseDiv.style.fontSize = "14px";
          testCaseDiv.style.whiteSpace = "pre-wrap";
          testCaseDiv.style.transition = "transform 0.2s";

          testCaseDiv.addEventListener("mouseover", () => {
            testCaseDiv.style.transform = "scale(1.02)";
          });
          testCaseDiv.addEventListener("mouseout", () => {
            testCaseDiv.style.transform = "scale(1)";
          });

          thinkTestCaseContainer.appendChild(testCaseDiv);
        });

        // Append Final UI to Output
        output.appendChild(thinkTestCaseContainer);
        leetCodeData.thinkTestCases = thinkTestCases;
      } else {
        alert("Failed to generate think testcases.");
      }
    }
  );
}




// async function generateFullCode(){


//   if (!leetCodeData.content) {
//     alert("Please scrape the question first!");
//     return;
//   }

//   const output = document.getElementById("output");

//   const codeDivContainer = output.getElementsByClassName(
//     "codeDiv"
//   )[0];
//   if (codeDivContainer) {
//     output.removeChild(codeDivContainer);
//   }

//   try{
//     const language=await extractSelectedLanguage();
//     leetCodeData.language=language;
//     const codeContent = await extractEditorContent();
//     leetCodeData.code = codeContent;
//   const temp = document.createElement("div");
//   temp.style.color = "White";
//   temp.style.marginLeft = "10px";

//   const txt = "Generating whole code...";
//   temp.textContent = txt;
//   output.appendChild(temp);

//   chrome.runtime.sendMessage(
//     {
//       action:"fullCodeGenerate",
//       payload:{
//         content:leetCodeData.content,
//         lang:leetCodeData.language,
//         code:leetCodeData.code,
//       },
//     },
//     (response) =>{
//       output.removeChild(temp);
//       const { fullCode}= response || {};

//       if(fullCode){

//          const codeDiv = document.createElement('div');
//          codeDiv.className = 'codeDiv'; // Add this line when creating the new codeDiv


//     // Set the background color and styling for the code div
//     //codeDiv.style.backgroundColor = '#f4f4f4';  // Match the output container's background color
//     codeDiv.style.border = '1px solid #ccc';
//     codeDiv.style.borderRadius = '8px';
//     codeDiv.style.padding = '10px';  // Padding for readability
//     codeDiv.style.fontFamily = 'monospace';  // Monospace font for code
//     codeDiv.style.whiteSpace = 'pre-wrap';  // Preserve line breaks
//     codeDiv.style.overflowX = 'auto';  // Horizontal scrolling for overflowed code
//     codeDiv.style.maxWidth = '100%';  // Prevent div from going beyond container



//       // Add heading
//   const heading = document.createElement('h3');
//   heading.textContent = 'Code:';
//   heading.style.marginBottom = '15px';
//   heading.style.color = 'white';
//   heading.style.fontFamily = 'Arial, sans-serif';
//   codeDiv.appendChild(heading);


//    // Apply Prism.js syntax highlighting by wrapping code with a <pre> and <code> block
//     const codeBlock = document.createElement('pre');
//     const codeElement = document.createElement('code');
//     codeElement.className = 'language-java';  // Change language if needed
//     codeElement.textContent = fullCode;  // Set the code content
//     codeBlock.appendChild(codeElement);  // Append <code> inside <pre>
//     codeDiv.appendChild(codeBlock);  // Add <pre> block to the code div

//     // Apply Prism.js highlighting
//     Prism.highlightElement(codeElement);

//     // Create the Copy button
//     const copyButton = document.createElement('button');
//     copyButton.textContent = 'Copy';
//     copyButton.style.marginTop = '10px';  // Space between code and button
//     copyButton.style.padding = '10px 15px';
//     copyButton.style.border = 'none';
//     copyButton.style.backgroundColor = '#4CAF50';  // Green color for button
//     copyButton.style.color = 'white';
//     copyButton.style.borderRadius = '5px';
//     copyButton.style.cursor = 'pointer';
//     copyButton.style.fontSize = '14px';

//     // Add copy functionality to the button
//     copyButton.addEventListener('click', () => {
//         navigator.clipboard.writeText(fullCode).then(() => {
//             alert('Code copied to clipboard!');  // Show an alert once copied
//         }).catch((err) => {
//             console.error('Error copying code:', err);
//         });
//     });

//     // Append the copy button below the code
//     codeDiv.appendChild(copyButton);

//     // Append the codeDiv to the output container
//     output.appendChild(codeDiv);


//       }
//       else{
//         alert("Failed to generate full code");
//       }
//     }
//   );
// }
// catch(error){
//   document.getElementById("output").innerText =
//       "Error extracting code: " + error;
// }
// }

async function generateFullCode() {
  if (!leetCodeData.content) {
    alert("Please scrape the question first!");
    return;
  }

  const output = document.getElementById("output");

  // Remove existing code section if present
  const codeDivContainer = output.getElementsByClassName("codeDiv")[0];
  if (codeDivContainer) {
    output.removeChild(codeDivContainer);
  }

  try {
    const language = await extractSelectedLanguage();
    leetCodeData.language = language;

    const codeContent = await extractEditorContent();
    leetCodeData.code = codeContent;

    const temp = document.createElement("div");
    temp.style.color = "white";
    temp.style.marginLeft = "10px";
    temp.textContent = "Generating whole code...";
    output.appendChild(temp);

    chrome.runtime.sendMessage(
      {
        action: "fullCodeGenerate",
        payload: {
          content: leetCodeData.content,
          lang: leetCodeData.language,
          code: leetCodeData.code,
        },
      },
      (response) => {
        output.removeChild(temp);
        const { fullCode } = response || {};

        if (fullCode) {
          // 🧱 Modern Code Container
          const codeDiv = document.createElement("div");
          codeDiv.className = "codeDiv";
          codeDiv.style.backgroundColor = "#1E1E2F";  // Dark theme
          codeDiv.style.border = "1px solid rgba(0, 0, 0, 0.2)";
          codeDiv.style.borderRadius = "12px";
          codeDiv.style.padding = "16px";
          codeDiv.style.marginTop = "20px";
          codeDiv.style.boxShadow = "0 4px 10px rgba(0,0,0,0.3)";
          codeDiv.style.maxWidth = "100%";
          codeDiv.style.overflowX = "auto";

          // 🏷️ Header
          const heading = document.createElement("h3");
          heading.textContent = "Full Code";
          heading.style.color = "#3A82F7";
          heading.style.fontFamily = "'Segoe UI', sans-serif";
          heading.style.fontSize = "22px";
          heading.style.fontWeight = "600";
          heading.style.marginBottom = "15px";
          codeDiv.appendChild(heading);

          // 🧠 Code Block
          const codeBlock = document.createElement("pre");
          const codeElement = document.createElement("code");
          codeElement.className = 'language-java';
          codeElement.textContent = fullCode;
          codeBlock.appendChild(codeElement);
          codeDiv.appendChild(codeBlock);
          Prism.highlightElement(codeElement);

          // 📋 Copy Button
          const copyButton = document.createElement("button");
          copyButton.textContent = "Copy Code";
          copyButton.style.marginTop = "12px";
          copyButton.style.padding = "10px 18px";
          copyButton.style.border = "none";
          copyButton.style.backgroundColor = "#3A82F7";
          copyButton.style.color = "#fff";
          copyButton.style.borderRadius = "6px";
          copyButton.style.cursor = "pointer";
          copyButton.style.fontSize = "14px";
          copyButton.style.fontFamily = "'Segoe UI', sans-serif";
          copyButton.style.transition = "background 0.3s";

          copyButton.addEventListener("mouseover", () => {
            copyButton.style.backgroundColor = "#2f6cd6";
          });
          copyButton.addEventListener("mouseout", () => {
            copyButton.style.backgroundColor = "#3A82F7";
          });

          copyButton.addEventListener("click", () => {
            navigator.clipboard.writeText(fullCode)
              .then(() => alert("Code copied to clipboard!"))
              .catch((err) => console.error("Error copying code:", err));
          });

          codeDiv.appendChild(copyButton);
          output.appendChild(codeDiv);

        } else {
          alert("❌ Failed to generate full code.");
        }
      }
    );
  } catch (error) {
    document.getElementById("output").innerText =
      "Error extracting code: " + error;
  }
}






(function () {
  let floatingWindow = null;

  chrome.runtime.onMessage.addListener((request, sender, sendResponse) => {
    if (request.ping) {
      sendResponse({ pong: true });
      return;
    }

    if (request.action === "toggleFloatingWindow") {
      if (floatingWindow) {
        floatingWindow.remove();
        floatingWindow = null;
        leetCodeData.title = null;
        leetCodeData.content = null;
        leetCodeData.code = null;
        leetCodeData.testcases = null;
        leetCodeData.hints = null;
        leetCodeData.thinkTestCases = null;
      } else {
        createFloatingWindow();
      }
    }
  });

  function createFloatingWindow() {
    floatingWindow = document.createElement("div");
    floatingWindow.style.position = "fixed";
    floatingWindow.style.top = "100px";
    floatingWindow.style.left = "100px";
    floatingWindow.style.width = "400px";
    floatingWindow.style.height = "500px";
    floatingWindow.style.background = "black";
    floatingWindow.style.border = "2px solid black";
    floatingWindow.style.zIndex = 9999;
    floatingWindow.style.boxShadow = "0px 0px 10px rgba(0,0,0,0.5)";
    floatingWindow.style.padding = "0";
    floatingWindow.style.overflow = "auto";
    floatingWindow.style.color = "black";
    floatingWindow.style.resize = "both";
    floatingWindow.style.minWidth = "300px";
    floatingWindow.style.minHeight = "300px";
    floatingWindow.style.maxWidth = "90vw";
    floatingWindow.style.maxHeight = "90vh";
    floatingWindow.style.borderRadius = "10px";


//     floatingWindow.innerHTML = `
//   <div id="staticContainer" style="position:static;">
//   <div id="floatingHeader" style="cursor:move;padding:10px;background-color:	#1E1E2F;border-bottom:1px solid #ccc;display:flex;justify-content:space-between;align-items:center; padding: 5px 15px; ">
//     <p style="font-size: 20px; font-weight: bold; color:#FFFFFF; margin: 0;">LeetGrow</p>
//     <button id="closeFloatingWindow" style="margin-left:auto;background-color:#FF4C4C;color:	#FFFFFF;border:none;padding:5px 10px;border-radius:4px;cursor:pointer;">X</button>
//   </div>
//   </div>
//   <div id="floatingContent" style=" background-color:#2D2F36; padding: 5px 15px; position:fixed">
//     <button class="floating-btn" id="scrapeBtn">Scrape</button>
//     <button class="floating-btn" id="hintBtn">Hint</button>
//     <button class="floating-btn" id="testcasesBtn">TestCases</button>
//     <button class="floating-btn" id="thinkTestcasesBtn">Think TestCases</button>
//     <button class="floating-btn" id="analyzeBtn">Analyze</button>
//     <button class="floating-btn" id="completeCode">Full Code</button>

//   </div>
  
//   <div style="background-color:#1F1F2B; padding:10px 15px;  color:#E0E0E0" id="output"  >
//     There exist two undirected trees with n and m nodes, with distinct labels in ranges [0, n - 1] and [0, m - 1], respectively.

// You are given two 2D integer arrays edges1 and edges2 of lengths n - 1 and m - 1, respectively, where edges1[i] = [ai, bi] indicates that there is an edge between nodes ai and bi in the first tree and edges2[i] = [ui, vi] indicates that there is an edge between nodes ui and vi in the second tree. You are also given an integer k.

// Node u is target to node v if the number of edges on the path from u to v is less than or equal to k. Note that a node is always target to itself.

// Return an array of n integers answer, where answer[i] is the maximum possible number of nodes target to node i of the first tree if you have to connect one node from the first tree to another node in the second tree.

// Note that queries are independent from each other. That is, for every query you will remove the added edge before proceeding to the next query.
// There exist two undirected trees with n and m nodes, with distinct labels in ranges [0, n - 1] and [0, m - 1], respectively.

// You are given two 2D integer arrays edges1 and edges2 of lengths n - 1 and m - 1, respectively, where edges1[i] = [ai, bi] indicates that there is an edge between nodes ai and bi in the first tree and edges2[i] = [ui, vi] indicates that there is an edge between nodes ui and vi in the second tree. You are also given an integer k.

// Node u is target to node v if the number of edges on the path from u to v is less than or equal to k. Note that a node is always target to itself.

// Return an array of n integers answer, where answer[i] is the maximum possible number of nodes target to node i of the first tree if you have to connect one node from the first tree to another node in the second tree.

// Note that queries are independent from each other. That is, for every query you will remove the added edge before proceeding to the next query.
//     </div>
// `;

// #2D2F36

    floatingWindow.innerHTML = `
  <div id="floatingHeader" style="position:sticky;top:0;cursor:move;padding:10px 15px;background-color:#1E1E2F;border-bottom:1px solid #ccc;display:flex;justify-content:space-between;align-items:center;z-index:10;">
    <p style="font-size: 20px; font-weight: bold; color:#FFFFFF; margin: 0;">LeetGrow</p>
    <button id="closeFloatingWindow" style="background-color:#FF4C4C;color:#FFFFFF;border:none;padding:5px 10px;border-radius:4px;cursor:pointer;">X</button>
  </div>

  <div id="floatingContent" style="position:sticky;top:52px;background-color:#1A1A40;padding:10px 10px;display:flex;flex-wrap:wrap;gap:5px;z-index:9;">
    <button class="floating-btn" id="scrapeBtn">Scrape</button>
    <button class="floating-btn" id="hintBtn">Hints</button>
    <button class="floating-btn" id="testcasesBtn">Test Cases</button>
    <button class="floating-btn" id="thinkTestcasesBtn">Think Test Cases</button>
    <button class="floating-btn" id="analyzeBtn">Analyze Code</button>
    <button class="floating-btn" id="completeCode">Full Code</button>
  </div>

  <div id="output" style="padding:15px;background-color:#1F1F2B;color:#E0E0E0;">
    
  </div>
`;






    const style = document.createElement("style");
    style.innerHTML = `
    .floating-btn {
  margin: 5px;
  padding: 8px 14px;
  background-color: #3A82F7;
  color: #FFFFFF;
  border: 1px solid #1E40AF;
  border-radius: 5px;
  cursor: pointer;
  transition: background 0.2s ease;
  flex-shrink: 0;
}
.floating-btn:hover {
  background-color: #2563EB;
}

    `


//     `
//   .floating-btn {
//     margin: 5px;
//     padding: 8px 14px;
//     background-color: #3A82F7;
//     color: #FFFFFF;
//     border: 1px solid #1E40AF;
//     border-radius: 5px;
//     cursor: pointer;
//     transition: background 0.2s ease;
//   }
//   .floating-btn:hover {
//     background-color: #2563EB;
//   }
// `;
    document.head.appendChild(style);

    document.body.appendChild(floatingWindow);

    // Close button functionality
    document
      .getElementById("closeFloatingWindow")
      .addEventListener("click", () => {
        floatingWindow.remove();
        floatingWindow = null;
        // clear all data
        leetCodeData.title = null;
        leetCodeData.content = null;
        leetCodeData.code = null;
        leetCodeData.testcases = null;
        leetCodeData.hints = null;
        leetCodeData.thinkTestCases = null;
      });

    // Add your button logic here
    document
      .getElementById("scrapeBtn")
      .addEventListener("click", scrapeLeetCodeData);
    document
      .getElementById("testcasesBtn")
      .addEventListener("click", generateTestCases);
    document
      .getElementById("analyzeBtn")
      .addEventListener("click", analyzeCode);
    document
      .getElementById("hintBtn")
      .addEventListener("click", approachHintGeneration);
    document
      .getElementById("thinkTestcasesBtn")
      .addEventListener("click", generateThinkTestCases);
    document
      .getElementById("completeCode")
      .addEventListener("click", generateFullCode);

    // Draggable functionality
    const header = floatingWindow.querySelector("#floatingHeader");
    let isDragging = false,
      offsetX,
      offsetY;

    header.addEventListener("mousedown", function (e) {
      isDragging = true;
      offsetX = e.clientX - floatingWindow.getBoundingClientRect().left;
      offsetY = e.clientY - floatingWindow.getBoundingClientRect().top;
      document.body.style.userSelect = "none";
    });

    document.addEventListener("mousemove", function (e) {
      if (isDragging) {
        floatingWindow.style.left =
          Math.min(Math.max(0, e.clientX - offsetX), window.innerWidth - 100) +
          "px";
        floatingWindow.style.top =
          Math.min(Math.max(0, e.clientY - offsetY), window.innerHeight - 100) +
          "px";
      }
    });

    document.addEventListener("mouseup", function () {
      isDragging = false;
      document.body.style.userSelect = "auto";
    });
  }
})();

// by gpt
// (function () {
//   // --- State & shared handlers ---
//   let floatingWindow = null;
//   let isDragging = false;
//   let offsetX = 0;
//   let offsetY = 0;

//   // Listen for messages from background or popup
//   chrome.runtime.onMessage.addListener((request, sender, sendResponse) => {
//     if (request.ping) {
//       sendResponse({ pong: true });
//       return;
//     }

//     if (request.action === "toggleFloatingWindow") {
//       if (floatingWindow) {
//         closeFloatingWindow();
//       } else {
//         createFloatingWindow();
//       }
//     }
//   });

//   // --- Create the floating panel ---
//   function createFloatingWindow() {
//     // Main container
//     floatingWindow = document.createElement("div");
//     Object.assign(floatingWindow.style, {
//       position: "fixed",
//       top: "100px",
//       left: "100px",
//       width: "400px",
//       height: "500px",
//       background: "black",
//       border: "2px solid black",
//       zIndex: "9999",
//       boxShadow: "0px 0px 10px rgba(0,0,0,0.5)",
//       padding: "0",
//       overflow: "auto",
//       resize: "both",
//       minWidth: "300px",
//       minHeight: "300px",
//       maxWidth: "90vw",
//       maxHeight: "90vh",
//     });

//     floatingWindow.innerHTML = `
//       <div id="fg-header" style="cursor:move;padding:10px;background:#000;color:#fff;display:flex;justify-content:space-between;align-items:center;">
//         <h3 style="margin:0">LeetGrow Panel</h3>
//         <button id="fg-close" style="background:#e74c3c;color:#fff;border:none;padding:5px 10px;border-radius:4px;cursor:pointer;">X</button>
//       </div>
//       <div id="fg-controls" style="padding:6px;background:orange;display:flex;flex-wrap:wrap;">
//         <button class="floating-btn" id="scrapeBtn">Scrape</button>
//         <button class="floating-btn" id="hintBtn">Hint</button>
//         <button class="floating-btn" id="testcasesBtn">TestCases</button>
//         <button class="floating-btn" id="thinkTestcasesBtn">Think TestCases</button>
//         <button class="floating-btn" id="analyzeBtn">Analyze</button>
//         <button class="floating-btn" id="completeCode">Full Code</button>
//       </div>
//       <div id="fg-output" style="padding:6px;margin-top:10px;color:white;"></div>
//     `;

//     // Button styles (once)
//     const styleTag = document.createElement("style");
//     styleTag.innerHTML = `
//       .floating-btn {
//         margin: 5px;
//         padding: 8px 14px;
//         background-color: #3498db;
//         color: white;
//         border: 1px solid #2980b9;
//         border-radius: 5px;
//         cursor: pointer;
//         transition: background 0.2s ease;
//       }
//       .floating-btn:hover {
//         background-color: #2980b9;
//       }
//     `;
//     document.head.appendChild(styleTag);

//     document.body.appendChild(floatingWindow);

//     // Close handler
//     floatingWindow
//       .querySelector("#fg-close")
//       .addEventListener("click", closeFloatingWindow);

//     // Button listeners
//     floatingWindow
//       .querySelector("#scrapeBtn")
//       .addEventListener("click", scrapeLeetCodeData);
//     floatingWindow
//       .querySelector("#hintBtn")
//       .addEventListener("click", approachHintGeneration);
//     floatingWindow
//       .querySelector("#testcasesBtn")
//       .addEventListener("click", generateTestCases);
//     floatingWindow
//       .querySelector("#thinkTestcasesBtn")
//       .addEventListener("click", generateThinkTestCases);
//     floatingWindow
//       .querySelector("#analyzeBtn")
//       .addEventListener("click", analyzeCode);
//     floatingWindow
//       .querySelector("#completeCode")
//       .addEventListener("click", generateFullCode);

//     // Drag handlers
//     const header = floatingWindow.querySelector("#fg-header");
//     header.addEventListener("mousedown", onMouseDown);
//     document.addEventListener("mousemove", onMouseMove, true);
//     document.addEventListener("mouseup", onMouseUp, true);
//   }

//   // Prevent selection & start drag
//   function onMouseDown(e) {
//     if (e.target.closest("#fg-header")) {
//       e.preventDefault();
//       isDragging = true;
//       const rect = floatingWindow.getBoundingClientRect();
//       offsetX = e.clientX - rect.left;
//       offsetY = e.clientY - rect.top;
//       document.body.style.userSelect = "none";
//     }
//   }

//   function onMouseMove(e) {
//     if (!isDragging || !floatingWindow) return;
//     let x = e.clientX - offsetX;
//     let y = e.clientY - offsetY;
//     // clamp within viewport
//     x = Math.max(
//       0,
//       Math.min(window.innerWidth - floatingWindow.clientWidth, x)
//     );
//     y = Math.max(
//       0,
//       Math.min(window.innerHeight - floatingWindow.clientHeight, y)
//     );
//     floatingWindow.style.left = x + "px";
//     floatingWindow.style.top = y + "px";
//   }

//   function onMouseUp() {
//     if (isDragging) {
//       isDragging = false;
//       document.body.style.userSelect = "";
//     }
//   }

//   // Clean up listeners & remove panel
//   function closeFloatingWindow() {
//     if (!floatingWindow) return;
//     floatingWindow.remove();
//     floatingWindow = null;
//     // reset LeetCode data
//     if (window.leetCodeData) {
//       [
//         "title",
//         "content",
//         "code",
//         "testcases",
//         "hints",
//         "thinkTestCases",
//       ].forEach((key) => {
//         window.leetCodeData[key] = null;
//       });
//     }
//     document.removeEventListener("mousemove", onMouseMove, true);
//     document.removeEventListener("mouseup", onMouseUp, true);
//   }
// })();

// this is my old function which works better for normal functionality
// function createFloatingWindow() {

//   floatingWindow = document.createElement('div');
//   floatingWindow.style.position = 'fixed';
//   floatingWindow.style.top = '100px';
//   floatingWindow.style.left = '100px';
//   floatingWindow.style.width = '400px';
//   floatingWindow.style.height = '500px';
//   floatingWindow.style.background = 'white';
//   floatingWindow.style.border = '2px solid black';
//   floatingWindow.style.zIndex = 9999;
//   floatingWindow.style.boxShadow = '0px 0px 10px rgba(0,0,0,0.5)';
//   floatingWindow.style.padding = '10px';
//   floatingWindow.style.overflow = 'auto';
//   floatingWindow.style.color = 'black';

//   floatingWindow.innerHTML = `
//     <div style="display:flex;justify-content:space-between;align-items:center;">
//       <h3>LeetGrow Panel</h3>
//       <button id="closeFloatingWindow">X</button>
//     </div>
//     <div id="floatingContent">
//       <button id="scrapeBtn">Scrape</button>
//       <button id="testcasesBtn">TestCases</button>
//       <button id="thinkTestcasesBtn">Think TestCases</button>
//       <button id="analyzeBtn">Analyze</button>
//       <button id="hintBtn">Hint</button>
//       <pre id="output" style="white-space:pre-wrap;margin-top:10px;"></pre>
//     </div>
//   `;

//   document.body.appendChild(floatingWindow);

//   document.getElementById('closeFloatingWindow').addEventListener('click', () => {
//     floatingWindow.remove();
//     floatingWindow = null;
//   });

//   // Add your scrape logic
//   document.getElementById('scrapeBtn').addEventListener('click', scrapeLeetCodeData);
//   document.getElementById('testcasesBtn').addEventListener('click', generateTestCases);
//   document.getElementById('analyzeBtn').addEventListener('click', analyzeCode);
//   document.getElementById('hintBtn').addEventListener('click', approachHintGeneration);
// }
