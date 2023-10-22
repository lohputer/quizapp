import './App.css';
import 'bootstrap/dist/css/bootstrap.min.css';
import 'bootstrap/scss/bootstrap.scss';
import "/node_modules/bootstrap/dist/css/bootstrap.css";
import './custom.scss';
import axios from 'axios';
import { useEffect, useState } from 'react';
export default function App() {
  const [ content, setContent ] = useState("");
  const [ question, setQn ] = useState(-1);
  const [ seconds, setTime ] = useState(1500);
  const [ intervalId, setIntervalId ] = useState(null);
  const [ answers, setAnswers ] = useState(Array(50).fill(""));
  const [ name, setName ] = useState("");
  async function endQuiz() {
    try {
      setQn(50);
      const response2 = await fetch(`${process.env.PUBLIC_URL}/answers.txt`);
      const data2 = await response2.text(); 
      var answ = 0;
      if (data2.includes("\r")) {
        answ = data2.split("\r\n");
      } else {
        answ = data2.split("\n");
      }
      var score = 0;
      var scores = [];
      for (let i=0; i<answ.length; i++) {
        if (answers[i].includes(answ[i])) {
          score++;
          scores.push(
            <>
              <tr className="table-success d-flex">
                  <td className="col-2">1</td>
                  <td className="col-5">{answers[i]}</td>
                  <td className="col-5">{answ[i]}</td>
                </tr>
            </>
          );
        } else {
          scores.push(
            <>
              <tr className="table-danger d-flex">
                  <td className="col-2">0</td>
                  <td className="col-5">{answers[i]}</td>
                  <td className="col-5">{answ[i]}</td>
                </tr>
            </>
          );
        }
      }
      console.log(scores);
      setContent(
        <>
          <h1 className="text-primary">Congrats {name}! Thanks for doing this quiz!</h1>
          <p>Let's check your results. You got a score of <strong className={score < 25 ? "text-danger" : (score === 25 ? "text-primary" : "text-success")}>{score}/50</strong>.</p>
          <table className="table table-bordered table-responsive mw-100 m-auto col-12">
            <thead>
              <tr className="d-flex">
                <th className="col-2">Score</th>
                <th className="col-5">Your Answer</th>
                <th className="col-5">Correct Answer</th>
              </tr>
            </thead>
            <tbody>
              {scores.map((x)=>
                x
              )}
            </tbody>
          </table>
        </>
      ); 
    } catch (error) {
      console.log(error);
    }
    axios.post("https://sheet.best/api/sheets/4647d83c-900e-4ef8-a589-d52c1b312210", {
      name, score, answers
    });
  }
  function answer(x) {
    setAnswers((list) => {
      const updatedList = [...list];
      updatedList[question] = x;
      return updatedList;
    });
  }
  useEffect(()=>{
    if (question !== -1 && question !== 50) {
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
          var questions = null;
          if (data.includes("\r")) {
            questions = data.split("-end-\r\n");
          } else {
            questions = data.split("-end-\n")
          }
          setTimeout(()=>{
            setContent(
              <>
                <h1 className="text-primary">{questions[question].split("\n")[0]}</h1>
                {questions[question].split("\n").length > questions[0].split("\n").length ? <img className="img-fluid" src={questions[question].split("\n")[5]} alt="sds" /> : ""}
                  <div className="form-group row d-flex my-2">
                    <button className={answers[question] === questions[question].split("\n")[1] ? "btn btn-secondary m-auto my-2 col-md-5" : "btn btn-primary m-auto my-2 col-md-5"} name={"q"+(question+1)} onClick={()=>answer(questions[question].split("\n")[1])}>{questions[question].split("\n")[1]}</button>
                    <button className={answers[question] === questions[question].split("\n")[2] ? "btn btn-secondary m-auto my-2 col-md-5" : "btn btn-primary m-auto my-2 col-md-5"} name={"q"+(question+1)} onClick={()=>answer(questions[question].split("\n")[2])}>{questions[question].split("\n")[2]}</button>
                    <button className={answers[question] === questions[question].split("\n")[3] ? "btn btn-secondary m-auto my-2 col-md-5" : "btn btn-primary m-auto my-2 col-md-5"} name={"q"+(question+1)} onClick={()=>answer(questions[question].split("\n")[3])}>{questions[question].split("\n")[3]}</button>
                    <button className={answers[question] === questions[question].split("\n")[4] ? "btn btn-secondary m-auto my-2 col-md-5" : "btn btn-primary m-auto my-2 col-md-5"} name={"q"+(question+1)} onClick={()=>answer(questions[question].split("\n")[4])}>{questions[question].split("\n")[4]}</button>
                  </div>
                <p className={question !== 0 && "text-center"}>
                  {String(Math.floor(seconds / 3600)).padStart(2, '0')}:
                  {String(Math.floor((seconds - Math.floor(seconds / 3600) * 3600) / 60)).padStart(2, '0')}:
                  {String(seconds - Math.floor(seconds / 3600) * 3600 - Math.floor((seconds - Math.floor(seconds / 3600) * 3600) / 60) * 60).padStart(2, '0')}
                </p>
                <div className="row d-flex">
                  {(question !== 0 && question < 45) && <button className="btn btn-primary col-4 m-auto border-5 border-secondary shadow" onClick={() => setQn(x => x-1)}>Previous</button>}
                  <button className="btn btn-primary col-4 h-10 m-auto border-5 border-secondary shadow" onClick={question !== 49 ? () => setQn(x => x+1) : () => endQuiz()}>{question === 49 ? "Submit" : "Next"}</button>
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
          <p>Hi yalls! I quite frankly have lost my coding skills after 2 months and need to get back at it. To <em>"celebrate"</em>, I made a <del>50</del> 49 wait I mean 50 anyway.. MCQ quiz with random stuff. You need to try complete as much as possible in 25 minutes. For fun. Good luck :D also dont use google for an <em>authentic</em> experience and if you click the button, it makes your box spin. Don't play if you are afraid of things that spin.</p>
          <h2 className="text-secondary">Range of topics</h2>
          <ul className="border border-primary list-group">
            <li className="list-group-item">basic english</li>
            <li className="list-group-item">random knowledge</li>
            <li className="list-group-item">maybe math?? and science??</li>
            <li className="list-group-item">statistics</li>
            <li className="list-group-item">i wrote this at 10.52pm at night and i have to wake up at 6.20am and im also planning to sleep at midnight only so pls excuse the god awful questions made</li>
          </ul>
          <br></br>
          <div className="form-group">
            <input id="name" className="text-center text-primary rounded shadow border border-primary p-2" type="text" placeholder="Type in your name (0m)" onChange={() => setName(document.getElementById("name").value)} />
          </div>
          <br></br>
          <button className="btn btn-primary" onClick={() => setQn(0)}>Start Quiz</button>
          </>
        : content }
      </div>
    </div>
  );
}
