let quizData = null;
let currentUnit = 0;
let currentQuestion = 0;
let answered = false;
let currentModule = "module_1.json";
let unitScores = []; // Track correct answers per unit

document.addEventListener("DOMContentLoaded", () => {
  document.getElementById("module-select").addEventListener("change", (e) => {
    currentModule = e.target.value;
    currentUnit = 0;
    currentQuestion = 0;
    loadModule(currentModule);
  });
  loadModule(currentModule);
});

function loadModule(moduleFile) {
  fetch(moduleFile)
    .then((response) => response.json())
    .then((data) => {
      quizData = data.units;
      unitScores = quizData.map(() => []); // Reset scores for each unit
      renderUnitNavbar();
      showQuestion(currentUnit, currentQuestion);
      renderUnitScore();
    });
}

function renderUnitNavbar() {
  const navbar = document.getElementById("unit-navbar");
  navbar.innerHTML = "";
  quizData.forEach((unit, idx) => {
    const btn = document.createElement("button");
    btn.textContent = `${unit.name} (${unit.questions.length})`;
    btn.style.display = "block";
    btn.style.width = "100%";
    btn.style.margin = "8px 0";
    btn.style.background = idx === currentUnit ? "#6366f1" : "#fff";
    btn.style.color = idx === currentUnit ? "#fff" : "#333";
    btn.style.border = "none";
    btn.style.padding = "12px 16px";
    btn.style.borderRadius = "8px";
    btn.style.cursor = "pointer";
    btn.style.fontWeight = "bold";
    btn.onclick = () => {
      currentUnit = idx;
      currentQuestion = 0;
      renderUnitNavbar();
      showQuestion(currentUnit, currentQuestion);
    };
    navbar.appendChild(btn);
  });
}

function showQuestion(unitIdx, qIdx) {
  answered = false;
  const quizDiv = document.getElementById("quiz");
  const q = quizData[unitIdx].questions[qIdx];
  let optionsHtml = "";
  const isMulti = q.type === "multiple";

  q.options.forEach((opt, i) => {
    optionsHtml += `<div>
      <input type="${
        isMulti ? "checkbox" : "radio"
      }" name="option" id="opt${i}" value="${opt}">
      <label for="opt${i}">${opt}</label>
    </div>`;
  });

  quizDiv.innerHTML = `
    <div>
      <h2>Q${qIdx + 1}: ${q.question}</h2>
      <div style="margin-bottom:8px;">
        <span style="font-size:0.95em;color:#6366f1;background:#e0e7ff;padding:2px 8px;border-radius:6px;margin-right:8px;">${
          q.difficulty
        }</span>
        <span style="font-size:0.95em;color:#fff;background:#6366f1;padding:2px 8px;border-radius:6px;">${
          q.type === "multiple" ? "Multiple Select" : "Single Select"
        }</span>
      </div>
      ${optionsHtml}
      <button id="check">Check Answer</button>
    </div>
  `;

  document.getElementById("prev").disabled = qIdx === 0;
  document.getElementById("next").style.display = "none";

  document.getElementById("check").onclick = () => {
    if (answered) return;
    answered = true;
    const answerDiv = document.createElement("div");
    answerDiv.id = "answer";
    answerDiv.style.marginTop = "10px";
    document.querySelector("#quiz > div").appendChild(answerDiv);
    showAnswer(q);
    document.getElementById("next").style.display =
      qIdx < quizData[unitIdx].questions.length - 1 ? "inline-block" : "none";
  };
}

function showAnswer(q) {
  const answerDiv = document.getElementById("answer");
  const isMulti = q.type === "multiple";
  let selected = [];
  let isCorrect = false;
  let correct, user;

  if (isMulti) {
    document.querySelectorAll('input[name="option"]:checked').forEach(cb => selected.push(cb.value));
    correct = q.answer.slice().sort().join(", ");
    user = selected.slice().sort().join(", ");
    isCorrect = user === correct;
  } else {
    const checked = document.querySelector('input[name="option"]:checked');
    user = checked ? checked.value : "";
    correct = q.answer;
    isCorrect = user === correct;
  }

  // Record the answer for scoring
  unitScores[currentUnit][currentQuestion] = isCorrect;

  answerDiv.innerHTML = `
    <div class="answer-box" style="flex-direction: column; gap: 8px;">
      <div>
        <span class="answer-status ${isCorrect ? "correct" : "incorrect"}">
          ${isCorrect ? "Correct!" : "Incorrect."}
        </span>
      </div>
      <div class="answer-main">Answer: ${correct}</div>
      <div class="answer-explanation">${q.explanation}</div>
    </div>
  `;

  renderUnitScore();
}

document.getElementById("next").onclick = () => {
  if (currentQuestion < quizData[currentUnit].questions.length - 1) {
    currentQuestion++;
    showQuestion(currentUnit, currentQuestion);
  }
};

document.getElementById("prev").onclick = () => {
  if (currentQuestion > 0) {
    currentQuestion--;
    showQuestion(currentUnit, currentQuestion);
  }
};

function renderUnitScore() {
  const scoreDiv = document.getElementById("unit-score");
  if (!quizData) return;
  const total = quizData[currentUnit].questions.length;
  const correct = (unitScores[currentUnit] || []).filter(Boolean).length;
  scoreDiv.innerHTML = `
    <span>Score</span>
    <span class="unit-score-badge">${correct} / ${total}</span>
  `;
}

// You can add submit logic as needed
