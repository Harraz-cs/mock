function parsePolicy(data) {
    const lines = data.split("\n");
    return lines
      .map((line) => {
        if (line.startsWith("package")) {
          return `Namespace: ${line}`;
        } else if (line.startsWith("default")) {
          return `Default Rule: ${line}`;
        } else if (line.includes("=")) {
          const [left, right] = line.split("=");
          return `${left.trim()}: ${right.trim()}`;
        }
        return line;
      })
      .join("\n");
  }
  
  module.exports = parsePolicy;