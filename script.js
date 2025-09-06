// Question bank
const questions = [
    {
        question: "Which keyword is used to declare a variable in JavaScript?",
        options: ["var", "let", "const", "All of the above"],
        answer: 3
    },
    {
        question: "What will typeof null return in JavaScript?",
        options: ["null", "object", "undefined", "string"],
        answer: 1
    },
    {
        question: "Which array method adds one or more elements to the end of an array?",
        options: ["push()", "pop()", "shift()", "unshift()"],
        answer: 0
    },
    {
        question: "What is the purpose of the 'this' keyword in JavaScript?",
        options: [
            "It refers to the current function",
            "It refers to the previous object",
            "It refers to the current object",
            "It refers to the global object"
        ],
        answer: 2
    },
    {
        question: "Which method is used to convert a JSON string to a JavaScript object?",
        options: [
            "JSON.parse()",
            "JSON.stringify()",
            "JSON.toObject()",
            "JSON.convert()"
        ],
        answer: 0
    },
    {
        question: "What does the '===' operator do in JavaScript?",
        options: [
            "Compares values for equality with type conversion",
            "Compares values for equality without type conversion",
            "Assigns a value to a variable",
            "Checks if a value is truthy"
        ],
        answer: 1
    },
    {
        question: "Which of the following is not a JavaScript data type?",
        options: ["number", "string", "boolean", "character"],
        answer: 3
    },
    {
        question: "What is the output of console.log(1 + '1') in JavaScript?",
        options: ["2", "11", "NaN", "undefined"],
        answer: 1
    },
    {
        question: "Which function is used to execute code after a specified delay?",
        options: ["setTimeout()", "setInterval()", "delay()", "wait()"],
        answer: 0
    },
    {
        question: "What does the Array.map() method do?",
        options: [
            "Modifies the original array",
            "Creates a new array with the results of calling a function on every element",
            "Filters the array based on a condition",
            "Sorts the array in ascending order"
        ],
        answer: 1
    },
    {
        question: "What is a closure in JavaScript?",
        options: [
            "A function that has access to its own scope only",
            "A function that has access to variables from its outer function even after the outer function has returned",
            "A way to close a web page",
            "A method to encapsulate variables"
        ],
        answer: 1
    },
    {
        question: "Which symbol is used for comments in JavaScript?",
        options: ["//", "#", "--", "/* */"],
        answer: 0
    },
    {
        question: "What is the purpose of the 'use strict' directive?",
        options: [
            "To enforce stricter type checking",
            "To enforce a stricter parsing and error handling mode",
            "To make JavaScript run faster",
            "To enable experimental features"
        ],
        answer: 1
    },
    {
        question: "Which method is used to remove the last element from an array?",
        options: ["shift()", "pop()", "slice()", "splice()"],
        answer: 1
    },
    {
        question: "What will Boolean('false') return?",
        options: ["true", "false", "undefined", "NaN"],
        answer: 0
    }
];

// Exam variables
let currentQuestionIndex = 0;
let userAnswers = [];
let availableQuestions = [];
let timer;
let timeLeft = 600; // 10 minutes in seconds

// DOM elements
const timerElement = document.getElementById('timer');
const questionNumberElement = document.getElementById('question-number');
const questionElement = document.getElementById('question');
const optionsElement = document.getElementById('options');
const prevButton = document.getElementById('prev-btn');
const nextButton = document.getElementById('next-btn');
const submitButton = document.getElementById('submit-btn');
const progressElement = document.getElementById('progress');
const examContainer = document.getElementById('exam-container');
const resultContainer = document.getElementById('result-container');
const scoreElement = document.getElementById('score');
const messageElement = document.getElementById('message');
const restartButton = document.getElementById('restart-btn');

// Initialize the exam
function initExam() {
    // Reset variables
    currentQuestionIndex = 0;
    userAnswers = [];
    timeLeft = 600;
    
    // Create a copy of questions and shuffle them
    availableQuestions = [...questions];
    shuffleArray(availableQuestions);
    
    // Select only 10 questions for the exam
    availableQuestions = availableQuestions.slice(0, 10);
    
    // Initialize user answers array
    userAnswers = new Array(availableQuestions.length).fill(null);
    
    // Display first question
    displayQuestion();
    
    // Start timer
    startTimer();
    
    // Update progress bar
    updateProgressBar();
}

