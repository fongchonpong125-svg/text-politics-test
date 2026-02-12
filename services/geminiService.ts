import { SentimentAnalysisResult } from "../types";

// Safely attempt to retrieve the API key.
const getApiKey = (): string | undefined => {
  try {
    return process.env.API_KEY;
  } catch (error) {
    console.warn("Unable to access process.env. API_KEY might be missing.");
    return undefined;
  }
};

const apiKey = getApiKey();

// Define the expected JSON structure for the prompt to ensure GLM follows it
const jsonStructure = `{
  "overallScore": number (-100 to 100),
  "sentimentLabel": string (e.g. "积极"),
  "emotionalTone": string,
  "authorStance": string,
  "coreIntent": string,
  "summary": string,
  "positiveKeyPoints": string[],
  "negativeKeyPoints": string[],
  "suggestedResponse": string,
  "timeline": [
    { "segmentSummary": string, "score": number }
  ],
  "politicalAnalysis": {
    "economic": { "leftScore": number, "rightScore": number, "label": string },
    "diplomatic": { "leftScore": number, "rightScore": number, "label": string },
    "civil": { "leftScore": number, "rightScore": number, "label": string },
    "societal": { "leftScore": number, "rightScore": number, "label": string },
    "ideology": string
  },
  "extendedPoliticalAnalysis": {
    "revolution": { "leftScore": number, "rightScore": number, "label": string },
    "scientific": { "leftScore": number, "rightScore": number, "label": string },
    "central": { "leftScore": number, "rightScore": number, "label": string },
    "international": { "leftScore": number, "rightScore": number, "label": string },
    "party": { "leftScore": number, "rightScore": number, "label": string },
    "production": { "leftScore": number, "rightScore": number, "label": string },
    "conservative": { "leftScore": number, "rightScore": number, "label": string },
    "closestWorldParty": string,
    "closestWorldPartyReason": string,
    "globalPercentage": number
  }
}`;

export const analyzeTextSentiment = async (text: string): Promise<SentimentAnalysisResult> => {
  // 1. Validation
  if (!apiKey) {
    throw new Error("未配置 API Key。请在环境变量中设置 API_KEY。");
  }

  // Zhipu keys usually contain a dot (id.secret)
  if (!apiKey.includes('.')) {
     console.warn("警告: 您输入的 Key 看起来不像智谱 AI 的 Key (通常格式为 id.secret)。");
  }

  // 2. Construct the Prompt
  // Zhipu works best with a clear system instruction and a user message.
  const systemPrompt = `你是一个高级文本情绪与政治倾向分析引擎。
请分析用户提供的文本。
无论原文是什么语言，结果中的所有文本字段**必须**翻译成**简体中文**。

你必须严格只返回有效的 JSON 格式，不要包含 markdown 代码块标记（如 \`\`\`json），不要包含任何额外的解释文字。

输出的 JSON 必须严格符合以下结构：
${jsonStructure}

关于政治分析的要求：
1. 即使是商业或日常文本，也要挖掘其潜在价值观（如：注重效率=市场派/科学派，注重情感=传统/社群）。
2. 如果完全无法判断，请保持中立（50/50）。
3. extendedPoliticalAnalysis 必须包含完整的 7 个维度 (LeftValues)。
4. closestWorldParty 必须是现实世界存在的政党名称。`;

  try {
    // 3. Call Zhipu AI API (OpenAI Compatible Endpoint)
    // Using the GLM-4-Flash model which is fast and cost-effective, or GLM-4 for higher quality
    const response = await fetch("https://open.bigmodel.cn/api/paas/v4/chat/completions", {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
        "Authorization": `Bearer ${apiKey}`
      },
      body: JSON.stringify({
        model: "glm-4-flash", // You can switch to "glm-4" for better reasoning if needed
        messages: [
          {
            role: "system",
            content: systemPrompt
          },
          {
            role: "user",
            content: text
          }
        ],
        temperature: 0.1, // Low temperature for consistent JSON output
        top_p: 0.7,
        max_tokens: 4096
      })
    });

    if (!response.ok) {
      const errorData = await response.json().catch(() => ({}));
      
      // Handle specific auth error
      if (response.status === 401) {
         throw new Error("API Key 无效或已过期 (401 Unauthorized)。请检查您的 API_KEY 是否正确配置。");
      }

      throw new Error(`智谱 API 请求失败: ${response.status} ${response.statusText} - ${JSON.stringify(errorData)}`);
    }

    const data = await response.json();
    
    // 4. Parse the response
    const content = data.choices?.[0]?.message?.content;
    
    if (!content) {
      throw new Error("API 返回内容为空");
    }

    // Clean up potential markdown formatting if the model adds it despite instructions
    const cleanJson = content.replace(/```json\n?|```/g, "").trim();

    try {
      return JSON.parse(cleanJson) as SentimentAnalysisResult;
    } catch (e) {
      console.error("JSON Parse Error:", e);
      console.log("Raw Content:", content);
      throw new Error("无法解析 AI 返回的数据格式，请重试。");
    }

  } catch (error: any) {
    console.error("Analysis Error:", error);
    throw new Error(error.message || "分析过程中发生未知错误");
  }
};