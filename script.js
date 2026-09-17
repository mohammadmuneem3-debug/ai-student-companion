// =====================================================
// AI STUDENT COMPANION
// COMPLETE CORRECTED SCRIPT.JS
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
// GET USER ID
// =====================================================

function getUserId() {

    if (!currentUser) {
        return null;
    }

    return (
        currentUser.id ||
        currentUser._id ||
        currentUser.userId ||
        currentUser.userID ||
        null
    );
}


// =====================================================
// PAGE LOAD
// =====================================================

document.addEventListener(
    "DOMContentLoaded",
    function () {

        console.log("DOM loaded");


        // =============================================
        // LOGIN SWITCH BUTTON
        // =============================================

        const loginSwitchButton =
            document.getElementById(
                "loginSwitchButton"
            );


        if (loginSwitchButton) {

            loginSwitchButton.addEventListener(
                "click",
                function (event) {

                    event.preventDefault();
                    event.stopPropagation();

                    console.log(
                        "LOGIN BUTTON CLICKED"
                    );

                    showLoginForm();
                }
            );
        }


        // =============================================
        // REGISTER SWITCH BUTTON
        // =============================================

        const registerSwitchButton =
            document.getElementById(
                "registerSwitchButton"
            );


        if (registerSwitchButton) {

            registerSwitchButton.addEventListener(
                "click",
                function (event) {

                    event.preventDefault();
                    event.stopPropagation();

                    console.log(
                        "REGISTER BUTTON CLICKED"
                    );

                    showRegisterForm();
                }
            );
        }


        // =============================================
        // CHECK LOGIN
        // =============================================

        checkLogin();

    }
);


// =====================================================
// SHOW REGISTER
// =====================================================

function showOnlyRegister() {

    console.log(
        "Showing REGISTER form"
    );


    const registerCard =
        document.getElementById(
            "registerCard"
        );


    const loginCard =
        document.getElementById(
            "loginCard"
        );


    if (!registerCard || !loginCard) {

        console.error(
            "Register/Login cards not found"
        );

        return;
    }


    registerCard.style.setProperty(
        "display",
        "block",
        "important"
    );


    loginCard.style.setProperty(
        "display",
        "none",
        "important"
    );
}


// =====================================================
// SHOW LOGIN
// =====================================================

function showOnlyLogin() {

    console.log(
        "Showing LOGIN form"
    );


    const registerCard =
        document.getElementById(
            "registerCard"
        );


    const loginCard =
        document.getElementById(
            "loginCard"
        );


    if (!registerCard || !loginCard) {

        console.error(
            "Register/Login cards not found"
        );

        return;
    }


    registerCard.style.setProperty(
        "display",
        "none",
        "important"
    );


    loginCard.style.setProperty(
        "display",
        "block",
        "important"
    );
}


// =====================================================
// SWITCH FUNCTIONS
// =====================================================

function showLoginForm() {

    console.log(
        "showLoginForm() called"
    );

    showOnlyLogin();
}