// Display current question
function displayQuestion() {
    const currentQuestion = availableQuestions[currentQuestionIndex];
    
    questionNumberElement.textContent = `Question ${currentQuestionIndex + 1} of ${availableQuestions.length}`;
    questionElement.textContent = currentQuestion.question;
    
    // Clear previous options
    optionsElement.innerHTML = '';
    
    // Add options
    currentQuestion.options.forEach((option, index) => {
        const optionElement = document.createElement('div');
        optionElement.classList.add('option');
        if (userAnswers[currentQuestionIndex] === index) {
            optionElement.classList.add('selected');
        }
        optionElement.textContent = option;
        optionElement.addEventListener('click', () => selectOption(index));
        optionsElement.appendChild(optionElement);
    });
    
    // Update navigation buttons
    prevButton.disabled = currentQuestionIndex === 0;
    nextButton.disabled = false;
    
    if (currentQuestionIndex === availableQuestions.length - 1) {
        nextButton.style.display = 'none';
        submitButton.style.display = 'block';
    } else {
        nextButton.style.display = 'block';
        submitButton.style.display = 'none';
    }
}

// Select an option
function selectOption(optionIndex) {
    userAnswers[currentQuestionIndex] = optionIndex;
    
    // Update UI to show selected option
    const options = optionsElement.querySelectorAll('.option');
    options.forEach((option, index) => {
        if (index === optionIndex) {
            option.classList.add('selected');
        } else {
            option.classList.remove('selected');
        }
    });
}

// Navigate to next question
function nextQuestion() {
    if (currentQuestionIndex < availableQuestions.length - 1) {
        currentQuestionIndex++;
        displayQuestion();
        updateProgressBar();
    }
}

// Navigate to previous question
function prevQuestion() {
    if (currentQuestionIndex > 0) {
        currentQuestionIndex--;
        displayQuestion();
        updateProgressBar();
    }
}

// Start the countdown timer
function startTimer() {
    clearInterval(timer);
    
    timer = setInterval(() => {
        timeLeft--;
        
        const minutes = Math.floor(timeLeft / 60);
        const seconds = timeLeft % 60;
        
        timerElement.textContent = `${minutes.toString().padStart(2, '0')}:${seconds.toString().padStart(2, '0')}`;
        
        // Change color when time is running out
        if (timeLeft <= 60) {
            timerElement.classList.add('timer-warning');
        } else {
            timerElement.classList.remove('timer-warning');
        }
        
        // Auto submit when time is up
        if (timeLeft <= 0) {
            clearInterval(timer);
            submitExam();
        }
    }, 1000);
}

// Update progress bar
function updateProgressBar() {
    const progress = ((currentQuestionIndex + 1) / availableQuestions.length) * 100;
    progressElement.style.width = `${progress}%`;
}

// Submit the exam
function submitExam() {
    clearInterval(timer);
    
    // Calculate score
    let score = 0;
    userAnswers.forEach((answer, index) => {
        if (answer === availableQuestions[index].answer) {
            score++;
        }
    });
    
    // Display results
    examContainer.style.display = 'none';
    resultContainer.style.display = 'block';
    
    scoreElement.textContent = `${score}/${availableQuestions.length}`;
    
    // Display message based on score
    const percentage = (score / availableQuestions.length) * 100;
    if (percentage >= 80) {
        messageElement.textContent = 'Excellent job! You have a strong understanding of JavaScript.';
    } else if (percentage >= 60) {
        messageElement.textContent = 'Good effort! With a bit more practice, you\'ll master JavaScript.';
    } else if (percentage >= 40) {
        messageElement.textContent = 'Not bad! Keep studying and you\'ll improve.';
    } else {
        messageElement.textContent = 'Keep practicing! Review the basics and try again.';
    }
}

// Utility function to shuffle array (Fisher-Yates algorithm)
function shuffleArray(array) {
    for (let i = array.length - 1; i > 0; i--) {
        const j = Math.floor(Math.random() * (i + 1));
        [array[i], array[j]] = [array[j], array[i]];
    }
    return array;
}

// Event listeners
prevButton.addEventListener('click', prevQuestion);
nextButton.addEventListener('click', nextQuestion);
submitButton.addEventListener('click', submitExam);
restartButton.addEventListener('click', () => {
    resultContainer.style.display = 'none';
    examContainer.style.display = 'block';
    initExam();
});

// Initialize the exam when the page loads
window.addEventListener('load', initExam);