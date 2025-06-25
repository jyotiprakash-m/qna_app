let currentQuestion = 0;
let quizData = null;
let answered = false;

fetch("azure_ai_quiz.json")
  .then((response) => response.json())
  .then((data) => {
    quizData = data.questions;
    showQuestion(currentQuestion);
  });

function showQuestion(index) {
  answered = false;
  const quizDiv = document.getElementById("quiz");
  const q = quizData[index];
  let optionsHtml = "";
  const isMulti = Array.isArray(q.answer);

  q.options.forEach((opt, i) => {
    optionsHtml += `<div>
      <input type="${isMulti ? "checkbox" : "radio"}" name="option" id="opt${i}" value="${opt}">
      <label for="opt${i}">${opt}</label>
    </div>`;
  });

  quizDiv.innerHTML = `
    <div>
      <h2>Q${index + 1}: ${q.question}</h2>
      ${optionsHtml}
      <button id="check">Check Answer</button>
      <div id="answer" style="margin-top:10px;"></div>
    </div>
  `;

  document.getElementById("prev").disabled = index === 0;
  document.getElementById("next").style.display = "none";

  document.getElementById("check").onclick = () => {
    if (answered) return;
    answered = true;
    showAnswer(q);
    document.getElementById("next").style.display = (currentQuestion < quizData.length - 1) ? "inline-block" : "none";
  };
}

function showAnswer(q) {
  const answerDiv = document.getElementById("answer");
  const isMulti = Array.isArray(q.answer);
  let selected = [];
  if (isMulti) {
    document.querySelectorAll('input[name="option"]:checked').forEach(cb => selected.push(cb.value));
    const correct = q.answer.sort().join(", ");
    const user = selected.sort().join(", ");
    answerDiv.innerHTML = user === correct
      ? `<span style="color:green;">Correct!</span><br>Answer: ${correct}`
      : `<span style="color:red;">Incorrect.</span><br>Correct Answer: ${correct}`;
  } else {
    const checked = document.querySelector('input[name="option"]:checked');
    const user = checked ? checked.value : "";
    answerDiv.innerHTML = user === q.answer
      ? `<span style="color:green;">Correct!</span><br>Answer: ${q.answer}`
      : `<span style="color:red;">Incorrect.</span><br>Correct Answer: ${q.answer}`;
  }
}

document.getElementById("next").onclick = () => {
  if (currentQuestion < quizData.length - 1) {
    currentQuestion++;
    showQuestion(currentQuestion);
  }
};

document.getElementById("prev").onclick = () => {
  if (currentQuestion > 0) {
    currentQuestion--;
    showQuestion(currentQuestion);
  }
};

// You can add submit logic as needed
