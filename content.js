// import {showToast} from './toastError.js';   not works ??

function injectToastStyles() {
  if (document.getElementById("custom-toast-style")) return; // avoid duplicates

  const style = document.createElement("style");
  style.id = "custom-toast-style";
  style.textContent = `
    .toast-container {
      position: fixed;
      bottom: 30px;
      right: 20px;
      z-index: 9999;
      display: flex;
      flex-direction: column;
      gap: 10px;
    }

    .toast {
      background: rgba(0, 0, 0, 0.85);
      color: #fff;
      padding: 10px 16px;
      border-radius: 6px;
      font-size: 14px;
      box-shadow: 0 4px 8px rgba(0,0,0,0.2);
      animation: fadein 0.3s, fadeout 0.3s ease-out 2.7s;
    }

    @keyframes fadein {
      from { opacity: 0; transform: translateY(20px); }
      to { opacity: 1; transform: translateY(0); }
    }

    @keyframes fadeout {
      from { opacity: 1; transform: translateY(0); }
      to { opacity: 0; transform: translateY(20px); }
    }
  `;
  document.head.appendChild(style);
}

function showToast(message, duration = 3000) {
  injectToastStyles();

  let container = document.querySelector(".toast-container");
  if (!container) {
    container = document.createElement("div");
    container.className = "toast-container";
    document.body.appendChild(container);
  }

  const toast = document.createElement("div");
  toast.className = "toast";
  toast.innerText = message;

  container.appendChild(toast);

  setTimeout(() => {
    toast.remove();
    if (container.childElementCount === 0) {
      container.remove();
    }
  }, duration);
}

const leetCodeData = {
  title: null,
  content: null,
  code: null,
  testcases: null,
  hints: null,
  thinkTestCases: null,
};

console.log(
  "Extracting full LeetCode question content and code editor content..."
);

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
    showToast("⚠️ Title not found.");
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

// function to call all scrape leetcode data
function scrapeLeetCodeData() {
  extractQuestionTitle();
  extractFullQuestionContent();
  leetCodeData.code = null; // <-- clear old code
  leetCodeData.testcases = null; // <-- clear old code
  leetCodeData.hints = null; // <-- clear old code
  leetCodeData.thinkTestCases = null; // <-- clear old code

  if (leetCodeData.title) {
    const outputHTML = `
    <div class="output-box" style="padding:3px; color:yellow; margin-bottom:10px;" >
        <div style="font-weight:800">Question Title: </div>
      <div>${leetCodeData.title} </div>
    </div>
  `;

    document.getElementById("output").innerHTML = outputHTML;
  }
}

function generateTestCases() {
  const temp = document.createElement("div");
  temp.style.color = "White";
  temp.style.marginLeft = "10px";

  if (!leetCodeData.content) {
    // const txt="Please scrape the question first!";
    // temp.textContent=txt;
    // document.getElementById("output").appendChild(temp);
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
      },
    },
    (response) => {
      const { testCases } = response || {};
      output.removeChild(temp);
      if (testCases) {
        // Create parent container (styled similar to "Thinking of Test Cases")
        const TestCasecontainer = document.createElement("div");
        TestCasecontainer.style.padding = "10px";
        TestCasecontainer.style.border = "1px solid #ccc";
        TestCasecontainer.style.borderRadius = "8px";

        // Add heading
        const heading = document.createElement("h3");
        heading.textContent = "Test Cases";
        heading.style.marginBottom = "15px";
        heading.style.color = "white";
        heading.style.fontFamily = "Arial, sans-serif";
        TestCasecontainer.appendChild(heading);

        // Create the wrapper div for test cases (with white background and border radius)
        const testCasesDiv = document.createElement("div");
        testCasesDiv.style.backgroundColor = "white";
        testCasesDiv.style.borderRadius = "8px";
        testCasesDiv.style.padding = "15px";
        testCasesDiv.style.marginBottom = "15px";

        const pre = document.createElement("pre");
        pre.textContent = testCases;
        pre.style.color = "black";
        testCasesDiv.appendChild(pre);

        TestCasecontainer.appendChild(testCasesDiv);

        output.appendChild(TestCasecontainer);

        leetCodeData.testcases = testCases;
      } else {
        alert("Failed to generate testcases.");
      }
    }
  );
}

