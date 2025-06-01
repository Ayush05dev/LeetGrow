import {API_KEY} from './config.js'

export async function sendToGeminiAPI(prompt) {
  const apiKey = API_KEY; 
  const apiUrl = "https://openrouter.ai/api/v1/chat/completions";

  try {
    const response = await fetch(apiUrl, {
      method: "POST",
      headers: {
        "Authorization": `Bearer ${apiKey}`,
        "Content-Type": "application/json",
        "X-Title": "LeetGrow Title", // Optional title for usage tracking
      },
      body: JSON.stringify({
        model: "google/gemma-3n-e4b-it:free",
        messages: [
          {
            role: "user",
            content: prompt
          }
        ]
      }),
    });

    const data = await response.json();

    if (data.error) {
      console.error("OpenRouter API Error:", data.error);
      return "OpenRouter API error: " + data.error.message;
    }

    const aiAnswer = data.choices?.[0]?.message?.content?.trim();
    return aiAnswer;
  } catch (error) {
    console.error("Error calling OpenRouter API:", error);
    return "Error occurred!";
  }
}


export async function sendTestcasePromptToGeminiAPI(questionContent,givenTestcases) {
 /* // const prompt = `Given the following LeetCode problem description:
  // ${questionContent}
  
  // Your task is to deeply analyze the problem and generate **eight test cases** that cover all edge cases and verify the correctness of the solution.
  
  // Only output the test case inputs, each input on a new line, exactly in the following format:
  
  // Example 1:
  // Input: nums = [1,3,2,3,3], k = 2
  // Input: nums = [1,4,2,1], k = 3
  
  // Output format:
  // [1,3,2,3,3]
  // 2
  // [1,4,2,1]
  // 3
  
  // Example 2:
  // Input: nums1 = [1,2,2,1], nums2 = [2,2], k = 3, m = 6
  // Input: nums1 = [4,9,5], nums2 = [9,4,9,8,4], k = 5, n = 8
  
  // Output format:
  // [1,2,2,1]
  // [2,2]
  // 3
  // 6
  // [4,9,5]
  // [9,4,9,8,4]
  // 5
  // 8
  
  // Only follow this exact output style with no additional explanation or formatting.`;

  // your existing function that calls Gemini API
  */
 
  /*const prompt = `You are given a LeetCode-style problem:
  
${questionContent}

Your task is to deeply analyze the problem and generate **exactly eight (8) test cases** that cover all possible edge cases and verify the correctness of a solution.

🚨 VERY IMPORTANT 🚨: Only output **the test case inputs**, one **value per line**, and **strictly follow the exact format and order shown below**. 

🔒 DO NOT include any explanation or extra formatting.  
🔒 DO NOT put multiple values in a single line.  
🔒 DO NOT add quotation marks, variable names, or labels like "Input:"

---

🧪 Format Instructions:

- If the problem input has variables like:  
  \`nums = [1,3,2,3,3]\`, \`k = 2\`  
  then output should be:
  \`\`\`
  [1,3,2,3,3]
  2
  \`\`\`

- If input has more than one array and multiple values like:  
  \`nums1 = [1,2,2,1]\`, \`nums2 = [2,2]\`, \`k = 3\`, \`m = 6\`  
  then output should be:
  \`\`\`
  [1,2,2,1]
  [2,2]
  3
  6
  \`\`\`

---

✅ Example Output (Follow This Order Exactly):

Example 1 (2 test cases):
\`\`\`
[1,3,2,3,3]
2
[1,4,2,1]
3
\`\`\`

Example 2 (2 test cases):
\`\`\`
[1,2,2,1]
[2,2]
3
6
[4,9,5]
[9,4,9,8,4]
5
8
\`\`\`

---

⚠️ Summary of Output Rules:
- Only raw input values, **one per line**.
- Maintain the **same order of inputs** as shown in the problem description.
- No headings, labels, or explanations.
- Use **exact array syntax** like \`[1,2,3]\` and numbers like \`5\`.

Now, using this format and the given problem, generate 8 test case inputs.
`;*/

 
 /* const prompt = `You are given a LeetCode-style problem.

📘 Problem Description:
${questionContent}

---

🔎 Test Case Format Context:
The examples given in the above problem description include test case **input formats**. Below is the **actual format** used in those examples:

${givenTestcases}

Use the **structure, style, and input ordering** of the examples above as a reference. You must analyze and follow this exact formatting when creating new test cases.

---

🎯 Your Task:
Generate exactly **eight (8)** new test case inputs that:
- Fully test the problem across all edge cases and conditions.
- Strictly follow the **exact same input structure and order** as shown in the examples.
- Help validate the correctness and robustness of any solution.

---

⚠️ Output Rules – Follow These STRICTLY:

✅ Output:
- Only raw test **input values**, one **value per line**.
- Respect the **same input order** as in the given examples.
- Use standard JSON-like syntax: arrays as \`[1,2,3]\`, numbers as \`5\`, strings as \`"abc"\` (only if shown in examples).

⛔ DO NOT:
- Add labels like "Input:" or "Example:"
- Include any extra explanation or text.
- Put multiple values on a single line.
- Add quotes unless they appear in the given examples.

---

✅ Example (format derived from given examples):

If the given examples above look like:
\`\`\`
[1,2,3]
5
[4,5,6]
2
\`\`\`

Then your generated test cases must follow this same structure exactly.

---

Now, based on the problem and using the example format above as a template, generate **eight complete test case inputs**.
`;
*/

console.log("Given TestCases Format :", givenTestcases);
  const prompt = `You are given a LeetCode-style problem:

${questionContent}

The original problem statement shows sample test cases and below i am providing how they actually looks in the format so with this similar format generate more(8) testcases. (each input element on its own line, with no commas separating test cases):

\`\`\`
${givenTestcases}
\`\`\`

⚠️ Notice:
- For ech input inside a single tetscases there should be different line for different variables to be input like if there is one 2d array and 2 1d array then there should be 3 lines one line for input of 2d array then no comma direct next line then input fist 1d array then in next line another 1d array and like that.
- Lets take another exmaple in which two integer variables input and one 2d array then in that case according to question which one comes first array or integer variable take input of that and then in next line (no comma in previous line ) take remain array of variable input and then similarly in next line remainig variable or array input.
- **Each array or number is on its own line.**  
- **There are NO commas between separate test cases.**  
- Once one test case finishes (after its last line), the very next line begins the next test case.

---

🎯 Your task:
Generate **exactly eight (8)** new test case **inputs** that:
1. Cover **all** edge cases and typical scenarios.
2. Follow **exactly** the same **line-by-line** structure as above.
3. Do **NOT** include any labels, commas, or extra formatting—just raw arrays/numbers, one per line.

---

✅ Example (from above):
\`\`\`
[1,2,2,1]
[2,2]
3
6
[4,9,5]
[9,4,9,8,4]
5
8
\`\`\`
Here there are **two** complete test cases (4 lines each), back-to-back.

---

Now, based on the problem and using that exact format, output **8** test cases (each test case’s values on separate lines, and no commas between test‐cases).`;



  return sendToGeminiAPI(prompt);
}

