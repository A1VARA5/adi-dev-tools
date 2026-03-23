#!/usr/bin/env node
// Prepends #!/usr/bin/env node to dist/index.js with Unix LF line endings
const fs = require("fs");
const path = require("path");

const file = path.join(__dirname, "..", "dist", "index.js");
let content = fs.readFileSync(file, "utf8");

// Strip BOM if present
content = content.replace(/^\uFEFF/, "");

// Normalize to LF
content = content.replace(/\r\n/g, "\n");

// Add shebang if missing
if (!content.startsWith("#!/usr/bin/env node\n")) {
  content = "#!/usr/bin/env node\n" + content;
}

fs.writeFileSync(file, content, { encoding: "utf8" });
console.log("✓ Shebang added to dist/index.js");
