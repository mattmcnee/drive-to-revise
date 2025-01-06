import axios from "axios";
import { toast } from "react-toastify";
import { Question } from '../utils';

const validateInstructions = "You validate whether a user has understood a concept, returning either True or False.";
export const validateUserUnderstandsAsync = async (question : Question, input: string) => {

  const model = "gpt-4o-mini";
  const temperature = 0.3;
  const max_tokens = 500;

  const prompt = `The question is "${question.question}"
The user previously answered incorrectly with "${question.dummy}".

Now, the user has either:
- asked for help
- explained why "${question.answer}" is the correct answer
- explained why "${question.dummy}" is the incorrect answer

Their response is:
${input}

They may either explain why the correct answer is correct or why the incorrect answer is incorrect.
Be lenient with spelling and grammar errors.

If the explanation is incorrect, return: False
If repeats the correct answer with no further explanation, return: False
If an explanation is lacking, return: False
Only if the explanation is correct, return: True
If the user is asking for help, return: False`;

  const messages = [
    { role: "system", content: validateInstructions },
    { role: "user", content: prompt },
  ];

  try {
    const response = await axios.post(
      "/api/getChatCompletion",
      { model, temperature, max_tokens, messages },
      {
        headers: {
          "Content-Type": "application/json"
        }
      }
    );

    let message = response.data.message;
    const isValid = message.toLowerCase().replace('.', '').includes("true");

    if (!isValid) {
      message = "That's not quite right. Please try again.";
      if (message === "") return {valid: true, message: "AI currently unavailable"};
    }

    console.log(message);

    return {valid: isValid, message: message};
  } catch (error) {
    console.error("Error fetching chat completion:", error);
    toast.error("Failed to fetch questions");
    
    return {valid: true, message: "AI currently unavailable"};
  }
};



