const axios = require("axios");

const GEMINI_API_KEY = process.env.GEMINI_API_KEY;

const schema = `
employees(id, first_name, last_name, email, phone, department_id, role_id, manager_id, hire_date, salary, status)
departments(id, name, location)
roles(id, title, level, base_salary)
attendance(id, employee_id, date, check_in, check_out, status)
payroll(id, employee_id, month, year, base_salary, bonus, deductions, net_salary)
leaves(id, employee_id, start_date, end_date, leave_type, status)
`;

async function getSQLFromAI(userQuery) {
  if (!GEMINI_API_KEY) {
    throw new Error("GEMINI_API_KEY is missing");
  }

  const prompt = `
You are a strict MySQL query generator.

RULES:
- ONLY output SQL
- ONLY SELECT queries
- NO explanation
- NO markdown
- Start directly with SELECT

SCHEMA:
${schema}

EXAMPLES:
User: "Top 5 highest paid employees"
SELECT first_name, salary FROM employees ORDER BY salary DESC LIMIT 5;

User: "Average salary by department"
SELECT d.name, AVG(e.salary)
FROM employees e
JOIN departments d ON e.department_id = d.id
GROUP BY d.name;

User Query:
"${userQuery}"
`;

  try {
    const url = `https://generativelanguage.googleapis.com/v1beta/models/gemini-2.5-flash:generateContent?key=${GEMINI_API_KEY}`;

    const response = await axios.post(
      url,
      {
        contents: [{ parts: [{ text: prompt }] }]
      },
      {
        headers: { "Content-Type": "application/json" }
      }
    );

    if (!response.data.candidates?.length) {
      throw new Error("No response from AI");
    }

    let text = response.data.candidates[0].content.parts[0].text;

    console.log("RAW AI:", text);

    // Clean markdown
    text = text.replace(/```sql/ig, "").replace(/```/g, "").trim();

    // Extract only SELECT query
    const match = text.match(/select[\s\S]*/i);

    if (!match) {
      throw new Error("AI did not return valid SQL");
    }

    return match[0].trim();

  } catch (error) {
    if (error.response) {
      console.error("API Status:", error.response.status);
      console.error("API Data:", error.response.data);
    } else {
      console.error("Error:", error.message);
    }

    throw new Error("AI request failed");
  }
}

module.exports = { getSQLFromAI };