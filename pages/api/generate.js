import { Configuration, OpenAIApi } from "openai";

const configuration = new Configuration({
  apiKey: process.env.OPENAI_API_KEY,
});
const openai = new OpenAIApi(configuration);

export default async function (req, res) {
  if (!configuration.apiKey) {
    res.status(500).json({
      error: {
        message: "OpenAI API key not configured, please follow instructions in README.md",
      }
    });
    return;
  }

  const question = req.body.question || '';
  const option = req.body.option || 'Normal Question'
  let helper = req.body.helper || null
  if(option.toLowerCase() == "translate" && helper == null) {
    res.status(400).json({
      error: {
        message: "Please select a valid language",
      }
    });
    return;
  }

  if (question.trim().length === 0) {
    res.status(400).json({
      error: {
        message: "Please enter a valid question",
      }
    });
    return;
  }

  try {

    if(option == "Generate Image") {
      const completion = await openai.createImage({
        //model: "text-davinci-003",
        prompt: question,
        n: 1,
        size: "1024x1024"
      })
      res.status(200).json({ result: completion.data.data[0].url });
    } else {
      const completion = await openai.createCompletion({
        model: "text-davinci-003",
        prompt: generatePrompt(option, question, helper),
        temperature: 0.6,
      })
      res.status(200).json({ result: completion.data.choices[0].text });
    }
  } catch(error) {
    // Consider adjusting the error handling logic for your use case
    if (error.response) {
      console.error(error.response.status, error.response.data);
      res.status(error.response.status).json(error.response.data);
    } else {
      console.error(`Error with OpenAI API request: ${error.message}`);
      res.status(500).json({
        error: {
          message: 'An error occurred during your request.',
        }
      });
    }
  }
}

function generatePrompt(option, question, helper) {
  switch(option) {
    case "Normal Question": return question
    case "Chatbot": return `The following is a conversation with an AI assistant. The assistant is helpful, creative, clever, and very friendly: 
                            Human: ${question}`
    case "Sarcastic Chatbot": return `The following is a conversation with an AI assistant. The assistant is reluctantly answers questions with sarcastic responses:
                            Human: ${question}`
    case "Ask for Name Suggestion": 
                            const capitalizedAnimal = question[0].toUpperCase() + question.slice(1).toLowerCase();
                            return `Suggest three names for an animal. 
                            Animal: ${capitalizedAnimal}`
    case "Translate": return `Translate this into ${helper}: ${question}`
    default:  return question
  }
}
