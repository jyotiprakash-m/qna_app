"use client";
import React, { useEffect, useState } from "react";

type Question = {
  question: string;
  options: string[];
  answer: string | string[];
  type: "single" | "multiple";
  difficulty?: string;
  explanation?: string;
};

type Unit = {
  name: string;
  questions: Question[];
};

type QuizData = {
  units: Unit[];
};

const MODULES = [
  { label: "Module 1: Introduction to Azure AI", value: "module_1.json" },
  { label: "Module 2: AI Agents", value: "module_2_ai_agent.json" },
  {
    label: "Module 3: Natural Language Solutions",
    value: "module_3_natural_language_solutions.json",
  },
  {
    label: "Module 4: Computer Vision",
    value: "module_4_computer_vision.json",
  },
];

export default function QuizPage() {
  const [quizData, setQuizData] = useState<QuizData | null>(null);
  const [currentModule, setCurrentModule] = useState(MODULES[0].value);
  const [currentUnit, setCurrentUnit] = useState(0);
  const [currentQuestion, setCurrentQuestion] = useState(0);
  const [answered, setAnswered] = useState(false);
  const [unitScores, setUnitScores] = useState<boolean[][]>([]);
  const [showSidebar, setShowSidebar] = useState(false);

  useEffect(() => {
    fetch(`/${currentModule}`)
      .then((res) => res.json())
      .then((data: QuizData) => {
        setQuizData(data);
        setCurrentUnit(0);
        setCurrentQuestion(0);
        setUnitScores(data.units.map(() => []));
        setAnswered(false);
      });
  }, [currentModule]);

  function handleCheckAnswer(q: Question) {
    const isMulti = q.type === "multiple";
    let selected: string[] = [];

    if (isMulti) {
      document
        .querySelectorAll('input[name="option"]:checked')
        .forEach((cb) => selected.push((cb as HTMLInputElement).value));
      const correct = (q.answer as string[]).slice().sort().join(", ");
      const user = selected.slice().sort().join(", ");
      updateScore(user === correct);
    } else {
      const checked = document.querySelector(
        'input[name="option"]:checked'
      ) as HTMLInputElement | null;
      const user = checked ? checked.value : "";
      updateScore(user === q.answer);
    }
    setAnswered(true);
  }

  function updateScore(isCorrect: boolean) {
    setUnitScores((prev) => {
      const updated = prev.map((arr) => [...arr]);
      updated[currentUnit][currentQuestion] = isCorrect;
      return updated;
    });
  }

  if (!quizData) return <div>Loading...</div>;

  const unit = quizData.units[currentUnit];
  const q = unit.questions[currentQuestion];
  const isMulti = q.type === "multiple";
  const total = unit.questions.length;
  const correct = (unitScores[currentUnit] || []).filter(Boolean).length;

  return (
    <div className="appFlex">
      <button
        className="sidebarHamburger"
        aria-label="Open navigation"
        onClick={() => setShowSidebar(true)}
      >
        &#9776;
      </button>
      <div
        className={`sidebarBackdrop ${showSidebar ? "active" : ""}`}
        onClick={() => setShowSidebar(false)}
      />
      <nav
        className={`unitNavbar ${showSidebar ? "open" : ""}`}
        onClick={() => setShowSidebar(false)}
      >
        {quizData.units.map((u, idx) => (
          <button
            key={u.name}
            className={idx === currentUnit ? "activeUnit" : ""}
            onClick={(e) => {
              e.stopPropagation();
              setCurrentUnit(idx);
              setCurrentQuestion(0);
              setAnswered(false);
            }}
          >
            {u.name} ({u.questions.length})
          </button>
        ))}
      </nav>
      <div className="quizContainer">
        <h1 className="quizTitle">Azure AI-102 Quiz</h1>
        <div className="moduleSelectRow">
          <label htmlFor="module-select" className="moduleSelectLabel">
            Select Module:
          </label>
          <select
            id="module-select"
            value={currentModule}
            onChange={(e) => setCurrentModule(e.target.value)}
            className="moduleSelect"
          >
            {MODULES.map((m) => (
              <option key={m.value} value={m.value}>
                {m.label}
              </option>
            ))}
          </select>
        </div>
        <div className="unitScore">
          <span>Score</span>
          <span className="unitScoreBadge">
            {correct} / {total}
          </span>
        </div>
        <div className="quiz">
          <div>
            <h2>
              Q{currentQuestion + 1}: {q.question}
            </h2>
            <div className="questionMeta">
              <span className="difficulty">{q.difficulty}</span>
              <span className="type">
                {q.type === "multiple" ? "Multiple Select" : "Single Select"}
              </span>
            </div>
            {q.options.map((opt, i) => (
              <div key={opt}>
                <input
                  type={isMulti ? "checkbox" : "radio"}
                  name="option"
                  id={`opt${i}`}
                  value={opt}
                  disabled={answered}
                />
                <label htmlFor={`opt${i}`}>{opt}</label>
              </div>
            ))}
            {!answered && (
              <button className="checkBtn" onClick={() => handleCheckAnswer(q)}>
                Check Answer
              </button>
            )}
            {answered && (
              <div className="answerBox">
                <div>
                  <span
                    className={`answerStatus ${
                      unitScores[currentUnit][currentQuestion]
                        ? "correct"
                        : "incorrect"
                    }`}
                  >
                    {unitScores[currentUnit][currentQuestion]
                      ? "Correct!"
                      : "Incorrect."}
                  </span>
                </div>
                <div className="answerMain">
                  Answer:{" "}
                  {Array.isArray(q.answer) ? q.answer.join(", ") : q.answer}
                </div>
                <div className="answerExplanation">{q.explanation}</div>
              </div>
            )}
            <div className="navBtns">
              <button
                onClick={() => {
                  setCurrentQuestion((q) => q - 1);
                  setAnswered(false);
                }}
                disabled={currentQuestion === 0}
              >
                Previous
              </button>
              <button
                onClick={() => {
                  setCurrentQuestion((q) => q + 1);
                  setAnswered(false);
                }}
                disabled={currentQuestion === total - 1 || !answered}
              >
                Next
              </button>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}
