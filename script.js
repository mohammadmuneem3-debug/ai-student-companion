// =====================================================
// AI STUDENT COMPANION
// COMPLETE UPDATED SCRIPT.JS
// =====================================================


// =====================================================
// SCRIPT TEST
// =====================================================

console.log("AI Student Companion script loaded");


// =====================================================
// API URL
// =====================================================

const API_URL = "https://ai-student-companion-njmj.onrender.com";


// =====================================================
// CURRENT USER
// =====================================================

let currentUser = JSON.parse(
    localStorage.getItem("currentUser")
);


// =====================================================
// PAGE LOAD
// =====================================================

document.addEventListener("DOMContentLoaded", function () {

    console.log("DOM loaded");

    // Login/Register switch buttons

    const loginSwitchButton =
        document.getElementById("loginSwitchButton");

    const registerSwitchButton =
        document.getElementById("registerSwitchButton");


    if (loginSwitchButton) {

        loginSwitchButton.addEventListener(
            "click",
            function () {

                console.log("Login switch clicked");

                showLoginForm();

            }
        );

    }


    if (registerSwitchButton) {

        registerSwitchButton.addEventListener(
            "click",
            function () {

                console.log("Register switch clicked");

                showRegisterForm();

            }
        );

    }


    // Check login status

    checkLogin();

});


// =====================================================
// AUTH CARD DISPLAY
// =====================================================

function showOnlyRegister() {

    console.log("Showing register form");

    const registerCard =
        document.getElementById("registerCard");

    const loginCard =
        document.getElementById("loginCard");


    if (!registerCard || !loginCard) {

        console.error(
            "Register or Login card not found"
        );

        return;

    }


    registerCard.style.display = "block";

    loginCard.style.display = "none";

}


// =====================================================
// SHOW LOGIN
// =====================================================

function showOnlyLogin() {

    console.log("Showing login form");

    const registerCard =
        document.getElementById("registerCard");

    const loginCard =
        document.getElementById("loginCard");


    if (!registerCard || !loginCard) {

        console.error(
            "Register or Login card not found"
        );

        return;

    }


    registerCard.style.display = "none";

    loginCard.style.display = "block";

}


// =====================================================
// SWITCH FUNCTIONS
// =====================================================

function showRegisterForm() {

    showOnlyRegister();

}


function showLoginForm() {

    showOnlyLogin();

}


function showLogin() {

    showOnlyLogin();

}


function showRegister() {

    showOnlyRegister();

}


// =====================================================
// CHECK LOGIN
// =====================================================

function checkLogin() {

    console.log("Checking login status...");


    currentUser = JSON.parse(
        localStorage.getItem("currentUser")
    );


    if (currentUser) {

        console.log(
            "User already logged in:",
            currentUser
        );


        showApp();

        loadTasks();

        loadStudyPlans();

        loadNotes();

        return;

    }


    hideApp();


    const registrationCompleted =
        localStorage.getItem(
            "registrationCompleted"
        );


    if (registrationCompleted === "true") {

        showOnlyLogin();

    } else {

        showOnlyRegister();

    }

}


// =====================================================
// SHOW APPLICATION
// =====================================================

function showApp() {

    const authSection =
        document.getElementById("authSection");

    const appSection =
        document.getElementById("appSection");

    const logoutButton =
        document.getElementById("logoutButton");


    if (authSection) {

        authSection.style.display = "none";

    }


    if (appSection) {

        appSection.style.display = "block";

    }


    if (logoutButton) {

        logoutButton.style.display = "block";

    }


    const welcomeMessage =
        document.getElementById("welcomeMessage");


    if (welcomeMessage && currentUser) {

        welcomeMessage.textContent =
            `Welcome, ${currentUser.name || "Student"}!`;

    }

}


// =====================================================
// HIDE APPLICATION
// =====================================================

function hideApp() {

    const authSection =
        document.getElementById("authSection");

    const appSection =
        document.getElementById("appSection");

    const logoutButton =
        document.getElementById("logoutButton");


    if (authSection) {

        authSection.style.display = "block";

    }


    if (appSection) {

        appSection.style.display = "none";

    }


    if (logoutButton) {

        logoutButton.style.display = "none";

    }

}


// =====================================================
// REGISTER USER
// =====================================================

