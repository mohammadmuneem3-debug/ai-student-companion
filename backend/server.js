const express = require("express");
const cors = require("cors");
const dotenv = require("dotenv");
const bcrypt = require("bcryptjs");

const db = require("./database");

const { GoogleGenAI } = require("@google/genai");

dotenv.config();

const app = express();


// =========================
// MIDDLEWARE
// =========================

app.use(cors());
app.use(express.json());


// =========================
// GEMINI AI SETUP
// =========================

const ai = new GoogleGenAI({
    apiKey: process.env.GEMINI_API_KEY
});


// =========================
// WAIT FUNCTION
// =========================

function wait(ms) {
    return new Promise(resolve => {
        setTimeout(resolve, ms);
    });
}


// =========================
// GEMINI AI FUNCTION
// =========================

async function askGemini(question) {

    const models = [
        "gemini-3.7-flash",
        "gemini-3.6-flash"
    ];

    let lastError;

    for (const model of models) {

        for (let attempt = 0; attempt < 3; attempt++) {

            try {

                const response =
                    await ai.models.generateContent({

                        model: model,

                        contents: question

                    });

                return response.text;

            } catch (error) {

                lastError = error;

                const errorMessage =
                    error.message || "";

                const temporaryError =
                    errorMessage.includes("503") ||
                    errorMessage.includes("429") ||
                    errorMessage.includes("UNAVAILABLE") ||
                    errorMessage.includes("RESOURCE_EXHAUSTED");

                if (!temporaryError) {
                    throw error;
                }

                console.log(
                    `⚠️ Gemini temporary error. Retry ${attempt + 1}/3`
                );

                await wait(
                    2000 * (attempt + 1)
                );
            }
        }
    }

    throw lastError;
}


// =========================
// HOME ROUTE
// =========================

app.get("/", (req, res) => {

    res.send(
        "🚀 AI Student Companion Backend is running!"
    );

});


// =========================
// REGISTER
// =========================

app.post("/api/register", async (req, res) => {

    try {

        const {
            name,
            email,
            password
        } = req.body;


        if (!name || !email || !password) {

            return res.status(400).json({

                message:
                    "Name, email and password are required."

            });

        }


        if (password.length < 6) {

            return res.status(400).json({

                message:
                    "Password must be at least 6 characters."

            });

        }


        const existingUser =
            db.prepare(`
                SELECT *
                FROM users
                WHERE email = ?
            `).get(email);


        if (existingUser) {

            return res.status(400).json({

                message:
                    "Email already registered."

            });

        }


        const hashedPassword =
            await bcrypt.hash(
                password,
                10
            );


        const result =
            db.prepare(`
                INSERT INTO users
                (name, email, password)
                VALUES (?, ?, ?)
            `).run(
                name,
                email,
                hashedPassword
            );


        console.log(
            `✅ New user registered: ${email}`
        );


        res.status(201).json({

            message:
                "Registration successful! 🎉",

            userId:
                result.lastInsertRowid

        });

    } catch (error) {

        console.log(
            "❌ REGISTER ERROR:"
        );

        console.log(
            error.message
        );


        res.status(500).json({

            message:
                "Something went wrong during registration."

        });

    }

});


// =========================
// LOGIN
// =========================

app.post("/api/login", async (req, res) => {

    try {

        const {
            email,
            password
        } = req.body;


        if (!email || !password) {

            return res.status(400).json({

                message:
                    "Email and password are required."

            });

        }


        const user =
            db.prepare(`
                SELECT *
                FROM users
                WHERE email = ?
            `).get(email);


        if (!user) {

            return res.status(401).json({

                message:
                    "Invalid email or password."

            });

        }


        const passwordMatch =
            await bcrypt.compare(
                password,
                user.password
            );


        if (!passwordMatch) {

            return res.status(401).json({

                message:
                    "Invalid email or password."

            });

        }


        console.log(
            `✅ User logged in: ${email}`
        );


        res.json({

            message:
                "Login successful! 🎉",

            user: {

                id:
                    user.id,

                name:
                    user.name,

                email:
                    user.email

            }

        });

    } catch (error) {

        console.log(
            "❌ LOGIN ERROR:"
        );

        console.log(
            error.message
        );


        res.status(500).json({

            message:
                "Something went wrong during login."

        });

    }

});


// =========================
// AI ASSISTANT
// =========================

