const API_URL = "https://ai-student-companion-njmj.onrender.com";

/* =========================
   CURRENT USER
========================= */

let currentUser =
    JSON.parse(localStorage.getItem("currentUser"));

/* =========================
   CURRENT QUIZ
========================= */

let currentQuiz = [];

/* =========================
   AI RESPONSE STYLE
========================= */

function addAIResponseStyles() {

    if (document.getElementById("aiResponseStyles")) {
        return;
    }

    const style = document.createElement("style");

    style.id = "aiResponseStyles";

    style.innerHTML = `

        .ai-response-box {
            background: #111827;
            border: 1px solid #273248;
            border-radius: 14px;
            padding: 18px;
            margin-top: 15px;
            line-height: 1.7;
            color: #e5e7eb;
        }

        .ai-response-section {
            margin-bottom: 18px;
        }

        .ai-response-section:last-child {
            margin-bottom: 0;
        }

        .ai-response-title {
            font-size: 16px;
            font-weight: 700;
            color: #f8fafc;
            margin-bottom: 8px;
        }

        .ai-response-content {
            color: #cbd5e1;
            font-size: 14px;
            white-space: pre-line;
        }

        .ai-response-content ul {
            margin: 8px 0 0 20px;
            padding: 0;
        }

        .ai-response-content li {
            margin-bottom: 5px;
        }

        .ai-loading {
            display: flex;
            align-items: center;
            gap: 10px;
            color: #cbd5e1;
            padding: 15px 0;
        }

        .ai-loading-dot {
            width: 8px;
            height: 8px;
            border-radius: 50%;
            background: #94a3b8;
            animation: aiPulse 1.2s infinite;
        }

        @keyframes aiPulse {

            0%, 100% {
                opacity: 0.3;
                transform: scale(0.8);
            }

            50% {
                opacity: 1;
                transform: scale(1);
            }

        }

        .ai-error {
            color: #fca5a5;
            background: #2a1515;
            border: 1px solid #5f2929;
            padding: 12px;
            border-radius: 10px;
        }

    `;

    document.head.appendChild(style);
}

addAIResponseStyles();

/* =========================
   LOGIN CHECK
========================= */

function checkLogin() {

    if (currentUser) {

        document.getElementById("welcomeMessage").innerText =
            `Welcome, ${currentUser.name}! 👋`;

        showApp();

        loadTasks();
        loadStudyPlans();
        loadNotes();

    } else {

        hideApp();

    }

}

/* =========================
   SHOW APP
========================= */

function showApp() {

    const dashboard =
        document.querySelector(".dashboard");

    const cards =
        document.querySelector(".cards");

    const logoutButton =
        document.getElementById("logoutButton");

    if (dashboard) {
        dashboard.style.display = "grid";
    }

    if (cards) {
        cards.style.display = "grid";
    }

    if (logoutButton) {
        logoutButton.style.display = "block";
    }

}

/* =========================
   HIDE APP
========================= */

function hideApp() {

    const dashboard =
        document.querySelector(".dashboard");

    const cards =
        document.querySelector(".cards");

    const logoutButton =
        document.getElementById("logoutButton");

    if (dashboard) {
        dashboard.style.display = "none";
    }

    if (cards) {
        cards.style.display = "none";
    }

    if (logoutButton) {
        logoutButton.style.display = "none";
    }

}

/* =========================
   ENTER APP
========================= */

function enterApp() {

    if (!currentUser) {

        alert("Please login first.");

        return;
    }

    showApp();

}

/* =========================
   REGISTER
========================= */

