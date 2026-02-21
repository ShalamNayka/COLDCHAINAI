const { GoogleGenerativeAI } = require("@google/generative-ai");

const key = "AIzaSyA5ZSYc4Le5YVFc9AnZ3rHgP-ecxE-M_so";
const genAI = new GoogleGenerativeAI(key);

async function test() {
    try {
        const model = genAI.getGenerativeModel({ model: "gemini-1.5-flash" });
        const result = await model.generateContent("Say hello in JSON { message: 'hello' }");
        console.log("SUCCESS:", result.response.text());
    } catch (e) {
        console.error("ERROR:", e.message);
    }
}

test();
