const fs = require("node:fs/promises");
const path = require("path");

const basePath = "docs";

(async () => {
  const entries = await fs.readdir(basePath, { withFileTypes: true });
  const directories = entries.filter((entry) => entry.isDirectory());

  for (const directory of directories) {
    const dirPath = path.join(basePath, directory.name);
    const files = await fs.readdir(dirPath);

    for (const file of files) {
      if (!file.endsWith(".html")) {
        continue;
      }

      const filePath = path.join(dirPath, file);
      const content = (await fs.readFile(filePath, "utf8"))
        .replace(/href="styles/g, 'href="../styles')
        .replace(/src="scripts/g, 'src="../scripts');
      await fs.writeFile(filePath, content, "utf8");
    }
  }
})();