async function registerUser() {

    const name =
        document.getElementById("registerName").value.trim();

    const email =
        document.getElementById("registerEmail").value.trim();

    const password =
        document.getElementById("registerPassword").value;

    if (!name || !email || !password) {

        alert("Please fill all registration fields.");

        return;
    }

    try {

        const response =
            await fetch(
                `${API_URL}/api/register`,
                {
                    method: "POST",

                    headers: {
                        "Content-Type": "application/json"
                    },

                    body: JSON.stringify({
                        name: name,
                        email: email,
                        password: password
                    })
                }
            );

        const data =
            await response.json();

        if (!response.ok) {

            alert(data.message);

            return;
        }

        alert(
            "Registration successful! 🎉 Please login."
        );

        document.getElementById("registerName").value = "";
        document.getElementById("registerEmail").value = "";
        document.getElementById("registerPassword").value = "";

    } catch (error) {

        console.log("REGISTER ERROR:");
        console.log(error);

        alert(
            "Unable to connect to the backend."
        );

    }

}

/* =========================
   LOGIN
========================= */

async function loginUser() {

    const email =
        document.getElementById("loginEmail").value.trim();

    const password =
        document.getElementById("loginPassword").value;

    if (!email || !password) {

        alert("Please enter email and password.");

        return;
    }

    try {

        const response =
            await fetch(
                `${API_URL}/api/login`,
                {
                    method: "POST",

                    headers: {
                        "Content-Type": "application/json"
                    },

                    body: JSON.stringify({
                        email: email,
                        password: password
                    })
                }
            );

        const data =
            await response.json();

        if (!response.ok) {

            alert(data.message);

            return;
        }

        currentUser =
            data.user;

        localStorage.setItem(
            "currentUser",
            JSON.stringify(currentUser)
        );

        document.getElementById("loginEmail").value = "";
        document.getElementById("loginPassword").value = "";

        document.getElementById("welcomeMessage").innerText =
            `Welcome, ${currentUser.name}! 👋`;

        showApp();

        loadTasks();
        loadStudyPlans();
        loadNotes();

        alert(
            `Welcome ${currentUser.name}! 🎉`
        );

    } catch (error) {

        console.log("LOGIN ERROR:");
        console.log(error);

        alert(
            "Unable to connect to the backend."
        );

    }

}

/* =========================
   LOGOUT
========================= */

function logoutUser() {

    currentUser = null;

    localStorage.removeItem("currentUser");

    document.getElementById("welcomeMessage").innerText =
        "Welcome to AI Student Companion!";

    document.getElementById("taskList").innerHTML = "";
    document.getElementById("studyList").innerHTML = "";
    document.getElementById("noteList").innerHTML = "";

    updateDashboard([], [], []);

    hideApp();

    alert(
        "You have been logged out successfully. 👋"
    );

}

/* =========================
   ADD TASK
========================= */

async function addTask() {

    if (!currentUser) {

        alert("Please login first.");

        return;
    }

    const taskInput =
        document.getElementById("taskInput");

    const task =
        taskInput.value.trim();

    if (!task) {

        alert("Please enter a task.");

        return;
    }

    try {

        const response =
            await fetch(
                `${API_URL}/api/tasks`,
                {
                    method: "POST",

                    headers: {
                        "Content-Type": "application/json"
                    },

                    body: JSON.stringify({
                        userId: currentUser.id,
                        task: task
                    })
                }
            );

        const data =
            await response.json();

        if (!response.ok) {

            alert(data.message);

            return;
        }

        taskInput.value = "";

        loadTasks();

    } catch (error) {

        console.log("ADD TASK ERROR:");
        console.log(error);

        alert(
            "Unable to add task."
        );

    }

}

/* =========================
   LOAD TASKS
========================= */

async function loadTasks() {

    if (!currentUser) return;

    try {

        const response =
            await fetch(
                `${API_URL}/api/tasks/${currentUser.id}`
            );

        const data =
            await response.json();

        const taskList =
            document.getElementById("taskList");

        taskList.innerHTML = "";

        if (
            !data.tasks ||
            data.tasks.length === 0
        ) {

            taskList.innerHTML =
                "<li>No tasks yet. Add your first task! 📋</li>";

            updateDashboard(
                [],
                null,
                null
            );

            return;
        }

        data.tasks.forEach(
            createTaskElement
        );

        updateDashboard(
            data.tasks,
            null,
            null
        );

    } catch (error) {

        console.log(
            "LOAD TASKS ERROR:"
        );

        console.log(error);

    }

}

