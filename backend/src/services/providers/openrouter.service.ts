import axios from "axios";

class OpenRouterService {
  async generateResponse(prompt: string): Promise<string> {
    try {
      const response = await axios.post(
        "https://openrouter.ai/api/v1/chat/completions",
        {
          model: "openai/gpt-oss-20b:free",
          messages: [
            {
              role: "user",
              content: prompt,
            },
          ],
        },
        {
          headers: {
            Authorization: `Bearer ${process.env.OPENROUTER_API_KEY}`,
            "Content-Type": "application/json",
          },
        }
      );

      return response.data.choices[0].message.content;
    } catch (error: any) {
      console.error(error.response?.data || error.message);
      throw new Error("Failed to generate AI response.");
    }
  }
}

export default new OpenRouterService();