async function registerUser() {

    const name =
        document.getElementById("registerName").value.trim();

    const email =
        document.getElementById("registerEmail").value.trim();

    const password =
        document.getElementById("registerPassword").value.trim();


    if (!name || !email || !password) {

        alert("Please fill all fields.");

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
                        name,
                        email,
                        password
                    })

                }
            );


        const data =
            await response.json();


        if (!response.ok) {

            alert(
                data.message ||
                "Registration failed."
            );

            return;

        }


        alert(
            "Registration successful! Please login."
        );


        localStorage.setItem(
            "registrationCompleted",
            "true"
        );


        // Clear fields

        document.getElementById(
            "registerName"
        ).value = "";

        document.getElementById(
            "registerEmail"
        ).value = "";

        document.getElementById(
            "registerPassword"
        ).value = "";


        // Show login

        showOnlyLogin();

    }

    catch (error) {

        console.error(
            "Registration error:",
            error
        );

        alert(
            "Could not connect to the server."
        );

    }

}


// =====================================================
// LOGIN USER
// =====================================================

async function loginUser() {

    const email =
        document.getElementById("loginEmail").value.trim();

    const password =
        document.getElementById("loginPassword").value.trim();


    if (!email || !password) {

        alert(
            "Please enter email and password."
        );

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
                        email,
                        password
                    })

                }
            );


        const data =
            await response.json();


        if (!response.ok) {

            alert(
                data.message ||
                "Login failed."
            );

            return;

        }


        currentUser =
            data.user || data;


        localStorage.setItem(
            "currentUser",
            JSON.stringify(currentUser)
        );


        showApp();


        loadTasks();

        loadStudyPlans();

        loadNotes();


        document.getElementById(
            "loginEmail"
        ).value = "";

        document.getElementById(
            "loginPassword"
        ).value = "";

    }

    catch (error) {

        console.error(
            "Login error:",
            error
        );

        alert(
            "Could not connect to the server."
        );

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


    hideApp();


    showOnlyLogin();

}


// =====================================================
// TASKS
// =====================================================

async function addTask() {

    const input =
        document.getElementById("taskInput");

    const title =
        input.value.trim();


    if (!title) {

        alert("Please enter a task.");

        return;

    }


    if (!currentUser) {

        alert("Please login first.");

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

                        userId:
                            currentUser.id ||
                            currentUser._id,

                        title

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


        input.value = "";


        loadTasks();

    }

    catch (error) {

        console.error(
            "Add task error:",
            error
        );

    }

}


// =====================================================
// LOAD TASKS
// =====================================================

async function loadTasks() {

    if (!currentUser) return;


    try {

        const userId =
            currentUser.id ||
            currentUser._id;


        const response =
            await fetch(
                `${API_URL}/api/tasks/${userId}`
            );


        if (!response.ok) return;


        const tasks =
            await response.json();


        const taskList =
            document.getElementById(
                "taskList"
            );


        if (!taskList) return;


        taskList.innerHTML = "";


        let completed = 0;


        tasks.forEach(function (task) {

            if (task.completed) {

                completed++;

            }


            const taskItem =
                document.createElement("div");


            taskItem.className =
                "task-item";


            taskItem.innerHTML = `

                <div class="task-content">

                    <input
                        type="checkbox"
                        ${task.completed ? "checked" : ""}
                        onchange="toggleTask('${task._id || task.id}', ${!task.completed})"
                    >

                    <span>
                        ${escapeHTML(task.title)}
                    </span>

                </div>

                <button
                    type="button"
                    onclick="deleteTask('${task._id || task.id}')">

                    Delete

                </button>

            `;


            taskList.appendChild(
                taskItem
            );

        });


        const totalTasks =
            document.getElementById(
                "totalTasks"
            );

        const completedTasks =
            document.getElementById(
                "completedTasks"
            );


        if (totalTasks) {

            totalTasks.textContent =
                tasks.length;

        }


        if (completedTasks) {

            completedTasks.textContent =
                completed;

        }


        updateProgress(
            tasks.length,
            completed
        );

    }

    catch (error) {

        console.error(
            "Load tasks error:",
            error
        );

    }

}


// =====================================================
// TOGGLE TASK
// =====================================================

async function toggleTask(
    taskId,
    completed
) {

    try {

        await fetch(
            `${API_URL}/api/tasks/${taskId}`,
            {

                method: "PUT",

                headers: {
                    "Content-Type": "application/json"
                },

                body: JSON.stringify({
                    completed
                })

            }
        );


        loadTasks();

    }

    catch (error) {

        console.error(
            "Toggle task error:",
            error
        );

    }

}