/* =========================
   CREATE TASK ELEMENT
========================= */

function createTaskElement(task) {

    const taskList =
        document.getElementById("taskList");

    const li =
        document.createElement("li");

    const taskText =
        document.createElement("span");

    taskText.innerText =
        task.task;

    if (task.completed) {

        taskText.classList.add(
            "task-completed"
        );

    }

    const buttonContainer =
        document.createElement("div");

    const completeButton =
        document.createElement("button");

    completeButton.innerText =
        task.completed
            ? "↩️"
            : "✅";

    completeButton.title =
        task.completed
            ? "Mark as incomplete"
            : "Complete task";

    completeButton.style.marginRight =
        "6px";

    completeButton.onclick =
        function () {

            updateTask(
                task.id,
                !task.completed
            );

        };

    const deleteButton =
        document.createElement("button");

    deleteButton.innerText =
        "🗑️";

    deleteButton.title =
        "Delete task";

    deleteButton.style.background =
        "#ef4444";

    deleteButton.onclick =
        function () {

            deleteTask(task.id);

        };

    buttonContainer.appendChild(
        completeButton
    );

    buttonContainer.appendChild(
        deleteButton
    );

    li.appendChild(
        taskText
    );

    li.appendChild(
        buttonContainer
    );

    taskList.appendChild(
        li
    );

}

/* =========================
   UPDATE TASK
========================= */

async function updateTask(
    taskId,
    completed
) {

    try {

        const response =
            await fetch(
                `${API_URL}/api/tasks/${taskId}`,
                {
                    method: "PUT",

                    headers: {
                        "Content-Type": "application/json"
                    },

                    body: JSON.stringify({
                        completed: completed
                    })
                }
            );

        if (!response.ok) {

            alert(
                "Unable to update task."
            );

            return;
        }

        loadTasks();

    } catch (error) {

        console.log(
            "UPDATE TASK ERROR:"
        );

        console.log(error);

    }

}

/* =========================
   DELETE TASK
========================= */

async function deleteTask(taskId) {

    try {

        const response =
            await fetch(
                `${API_URL}/api/tasks/${taskId}`,
                {
                    method: "DELETE"
                }
            );

        if (!response.ok) {

            alert(
                "Unable to delete task."
            );

            return;
        }

        loadTasks();

    } catch (error) {

        console.log(
            "DELETE TASK ERROR:"
        );

        console.log(error);

    }

}

/* =========================
   ADD STUDY PLAN
========================= */

async function addStudyPlan() {

    if (!currentUser) {

        alert("Please login first.");

        return;
    }

    const subject =
        document
            .getElementById("subjectInput")
            .value
            .trim();

    const topic =
        document
            .getElementById("topicInput")
            .value
            .trim();

    const studyTime =
        document
            .getElementById("timeInput")
            .value
            .trim();

    if (
        !subject ||
        !topic ||
        !studyTime
    ) {

        alert(
            "Please fill all study plan fields."
        );

        return;
    }

    try {

        const response =
            await fetch(
                `${API_URL}/api/study-plans`,
                {
                    method: "POST",

                    headers: {
                        "Content-Type": "application/json"
                    },

                    body: JSON.stringify({
                        userId: currentUser.id,
                        subject: subject,
                        topic: topic,
                        studyTime: studyTime
                    })
                }
            );

        const data =
            await response.json();

        if (!response.ok) {

            alert(data.message);

            return;
        }

        document.getElementById(
            "subjectInput"
        ).value = "";

        document.getElementById(
            "topicInput"
        ).value = "";

        document.getElementById(
            "timeInput"
        ).value = "";

        loadStudyPlans();

    } catch (error) {

        console.log(
            "ADD STUDY PLAN ERROR:"
        );

        console.log(error);

        alert(
            "Unable to add study plan."
        );

    }

}

