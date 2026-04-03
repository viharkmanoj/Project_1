function validateQuery(sql) {
  const lower = sql.toLowerCase();

  if (!lower.startsWith("select")) {
    throw new Error("Only SELECT queries allowed");
  }

  const forbidden = ["drop", "delete", "update", "insert", "alter"];

  for (let word of forbidden) {
    if (lower.includes(word)) {
      throw new Error("Unsafe query detected");
    }
  }

  return true;
}

module.exports = { validateQuery };