async function analyzeCode() {
  const temp = document.createElement("div");
  temp.style.color = "White";
  temp.style.marginLeft = "10px";

  if (!leetCodeData.content) {
    alert("Please scrape the question first!");
    return;
  }

  const output = document.getElementById("output");

  const analyzeContainer = output.getElementsByClassName(
    "analyzeCodeContainer"
  )[0];
  if (analyzeContainer) {
    output.removeChild(analyzeContainer);
  }

  try {
    const codeContent = await extractEditorContent();
    leetCodeData.code = codeContent;
    const txt = "Analyzing your code...";
    temp.textContent = txt;
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

        if (parsed) {
          // Create parent container
          const analyzeCodeContainer = document.createElement("div");
          analyzeCodeContainer.className = "analyzeCodeContainer";
          analyzeCodeContainer.style.padding = "10px";
          analyzeCodeContainer.style.border = "1px solid #ccc";
          analyzeCodeContainer.style.borderRadius = "8px";

          // Add heading
          const heading = document.createElement("h3");
          heading.textContent = "Issues and Solutions";
          heading.style.marginBottom = "15px";
          heading.style.color = "white";
          heading.style.fontFamily = "Arial, sans-serif";
          analyzeCodeContainer.appendChild(heading);

          parsed.forEach((issue, index) => {
            // Outer accordion for each issue
            const outerAccordion = document.createElement("div");
            outerAccordion.style.marginBottom = "12px";
            outerAccordion.style.border = "1px solid #ccc";
            outerAccordion.style.borderRadius = "6px";
            outerAccordion.style.overflow = "hidden";

            const issueHeader = document.createElement("button");
            issueHeader.textContent = issue.issueHeading;
            issueHeader.style.width = "100%";
            issueHeader.style.textAlign = "left";
            issueHeader.style.padding = "10px";
            issueHeader.style.backgroundColor = "blue";
            issueHeader.style.color = "white";
            issueHeader.style.border = "none";
            issueHeader.style.cursor = "pointer";
            issueHeader.style.fontWeight = "bold";

            const issueContent = document.createElement("div");
            issueContent.style.display = "none";
            issueContent.style.padding = "10px";
            issueContent.style.backgroundColor = "#f9f9f9";

            // Issue Detail
            const detailPara = document.createElement("p");
            detailPara.textContent = issue.detail;
            detailPara.style.marginBottom = "10px";
            issueContent.appendChild(detailPara);

            // Inner accordion for solution
            const solutionAccordion = document.createElement("div");
            solutionAccordion.style.border = "1px solid #ddd";
            solutionAccordion.style.borderRadius = "4px";

            const solutionHeader = document.createElement("button");
            solutionHeader.textContent = "Show Solution";
            solutionHeader.style.width = "100%";
            solutionHeader.style.textAlign = "left";
            solutionHeader.style.padding = "8px";
            solutionHeader.style.backgroundColor = "#555";
            solutionHeader.style.color = "white";
            solutionHeader.style.border = "none";
            solutionHeader.style.cursor = "pointer";
            solutionHeader.style.fontWeight = "600";

            const solutionContent = document.createElement("div");
            solutionContent.style.display = "none";
            solutionContent.style.padding = "8px";
            solutionContent.style.backgroundColor = "#eee";
            solutionContent.style.color = "#333";
            solutionContent.textContent = issue.solution;

            // Toggle solution display
            solutionHeader.addEventListener("click", () => {
              solutionContent.style.display =
                solutionContent.style.display === "none" ? "block" : "none";
            });

            solutionAccordion.appendChild(solutionHeader);
            solutionAccordion.appendChild(solutionContent);

            // Append inner solution accordion to issueContent
            issueContent.appendChild(solutionAccordion);

            // Toggle issue display
            issueHeader.addEventListener("click", () => {
              issueContent.style.display =
                issueContent.style.display === "none" ? "block" : "none";
            });

            // Final assembly
            outerAccordion.appendChild(issueHeader);
            outerAccordion.appendChild(issueContent);
            analyzeCodeContainer.appendChild(outerAccordion);
            output.appendChild(analyzeCodeContainer);
          });
        } else {
          alert("Failed to analyze code.");
        }
      }
    );
  } catch (error) {
    document.getElementById("output").innerText =
      "Error extracting code: " + error;
  }
}

function approachHintGeneration() {
  const temp = document.createElement("div");
  temp.style.color = "White";
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
        // Create parent container
        const approachHintContainer = document.createElement("div");
        approachHintContainer.style.padding = "10px";
        approachHintContainer.style.border = "1px solid #ccc";
        approachHintContainer.style.borderRadius = "8px";

        // Add heading
        const heading = document.createElement("h3");
        heading.textContent = "Hints";
        heading.style.marginBottom = "15px";
        heading.style.color = "white";
        heading.style.fontFamily = "Arial, sans-serif";
        approachHintContainer.appendChild(heading);

        // Extract hints using regex
        const hints = approachHint
          .trim()
          .split("\n")
          .filter((line) => /^Hint\s*\d+:/.test(line.trim()));

        hints.forEach((hintText, index) => {
          // Create accordion container (individual hint box)
          const accordionItem = document.createElement("div");
          accordionItem.style.marginBottom = "8px";
          accordionItem.style.border = "1px solid #ccc";
          accordionItem.style.borderRadius = "5px";
          accordionItem.style.overflow = "hidden";

          // Create header button
          const header = document.createElement("button");
          header.textContent = `Hint ${index + 1}`;
          header.style.width = "100%";
          header.style.textAlign = "left";
          header.style.padding = "10px";
          header.style.backgroundColor = "blue";
          header.style.color = "white";
          header.style.border = "none";
          header.style.cursor = "pointer";
          header.style.fontWeight = "bold";

          // Create content container
          const content = document.createElement("div");
          const parts = hintText.split(":");
          content.textContent =
            parts.length > 1 ? parts.slice(1).join(":").trim() : hintText;

          content.style.padding = "10px";
          content.style.display = "none";
          content.style.backgroundColor = "#f4f4f4";
          content.style.color = "#333";

          // Toggle display on click
          header.addEventListener("click", () => {
            content.style.display =
              content.style.display === "none" ? "block" : "none";
          });

          accordionItem.appendChild(header);
          accordionItem.appendChild(content);
          approachHintContainer.appendChild(accordionItem);
        });

        // Append the whole container to output
        output.appendChild(approachHintContainer);
        leetCodeData.hints = approachHint;
      } else {
        alert("Failed to generate approach hints.");
      }
    }
  );
}