/* =========================
   LOAD STUDY PLANS
========================= */

async function loadStudyPlans() {

    if (!currentUser) return;

    try {

        const response =
            await fetch(
                `${API_URL}/api/study-plans/${currentUser.id}`
            );

        const data =
            await response.json();

        const studyList =
            document.getElementById(
                "studyList"
            );

        studyList.innerHTML = "";

        if (
            !data.studyPlans ||
            data.studyPlans.length === 0
        ) {

            studyList.innerHTML =
                "<li>No study plans yet. 📚</li>";

            updateDashboard(
                null,
                [],
                null
            );

            return;
        }

        data.studyPlans.forEach(
            createStudyPlanElement
        );

        updateDashboard(
            null,
            data.studyPlans,
            null
        );

    } catch (error) {

        console.log(
            "LOAD STUDY PLANS ERROR:"
        );

        console.log(error);

    }

}

/* =========================
   CREATE STUDY PLAN
========================= */

function createStudyPlanElement(
    studyPlan
) {

    const studyList =
        document.getElementById(
            "studyList"
        );

    const li =
        document.createElement("li");

    const text =
        document.createElement("span");

    text.innerText =
        `${studyPlan.subject} — ${studyPlan.topic} (${studyPlan.study_time})`;

    const deleteButton =
        document.createElement("button");

    deleteButton.innerText =
        "🗑️";

    deleteButton.style.background =
        "#ef4444";

    deleteButton.onclick =
        function () {

            deleteStudyPlan(
                studyPlan.id
            );

        };

    li.appendChild(text);

    li.appendChild(
        deleteButton
    );

    studyList.appendChild(li);

}

/* =========================
   DELETE STUDY PLAN
========================= */

async function deleteStudyPlan(
    studyPlanId
) {

    try {

        const response =
            await fetch(
                `${API_URL}/api/study-plans/${studyPlanId}`,
                {
                    method: "DELETE"
                }
            );

        if (!response.ok) {

            alert(
                "Unable to delete study plan."
            );

            return;
        }

        loadStudyPlans();

    } catch (error) {

        console.log(
            "DELETE STUDY PLAN ERROR:"
        );

        console.log(error);

    }

}

/* =========================
   ADD NOTE
========================= */

async function addNote() {

    if (!currentUser) {

        alert("Please login first.");

        return;
    }

    const noteInput =
        document.getElementById(
            "noteInput"
        );

    const note =
        noteInput.value.trim();

    if (!note) {

        alert(
            "Please write a note."
        );

        return;
    }

    try {

        const response =
            await fetch(
                `${API_URL}/api/notes`,
                {
                    method: "POST",

                    headers: {
                        "Content-Type": "application/json"
                    },

                    body: JSON.stringify({
                        userId: currentUser.id,
                        note: note
                    })
                }
            );

        const data =
            await response.json();

        if (!response.ok) {

            alert(data.message);

            return;
        }

        noteInput.value = "";

        loadNotes();

    } catch (error) {

        console.log(
            "ADD NOTE ERROR:"
        );

        console.log(error);

        alert(
            "Unable to add note."
        );

    }

}

/* =========================
   LOAD NOTES
========================= */

async function loadNotes() {

    if (!currentUser) return;

    try {

        const response =
            await fetch(
                `${API_URL}/api/notes/${currentUser.id}`
            );

        const data =
            await response.json();

        const noteList =
            document.getElementById(
                "noteList"
            );

        noteList.innerHTML = "";

        if (
            !data.notes ||
            data.notes.length === 0
        ) {

            noteList.innerHTML =
                "<li>No notes yet. 📝</li>";

            updateDashboard(
                null,
                null,
                []
            );

            return;
        }

        data.notes.forEach(
            createNoteElement
        );

        updateDashboard(
            null,
            null,
            data.notes
        );

    } catch (error) {

        console.log(
            "LOAD NOTES ERROR:"
        );

        console.log(error);

    }

}

