const birds = [
  { name: "Northern Cardinal", img: "assets/cardinal.jpg" },
  { name: "Blue Jay", img: "assets/bluejay.jpg" },
  { name: "American Robin", img: "assets/robin.jpg" },
  { name: "Goldfinch", img: "assets/goldfinch.jpg" },
  { name: "Bald Eagle", img: "assets/bald-eagle.jpg" },
  { name: "Ruby-throated Hummingbird", img: "assets/hummingbird.jpg" },
  { name: "Great Blue Heron", img: "assets/heron.jpg" },
  { name: "Black-capped Chickadee", img: "assets/chickadee.jpg" },
];

let currentQuestion = {};
let score = 0;
let questionCount = 0;

const birdImage = document.getElementById("bird-image");
const optionsContainer = document.getElementById("options");
const nextBtn = document.getElementById("next-btn");
const scoreDisplay = document.getElementById("score");

function shuffle(array) {
  return array.sort(() => Math.random() - 0.5);
}

function loadQuestion() {
  questionCount++;
  optionsContainer.innerHTML = "";
  const [correct, ...rest] = shuffle(birds);
  currentQuestion = correct;

  birdImage.src = correct.img;
  const choices = shuffle([correct, ...shuffle(rest).slice(0, 2)]);

  choices.forEach((choice) => {
    const btn = document.createElement("button");
    btn.innerText = choice.name;
    btn.classList.add("option-btn");
    btn.addEventListener("click", () => selectAnswer(btn, choice));
    optionsContainer.appendChild(btn);
  });
}

function selectAnswer(btn, choice) {
  const buttons = document.querySelectorAll(".option-btn");
  buttons.forEach((b) => (b.disabled = true));

  if (choice.name === currentQuestion.name) {
    btn.classList.add("correct");
    score++;
  } else {
    btn.classList.add("wrong");

    buttons.forEach((b) => {
      if (b.innerText === currentQuestion.name) b.classList.add("correct");
    });
  }
  scoreDisplay.innerText = `Score: ${score} / ${questionCount}`;
}

nextBtn.addEventListener("click", () => {
  loadQuestion();
});

loadQuestion();
scoreDisplay.innerText = `Score: ${score} / ${questionCount}`;