function showRegisterForm() {

    console.log(
        "showRegisterForm() called"
    );

    showOnlyRegister();
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

    console.log(
        "Checking login status..."
    );


    currentUser =
        JSON.parse(
            localStorage.getItem(
                "currentUser"
            )
        );


    console.log(
        "Current user:",
        currentUser
    );


    if (currentUser) {

        console.log(
            "User ID:",
            getUserId()
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


    if (
        registrationCompleted ===
        "true"
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


    if (authSection) {

        authSection.style.setProperty(
            "display",
            "none",
            "important"
        );
    }


    if (appSection) {

        appSection.style.setProperty(
            "display",
            "block",
            "important"
        );
    }


    if (logoutButton) {

        logoutButton.style.setProperty(
            "display",
            "block",
            "important"
        );
    }


    const welcomeMessage =
        document.getElementById(
            "welcomeMessage"
        );


    if (
        welcomeMessage &&
        currentUser
    ) {

        welcomeMessage.textContent =
            `Welcome, ${
                currentUser.name ||
                "Student"
            }!`;
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


    if (authSection) {

        authSection.style.setProperty(
            "display",
            "block",
            "important"
        );
    }


    if (appSection) {

        appSection.style.setProperty(
            "display",
            "none",
            "important"
        );
    }


    if (logoutButton) {

        logoutButton.style.setProperty(
            "display",
            "none",
            "important"
        );
    }
}


// =====================================================
// REGISTER USER
// =====================================================

async function registerUser() {

    const name =
        document.getElementById(
            "registerName"
        ).value.trim();


    const email =
        document.getElementById(
            "registerEmail"
        ).value.trim();


    const password =
        document.getElementById(
            "registerPassword"
        ).value.trim();


    if (
        !name ||
        !email ||
        !password
    ) {

        alert(
            "Please fill all fields."
        );

        return;
    }


    try {

        const response =
            await fetch(
                `${API_URL}/api/register`,
                {

                    method: "POST",

                    headers: {
                        "Content-Type":
                            "application/json"
                    },

                    body:
                        JSON.stringify({
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


        document.getElementById(
            "registerName"
        ).value = "";


        document.getElementById(
            "registerEmail"
        ).value = "";


        document.getElementById(
            "registerPassword"
        ).value = "";


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
        document.getElementById(
            "loginEmail"
        ).value.trim();


    const password =
        document.getElementById(
            "loginPassword"
        ).value.trim();


    if (
        !email ||
        !password
    ) {

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
                        "Content-Type":
                            "application/json"
                    },

                    body:
                        JSON.stringify({
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


        // =============================================
        // SAVE USER
        // =============================================

        currentUser =
            data.user ||
            data;


        console.log(
            "Login successful"
        );


        console.log(
            "Current user:",
            currentUser
        );


        console.log(
            "User ID:",
            getUserId()
        );


        if (!getUserId()) {

            console.error(
                "User ID missing from login response."
            );


            alert(
                "Login successful, but user ID was not received."
            );


            return;
        }


        localStorage.setItem(
            "currentUser",
            JSON.stringify(
                currentUser
            )
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
// ADD TASK
// =====================================================

async function addTask() {

    const input =
        document.getElementById(
            "taskInput"
        );


    if (!input) {

        console.error(
            "Task input not found."
        );

        return;
    }


    const title =
        input.value.trim();


    if (!title) {

        alert(
            "Please enter a task."
        );

        return;
    }


    if (!currentUser) {

        alert(
            "Please login first."
        );

        return;
    }


    const userId =
        getUserId();


    if (!userId) {

        alert(
            "User ID not found. Please logout and login again."
        );

        return;
    }


    try {

        const response =
            await fetch(
                `${API_URL}/api/tasks`,
                {

                    method: "POST",

                    headers: {
                        "Content-Type":
                            "application/json"
                    },

                    // IMPORTANT:
                    // Backend expects "task", NOT "title"

                    body:
                        JSON.stringify({
                            userId,
                            task: title
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


    const userId =
        getUserId();


    if (!userId) {

        console.error(
            "Cannot load tasks. User ID missing."
        );

        return;
    }


    try {

        const response =
            await fetch(
                `${API_URL}/api/tasks/${userId}`
            );


        if (!response.ok) {

            console.error(
                "Could not load tasks."
            );

            return;
        }


        const data =
            await response.json();


        // Backend returns:
        // { tasks: [...] }

        const tasks =
            Array.isArray(data)
                ? data
                : data.tasks || [];


        const taskList =
            document.getElementById(
                "taskList"
            );


        if (!taskList) {
            return;
        }


        taskList.innerHTML = "";


        let completed = 0;


        tasks.forEach(
            function (task) {

                if (
                    task.completed
                ) {

                    completed++;
                }


                const taskItem =
                    document.createElement(
                        "div"
                    );


                taskItem.className =
                    "task-item";


                const taskId =
                    task.id ||
                    task._id;


                const taskTitle =
                    task.task ||
                    task.title ||
                    "";


                taskItem.innerHTML = `

                    <div class="task-content">

                        <input
                            type="checkbox"

                            ${
                                task.completed
                                    ? "checked"
                                    : ""
                            }

                            onchange="
                                toggleTask(
                                    '${taskId}',
                                    ${!task.completed}
                                )
                            "
                        >

                        <span>
                            ${escapeHTML(
                                taskTitle
                            )}
                        </span>

                    </div>


                    <button
                        type="button"

                        onclick="
                            deleteTask(
                                '${taskId}'
                            )
                        "
                    >
                        Delete
                    </button>

                `;


                taskList.appendChild(
                    taskItem
                );
            }
        );


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

        const response =
            await fetch(
                `${API_URL}/api/tasks/${taskId}`,
                {

                    method: "PUT",

                    headers: {
                        "Content-Type":
                            "application/json"
                    },

                    body:
                        JSON.stringify({
                            completed
                        })
                }
            );


        if (!response.ok) {

            console.error(
                "Could not update task."
            );

            return;
        }


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

async function deleteTask(
    taskId
) {

    try {

        const response =
            await fetch(
                `${API_URL}/api/tasks/${taskId}`,
                {
                    method: "DELETE"
                }
            );


        if (!response.ok) {

            console.error(
                "Could not delete task."
            );

            return;
        }


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
// UPDATE PROGRESS
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
                (completed / total) *
                100
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

        if (
            percentage === 100 &&
            total > 0
        ) {

            productivityStatus.textContent =
                "🔥 Excellent! You completed all your tasks.";

        }
        else if (
            percentage >= 50
        ) {

            productivityStatus.textContent =
                "💪 Great progress! Keep going.";

        }
        else if (
            total > 0
        ) {

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
// ADD STUDY PLAN
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


    if (!currentUser) {

        alert(
            "Please login first."
        );

        return;
    }


    const userId =
        getUserId();


    if (!userId) {

        alert(
            "User ID not found. Please logout and login again."
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
                        "Content-Type":
                            "application/json"
                    },

                    // IMPORTANT:
                    // Backend expects "studyTime"

                    body:
                        JSON.stringify({
                            userId,
                            subject,
                            topic,
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


    const userId =
        getUserId();


    if (!userId) {
        return;
    }


    try {

        const response =
            await fetch(
                `${API_URL}/api/study-plans/${userId}`
            );


        if (!response.ok) {

            console.error(
                "Could not load study plans."
            );

            return;
        }


        const data =
            await response.json();


        // Backend returns:
        // { studyPlans: [...] }

        const plans =
            Array.isArray(data)
                ? data
                : data.studyPlans || [];


        const list =
            document.getElementById(
                "studyPlanList"
            );


        if (!list) {
            return;
        }


        list.innerHTML = "";


        plans.forEach(
            function (plan) {

                const item =
                    document.createElement(
                        "div"
                    );


                item.className =
                    "study-plan-item";


                item.innerHTML = `

                    <h3>
                        ${escapeHTML(
                            plan.subject
                        )}
                    </h3>

                    <p>
                        ${escapeHTML(
                            plan.topic
                        )}
                    </p>

                    <span>
                        ⏱
                        ${escapeHTML(
                            plan.study_time ||
                            plan.studyTime ||
                            ""
                        )}
                    </span>

                `;


                list.appendChild(
                    item
                );
            }
        );


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
// ADD NOTE
// =====================================================

async function addNote() {

    const input =
        document.getElementById(
            "noteInput"
        );


    if (!input) {

        console.error(
            "Note input not found."
        );

        return;
    }


    const content =
        input.value.trim();


    if (!content) {

        alert(
            "Please write a note."
        );

        return;
    }


    if (!currentUser) {

        alert(
            "Please login first."
        );

        return;
    }


    const userId =
        getUserId();


    if (!userId) {

        alert(
            "User ID not found. Please logout and login again."
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
                        "Content-Type":
                            "application/json"
                    },

                    // IMPORTANT:
                    // Backend expects "note"

                    body:
                        JSON.stringify({
                            userId,
                            note: content
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


    const userId =
        getUserId();


    if (!userId) {
        return;
    }


    try {

        const response =
            await fetch(
                `${API_URL}/api/notes/${userId}`
            );


        if (!response.ok) {

            console.error(
                "Could not load notes."
            );

            return;
        }


        const data =
            await response.json();


        // Backend returns:
        // { notes: [...] }

        const notes =
            Array.isArray(data)
                ? data
                : data.notes || [];


        const list =
            document.getElementById(
                "notesList"
            );


        if (!list) {
            return;
        }


        list.innerHTML = "";


        notes.forEach(
            function (note) {

                const item =
                    document.createElement(
                        "div"
                    );


                item.className =
                    "note-item";


                item.innerHTML = `

                    <p>
                        ${escapeHTML(
                            note.note ||
                            note.content ||
                            ""
                        )}
                    </p>

                `;


                list.appendChild(
                    item
                );
            }
        );


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
// AI QUICK QUESTION
// =====================================================

function setAIQuestion(
    question
) {

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


    if (!currentUser) {

        alert(
            "Please login first."
        );

        return;
    }


    responseBox.innerHTML = `

        <div class="ai-loading">
            Thinking...
        </div>

    `;


    try {

        // IMPORTANT:
        // Backend route is /api/ask
        // NOT /api/ai

        const response =
            await fetch(
                `${API_URL}/api/ask`,
                {

                    method: "POST",

                    headers: {
                        "Content-Type":
                            "application/json"
                    },

                    body:
                        JSON.stringify({
                            question
                        })
                }
            );


        const data =
            await response.json();


        if (!response.ok) {

            console.error(
                "AI backend error:",
                data
            );


            responseBox.innerHTML = `

                <p>
                    ${
                        data.message ||
                        "Sorry, I couldn't get an AI response right now."
                    }
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

                ${formatAIResponse(
                    answer
                )}

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
// GENERATE QUIZ
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


    if (
        !topicInput ||
        !container
    ) {

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


    if (!currentUser) {

        alert(
            "Please login first."
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
                        "Content-Type":
                            "application/json"
                    },

                    // Backend only requires topic

                    body:
                        JSON.stringify({
                            topic
                        })
                }
            );


        const data =
            await response.json();


        if (!response.ok) {

            console.error(
                "Quiz backend error:",
                data
            );


            container.innerHTML = `

                <p>
                    ${
                        data.message ||
                        "Unable to generate quiz."
                    }
                </p>

            `;

            return;
        }


        const quiz =
            data.quiz ||
            data.response ||
            data.answer;


        if (
            typeof quiz ===
            "string"
        ) {

            container.innerHTML = `

                <div class="quiz-result">

                    ${formatAIResponse(
                        quiz
                    )}

                </div>

            `;

        }
        else {

            displayQuiz(
                quiz,
                container
            );
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
// DISPLAY QUIZ
// =====================================================

function displayQuiz(
    quiz,
    container
) {

    if (
        !quiz ||
        !Array.isArray(
            quiz.questions
        )
    ) {

        container.innerHTML = `

            <pre>
                ${escapeHTML(
                    JSON.stringify(
                        quiz,
                        null,
                        2
                    )
                )}
            </pre>

        `;

        return;
    }


    let html = "";


    quiz.questions.forEach(
        function (question, index) {

            html += `

                <div class="quiz-question">

                    <h3>
                        ${index + 1}.
                        ${escapeHTML(
                            question.question
                        )}
                    </h3>

                    <div class="quiz-options">

            `;


            if (
                Array.isArray(
                    question.options
                )
            ) {

                question.options.forEach(
                    function (option) {

                        html += `

                            <div class="quiz-option">

                                ${escapeHTML(
                                    option
                                )}

                            </div>

                        `;
                    }
                );
            }


            html += `

                    </div>

                </div>

            `;
        }
    );


    container.innerHTML = html;
}


// =====================================================
// FORMAT AI RESPONSE
// =====================================================

function formatAIResponse(
    text
) {

    if (!text) {
        return "";
    }


    return escapeHTML(
        String(text)
    )

        .replace(
            /\*\*(.*?)\*\*/g,
            "<strong>$1</strong>"
        )

        .replace(
            /\n/g,
            "<br>"
        );
}


// =====================================================
// ESCAPE HTML
// =====================================================

function escapeHTML(
    value
) {

    if (
        value === null ||
        value === undefined
    ) {

        return "";
    }


    return String(value)

        .replace(
            /&/g,
            "&amp;"
        )

        .replace(
            /</g,
            "&lt;"
        )

        .replace(
            />/g,
            "&gt;"
        )

        .replace(
            /"/g,
            "&quot;"
        )

        .replace(
            /'/g,
            "&#039;"
        );
}