/* =========================
   CREATE NOTE
========================= */

function createNoteElement(
    note
) {

    const noteList =
        document.getElementById(
            "noteList"
        );

    const li =
        document.createElement("li");

    const text =
        document.createElement("span");

    text.innerText =
        note.note;

    const deleteButton =
        document.createElement("button");

    deleteButton.innerText =
        "🗑️";

    deleteButton.style.background =
        "#ef4444";

    deleteButton.onclick =
        function () {

            deleteNote(
                note.id
            );

        };

    li.appendChild(text);

    li.appendChild(
        deleteButton
    );

    noteList.appendChild(li);

}

/* =========================
   DELETE NOTE
========================= */

async function deleteNote(
    noteId
) {

    try {

        const response =
            await fetch(
                `${API_URL}/api/notes/${noteId}`,
                {
                    method: "DELETE"
                }
            );

        if (!response.ok) {

            alert(
                "Unable to delete note."
            );

            return;
        }

        loadNotes();

    } catch (error) {

        console.log(
            "DELETE NOTE ERROR:"
        );

        console.log(error);

    }

}

/* =========================
   DASHBOARD
========================= */

function updateDashboard(
    tasks = null,
    studyPlans = null,
    notes = null
) {

    const totalTasksElement =
        document.getElementById(
            "totalTasks"
        );

    const completedTasksElement =
        document.getElementById(
            "completedTasks"
        );

    const totalStudiesElement =
        document.getElementById(
            "totalStudies"
        );

    const totalNotesElement =
        document.getElementById(
            "totalNotes"
        );

    const progressElement =
        document.getElementById(
            "progress"
        );

    const progressBar =
        document.getElementById(
            "progressBar"
        );

    const progressStatus =
        document.getElementById(
            "progressStatus"
        );

    const productivityStatus =
        document.getElementById(
            "productivityStatus"
        );

    const productivityMessage =
        document.getElementById(
            "productivityMessage"
        );

    /* =========================
       TASK PROGRESS
    ========================= */

    if (tasks !== null) {

        const totalTasks =
            tasks.length;

        const completedTasks =
            tasks.filter(
                task =>
                    task.completed === 1 ||
                    task.completed === true
            ).length;

        let percentage = 0;

        if (totalTasks > 0) {

            percentage =
                Math.round(
                    (completedTasks / totalTasks) * 100
                );

        }

        if (totalTasksElement) {

            totalTasksElement.innerText =
                totalTasks;

        }

        if (completedTasksElement) {

            completedTasksElement.innerText =
                completedTasks;

        }

        if (progressElement) {

            progressElement.innerText =
                `${percentage}%`;

        }

        if (progressBar) {

            progressBar.style.width =
                `${percentage}%`;

        }

        let status =
            "Ready to start";

        let message =
            "Complete your first task to build momentum.";

        let progressText =
            "Let's get started! 🚀";

        if (percentage === 0) {

            status =
                "Ready to start";

            message =
                "Complete your first task to build momentum.";

            progressText =
                "Let's get started! 🚀";

        }

        else if (percentage < 40) {

            status =
                "Getting started";

            message =
                "You're building momentum. Keep going! 💪";

            progressText =
                "Great start! Keep moving.";

        }

        else if (percentage < 60) {

            status =
                "Making progress";

            message =
                "You're making good progress. Stay focused! 📈";

            progressText =
                "You're halfway there!";

        }

        else if (percentage < 80) {

            status =
                "Doing great";

            message =
                "Excellent progress! Keep the momentum going. 🔥";

            progressText =
                "You're doing great!";

        }

        else if (percentage < 100) {

            status =
                "Almost there!";

            message =
                "You're very close to completing your tasks! 🚀";

            progressText =
                "Almost at 100%!";

        }

        else {

            status =
                "Excellent!";

            message =
                "Amazing! You've completed all your tasks! 🎉";

            progressText =
                "100% complete! 🎉";

        }

        if (productivityStatus) {

            productivityStatus.innerText =
                status;

        }

        if (productivityMessage) {

            productivityMessage.innerText =
                message;

        }

        if (progressStatus) {

            progressStatus.innerText =
                progressText;

        }

    }

    /* =========================
       STUDY PLANS
    ========================= */

    if (studyPlans !== null) {

        if (totalStudiesElement) {

            totalStudiesElement.innerText =
                studyPlans.length;

        }

    }

    /* =========================
       NOTES
    ========================= */

    if (notes !== null) {

        if (totalNotesElement) {

            totalNotesElement.innerText =
                notes.length;

        }

    }

}