export async function sendAnalyzeCodeToGeminiAPI(content, code) {
  const prompt = `
Given the following LeetCode problem description and the submitted solution:

--- Problem Description ---
${content}

--- Submitted Code ---
${code}

Your tasks:
1. Analyze whether the code solves the problem correctly.
2. Identify logical errors, edge cases missed, or bugs.
3. Suggest improvements and fixes.
4. If applicable, include a corrected version of the code.

📌 Important: Return the output strictly as a JSON array of issues in the following format (no explanation or text before/after the JSON):

[
{
  "issueHeading": "Brief title of the issue",
  "detail": "Detailed explanation of the issue, e.g., what's wrong or missing.",
  "solution": "Suggestion to fix the issue or improve the code."
},
{
  "issueHeading": "Another issue",
  "detail": "Explanation of the second issue.",
  "solution": "How to resolve or improve it."
}
]

✅ Example:

[
{
  "issueHeading": "Fails for empty input",
  "detail": "The code does not handle the case when the input array is empty, which may lead to runtime errors.",
  "solution": "Add a condition to check if the array is empty at the beginning of the function."
},
{
  "issueHeading": "Inefficient loop structure",
  "detail": "The nested loop causes O(n^2) complexity which is not optimal for large inputs.",
  "solution": "Use a hash map to reduce the time complexity to O(n)."
}
]

Return only the JSON, no markdown formatting, headers, or additional explanation.`;

  return sendToGeminiAPI(prompt);
}

export async function sendApproachHintPromptToGeminiAPI(content) {
  const prompt = `Given the following LeetCode problem description :
  ${content}
  Your task is to generate 4 to 5 hints of approaches to solve this question. Output the hints like the below example.
  Example:
  "
  Hint 1: Try using a hashmap.
  Hint 2: Think about two-pointers.
  Hint 3: Consider edge cases.
  "
  `;
  return sendToGeminiAPI(prompt);
}

export async function sendThinkTestcasesPromptToGeminiAPI(content) {
  const prompt = `Given the following LeetCode problem description:
  ${content}
  
  Your task is to deeply analyze the problem and generate five unique "thinkings" that describe different test cases. These test cases should cover all possible edge cases and help in verifying the correctness of the solution.
  
  Present the output in the following format, just like this example:
  "
  1: If the list has no nodes (head is null), it should safely return no cycle.
  2: A list with just one node that does not point to itself.
  3: A list with one node that points to itself (i.e., head.next = head).
  4: A standard linked list with multiple nodes and no cycle (last node points to null).
  5: A cycle formed by connecting the last node back to the head.
  "
  Only output the numbered thinking statements, without explanations or extra formatting.`;

  return sendToGeminiAPI(prompt);
}

export async function sendFullCodePromptToGeminiAPI(content, lang, code){

const prompt =`Given the following LeetCode problem description :
  ${content}
  By deeply analyze your task is to generate full code in language :${lang} and use the format of class and function name which is same as leetcode format from this code  :${code} . Provide correct code, explanatory with comments. 
  `

  return sendToGeminiAPI(prompt);

}