function generateThinkTestCases() {
  const temp = document.createElement("div");
  temp.style.color = "White";
  temp.style.marginLeft = "10px";

  if (!leetCodeData.content) {
    alert("Please scrape the question first!");
    return;
  }
  if (leetCodeData.thinkTestCases) {
    alert("Think testcases already generated");
    return;
  }

  const txt = "Generating think testcases.....";
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
        // Create parent container
        const thinkTestCaseContainer = document.createElement("div");
        thinkTestCaseContainer.style.padding = "10px";
        thinkTestCaseContainer.style.border = "1px solid #ccc";
        thinkTestCaseContainer.style.borderRadius = "8px";

        // Add heading
        const heading = document.createElement("h3");
        heading.textContent = "Thinking of Test Cases";
        heading.style.marginBottom = "15px";
        heading.style.color = "white";
        heading.style.fontFamily = "Arial, sans-serif";
        thinkTestCaseContainer.appendChild(heading);

        // Split into individual test cases
        const cases = thinkTestCases.trim().split("\n");

        cases.forEach((testCase) => {
          const testCaseDiv = document.createElement("div");
          testCaseDiv.textContent = testCase;
          testCaseDiv.style.marginBottom = "10px";
          testCaseDiv.style.padding = "8px";
          testCaseDiv.style.backgroundColor = "#ffffff";
          testCaseDiv.style.border = "1px solid #ddd";
          testCaseDiv.style.borderRadius = "5px";
          testCaseDiv.style.boxShadow = "0 1px 3px rgba(0,0,0,0.05)";
          thinkTestCaseContainer.appendChild(testCaseDiv);
        });

        // Append container to output
        output.appendChild(thinkTestCaseContainer);
        leetCodeData.thinkTestCases = thinkTestCases;
      } else {
        alert("Failed to generate think testcases.");
      }
    }
  );
}

// function generateFullCode(){

//   const temp=document.createElement('div');
//   temp.style.color="White";
//   temp.style.marginLeft="10px";

//   if (!leetCodeData.content) {
//     alert( "Please scrape the question first!");
//     return;
//   }

//   const txt="Generating full code....."
//   temp.textContent=txt;
//   const output = document.getElementById('output');

//   output.appendChild(temp);

//   chrome.runtime.sendMessage(
//     {
//       action: "generateFullCode",
//       payload: {
//         content: leetCodeData.content,

//       }
//     },
//   )

// }

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

    floatingWindow.innerHTML = `
  <div id="floatingHeader" style="cursor:move;padding:10px;background:#f0f0f0;border-bottom:1px solid #ccc;display:flex;justify-content:space-between;align-items:center; background-color:black;">
    <h3 style="margin:0 ;color: white;">LeetGrow Panel</h3>
    <button id="closeFloatingWindow" style="margin-left:auto;background:#e74c3c;color:white;border:none;padding:5px 10px;border-radius:4px;cursor:pointer;">X</button>
  </div>
  <div id="floatingContent" style="padding:2px; background-color:orange">
    <button class="floating-btn" id="scrapeBtn">Scrape</button>
    <button class="floating-btn" id="hintBtn">Hint</button>
    <button class="floating-btn" id="testcasesBtn">TestCases</button>
    <button class="floating-btn" id="thinkTestcasesBtn">Think TestCases</button>
    <button class="floating-btn" id="analyzeBtn">Analyze</button>
    <button class="floating-btn" id="completeCode">Full Code</button>

  </div>
  <div style="background-color:; padding:1px; margin-top:10px" id="output"  >

    </div>
`;

    const style = document.createElement("style");
    style.innerHTML = `
  .floating-btn {
    margin: 5px;
    padding: 8px 14px;
    background-color: #3498db;
    color: white;
    border: 1px solid #2980b9;
    border-radius: 5px;
    cursor: pointer;
    transition: background 0.2s ease;
  }
  .floating-btn:hover {
    background-color: #2980b9;
  }
`;
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
