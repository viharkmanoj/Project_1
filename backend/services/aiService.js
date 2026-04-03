const axios = require("axios");

const GEMINI_API_KEY = process.env.GEMINI_API_KEY;

const schema = `
employees(id, first_name, last_name, email, department_id, role_id, manager_id, hire_date, salary)
departments(id, name, location)
roles(id, title, level, base_salary)
attendance(id, employee_id, date, status)
payroll(id, employee_id, month, year, net_salary)
leaves(id, employee_id, start_date, end_date, leave_type, status)
`;

async function getSQLFromAI(userQuery) {
  const prompt = `
You are a MySQL expert.

Convert the user query into a valid MySQL SELECT query.

Rules:
- ONLY return SQL
- No explanation
- Use only given schema
- Use proper JOINs if needed

Schema:
${schema}

User Query:
"${userQuery}"
`;

  const response = await axios.post(
    `https://generativelanguage.googleapis.com/v1beta/models/gemini-pro:generateContent?key=${GEMINI_API_KEY}`,
    {
      contents: [{ parts: [{ text: prompt }] }]
    }
  );

  const text = response.data.candidates[0].content.parts[0].text;

  return text.trim();
}

module.exports = { getSQLFromAI };