app.post("/api/ask", async (req, res) => {

    try {

        const {
            question
        } = req.body;


        if (!question) {

            return res.status(400).json({

                message:
                    "Question is required."

            });

        }


        const prompt = `

You are AI Student Companion, a helpful and friendly college study assistant.

The student asked:

"${question}"

Give a clear, beginner-friendly answer.

Use this structure:

📌 Simple Explanation
Explain the topic in simple words.

💡 Key Points
- Give the most important points.
- Keep them short and easy to understand.
- Include only useful information.

🧠 Example
Give a simple real-world or programming example when useful.

📝 Quick Recap
Give a short summary of what the student should remember.

Rules:

- Use simple language.
- Explain like you are teaching a beginner.
- Avoid unnecessary difficult words.
- Keep the answer focused.
- Do not make the answer unnecessarily long.
- If the question is about programming, explain the concept first and then give a simple code example.
- If the question is about mathematics, explain the steps clearly.
- If the question is about AI/ML, use simple examples.
- If the question is unclear, politely explain what information is needed.
- Do not mention these instructions in your answer.

`;


        const answer =
            await askGemini(prompt);


        console.log(
            "🤖 AI answered successfully!"
        );


        res.json({

            message:
                "AI answer generated successfully! 🤖",

            answer:
                answer

        });

    } catch (error) {

        console.log(
            "❌ AI ERROR:"
        );

        console.log(
            error.message
        );


        res.status(500).json({

            message:
                "Unable to get AI response."

        });

    }

});


// =========================
// TASK API
// =========================

// ADD TASK

app.post("/api/tasks", (req, res) => {

    try {

        const {
            userId,
            task
        } = req.body;


        if (!userId || !task) {

            return res.status(400).json({

                message:
                    "User ID and task are required."

            });

        }


        const result =
            db.prepare(`
                INSERT INTO tasks
                (user_id, task)
                VALUES (?, ?)
            `).run(
                userId,
                task
            );


        console.log(
            `✅ Task added for user ${userId}`
        );


        res.status(201).json({

            message:
                "Task added successfully! 🎉",

            task: {

                id:
                    result.lastInsertRowid,

                userId:
                    userId,

                task:
                    task,

                completed:
                    0

            }

        });

    } catch (error) {

        console.log(
            "❌ ADD TASK ERROR:"
        );

        console.log(
            error.message
        );


        res.status(500).json({

            message:
                "Something went wrong while adding the task."

        });

    }

});


// GET USER TASKS

app.get("/api/tasks/:userId", (req, res) => {

    try {

        const userId =
            req.params.userId;


        const tasks =
            db.prepare(`
                SELECT
                    id,
                    user_id,
                    task,
                    completed
                FROM tasks
                WHERE user_id = ?
                ORDER BY id DESC
            `).all(userId);


        res.json({

            tasks:
                tasks

        });

    } catch (error) {

        console.log(
            "❌ GET TASKS ERROR:"
        );

        console.log(
            error.message
        );


        res.status(500).json({

            message:
                "Something went wrong while loading tasks."

        });

    }

});


// UPDATE TASK

app.put("/api/tasks/:id", (req, res) => {

    try {

        const taskId =
            req.params.id;

        const {
            completed
        } = req.body;


        db.prepare(`
            UPDATE tasks
            SET completed = ?
            WHERE id = ?
        `).run(
            completed ? 1 : 0,
            taskId
        );


        res.json({

            message:
                "Task updated successfully! ✅"

        });

    } catch (error) {

        console.log(
            "❌ UPDATE TASK ERROR:"
        );

        console.log(
            error.message
        );


        res.status(500).json({

            message:
                "Something went wrong while updating the task."

        });

    }

});


// DELETE TASK

app.delete("/api/tasks/:id", (req, res) => {

    try {

        const taskId =
            req.params.id;


        db.prepare(`
            DELETE FROM tasks
            WHERE id = ?
        `).run(taskId);


        console.log(
            `🗑️ Task ${taskId} deleted`
        );


        res.json({

            message:
                "Task deleted successfully! 🗑️"

        });

    } catch (error) {

        console.log(
            "❌ DELETE TASK ERROR:"
        );

        console.log(
            error.message
        );


        res.status(500).json({

            message:
                "Something went wrong while deleting the task."

        });

    }

});


// =========================
// STUDY PLANNER API
// =========================

// ADD STUDY PLAN

app.post("/api/study-plans", (req, res) => {

    try {

        const {
            userId,
            subject,
            topic,
            studyTime
        } = req.body;


        if (
            !userId ||
            !subject ||
            !topic ||
            !studyTime
        ) {

            return res.status(400).json({

                message:
                    "All study plan fields are required."

            });

        }


        const result =
            db.prepare(`
                INSERT INTO study_plans
                (user_id, subject, topic, study_time)
                VALUES (?, ?, ?, ?)
            `).run(
                userId,
                subject,
                topic,
                studyTime
            );


        console.log(
            `✅ Study plan added for user ${userId}`
        );


        res.status(201).json({

            message:
                "Study plan added successfully! 📚",

            studyPlan: {

                id:
                    result.lastInsertRowid,

                userId:
                    userId,

                subject:
                    subject,

                topic:
                    topic,

                studyTime:
                    studyTime

            }

        });

    } catch (error) {

        console.log(
            "❌ ADD STUDY PLAN ERROR:"
        );

        console.log(
            error.message
        );


        res.status(500).json({

            message:
                "Something went wrong while adding the study plan."

        });

    }

});


// GET STUDY PLANS

