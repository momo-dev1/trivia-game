// Select Elements

let countSpan = document.querySelector(".count span");
let bullets = document.querySelector(".bullets");
let bulletsSpanContainer = document.querySelector(".bullets .spans");
let quizArea = document.querySelector(".quiz-area");
let answersArea = document.querySelector(".answers-area");
let submitButton = document.querySelector(".submit-button");
let resultsContainer = document.querySelector(".results");
let countdownElement = document.querySelector(".countdown");

// Set Options

let currentIndex = 0;
let rightAnswers = 0;
let countdownInterval;


async function getQuestions() {
    const res = await fetch("./questions.json")
    const questions = await res.json()
    const questionsCount = questions.length

    createBullets(questionsCount)
    addQuestionsData(questions[currentIndex], questionsCount)

    submitButton.onclick = () => {
        let theCorrectAnswer = questions[currentIndex].right_answer

        currentIndex++

        checkAnswers(theCorrectAnswer, questionsCount)

        quizArea.innerHTML = "";
        answersArea.innerHTML = "";
        addQuestionData(questions[currentIndex], questionsCount);

        handleBullets();

        clearInterval(countdownInterval);
        countdown(3, qCount);
    }
}

getQuestions()

function createBullets(num) {
    countSpan.innerHTML = num

    for (let i = 0; i < num; i++) {
        let bullets = document.createElement("span")
        if (i === 0) {
            bullets.className = "active"
        }
        bulletsSpanContainer.appendChild(bullets)
    }

}

function addQuestionsData(obj, count) {

    if (currentIndex < count) {
        let questionTitle = document.createElement("h2");
        let questionText = document.createTextNode(obj["title"]);
        questionTitle.appendChild(questionText);
        quizArea.appendChild(questionTitle);

        for (let i = 1; i <= 4; i++) {
            let answerDiv = document.createElement("div")
            answerDiv.className = "answer"

            let radioInput = document.createElement("input")

            radioInput.id = `answer_${ i }`
            radioInput.name = "question";
            radioInput.type = "radio"
            radioInput.dataset.answer = `${ obj[`answer_${ i }`] }`

            let label = document.createElement("label")
            let labelText = document.createTextNode(obj[`answer_${ i }`])
            label.htmlFor = `answer_${ i }`
            label.appendChild(labelText)

            answerDiv.appendChild(radioInput)
            answerDiv.appendChild(label)

            answersArea.appendChild(answerDiv)

        }
    }
}

function checkAnswers(rightAnswer, count) {
    let answers = document.getElementsByName("question");
    let theChoosenAnswer;
    for (let i = 0; i < answers.length; i++) {
        theChoosenAnswer = answers[i].dataset.answer
    }

    if (rightAnswer === theChoosenAnswer) {
        rightAnswers++
    }
}

function handleBullets() {
    let bulletsSpans = document.querySelectorAll(".bullets .spans span");
    let arrayOfSpans = Array.from(bulletsSpans);
    arrayOfSpans.forEach((span, index) => {
        if (currentIndex === index) {
            span.className = "active";
        }
    });
}

function countdown(duration, count) {
    if (currentIndex < count) {
        let minutes, seconds;
        countdownInterval = setInterval(function () {
            minutes = parseInt(duration / 60);
            seconds = parseInt(duration % 60);

            minutes = minutes < 10 ? `0${ minutes }` : minutes;
            seconds = seconds < 10 ? `0${ seconds }` : seconds;

            countdownElement.innerHTML = `${ minutes }:${ seconds }`;

            if (--duration < 0) {
                clearInterval(countdownInterval);
                submitButton.click();
            }
        }, 1000);
    }
}