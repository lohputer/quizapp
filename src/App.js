import './App.css';
import 'bootstrap/dist/css/bootstrap.min.css';
import 'bootstrap/scss/bootstrap.scss';
import "/node_modules/bootstrap/dist/css/bootstrap.css";
import './custom.scss';
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
        answ = data2.split(/\n/);
      }
      var score = 0;
      var scores = [];
      for (let i=0; i<answ.length; i++) {
        if (answers[i].includes(answ[i])) {
          score++;
          scores.push(
            <>
              <tr className="text-success d-flex">
                  <td className="col-2">1</td>
                  <td className="col-5">{answers[i]}</td>
                  <td className="col-5">{answ[i]}</td>
                </tr>
            </>
          );
        } else {
          scores.push(
            <>
              <tr className="text-danger d-flex">
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
          <h1 className="text-primary">Congrats {name}! I can't believe you actually bothered to do this quiz!</h1>
          <p>Let's check your results. You got a score of <strong className="text-primary">{score}/50</strong>.</p>
          <table className="table table-bordered w-auto">
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
          console.log(questions[question], questions, question);
          setTimeout(()=>{
            setContent(
              <>
                <h1 className="text-primary">{questions[question].split("\n")[0]}</h1>
                {questions[question].split("\n").length > 5 ? <img className="img-fluid" src={questions[question].split("\n")[5]} /> : ""}
                  <div className="form-check p-4">
                    <label className="form-check-label" htmlFor={"q"+(question+1)} >
                      <input type="radio" className="form-check-input" name={"q"+(question+1)} onChange={()=>answer(questions[question].split("\n")[1])} checked={answers[question] === questions[question].split("\n")[1] ? true : false} /> {questions[question].split("\n")[1]}
                    </label>
                    <br></br>
                    <label className="form-check-label" htmlFor={"q"+(question+1)} >
                      <input type="radio" className="form-check-input" name={"q"+(question+1)} onChange={()=>answer(questions[question].split("\n")[2])} checked={answers[question] === questions[question].split("\n")[2] ? true : false}  /> {questions[question].split("\n")[2]}
                    </label>
                    <br></br>
                    <label className="form-check-label" htmlFor={"q"+(question+1)} >
                      <input type="radio" className="form-check-input" name={"q"+(question+1)} onChange={()=>answer(questions[question].split("\n")[3])} checked={answers[question] === questions[question].split("\n")[3] ? true : false}  /> {questions[question].split("\n")[3]}
                    </label>
                    <br></br>
                    <label className="form-check-label" htmlFor={"q"+question} >
                      <input type="radio" className="form-check-input" name={"q"+(question+1)} onChange={()=>answer(questions[question].split("\n")[4])} checked={answers[question] === questions[question].split("\n")[4] ? true : false} /> {questions[question].split("\n")[4]}
                    </label>
                  </div>
                <p className={question !== 0 && "text-center"}>
                  {String(Math.floor(seconds / 3600)).padStart(2, '0')}:
                  {String(Math.floor((seconds - Math.floor(seconds / 3600) * 3600) / 60)).padStart(2, '0')}:
                  {String(seconds - Math.floor(seconds / 3600) * 3600 - Math.floor((seconds - Math.floor(seconds / 3600) * 3600) / 60) * 60).padStart(2, '0')}
                </p>
                <div className="row d-flex">
                  {(question !== 0 && question < 45) && <button className="btn btn-primary col-5 m-auto" onClick={() => setQn(x => x-1)}>Previous</button>}
                  <button className={question !== 0 ? "btn btn-primary col-5 m-auto" : "btn btn-primary"} onClick={question !== 49 ? () => setQn(x => x+1) : () => endQuiz()}>Next</button>
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