// =====================================================
// DELETE TASK
// =====================================================

async function deleteTask(taskId) {

    try {

        await fetch(
            `${API_URL}/api/tasks/${taskId}`,
            {

                method: "DELETE"

            }
        );


        loadTasks();

    }

    catch (error) {

        console.error(
            "Delete task error:",
            error
        );

    }

}


// =====================================================
// PROGRESS
// =====================================================

function updateProgress(
    total,
    completed
) {

    const progressFill =
        document.getElementById(
            "progressFill"
        );

    const progressText =
        document.getElementById(
            "progressText"
        );

    const productivityStatus =
        document.getElementById(
            "productivityStatus"
        );


    let percentage = 0;


    if (total > 0) {

        percentage =
            Math.round(
                (completed / total) * 100
            );

    }


    if (progressFill) {

        progressFill.style.width =
            `${percentage}%`;

    }


    if (progressText) {

        progressText.textContent =
            `${percentage}%`;

    }


    if (productivityStatus) {

        if (percentage === 100 && total > 0) {

            productivityStatus.textContent =
                "🔥 Excellent! You completed all your tasks.";

        }

        else if (percentage >= 50) {

            productivityStatus.textContent =
                "💪 Great progress! Keep going.";

        }

        else if (total > 0) {

            productivityStatus.textContent =
                "📚 Keep working on your tasks.";

        }

        else {

            productivityStatus.textContent =
                "Start completing your tasks to see your productivity.";

        }

    }

}


// =====================================================
// STUDY PLANS
// =====================================================

async function addStudyPlan() {

    const subject =
        document.getElementById(
            "subjectInput"
        ).value.trim();

    const topic =
        document.getElementById(
            "topicInput"
        ).value.trim();

    const studyTime =
        document.getElementById(
            "timeInput"
        ).value.trim();


    if (!subject || !topic || !studyTime) {

        alert(
            "Please fill all study plan fields."
        );

        return;

    }


    if (!currentUser) {

        alert("Please login first.");

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

                        userId:
                            currentUser.id ||
                            currentUser._id,

                        subject,

                        topic,

                        study_time: studyTime

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

    }

    catch (error) {

        console.error(
            "Study plan error:",
            error
        );

    }

}


// =====================================================
// LOAD STUDY PLANS
// =====================================================

async function loadStudyPlans() {

    if (!currentUser) return;


    try {

        const userId =
            currentUser.id ||
            currentUser._id;


        const response =
            await fetch(
                `${API_URL}/api/study-plans/${userId}`
            );


        if (!response.ok) return;


        const plans =
            await response.json();


        const list =
            document.getElementById(
                "studyPlanList"
            );


        if (!list) return;


        list.innerHTML = "";


        plans.forEach(function (plan) {

            const item =
                document.createElement("div");


            item.className =
                "study-plan-item";


            item.innerHTML = `

                <h3>
                    ${escapeHTML(plan.subject)}
                </h3>

                <p>
                    ${escapeHTML(plan.topic)}
                </p>

                <span>
                    ⏱ ${escapeHTML(
                        plan.study_time || ""
                    )}
                </span>

            `;


            list.appendChild(item);

        });


        const totalStudyPlans =
            document.getElementById(
                "totalStudyPlans"
            );


        if (totalStudyPlans) {

            totalStudyPlans.textContent =
                plans.length;

        }

    }

    catch (error) {

        console.error(
            "Load study plans error:",
            error
        );

    }

}


// =====================================================
// NOTES
// =====================================================

async function addNote() {

    const input =
        document.getElementById(
            "noteInput"
        );


    const content =
        input.value.trim();


    if (!content) {

        alert("Please write a note.");

        return;

    }


    if (!currentUser) {

        alert("Please login first.");

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

                        userId:
                            currentUser.id ||
                            currentUser._id,

                        content

                    })

                }
            );


        const data =
            await response.json();


        if (!response.ok) {

            alert(
                data.message ||
                "Could not save note."
            );

            return;

        }


        input.value = "";


        loadNotes();

    }

    catch (error) {

        console.error(
            "Add note error:",
            error
        );

    }

}


// =====================================================
// LOAD NOTES
// =====================================================

