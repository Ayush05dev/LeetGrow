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
  leetCodeData.code = null; 
  leetCodeData.testcases = null; 
  leetCodeData.hints = null; 
  leetCodeData.thinkTestCases = null; 
  leetCodeData.language = null; 
  

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
