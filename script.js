console.log("AI Student Companion script loaded");
// =====================================================
// AI STUDENT COMPANION
// COMPLETE UPDATED SCRIPT.JS
// =====================================================


// =====================================================
// API URL
// =====================================================

const API_URL =
    "https://ai-student-companion-njmj.onrender.com";


// =====================================================
// CURRENT USER
// =====================================================

let currentUser =
    JSON.parse(localStorage.getItem("currentUser"));


// =====================================================
// PAGE LOAD
// =====================================================

document.addEventListener(
    "DOMContentLoaded",
    function () {

        checkLogin();

    }
);


// =====================================================
// AUTH CARD CONTROL
// =====================================================

function showOnlyRegister() {

    const registerCard =
        document.getElementById("registerCard");

    const loginCard =
        document.getElementById("loginCard");

    if (!registerCard || !loginCard) {
        return;
    }


    // SHOW REGISTER

    registerCard.classList.remove(
        "auth-hidden"
    );

    registerCard.classList.add(
        "auth-visible"
    );

    registerCard.style.setProperty(
        "display",
        "block",
        "important"
    );


    // HIDE LOGIN

    loginCard.classList.remove(
        "auth-visible"
    );

    loginCard.classList.add(
        "auth-hidden"
    );

    loginCard.style.setProperty(
        "display",
        "none",
        "important"
    );

}


// =====================================================
// SHOW LOGIN ONLY
// =====================================================

function showOnlyLogin() {

    const registerCard =
        document.getElementById("registerCard");

    const loginCard =
        document.getElementById("loginCard");

    if (!registerCard || !loginCard) {
        return;
    }


    // HIDE REGISTER

    registerCard.classList.remove(
        "auth-visible"
    );

    registerCard.classList.add(
        "auth-hidden"
    );

    registerCard.style.setProperty(
        "display",
        "none",
        "important"
    );


    // SHOW LOGIN

    loginCard.classList.remove(
        "auth-hidden"
    );

    loginCard.classList.add(
        "auth-visible"
    );

    loginCard.style.setProperty(
        "display",
        "block",
        "important"
    );

}


// =====================================================
// REGISTER BUTTON
// =====================================================

function showRegisterForm() {

    console.log(
        "Register button clicked"
    );

    showOnlyRegister();

}


// =====================================================
// LOGIN BUTTON
// =====================================================

function showLoginForm() {

    console.log(
        "Login button clicked"
    );

    showOnlyLogin();

}


// =====================================================
// EXTRA AUTH FUNCTIONS
// =====================================================

function showRegister() {

    showOnlyRegister();

}


function showLogin() {

    showOnlyLogin();

}


// =====================================================
// CHECK LOGIN
// =====================================================

function checkLogin() {

    if (currentUser) {

        const welcomeMessage =
            document.getElementById(
                "welcomeMessage"
            );

        if (welcomeMessage) {

            welcomeMessage.innerText =
                "Welcome, " +
                currentUser.name +
                "! 👋";

        }

        showApp();

        loadTasks();
        loadStudyPlans();
        loadNotes();

        return;

    }


    // User is not logged in

    hideApp();


    const registrationCompleted =
        localStorage.getItem(
            "registrationCompleted"
        );


    if (
        registrationCompleted === "true"
    ) {

        showOnlyLogin();

    } else {

        showOnlyRegister();

    }

}


// =====================================================
// SHOW APP
// =====================================================

function showApp() {

    const authSection =
        document.getElementById(
            "authSection"
        );

    const appSection =
        document.getElementById(
            "appSection"
        );

    const logoutButton =
        document.getElementById(
            "logoutButton"
        );


    // HIDE AUTH

    if (authSection) {

        authSection.style.setProperty(
            "display",
            "none",
            "important"
        );

    }


    // SHOW APP

    if (appSection) {

        appSection.style.setProperty(
            "display",
            "block",
            "important"
        );

    }


    // SHOW LOGOUT

    if (logoutButton) {

        logoutButton.style.setProperty(
            "display",
            "block",
            "important"
        );

    }

}


// =====================================================
// HIDE APP
// =====================================================

