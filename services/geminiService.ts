import { GoogleGenAI, Type, Schema } from "@google/genai";
import { SentimentAnalysisResult } from "../types";

const apiKey = process.env.API_KEY;

if (!apiKey) {
  console.error("API_KEY is missing from environment variables");
}

const ai = new GoogleGenAI({ apiKey: apiKey || 'dummy-key' });

export const analyzeTextSentiment = async (text: string): Promise<SentimentAnalysisResult> => {
  const modelId = "gemini-3-flash-preview";

  const responseSchema: Schema = {
    type: Type.OBJECT,
    properties: {
      overallScore: {
        type: Type.INTEGER,
        description: "总体情绪得分，整数，范围从 -100（极度消极）到 100（极度积极）。",
      },
      sentimentLabel: {
        type: Type.STRING,
        description: "简短的情绪标签（例如：积极、中性、消极）。必须使用简体中文。",
      },
      emotionalTone: {
        type: Type.STRING,
        description: "主要情绪基调（例如：愤怒、快乐、专业、讽刺）。必须使用简体中文。",
      },
      authorStance: {
        type: Type.STRING,
        description: "推测作者的立场或身份（例如：'不满的客户'、'中立观察者'、'狂热支持者'）。必须使用简体中文。",
      },
      coreIntent: {
        type: Type.STRING,
        description: "作者的核心意图或诉求（例如：'寻求退款'、'表达感谢'、'提出建议'）。必须使用简体中文。",
      },
      summary: {
        type: Type.STRING,
        description: "对文本内容的简明摘要。无论原文为何种语言，必须使用简体中文。",
      },
      positiveKeyPoints: {
        type: Type.ARRAY,
        items: { type: Type.STRING },
        description: "文本中提到的关键积极方面或观点列表。必须使用简体中文。",
      },
      negativeKeyPoints: {
        type: Type.ARRAY,
        items: { type: Type.STRING },
        description: "文本中提到的关键消极方面或观点列表。必须使用简体中文。",
      },
      suggestedResponse: {
        type: Type.STRING,
        description: "根据情绪得分生成一段得体、专业的回复建议。必须使用简体中文。",
      },
      timeline: {
        type: Type.ARRAY,
        description: "将文本分解为 10-20 个连续的逻辑片段，以显示情绪随时间的变化。",
        items: {
          type: Type.OBJECT,
          properties: {
            segmentSummary: { type: Type.STRING, description: "该文本片段的非常简短的 3-5 字标签。必须使用简体中文。" },
            score: { type: Type.INTEGER, description: "该特定片段的情绪得分（-100 到 100）。" },
          },
          required: ["segmentSummary", "score"],
        },
      },
      politicalAnalysis: {
        type: Type.OBJECT,
        description: "基础政治倾向分析 (8values)。",
        properties: {
          economic: {
            type: Type.OBJECT,
            properties: {
              leftScore: { type: Type.INTEGER, description: "平等 (Equality) 得分 0-100。" },
              rightScore: { type: Type.INTEGER, description: "市场 (Market) 得分 0-100。" },
              label: { type: Type.STRING, description: "中文标签。" }
            },
            required: ["leftScore", "rightScore", "label"]
          },
          diplomatic: {
            type: Type.OBJECT,
            properties: {
              leftScore: { type: Type.INTEGER, description: "国家 (Nation) 得分 0-100。" },
              rightScore: { type: Type.INTEGER, description: "世界 (World) 得分 0-100。" },
              label: { type: Type.STRING, description: "中文标签。" }
            },
            required: ["leftScore", "rightScore", "label"]
          },
          civil: {
            type: Type.OBJECT,
            properties: {
              leftScore: { type: Type.INTEGER, description: "自由 (Liberty) 得分 0-100。" },
              rightScore: { type: Type.INTEGER, description: "威权 (Authority) 得分 0-100。" },
              label: { type: Type.STRING, description: "中文标签。" }
            },
            required: ["leftScore", "rightScore", "label"]
          },
          societal: {
            type: Type.OBJECT,
            properties: {
              leftScore: { type: Type.INTEGER, description: "传统 (Tradition) 得分 0-100。" },
              rightScore: { type: Type.INTEGER, description: "进步 (Progress) 得分 0-100。" },
              label: { type: Type.STRING, description: "中文标签。" }
            },
            required: ["leftScore", "rightScore", "label"]
          },
          ideology: { type: Type.STRING, description: "最接近的政治意识形态名称。中文。" }
        },
        required: ["economic", "diplomatic", "civil", "societal", "ideology"]
      },
      extendedPoliticalAnalysis: {
        type: Type.OBJECT,
        description: "深度政治光谱分析 (LeftValues 风格)，包含7个维度。",
        properties: {
          revolution: {
            type: Type.OBJECT,
            properties: {
              leftScore: { type: Type.INTEGER, description: "革命 (Revolution) 得分 0-100。" },
              rightScore: { type: Type.INTEGER, description: "改良 (Reform) 得分 0-100。" },
              label: { type: Type.STRING, description: "中文标签。" }
            },
            required: ["leftScore", "rightScore", "label"]
          },
          scientific: {
            type: Type.OBJECT,
            properties: {
              leftScore: { type: Type.INTEGER, description: "科学 (Scientific) 得分 0-100。" },
              rightScore: { type: Type.INTEGER, description: "空想 (Utopian) 得分 0-100。" },
              label: { type: Type.STRING, description: "中文标签。" }
            },
            required: ["leftScore", "rightScore", "label"]
          },
          central: {
            type: Type.OBJECT,
            properties: {
              leftScore: { type: Type.INTEGER, description: "集权 (Centralization) 得分 0-100。" },
              rightScore: { type: Type.INTEGER, description: "分权 (Decentralization) 得分 0-100。" },
              label: { type: Type.STRING, description: "中文标签。" }
            },
            required: ["leftScore", "rightScore", "label"]
          },
          international: {
            type: Type.OBJECT,
            properties: {
              leftScore: { type: Type.INTEGER, description: "国际 (Internationalism) 得分 0-100。" },
              rightScore: { type: Type.INTEGER, description: "民族 (Nationalism) 得分 0-100。" },
              label: { type: Type.STRING, description: "中文标签。" }
            },
            required: ["leftScore", "rightScore", "label"]
          },
          party: {
            type: Type.OBJECT,
            properties: {
              leftScore: { type: Type.INTEGER, description: "党派 (Party) 得分 0-100。" },
              rightScore: { type: Type.INTEGER, description: "工会 (Union) 得分 0-100。" },
              label: { type: Type.STRING, description: "中文标签。" }
            },
            required: ["leftScore", "rightScore", "label"]
          },
          production: {
            type: Type.OBJECT,
            properties: {
              leftScore: { type: Type.INTEGER, description: "生产 (Production) 得分 0-100。" },
              rightScore: { type: Type.INTEGER, description: "生态 (Ecology) 得分 0-100。" },
              label: { type: Type.STRING, description: "中文标签。" }
            },
            required: ["leftScore", "rightScore", "label"]
          },
          conservative: {
            type: Type.OBJECT,
            properties: {
              leftScore: { type: Type.INTEGER, description: "保守 (Conservative) 得分 0-100。" },
              rightScore: { type: Type.INTEGER, description: "进步 (Progressive) 得分 0-100。" },
              label: { type: Type.STRING, description: "中文标签。" }
            },
            required: ["leftScore", "rightScore", "label"]
          },
          closestWorldParty: { type: Type.STRING, description: "世界上最符合该文本政治倾向的现实政党名称（例如：中国共产党、美国民主党、英国工党等）。必须使用简体中文。" },
          closestWorldPartyReason: { type: Type.STRING, description: "简短说明为什么匹配该政党。" }
        },
        required: ["revolution", "scientific", "central", "international", "party", "production", "conservative", "closestWorldParty", "closestWorldPartyReason"]
      }
    },
    required: ["overallScore", "sentimentLabel", "emotionalTone", "authorStance", "coreIntent", "summary", "positiveKeyPoints", "negativeKeyPoints", "suggestedResponse", "timeline", "politicalAnalysis", "extendedPoliticalAnalysis"],
  };

  try {
    const response = await ai.models.generateContent({
      model: modelId,
      contents: `请深入分析以下文本。无论原文是何种语言，所有返回的字段必须翻译并输出为简体中文。
      
      重点要求：
      1. 准确识别作者的立场和核心意图。
      2. 进行多维度的政治倾向分析（包含基础 8values 和深度 LeftValues 7轴分析）。即使文本看起来是非政治性的（如商业评论），也请尝试挖掘其潜在的价值观（如：支持市场 vs 支持监管，支持传统 vs 支持创新），如果完全无法判断，请保持中立（50/50）。
      3. 匹配一个现实世界中的政党。
      
      待分析文本：\n${text}`,
      config: {
        responseMimeType: "application/json",
        responseSchema: responseSchema,
      },
    });

    const jsonText = response.text;
    if (!jsonText) {
      throw new Error("No data returned from API");
    }

    return JSON.parse(jsonText) as SentimentAnalysisResult;
  } catch (error) {
    console.error("Gemini Analysis Error:", error);
    throw error;
  }
};