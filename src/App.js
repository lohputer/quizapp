import './App.css';
import 'bootstrap/dist/css/bootstrap.min.css';
import 'bootstrap/scss/bootstrap.scss';
import "/node_modules/bootstrap/dist/css/bootstrap.css";
import './custom.scss';
import { useEffect, useState } from 'react';
export default function App() {
  const [ content, setContent ] = useState("");
  const [ question, setQn ] = useState(-1);
  useEffect(()=>{
    if (question !== -1) {
      (async function() {
        try {
          const response = await fetch(`${process.env.PUBLIC_URL}/questions.txt`);
          const data = await response.text(); 
          const questions = data.split("\n-end-\n");
          document.getElementById("quiz").style.transform = "rotate(360deg)";
          setTimeout(()=>{
            setContent(
              <>
                <h1 className="text-primary">{questions[question].split("\n")[0]}</h1>
                <div className="form-check p-4 text-left">
                  <label className="form-check-label">
                    <input type="radio" className="form-check-input" name={question} value="1" /> {questions[question].split("\n")[1]}
                  </label>
                  <br></br>
                  <label className="form-check-label">
                    <input type="radio" className="form-check-input" name={question} value="2" /> {questions[question].split("\n")[2]}
                  </label>
                  <br></br>
                  <label className="form-check-label">
                    <input type="radio" className="form-check-input" name={question} value="3" /> {questions[question].split("\n")[3]}
                  </label>
                  <br></br>
                  <label className="form-check-label">
                    <input type="radio" className="form-check-input" name={question} value="4" /> {questions[question].split("\n")[4]}
                  </label>
                </div>
                {question !== 0 && <button className="btn btn-primary p-2" onClick={() => setQn(x => x-1)}>Previous Question</button>}
                <button className="btn btn-primary p-2" onClick={() => setQn(x => x+1)}>Next Question</button>
              </>
            );
          }, 50);
          console.log(question, questions);
        } catch (error) {
          console.log(error);
        }

      })();

    }
    
  }, [question]);
  return (
    <div className="App vh-100 vw-100 d-flex align-items-center justify-content-center">
      <div id="quiz" className="container col-8 m-auto p-4 bg-info text-center rounded shadow">
        {content === "" ?
          <>
          <h1 className="text-primary">A Fun Quiz</h1>
          <p>Hi yalls! I quite frankly have lost my coding skills after 2 months and need to get back at it. To <em>"celebrate"</em>, I made a <del>50</del> 49 MCQ quiz with random stuff. It's 30 minutes limit. For fun. Good luck :D also clicking the button makes your thing spin.</p>
          <h2 className="text-secondary">Range of topics</h2>
          <ul className="border border-primary list-group">
            <li className="list-group-item">basic english</li>
            <li className="list-group-item">random knowledge</li>
            <li className="list-group-item">maybe math?? and science??</li>
            <li className="list-group-item">a question with eighteen options for MCQ?!?!</li>
            <li className="list-group-item">statistics</li>
            <li className="list-group-item">i wrote this at 10.52pm at night and i have to wake up at 6.20am and im also planning to sleep at midnight only so pls excuse the god awful questions made</li>
          </ul>
          <br></br>
          <div className="form-group">
            <input className="text-center text-primary rounded shadow border border-primary p-2" type="text" placeholder="Type in your name (1m)" />
          </div>
          <br></br>
          <button className="btn btn-primary" onClick={() => setQn(0)}>Start Quiz</button>
          </>
        : content }
      </div>
    </div>
  );
}