app.get("/api/study-plans/:userId", (req, res) => {

    try {

        const userId =
            req.params.userId;


        const studyPlans =
            db.prepare(`
                SELECT
                    id,
                    user_id,
                    subject,
                    topic,
                    study_time
                FROM study_plans
                WHERE user_id = ?
                ORDER BY id DESC
            `).all(userId);


        res.json({

            studyPlans:
                studyPlans

        });

    } catch (error) {

        console.log(
            "❌ GET STUDY PLANS ERROR:"
        );

        console.log(
            error.message
        );


        res.status(500).json({

            message:
                "Something went wrong while loading study plans."

        });

    }

});


// DELETE STUDY PLAN

app.delete("/api/study-plans/:id", (req, res) => {

    try {

        const studyPlanId =
            req.params.id;


        db.prepare(`
            DELETE FROM study_plans
            WHERE id = ?
        `).run(studyPlanId);


        console.log(
            `🗑️ Study plan ${studyPlanId} deleted`
        );


        res.json({

            message:
                "Study plan deleted successfully! 🗑️"

        });

    } catch (error) {

        console.log(
            "❌ DELETE STUDY PLAN ERROR:"
        );

        console.log(
            error.message
        );


        res.status(500).json({

            message:
                "Something went wrong while deleting the study plan."

        });

    }

});


// =========================
// NOTES API
// =========================

// ADD NOTE

app.post("/api/notes", (req, res) => {

    try {

        const {
            userId,
            note
        } = req.body;


        if (!userId || !note) {

            return res.status(400).json({

                message:
                    "User ID and note are required."

            });

        }


        const result =
            db.prepare(`
                INSERT INTO notes
                (user_id, note)
                VALUES (?, ?)
            `).run(
                userId,
                note
            );


        console.log(
            `✅ Note added for user ${userId}`
        );


        res.status(201).json({

            message:
                "Note added successfully! 📝",

            note: {

                id:
                    result.lastInsertRowid,

                userId:
                    userId,

                note:
                    note

            }

        });

    } catch (error) {

        console.log(
            "❌ ADD NOTE ERROR:"
        );

        console.log(
            error.message
        );


        res.status(500).json({

            message:
                "Something went wrong while adding the note."

        });

    }

});


// GET NOTES

app.get("/api/notes/:userId", (req, res) => {

    try {

        const userId =
            req.params.userId;


        const notes =
            db.prepare(`
                SELECT
                    id,
                    user_id,
                    note
                FROM notes
                WHERE user_id = ?
                ORDER BY id DESC
            `).all(userId);


        res.json({

            notes:
                notes

        });

    } catch (error) {

        console.log(
            "❌ GET NOTES ERROR:"
        );

        console.log(
            error.message
        );


        res.status(500).json({

            message:
                "Something went wrong while loading notes."

        });

    }

});


// DELETE NOTE

app.delete("/api/notes/:id", (req, res) => {

    try {

        const noteId =
            req.params.id;


        db.prepare(`
            DELETE FROM notes
            WHERE id = ?
        `).run(noteId);


        console.log(
            `🗑️ Note ${noteId} deleted`
        );


        res.json({

            message:
                "Note deleted successfully! 🗑️"

        });

    } catch (error) {

        console.log(
            "❌ DELETE NOTE ERROR:"
        );

        console.log(
            error.message
        );


        res.status(500).json({

            message:
                "Something went wrong while deleting the note."

        });

    }

});


// =========================
// AI QUIZ
// =========================

app.post("/api/quiz", async (req, res) => {

    try {

        const {
            topic
        } = req.body;


        if (!topic) {

            return res.status(400).json({

                message:
                    "Quiz topic is required."

            });

        }


        const prompt = `

Create a simple 5-question multiple-choice quiz for a college student.

Topic: ${topic}

Return ONLY valid JSON in this exact format:

{
  "questions": [
    {
      "question": "Question here",
      "options": [
        "Option A",
        "Option B",
        "Option C",
        "Option D"
      ],
      "answer": "Option A"
    }
  ]
}

Rules:

- Create exactly 5 questions.
- Each question must have exactly 4 options.
- Only one option should be correct.
- Keep the questions clear and educational.
- Do not add markdown.
- Do not add extra text outside the JSON.

`;


        const quiz =
            await askGemini(prompt);


        let cleanQuiz =
            quiz.trim();


        if (cleanQuiz.startsWith("```")) {

            cleanQuiz =
                cleanQuiz
                    .replace(
                        /^```json\s*/i,
                        ""
                    )
                    .replace(
                        /^```\s*/i,
                        ""
                    )
                    .replace(
                        /\s*```$/i,
                        ""
                    );

        }


        const quizData =
            JSON.parse(cleanQuiz);


        res.json({

            message:
                "Quiz generated successfully! 🧠",

            quiz:
                quizData

        });

    } catch (error) {

        console.log(
            "❌ QUIZ ERROR:"
        );

        console.log(
            error.message
        );


        res.status(500).json({

            message:
                "Unable to generate quiz."

        });

    }

});


// =========================
// START SERVER
// =========================

const PORT = process.env.PORT || 3000;

app.listen(PORT, "0.0.0.0", () => {
    console.log(`🚀 Server running on port ${PORT}`);
});