function hideApp() {

    const authSection =
        document.getElementById(
            "authSection"
        );

    const appSection =
        document.getElementById(
            "appSection"
        );

    const logoutButton =
        document.getElementById(
            "logoutButton"
        );


    // SHOW AUTH

    if (authSection) {

        authSection.style.setProperty(
            "display",
            "block",
            "important"
        );

    }


    // HIDE APP

    if (appSection) {

        appSection.style.setProperty(
            "display",
            "none",
            "important"
        );

    }


    // HIDE LOGOUT

    if (logoutButton) {

        logoutButton.style.setProperty(
            "display",
            "none",
            "important"
        );

    }

}


// =====================================================
// ENTER APP
// =====================================================

function enterApp() {

    const authSection =
        document.getElementById(
            "authSection"
        );

    if (authSection) {

        authSection.scrollIntoView({
            behavior: "smooth"
        });

    }

}


// =====================================================
// REGISTER USER
// =====================================================

async function registerUser() {

    const nameElement =
        document.getElementById(
            "registerName"
        );

    const emailElement =
        document.getElementById(
            "registerEmail"
        );

    const passwordElement =
        document.getElementById(
            "registerPassword"
        );

    const authMessage =
        document.getElementById(
            "authMessage"
        );


    const name =
        nameElement.value.trim();

    const email =
        emailElement.value.trim();

    const password =
        passwordElement.value.trim();


    if (
        !name ||
        !email ||
        !password
    ) {

        if (authMessage) {

            authMessage.innerText =
                "Please fill all fields.";

        }

        return;

    }


    try {

        if (authMessage) {

            authMessage.innerText =
                "Creating your account...";

        }


        const response =
            await fetch(
                API_URL +
                "/api/register",
                {
                    method: "POST",

                    headers: {
                        "Content-Type":
                            "application/json"
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

            if (authMessage) {

                authMessage.innerText =
                    data.message ||
                    "Registration failed.";

            }

            return;

        }


        // Registration successful

        localStorage.setItem(
            "registrationCompleted",
            "true"
        );


        if (authMessage) {

            authMessage.innerText =
                "Registration successful! Please login. ✅";

        }


        // Clear register fields

        nameElement.value = "";
        emailElement.value = "";
        passwordElement.value = "";


        // SHOW LOGIN

        showOnlyLogin();


        // Put registered email
        // into login box

        const loginEmail =
            document.getElementById(
                "loginEmail"
            );

        const loginPassword =
            document.getElementById(
                "loginPassword"
            );


        if (loginEmail) {

            loginEmail.value =
                email;

        }


        if (loginPassword) {

            loginPassword.focus();

        }

    } catch (error) {

        console.error(
            "Registration error:",
            error
        );


        if (authMessage) {

            authMessage.innerText =
                "Cannot connect to the server. Please try again.";

        }

    }

}


// =====================================================
// LOGIN USER
// =====================================================

async function loginUser() {

    const emailElement =
        document.getElementById(
            "loginEmail"
        );

    const passwordElement =
        document.getElementById(
            "loginPassword"
        );

    const authMessage =
        document.getElementById(
            "authMessage"
        );


    const email =
        emailElement.value.trim();

    const password =
        passwordElement.value.trim();


    if (
        !email ||
        !password
    ) {

        if (authMessage) {

            authMessage.innerText =
                "Please enter email and password.";

        }

        return;

    }


    try {

        if (authMessage) {

            authMessage.innerText =
                "Logging in...";

        }


        const response =
            await fetch(
                API_URL +
                "/api/login",
                {
                    method: "POST",

                    headers: {
                        "Content-Type":
                            "application/json"
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

            if (authMessage) {

                authMessage.innerText =
                    data.message ||
                    "Login failed.";

            }

            return;

        }


        // SAVE USER

        currentUser =
            data.user;


        localStorage.setItem(
            "currentUser",
            JSON.stringify(
                currentUser
            )
        );


        localStorage.setItem(
            "registrationCompleted",
            "true"
        );


        // Clear login fields

        emailElement.value = "";
        passwordElement.value = "";


        if (authMessage) {

            authMessage.innerText = "";

        }


        // SHOW APP

        showApp();


        const welcomeMessage =
            document.getElementById(
                "welcomeMessage"
            );


        if (welcomeMessage) {

            welcomeMessage.innerText =
                "Welcome, " +
                currentUser.name +
                "! 👋";

        }


        // Load data

        loadTasks();
        loadStudyPlans();
        loadNotes();

    } catch (error) {

        console.error(
            "Login error:",
            error
        );


        if (authMessage) {

            authMessage.innerText =
                "Cannot connect to the server. Please try again.";

        }

    }

}


// =====================================================
// LOGOUT
// =====================================================

function logoutUser() {

    currentUser = null;


    localStorage.removeItem(
        "currentUser"
    );


    // Clear tasks

    const taskList =
        document.getElementById(
            "taskList"
        );

    if (taskList) {

        taskList.innerHTML = "";

    }


    // Clear study plans

    const studyPlanList =
        document.getElementById(
            "studyPlanList"
        );

    if (studyPlanList) {

        studyPlanList.innerHTML = "";

    }


    // Clear notes

    const notesList =
        document.getElementById(
            "notesList"
        );

    if (notesList) {

        notesList.innerHTML = "";

    }


    // Reset statistics

    const totalTasks =
        document.getElementById(
            "totalTasks"
        );

    const completedTasks =
        document.getElementById(
            "completedTasks"
        );

    const totalStudyPlans =
        document.getElementById(
            "totalStudyPlans"
        );

    const totalNotes =
        document.getElementById(
            "totalNotes"
        );


    if (totalTasks) {

        totalTasks.innerText =
            "0";

    }


    if (completedTasks) {

        completedTasks.innerText =
            "0";

    }


    if (totalStudyPlans) {

        totalStudyPlans.innerText =
            "0";

    }


    if (totalNotes) {

        totalNotes.innerText =
            "0";

    }


    // Hide app

    hideApp();


    // SHOW LOGIN

    showOnlyLogin();


    const authMessage =
        document.getElementById(
            "authMessage"
        );


    if (authMessage) {

        authMessage.innerText = "";

    }

}


// =====================================================
// PASSWORD SHOW / HIDE
// =====================================================

function togglePassword(
    inputId,
    button
) {

    const input =
        document.getElementById(
            inputId
        );


    if (!input) {

        return;

    }


    if (
        input.type ===
        "password"
    ) {

        input.type = "text";

        button.innerText =
            "🙈";

    } else {

        input.type = "password";

        button.innerText =
            "👁️";

    }

}


// =====================================================
// ADD TASK
// =====================================================

async function addTask() {

    if (!currentUser) {

        return;

    }


    const taskInput =
        document.getElementById(
            "taskInput"
        );


    const task =
        taskInput.value.trim();


    if (!task) {

        return;

    }


    try {

        const response =
            await fetch(
                API_URL +
                "/api/tasks",
                {
                    method: "POST",

                    headers: {
                        "Content-Type":
                            "application/json"
                    },

                    body: JSON.stringify({
                        userId:
                            currentUser.id,

                        task: task
                    })
                }
            );


        const data =
            await response.json();


        if (!response.ok) {

            alert(
                data.message ||
                "Could not add task."
            );

            return;

        }


        taskInput.value = "";

        loadTasks();

    } catch (error) {

        console.error(error);

        alert(
            "Could not connect to the server."
        );

    }

}


// =====================================================
// LOAD TASKS
// =====================================================

async function loadTasks() {

    if (!currentUser) {

        return;

    }


    try {

        const response =
            await fetch(
                API_URL +
                "/api/tasks/" +
                currentUser.id
            );


        const tasks =
            await response.json();


        const taskList =
            document.getElementById(
                "taskList"
            );


        if (!taskList) {

            return;

        }


        taskList.innerHTML = "";


        if (
            !tasks ||
            tasks.length === 0
        ) {

            taskList.innerHTML =
                "<li>No tasks yet. Add your first task! 🚀</li>";

            updateTaskStats([]);

            return;

        }


        tasks.forEach(
            function (task) {

                createTaskElement(
                    task
                );

            }
        );


        updateTaskStats(
            tasks
        );

    } catch (error) {

        console.error(
            "Load tasks error:",
            error
        );

    }

}


// =====================================================
// CREATE TASK ELEMENT
// =====================================================

function createTaskElement(task) {

    const taskList =
        document.getElementById(
            "taskList"
        );


    if (!taskList) {

        return;

    }


    const li =
        document.createElement(
            "li"
        );


    li.className =
        task.completed
            ? "completed"
            : "";


    li.innerHTML = `

        <span
            onclick="updateTask(
                ${task.id},
                ${!task.completed}
            )"
            style="cursor:pointer;"
        >
            ${task.completed ? "✅" : "⬜"}
            ${task.task}
        </span>

        <button
            onclick="deleteTask(${task.id})"
        >
            🗑️
        </button>

    `;


    taskList.appendChild(li);

}


// =====================================================
// UPDATE TASK
// =====================================================

async function updateTask(
    taskId,
    completed
) {

    try {

        const response =
            await fetch(
                API_URL +
                "/api/tasks/" +
                taskId,
                {
                    method: "PUT",

                    headers: {
                        "Content-Type":
                            "application/json"
                    },

                    body: JSON.stringify({
                        completed:
                            completed
                    })
                }
            );


        if (!response.ok) {

            alert(
                "Could not update task."
            );

            return;

        }


        loadTasks();

    } catch (error) {

        console.error(error);

    }

}


// =====================================================
// DELETE TASK
// =====================================================

async function deleteTask(taskId) {

    try {

        const response =
            await fetch(
                API_URL +
                "/api/tasks/" +
                taskId,
                {
                    method: "DELETE"
                }
            );


        if (!response.ok) {

            alert(
                "Could not delete task."
            );

            return;

        }


        loadTasks();

    } catch (error) {

        console.error(error);

    }

}


// =====================================================
// UPDATE TASK STATS
// =====================================================

function updateTaskStats(tasks) {

    const totalTasks =
        document.getElementById(
            "totalTasks"
        );

    const completedTasks =
        document.getElementById(
            "completedTasks"
        );


    const total =
        tasks.length;


    const completed =
        tasks.filter(
            task => task.completed
        ).length;


    if (totalTasks) {

        totalTasks.innerText =
            total;

    }


    if (completedTasks) {

        completedTasks.innerText =
            completed;

    }


    updateProgress(
        total,
        completed
    );

}


// =====================================================
// UPDATE PROGRESS
// =====================================================

function updateProgress(
    total,
    completed
) {

    const progress =
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


    let percentage = 0;


    if (total > 0) {

        percentage =
            Math.round(
                (completed / total) *
                100
            );

    }


    if (progress) {

        progress.innerText =
            percentage + "%";

    }


    if (progressBar) {

        progressBar.style.width =
            percentage + "%";

    }


    if (progressStatus) {

        if (percentage === 0) {

            progressStatus.innerText =
                "Let's get started! 🚀";

        } else if (
            percentage < 50
        ) {

            progressStatus.innerText =
                "Good start! Keep going! 💪";

        } else if (
            percentage < 100
        ) {

            progressStatus.innerText =
                "You're doing great! 🔥";

        } else {

            progressStatus.innerText =
                "Amazing! All tasks completed! 🎉";

        }

    }


    updateProductivity(
        percentage
    );

}


// =====================================================
// PRODUCTIVITY STATUS
// =====================================================

function updateProductivity(
    percentage
) {

    const status =
        document.getElementById(
            "productivityStatus"
        );

    const message =
        document.getElementById(
            "productivityMessage"
        );


    if (!status) {

        return;

    }


    if (percentage === 0) {

        status.innerText =
            "Ready to start 🚀";

        if (message) {

            message.innerText =
                "Complete your first task to build momentum.";

        }

    } else if (
        percentage < 50
    ) {

        status.innerText =
            "Getting started 💪";

        if (message) {

            message.innerText =
                "Keep completing tasks and build your momentum.";

        }

    } else if (
        percentage < 100
    ) {

        status.innerText =
            "Doing great 🔥";

        if (message) {

            message.innerText =
                "You're making excellent progress.";

        }

    } else {

        status.innerText =
            "Excellent 🎉";

        if (message) {

            message.innerText =
                "You've completed everything. Great work!";

        }

    }

}


// =====================================================
// ADD STUDY PLAN
// =====================================================

async function addStudyPlan() {

    if (!currentUser) {

        return;

    }


    const subjectInput =
        document.getElementById(
            "subjectInput"
        );

    const topicInput =
        document.getElementById(
            "topicInput"
        );

    const timeInput =
        document.getElementById(
            "timeInput"
        );


    const subject =
        subjectInput.value.trim();

    const topic =
        topicInput.value.trim();

    const studyTime =
        timeInput.value.trim();


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
                API_URL +
                "/api/study-plans",
                {
                    method: "POST",

                    headers: {
                        "Content-Type":
                            "application/json"
                    },

                    body: JSON.stringify({
                        userId:
                            currentUser.id,

                        subject:
                            subject,

                        topic:
                            topic,

                        studyTime:
                            studyTime
                    })
                }
            );


        const data =
            await response.json();


        if (!response.ok) {

            alert(
                data.message ||
                "Could not add study plan."
            );

            return;

        }


        subjectInput.value = "";
        topicInput.value = "";
        timeInput.value = "";


        loadStudyPlans();

    } catch (error) {

        console.error(error);

        alert(
            "Could not connect to the server."
        );

    }

}


// =====================================================
// LOAD STUDY PLANS
// =====================================================

async function loadStudyPlans() {

    if (!currentUser) {

        return;

    }


    try {

        const response =
            await fetch(
                API_URL +
                "/api/study-plans/" +
                currentUser.id
            );


        const plans =
            await response.json();


        const studyPlanList =
            document.getElementById(
                "studyPlanList"
            );


        if (!studyPlanList) {

            return;

        }


        studyPlanList.innerHTML = "";


        if (
            !plans ||
            plans.length === 0
        ) {

            studyPlanList.innerHTML =
                "<p>No study plans yet. 📚</p>";

            updateStudyStats([]);

            return;

        }


        plans.forEach(
            function (plan) {

                const div =
                    document.createElement(
                        "div"
                    );


                div.className =
                    "study-plan-item";


                div.innerHTML = `

                    <strong>
                        ${plan.subject}
                    </strong>

                    -

                    ${plan.topic}

                    <br>

                    ⏱️ ${plan.study_time}

                    <button
                        onclick="deleteStudyPlan(${plan.id})"
                    >
                        🗑️
                    </button>

                `;


                studyPlanList.appendChild(
                    div
                );

            }
        );


        updateStudyStats(
            plans
        );

    } catch (error) {

        console.error(
            "Load study plans error:",
            error
        );

    }

}


// =====================================================
// UPDATE STUDY STATS
// =====================================================

function updateStudyStats(plans) {

    const totalStudyPlans =
        document.getElementById(
            "totalStudyPlans"
        );


    if (totalStudyPlans) {

        totalStudyPlans.innerText =
            plans.length;

    }

}


// =====================================================
// DELETE STUDY PLAN
// =====================================================

async function deleteStudyPlan(
    planId
) {

    try {

        const response =
            await fetch(
                API_URL +
                "/api/study-plans/" +
                planId,
                {
                    method: "DELETE"
                }
            );


        if (!response.ok) {

            alert(
                "Could not delete study plan."
            );

            return;

        }


        loadStudyPlans();

    } catch (error) {

        console.error(error);

    }

}


// =====================================================
// ADD NOTE
// =====================================================

async function addNote() {

    if (!currentUser) {

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
                API_URL +
                "/api/notes",
                {
                    method: "POST",

                    headers: {
                        "Content-Type":
                            "application/json"
                    },

                    body: JSON.stringify({
                        userId:
                            currentUser.id,

                        note:
                            note
                    })
                }
            );


        const data =
            await response.json();


        if (!response.ok) {

            alert(
                data.message ||
                "Could not add note."
            );

            return;

        }


        noteInput.value = "";

        loadNotes();

    } catch (error) {

        console.error(error);

        alert(
            "Could not connect to the server."
        );

    }

}


// =====================================================
// LOAD NOTES
// =====================================================

async function loadNotes() {

    if (!currentUser) {

        return;

    }


    try {

        const response =
            await fetch(
                API_URL +
                "/api/notes/" +
                currentUser.id
            );


        const notes =
            await response.json();


        const notesList =
            document.getElementById(
                "notesList"
            );


        if (!notesList) {

            return;

        }


        notesList.innerHTML = "";


        if (
            !notes ||
            notes.length === 0
        ) {

            notesList.innerHTML =
                "<p>No notes yet. 📝</p>";

            updateNoteStats([]);

            return;

        }


        notes.forEach(
            function (note) {

                const div =
                    document.createElement(
                        "div"
                    );


                div.className =
                    "note-item";


                div.innerHTML = `

                    <span>
                        ${note.note}
                    </span>

                    <button
                        onclick="deleteNote(${note.id})"
                    >
                        🗑️
                    </button>

                `;


                notesList.appendChild(
                    div
                );

            }
        );


        updateNoteStats(
            notes
        );

    } catch (error) {

        console.error(
            "Load notes error:",
            error
        );

    }

}


// =====================================================
// UPDATE NOTE STATS
// =====================================================

function updateNoteStats(notes) {

    const totalNotes =
        document.getElementById(
            "totalNotes"
        );


    if (totalNotes) {

        totalNotes.innerText =
            notes.length;

    }

}


// =====================================================
// DELETE NOTE
// =====================================================

async function deleteNote(
    noteId
) {

    try {

        const response =
            await fetch(
                API_URL +
                "/api/notes/" +
                noteId,
                {
                    method: "DELETE"
                }
            );


        if (!response.ok) {

            alert(
                "Could not delete note."
            );

            return;

        }


        loadNotes();

    } catch (error) {

        console.error(error);

    }

}


// =====================================================
// QUICK AI
// =====================================================

function quickAI(question) {

    const aiInput =
        document.getElementById(
            "aiInput"
        );


    if (aiInput) {

        aiInput.value =
            question;

        aiInput.focus();

    }

}


// =====================================================
// AI QUICK BUTTON SUPPORT
// =====================================================

function setAIQuestion(question) {

    quickAI(question);

}


// =====================================================
// ASK AI
// =====================================================

async function askAI() {

    const aiInput =
        document.getElementById(
            "aiInput"
        );

    const aiResult =
        document.getElementById(
            "aiResult"
        );


    const aiResponse =
        document.getElementById(
            "aiResponse"
        );


    const output =
        aiResult ||
        aiResponse;


    if (!aiInput || !output) {

        return;

    }


    const question =
        aiInput.value.trim();


    if (!question) {

        output.innerText =
            "Please ask a question.";

        return;

    }


    output.innerText =
        "🤖 AI is thinking...";


    try {

        const response =
            await fetch(
                API_URL +
                "/api/ai",
                {
                    method: "POST",

                    headers: {
                        "Content-Type":
                            "application/json"
                    },

                    body: JSON.stringify({
                        question:
                            question
                    })
                }
            );


        const data =
            await response.json();


        if (!response.ok) {

            output.innerText =
                data.message ||
                "AI could not answer right now.";

            return;

        }


        output.innerText =
            data.answer ||
            data.response ||
            "No response received.";

    } catch (error) {

        console.error(
            "AI error:",
            error
        );


        output.innerText =
            "Sorry, I couldn't get an AI response right now.";

    }

}


// =====================================================
// GENERATE QUIZ
// =====================================================

async function generateQuiz() {

    const quizTopic =
        document.getElementById(
            "quizTopic"
        );

    const quizContainer =
        document.getElementById(
            "quizContainer"
        );


    if (
        !quizTopic ||
        !quizContainer
    ) {

        alert(
            "Quiz container not found in HTML."
        );

        return;

    }


    const topic =
        quizTopic.value.trim();


    if (!topic) {

        alert(
            "Please enter a quiz topic."
        );

        return;

    }


    quizContainer.innerHTML =
        "<p>🤖 Generating quiz...</p>";


    try {

        const response =
            await fetch(
                API_URL +
                "/api/quiz",
                {
                    method: "POST",

                    headers: {
                        "Content-Type":
                            "application/json"
                    },

                    body: JSON.stringify({
                        topic:
                            topic
                    })
                }
            );


        const data =
            await response.json();


        if (!response.ok) {

            quizContainer.innerHTML =
                `<p>${
                    data.message ||
                    "Could not generate quiz."
                }</p>`;

            return;

        }


        if (data.quiz) {

            quizContainer.innerHTML =
                data.quiz;

        } else if (
            data.answer
        ) {

            quizContainer.innerHTML =
                `<p>${data.answer}</p>`;

        } else {

            quizContainer.innerHTML =
                "<p>Quiz generated successfully.</p>";

        }

    } catch (error) {

        console.error(
            "Quiz error:",
            error
        );


        quizContainer.innerHTML =
            "<p>Sorry, quiz generation failed.</p>";

    }

}


// =====================================================
// END OF SCRIPT
// =====================================================