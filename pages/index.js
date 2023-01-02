import Head from "next/head";
import { useState } from "react";
import styles from "./index.module.css";

export default function Home() {
  const [questionInput, setQuestionInput] = useState("");
  const [questionOption, setQuestionOption] = useState("Normal Question");
  const [showHelper, setShowHelper] = useState(false);
  const [questionHelper, setQuestionHelper] = useState("English");
  const [result, setResult] = useState();

  const handleOptionChange = (event) => {
    // 👇 Get input value from "event"
    setQuestionOption(event.target.value);
    if(event.target.value == "Translate"){
      setShowHelper(true)
    } else {
      setShowHelper(false)
    }
  };

  async function onSubmit(event) {
    event.preventDefault();
    console.log(questionHelper)
    try {
      const response = await fetch("/api/generate", {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify({ option: questionOption, question: questionInput, helper: questionHelper }),
      });

      const data = await response.json();
      console.log(data)
      if (response.status !== 200) {
        throw data.error || new Error(`Request failed with status ${response.status}`);
      }
      setResult(data.result);
      //setQuestionInput("");
    } catch(error) {
      // Consider implementing your own error handling logic here
      console.error(error);
      alert(error.message);
    }
  }

  return (
    <div>
      <Head>
        <title>OpenAI Quickstart</title>
      </Head>

      <main className={styles.main}>
        <svg data-name="OpenAI Logo" width="24px" height="24px" viewBox="140 140 520 520"><defs><linearGradient id="linear" x1="100%" y1="22%" x2="0%" y2="78%"><stop offset="0%" stop-color="rgb(131,211,231)"></stop><stop offset="2%" stop-color="rgb(127,203,229)"></stop><stop offset="25%" stop-color="rgb(86,115,217)"></stop><stop offset="49%" stop-color="rgb(105,80,190)"></stop><stop offset="98%" stop-color="rgb(197,59,119)"></stop><stop offset="100%" stop-color="rgb(197,59,119)"></stop></linearGradient></defs><path id="logo" d="m617.24 354a126.36 126.36 0 0 0 -10.86-103.79 127.8 127.8 0 0 0 -137.65-61.32 126.36 126.36 0 0 0 -95.31-42.49 127.81 127.81 0 0 0 -121.92 88.49 126.4 126.4 0 0 0 -84.5 61.3 127.82 127.82 0 0 0 15.72 149.86 126.36 126.36 0 0 0 10.86 103.79 127.81 127.81 0 0 0 137.65 61.32 126.36 126.36 0 0 0 95.31 42.49 127.81 127.81 0 0 0 121.96-88.54 126.4 126.4 0 0 0 84.5-61.3 127.82 127.82 0 0 0 -15.76-149.81zm-190.66 266.49a94.79 94.79 0 0 1 -60.85-22c.77-.42 2.12-1.16 3-1.7l101-58.34a16.42 16.42 0 0 0 8.3-14.37v-142.39l42.69 24.65a1.52 1.52 0 0 1 .83 1.17v117.92a95.18 95.18 0 0 1 -94.97 95.06zm-204.24-87.23a94.74 94.74 0 0 1 -11.34-63.7c.75.45 2.06 1.25 3 1.79l101 58.34a16.44 16.44 0 0 0 16.59 0l123.31-71.2v49.3a1.53 1.53 0 0 1 -.61 1.31l-102.1 58.95a95.16 95.16 0 0 1 -129.85-34.79zm-26.57-220.49a94.71 94.71 0 0 1 49.48-41.68c0 .87-.05 2.41-.05 3.48v116.68a16.41 16.41 0 0 0 8.29 14.36l123.31 71.19-42.69 24.65a1.53 1.53 0 0 1 -1.44.13l-102.11-59a95.16 95.16 0 0 1 -34.79-129.81zm350.74 81.62-123.31-71.2 42.69-24.64a1.53 1.53 0 0 1 1.44-.13l102.11 58.95a95.08 95.08 0 0 1 -14.69 171.55c0-.88 0-2.42 0-3.49v-116.68a16.4 16.4 0 0 0 -8.24-14.36zm42.49-63.95c-.75-.46-2.06-1.25-3-1.79l-101-58.34a16.46 16.46 0 0 0 -16.59 0l-123.31 71.2v-49.3a1.53 1.53 0 0 1 .61-1.31l102.1-58.9a95.07 95.07 0 0 1 141.19 98.44zm-267.11 87.87-42.7-24.65a1.52 1.52 0 0 1 -.83-1.17v-117.92a95.07 95.07 0 0 1 155.9-73c-.77.42-2.11 1.16-3 1.7l-101 58.34a16.41 16.41 0 0 0 -8.3 14.36zm23.19-50 54.92-31.72 54.92 31.7v63.42l-54.92 31.7-54.92-31.7z" fill="#202123"></path></svg>
        <h3>Ask something to OpenAI</h3>
        <form onSubmit={onSubmit}>
        <select name="questOption" onChange={handleOptionChange}>
            <option value="Normal Question" {...questionOption=="Normal Question"?"selected": ""}>Normal Question</option>
            <option value="Chatbot" {...questionOption=="Chatbot"?"selected": ""}>Chatbot</option>
            <option value="Sarcastic Chatbot" {...questionOption=="Sarcastic Chatbot"?"selected": ""}>Sarcastic Chatbot</option>
            <option value="Ask for Name Suggestion" {...questionOption=="Ask for Name Suggestion"?"selected": ""}>Ask for Name Suggestion</option>
            <option value="Translate" {...questionOption=="Translate"?"selected": ""}>Translate</option>
            <option value="Generate Image" {...questionOption=="Generate Image"?"selected": ""}>Generate Image</option>
        </select>

        { showHelper ? <select name="helperOption" onChange={(e) => setQuestionHelper(e.target.value)}>
            <option value="English" {...questionHelper=="English"?"selected": ""}>English</option>
            <option value="Hindi" {...questionHelper=="Hindi"?"selected": ""}>Hindi</option>
            <option value="French" {...questionHelper=="French"?"selected": ""}>French</option>
            <option value="Spanish" {...questionHelper=="Spanish"?"selected": ""}>Spanish</option>
            <option value="Arabic" {...questionHelper=="Arabic"?"selected": ""}>Arabic</option>
        </select> : null }

          <input
            type="text"
            name="question"
            placeholder="Enter your question here"
            value={questionInput}
            onChange={(e) => setQuestionInput(e.target.value)}
          />
          <input type="submit" value="Generate answer" />
        </form>
        
        <div>{result}</div>

        { questionOption=="Generate Image" ? <img src={result} height={350} width={300} style={{marginTop: "10px"}}/> : null }
      </main>
    </div>
  );
}