/* =========================
   AI QUICK BUTTONS
========================= */

function quickAI(prompt) {

    const aiInput =
        document.getElementById(
            "aiInput"
        );

    aiInput.value =
        prompt;

    aiInput.focus();

}

/* =========================
   AI QUIZ
========================= */

async function generateQuiz() {

    const topicInput =
        document.getElementById(
            "quizTopic"
        );

    const topic =
        topicInput.value.trim();

    const quizContainer =
        document.getElementById(
            "quizContainer"
        );

    if (!topic) {

        alert(
            "Please enter a quiz topic."
        );

        return;
    }

    quizContainer.innerHTML = `
        <div class="quiz-loading">
            <h3>🤖 AI is creating your quiz...</h3>
            <p>Please wait a moment.</p>
        </div>
    `;

    try {

        const response =
            await fetch(
                `${API_URL}/api/quiz`,
                {
                    method: "POST",

                    headers: {
                        "Content-Type": "application/json"
                    },

                    body: JSON.stringify({
                        topic: topic
                    })
                }
            );

        const data =
            await response.json();

        if (!response.ok) {

            quizContainer.innerHTML =
                `<p>${data.message}</p>`;

            return;
        }

        if (
            !data.quiz ||
            !data.quiz.questions ||
            data.quiz.questions.length === 0
        ) {

            quizContainer.innerHTML =
                "<p>Unable to create quiz questions.</p>";

            return;
        }

        currentQuiz =
            data.quiz.questions;

        displayQuiz();

    } catch (error) {

        console.log(
            "QUIZ ERROR:"
        );

        console.log(error);

        quizContainer.innerHTML = `
            <div class="quiz-error">
                <p>❌ Unable to generate quiz.</p>
                <p>Please make sure your backend is running.</p>
            </div>
        `;

    }

}

/* =========================
   DISPLAY QUIZ
========================= */

