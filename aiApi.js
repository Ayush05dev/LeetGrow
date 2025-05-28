
 /*// export async function sendToGeminiAPI(prompt) {
//   const apiKey = "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"
//   // "AIzaSyBiPC08Y9E6V3nT4JHYkzvcU-dDLa44NrA";
//   //  "AIzaSyC3gej8bMpUrfkl8Q640lWhY9MDFTFlprU";
//   // "AIzaSyAAWU4uS4A-oab9F7n5V0dSdmHexCH3AVo"; // Replace with your real key
//   const apiUrl = `https://generativelanguage.googleapis.com/v1beta/models/gemini-1.5-pro:generateContent?key=${apiKey}`;

//   try {
//     const response = await fetch(apiUrl, {
//       method: "POST",
//       headers: {
//         "Content-Type": "application/json",
//       },
//       body: JSON.stringify({
//         contents: [
//           {
//             parts: [{ text: prompt }],
//           },
//         ],
//       }),
//     });

//     const data = await response.json();

//     if (data.error) {
//       console.error("Gemini API Error:", data.error);
//       return "Gemini API error: " + data.error.message;
//     }

//     const aiAnswer = data.candidates?.[0]?.content?.parts?.[0]?.text?.trim();
//     return aiAnswer;
//   } catch (error) {
//     console.error("Error calling Gemini API:", error);
//     return "Error occurred!";
//   }
// }

*/



export async function sendToGeminiAPI(prompt) {
  const apiKey = "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"; 
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
        model: "google/gemma-3n-e4b-it:free", // Or try "anthropic/claude-3-haiku"
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


export async function sendTestcasePromptToGeminiAPI(questionContent) {
  const prompt = `Given the following LeetCode problem description:
  ${questionContent}
  
  Your task is to deeply analyze the problem and generate **eight test cases** that cover all edge cases and verify the correctness of the solution.
  
  Only output the test case inputs, each input on a new line, exactly in the following format:
  
  Example 1:
  Input: nums = [1,3,2,3,3], k = 2
  Input: nums = [1,4,2,1], k = 3
  
  Output format:
  [1,3,2,3,3]
  2
  [1,4,2,1]
  3
  
  Example 2:
  Input: nums1 = [1,2,2,1], nums2 = [2,2], k = 3, m = 6
  Input: nums1 = [4,9,5], nums2 = [9,4,9,8,4], k = 5, n = 8
  
  Output format:
  [1,2,2,1]
  [2,2]
  3
  6
  [4,9,5]
  [9,4,9,8,4]
  5
  8
  
  Only follow this exact output style with no additional explanation or formatting.`;

  // your existing function that calls Gemini API
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