async function loadNotes() {

    if (!currentUser) return;


    try {

        const userId =
            currentUser.id ||
            currentUser._id;


        const response =
            await fetch(
                `${API_URL}/api/notes/${userId}`
            );


        if (!response.ok) return;


        const notes =
            await response.json();


        const list =
            document.getElementById(
                "notesList"
            );


        if (!list) return;


        list.innerHTML = "";


        notes.forEach(function (note) {

            const item =
                document.createElement("div");


            item.className =
                "note-item";


            item.innerHTML = `

                <p>
                    ${escapeHTML(
                        note.content
                    )}
                </p>

            `;


            list.appendChild(item);

        });


        const totalNotes =
            document.getElementById(
                "totalNotes"
            );


        if (totalNotes) {

            totalNotes.textContent =
                notes.length;

        }

    }

    catch (error) {

        console.error(
            "Load notes error:",
            error
        );

    }

}


// =====================================================
// AI QUESTION
// =====================================================

function setAIQuestion(question) {

    const input =
        document.getElementById(
            "aiInput"
        );


    if (input) {

        input.value =
            question;

        input.focus();

    }

}


// =====================================================
// ASK AI
// =====================================================

async function askAI() {

    const input =
        document.getElementById(
            "aiInput"
        );


    const responseBox =
        document.getElementById(
            "aiResponse"
        );


    if (!input || !responseBox) {

        return;

    }


    const question =
        input.value.trim();


    if (!question) {

        alert(
            "Please enter a question."
        );

        return;

    }


    responseBox.innerHTML = `

        <div class="ai-loading">

            Thinking...

        </div>

    `;


    try {

        const response =
            await fetch(
                `${API_URL}/api/ai`,
                {

                    method: "POST",

                    headers: {
                        "Content-Type": "application/json"
                    },

                    body: JSON.stringify({
                        question
                    })

                }
            );


        const data =
            await response.json();


        if (!response.ok) {

            responseBox.innerHTML = `

                <p>
                    Sorry, I couldn't get an AI response right now.
                </p>

            `;

            return;

        }


        const answer =
            data.answer ||
            data.response ||
            data.message ||
            "No response received.";


        responseBox.innerHTML = `

            <div class="ai-answer">

                ${formatAIResponse(answer)}

            </div>

        `;

    }

    catch (error) {

        console.error(
            "AI error:",
            error
        );


        responseBox.innerHTML = `

            <p>
                Sorry, I couldn't get an AI response right now.
            </p>

        `;

    }

}


// =====================================================
// QUIZ
// =====================================================

async function generateQuiz() {

    const topicInput =
        document.getElementById(
            "quizTopic"
        );

    const container =
        document.getElementById(
            "quizContainer"
        );


    if (!topicInput || !container) {

        return;

    }


    const topic =
        topicInput.value.trim();


    if (!topic) {

        alert(
            "Please enter a quiz topic."
        );

        return;

    }


    container.innerHTML = `

        <div class="ai-loading">
            Generating quiz...
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
                        topic
                    })

                }
            );


        const data =
            await response.json();


        if (!response.ok) {

            container.innerHTML = `

                <p>
                    Unable to generate quiz.
                </p>

            `;

            return;

        }


        const quiz =
            data.quiz ||
            data.response ||
            data.answer;


        if (typeof quiz === "string") {

            container.innerHTML =
                `<div class="quiz-result">
                    ${formatAIResponse(quiz)}
                </div>`;

        }

        else {

            container.innerHTML =
                `<pre>${escapeHTML(
                    JSON.stringify(
                        quiz,
                        null,
                        2
                    )
                )}</pre>`;

        }

    }

    catch (error) {

        console.error(
            "Quiz error:",
            error
        );


        container.innerHTML = `

            <p>
                Unable to generate quiz right now.
            </p>

        `;

    }

}


// =====================================================
// FORMAT AI RESPONSE
// =====================================================

function formatAIResponse(text) {

    if (!text) return "";


    return escapeHTML(
        String(text)
    )
        .replace(/\*\*(.*?)\*\*/g, "<strong>$1</strong>")
        .replace(/\n/g, "<br>");

}


// =====================================================
// SECURITY HELPER
// =====================================================

function escapeHTML(value) {

    if (value === null || value === undefined) {

        return "";

    }


    return String(value)

        .replace(/&/g, "&amp;")

        .replace(/</g, "&lt;")

        .replace(/>/g, "&gt;")

        .replace(/"/g, "&quot;")

        .replace(/'/g, "&#039;");

}