function displayQuiz() {

    const quizContainer =
        document.getElementById(
            "quizContainer"
        );

    quizContainer.innerHTML = "";

    const header =
        document.createElement("div");

    header.className =
        "quiz-header";

    const heading =
        document.createElement("h3");

    heading.innerText =
        "🧠 Your AI Quiz";

    const description =
        document.createElement("p");

    description.innerText =
        `${currentQuiz.length} questions • Choose one answer for each question.`;

    header.appendChild(
        heading
    );

    header.appendChild(
        description
    );

    quizContainer.appendChild(
        header
    );

    currentQuiz.forEach(
        (question, index) => {

            const questionCard =
                document.createElement("div");

            questionCard.className =
                "quiz-question-card";

            const questionTitle =
                document.createElement("h3");

            questionTitle.innerText =
                `${index + 1}. ${question.question}`;

            questionCard.appendChild(
                questionTitle
            );

            const optionsContainer =
                document.createElement("div");

            optionsContainer.className =
                "quiz-options";

            question.options.forEach(
                option => {

                    const optionLabel =
                        document.createElement("label");

                    optionLabel.className =
                        "quiz-option";

                    const radio =
                        document.createElement("input");

                    radio.type =
                        "radio";

                    radio.name =
                        `question-${index}`;

                    radio.value =
                        option;

                    const optionText =
                        document.createElement("span");

                    optionText.innerText =
                        option;

                    optionLabel.appendChild(
                        radio
                    );

                    optionLabel.appendChild(
                        optionText
                    );

                    radio.addEventListener(
                        "change",
                        function () {

                            const allOptions =
                                optionsContainer.querySelectorAll(
                                    ".quiz-option"
                                );

                            allOptions.forEach(
                                item => {

                                    item.classList.remove(
                                        "selected"
                                    );

                                }
                            );

                            optionLabel.classList.add(
                                "selected"
                            );

                        }
                    );

                    optionsContainer.appendChild(
                        optionLabel
                    );

                }
            );

            questionCard.appendChild(
                optionsContainer
            );

            quizContainer.appendChild(
                questionCard
            );

        }
    );

    const submitButton =
        document.createElement("button");

    submitButton.className =
        "quiz-submit-button";

    submitButton.innerText =
        "🏆 Submit Quiz";

    submitButton.onclick =
        checkQuiz;

    quizContainer.appendChild(
        submitButton
    );

}

/* =========================
   CHECK QUIZ
========================= */

function checkQuiz() {

    if (
        !currentQuiz ||
        currentQuiz.length === 0
    ) {

        return;
    }

    let score = 0;

    let unanswered = 0;

    currentQuiz.forEach(
        (question, index) => {

            const selected =
                document.querySelector(
                    `input[name="question-${index}"]:checked`
                );

            if (!selected) {

                unanswered++;

                return;
            }

            if (
                selected.value ===
                question.answer
            ) {

                score++;

            }

        }
    );

    if (unanswered > 0) {

        alert(
            `Please answer all questions. ${unanswered} question(s) remaining.`
        );

        return;
    }

    showQuizResult(score);

}

/* =========================
   QUIZ RESULT
========================= */

function showQuizResult(score) {

    const quizContainer =
        document.getElementById(
            "quizContainer"
        );

    const total =
        currentQuiz.length;

    const percentage =
        Math.round(
            (score / total) * 100
        );

    let message = "";

    if (percentage === 100) {

        message =
            "Perfect score! You're doing amazing! 🔥";

    }

    else if (percentage >= 80) {

        message =
            "Excellent work! Keep it up! 🚀";

    }

    else if (percentage >= 60) {

        message =
            "Good job! A little more practice will make you even better. 💪";

    }

    else {

        message =
            "Keep learning and try the quiz again! 📚";

    }

    quizContainer.innerHTML = `

        <div class="quiz-result">

            <div class="quiz-result-icon">
                🏆
            </div>

            <h2>
                Quiz Complete!
            </h2>

            <p class="quiz-score">
                ${score} / ${total}
            </p>

            <p class="quiz-percentage">
                ${percentage}%
            </p>

            <p class="quiz-message">
                ${message}
            </p>

            <button
                class="quiz-restart-button"
                onclick="restartQuiz()"
            >

                🔄 Try Again

            </button>

        </div>

    `;

}

/* =========================
   RESTART QUIZ
========================= */

function restartQuiz() {

    const quizTopic =
        document.getElementById(
            "quizTopic"
        );

    const topic =
        quizTopic.value.trim();

    if (!topic) {

        alert(
            "Please enter a quiz topic."
        );

        return;
    }

    generateQuiz();

}

/* =========================
   OLD CHECK ANSWER
========================= */

function checkAnswer() {

    if (
        currentQuiz.length > 0
    ) {

        checkQuiz();

    }

    else {

        alert(
            "Please generate a quiz first."
        );

    }

}

/* =========================
   FORMAT AI RESPONSE
========================= */

