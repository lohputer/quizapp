import './App.css';
import 'bootstrap/dist/css/bootstrap.min.css';
import 'bootstrap/scss/bootstrap.scss';
import "/node_modules/bootstrap/dist/css/bootstrap.css";
import './custom.scss';
import { useEffect, useState } from 'react';
export default function App() {
  const [ content, setContent ] = useState("");
  const [ question, setQn ] = useState(-1);
  const [ seconds, setTime ] = useState(1800);
  const [ intervalId, setIntervalId ] = useState(null);
  const [ answers, setAnswers ] = useState(Array(50).fill(NaN));
  function answer(x) {
    setAnswers((list) => {
      const updatedList = [...list];
      updatedList[question] = x;
      return updatedList;
    });
  }
  useEffect(()=>{
    if (question !== -1) {
      if (intervalId) {
        clearInterval(intervalId);
      }
      var newIntervalId = setInterval(function() {
        setTime(prevTime => prevTime - 1);
        clearInterval(intervalId);
      }, 1000);
      setIntervalId(newIntervalId);
      (async function() {
        try {
          const response = await fetch(`${process.env.PUBLIC_URL}/questions.txt`);
          const data = await response.text(); 
          const questions = data.split("-end-\r\n");
          setTimeout(()=>{
            console.log(question, answers[question]);
            setContent(
              <>
                <h1 className="text-primary">{questions[question].split("\n")[0]}</h1>
                {questions[question].split("\n").length > 5 ? <img className="col-6" src={questions[question].split("\n")[5]} /> : ""}
                <div className="form-check p-4">
                  <label className="form-check-label" htmlFor={"q"+(question+1)} >
                    <input type="radio" className="form-check-input" name={"q"+(question+1)} onChange={()=>answer(1)} checked={answers[question] === 1 ? true : false} /> {questions[question].split("\n")[1]}
                  </label>
                  <br></br>
                  <label className="form-check-label" htmlFor={"q"+(question+1)} >
                    <input type="radio" className="form-check-input" name={"q"+(question+1)} onChange={()=>answer(2)} checked={answers[question] === 2 ? true : false}  /> {questions[question].split("\n")[2]}
                  </label>
                  <br></br>
                  <label className="form-check-label" htmlFor={"q"+(question+1)} >
                    <input type="radio" className="form-check-input" name={"q"+(question+1)} onChange={()=>answer(3)} checked={answers[question] === 3 ? true : false}  /> {questions[question].split("\n")[3]}
                  </label>
                  <br></br>
                  <label className="form-check-label" htmlFor={"q"+question} >
                    <input type="radio" className="form-check-input" name={"q"+(question+1)} onChange={()=>answer(4)} checked={answers[question] === 4 ? true : false} /> {questions[question].split("\n")[4]}
                  </label>
                </div>
                <p className={question !== 0 && "text-center"}>
                  {String(Math.floor(seconds / 3600)).padStart(2, '0')}:
                  {String(Math.floor((seconds - Math.floor(seconds / 3600) * 3600) / 60)).padStart(2, '0')}:
                  {String(seconds - Math.floor(seconds / 3600) * 3600 - Math.floor((seconds - Math.floor(seconds / 3600) * 3600) / 60) * 60).padStart(2, '0')}
                </p>
                <div className="row d-flex">
                  {question !== 0 && <button className="btn btn-primary col-5 m-auto" onClick={() => setQn(x => x-1)}>Previous</button>}
                  <button className={question !== 0 ? "btn btn-primary col-5 m-auto" : "btn btn-primary"} onClick={() => setQn(x => x+1)}>Next</button>
                </div>
              </>
            );
          }, 50);
        } catch (error) {
          console.log(error);
        }
      })();
    }
    return () => {
      if (intervalId) {
        clearInterval(intervalId);
      }
    };
  }, [question, seconds]);
  useEffect(()=>{
    if (question !== -1) {
      document.getElementById("quiz").style.transform = "rotate(360deg)";
      setTimeout(()=>{
        document.getElementById("quiz").style.transform = "none";
      }, 100);
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
