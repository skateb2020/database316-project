//ONLY WORK ON CHATBOT IN HERE ONLY
/**
 * 
 * Need to use this function as a model but have the parameter be the user question and change the systemprompt to be appropriate and change the prompt in the try.
 * need to add .env to backend folder (API keys - in google doc)
 * Need to have some kind of user input and store the user input in a variable and when the user sends their question, you send the input as a parameter in the function.
 * 
 * 
 * const compareCourses = async (course1, course2) => {
    const systemPrompt = `Based on the names and descriptions of these 2 courses at Duke University, clearly explain the similarities and differences in individual bulleted lists. Make sure to return a comparison of the AOKs (Areas of Knowledge) and MODs (Modes of Inquiry). Also, include which careers/jobs both classes would prepare an undergraduate student for best. Return the response as a JSON object with no additional text or explanation. The key should be called "comparison" and the value should be the comparison between the 2 courses. Call the separate keys within comparision the following: "Similarities," "Differences," "Areas of Knowledge," "Modes of Inquiry," and "Career Preparations."`;

    try {
      const result = await fetch('http://localhost:3001/api/openai', {
        method: 'POST',
        body: JSON.stringify({
          systemPrompt,
          prompt: `Compare these two courses: ${JSON.stringify(course1)} and ${JSON.stringify(course2)}`
        }),
        headers: { 'Content-Type': 'application/json' }
      });
      const data = await result.json();
      return data.choices?.[0]?.message?.content || '';
    } catch (e) {
      console.error("Error comparing courses:", e);
      return '';
    }
  }
 * 
 */


export default function ChatbotScreen() {
  return <div>Chatbot</div>
}