function formatAIResponse(answer) {

    if (!answer) {

        return `
            <div class="ai-response-box">
                <div class="ai-response-content">
                    No answer received.
                </div>
            </div>
        `;

    }

    const sections = [];

    let currentSection = null;

    const lines =
        answer
            .replace(/\r/g, "")
            .split("\n");

    lines.forEach(line => {

        const trimmed =
            line.trim();

        if (!trimmed) {
            return;
        }

        let title = null;

        if (
            trimmed.includes("📌") &&
            trimmed.toLowerCase().includes("simple explanation")
        ) {

            title =
                "📌 Simple Explanation";

        }

        else if (
            trimmed.includes("💡") &&
            trimmed.toLowerCase().includes("key points")
        ) {

            title =
                "💡 Key Points";

        }

        else if (
            trimmed.includes("🧠") &&
            trimmed.toLowerCase().includes("example")
        ) {

            title =
                "🧠 Example";

        }

        else if (
            trimmed.includes("📝") &&
            trimmed.toLowerCase().includes("quick recap")
        ) {

            title =
                "📝 Quick Recap";

        }

        if (title) {

            currentSection = {

                title: title,

                content: []

            };

            sections.push(
                currentSection
            );

        } else if (currentSection) {

            currentSection.content.push(
                trimmed
            );

        } else {

            if (!sections.length) {

                sections.push({

                    title:
                        "🤖 AI Assistant",

                    content: [
                        trimmed
                    ]

                });

                currentSection =
                    sections[0];

            }

        }

    });

    if (sections.length === 0) {

        sections.push({

            title:
                "🤖 AI Assistant",

            content:
                [answer]

        });

    }

    let html =
        `<div class="ai-response-box">`;

    sections.forEach(section => {

        html += `
            <div class="ai-response-section">

                <div class="ai-response-title">
                    ${section.title}
                </div>

                <div class="ai-response-content">
        `;

        section.content.forEach(line => {

            if (
                line.startsWith("- ") ||
                line.startsWith("• ")
            ) {

                html +=
                    `<div>• ${line.substring(2)}</div>`;

            }

            else {

                html +=
                    `<div>${line}</div>`;

            }

        });

        html += `
                </div>

            </div>
        `;

    });

    html +=
        `</div>`;

    return html;

}

/* =========================
   AI ASSISTANT
========================= */

async function askAI() {

    if (!currentUser) {

        alert(
            "Please login first."
        );

        return;
    }

    const aiInput =
        document.getElementById(
            "aiInput"
        );

    const aiResult =
        document.getElementById(
            "aiResult"
        );

    const question =
        aiInput.value.trim();

    if (!question) {

        alert(
            "Please enter a question."
        );

        return;
    }

    /* =========================
       LOADING UI
    ========================= */

    aiResult.innerHTML = `

        <div class="ai-response-box">

            <div class="ai-loading">

                <span class="ai-loading-dot"></span>

                <span>
                    AI is thinking...
                </span>

            </div>

        </div>

    `;

    try {

        const response =
            await fetch(
                `${API_URL}/api/ask`,
                {
                    method: "POST",

                    headers: {
                        "Content-Type": "application/json"
                    },

                    body: JSON.stringify({
                        question: question
                    })
                }
            );

        const data =
            await response.json();

        if (!response.ok) {

            aiResult.innerHTML = `

                <div class="ai-error">

                    ❌ ${
                        data.message ||
                        "Unable to get AI response."
                    }

                </div>

            `;

            return;
        }

        /* =========================
           DISPLAY FORMATTED ANSWER
        ========================= */

        aiResult.innerHTML =
            formatAIResponse(
                data.answer
            );

    } catch (error) {

        console.log(
            "AI ERROR:"
        );

        console.log(error);

        aiResult.innerHTML = `

            <div class="ai-error">

                ❌ Unable to connect to the AI server.

                <br><br>

                Please make sure your backend is running.

            </div>

        `;

    }

}

/* =========================
   START APP
========================= */

checkLogin();

