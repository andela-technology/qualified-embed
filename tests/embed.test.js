import { expect, test } from "@playwright/test";

console.log("test");

class Embed {
  constructor(page) {
    this.page = page;
    this.embedSelector = 'iframe[src*="embed"]';
    this.clientKey = "g39RsSfAYEkyRG8ZYjxrpT9c/XqnfQpN";
    const embed = (this.embed = page.frameLocator(this.embedSelector));

    this.body = embed.locator("body");
    this.editorSettings = embed.getByText("Editor Settings", { exact: true });
    this.instructions = embed.locator("tab-heading :text-is('Instructions')");
    this.layout = embed.locator("multi-file-layout");
    this.readOnly = embed.getByText("Read-Only");
    this.run = embed.getByRole("button", { name: "Run" });
    this.runner = embed.frameLocator("#runner-frame");
    this.runOutput = embed.getByText("Run Output", { exact: true });
    this.settings = embed.locator("tab-heading :text-is('Editor Settings')");
    this.testsEditor = embed.locator(".multi-file-layout-code-editor").first();
    this.solutionCode = embed.getByText("Solution Code", { exact: true });
    this.solutionEditor = embed
      .locator(".multi-file-layout-code-editor")
      .first();
    this.startHere = embed.locator(":text('Start Here!')");
    this.submit = embed.getByRole("button", { name: "Submit" });
    this.testEditor = embed.locator(".multi-file-layout-code-editor").last();
    this.testCases = embed.getByText("Test Cases", { exact: true });
    this.testResults = this.runner.getByText("Test Results:");
  }

  goto() {
    return this.page.goto("/", { waitUntil: "commit" });
  }

  waitForCRToken() {
    const crTokenURL = "https://coderunner-production.qualified.io/token";
    return this.page.waitForResponse(
      (response) => response.status() === 200 && response.url() === crTokenURL,
    );
  }
}

let embed;
test.beforeEach(async ({ page }) => {
  embed = new Embed(page);
  await embed.goto();
});

test("loads", async () => {
  await expect(embed.layout).toBeVisible();
});

test("matches screenshot", async ({ page }) => {
  await embed.waitForCRToken();
  await expect(page).toHaveScreenshot();
});

test("shows the correct tabs", async () => {
  await expect(embed.solutionCode).toBeVisible();
  await expect(embed.testCases).toBeVisible();
  await expect(embed.runOutput).toBeVisible();
  await expect(embed.instructions).toBeVisible();
  await expect(embed.editorSettings).toBeVisible();
});

test("submits and shows run response by click", async () => {
  await embed.waitForCRToken();
  await expect(embed.testResults).not.toBeVisible();
  await embed.submit.click();
  await expect(embed.testResults).toBeVisible();
});

test("submits and shows run response by keyboard", async ({ page }) => {
  await embed.waitForCRToken();
  await embed.solutionEditor.click();
  await page.keyboard.press("Control+Enter");
  await expect(embed.testResults).toBeVisible();
});

test("runs and shows run response by click", async () => {
  await embed.waitForCRToken();
  await embed.run.click();
  await expect(embed.testResults).toBeVisible();
});

test("runs and shows run response by keyboard", async ({ page }) => {
  await embed.waitForCRToken();
  await embed.solutionEditor.click();
  await page.keyboard.press("Control+'");
  await expect(embed.testResults).toBeVisible();
});

test("can be destroyed", async ({ page }) => {
  await expect(embed.body).toBeVisible();
  await page.evaluate("window.manager.destroy();");
  await expect(embed.body).not.toBeVisible();
});

test("loads the correct challenge instructions", async () => {
  await expect(embed.startHere).not.toBeVisible();
  await embed.instructions.click();
  await expect(embed.instructions).toBeVisible();
  await embed.settings.click();
  await expect(embed.startHere).not.toBeVisible();
});

test("updates an editor config", async ({ page }) => {
  const pyCode = embed.solutionEditor.getByText("def say_hello");

  await expect(embed.run).toBeVisible();
  await expect(embed.submit).toBeVisible();
  await expect(embed.readOnly).not.toBeVisible();
  await expect(pyCode).not.toBeVisible();

  const options = {
    language: "python",
    mode: "readonly",
    hideTabs: "instructions",
  };
  const config = await page.evaluate(`
    window.manager.updateEditor({
      node: document.querySelector("[data-qualified-embed]"),
      options: ${JSON.stringify(options)},
    });
  `);
  expect(config.options).toEqual(expect.objectContaining(options));

  await expect(embed.readOnly).toBeVisible();
  await expect(embed.run).not.toBeVisible();
  await expect(embed.submit).not.toBeVisible();
  await expect(pyCode).toBeVisible();
});

test("reports error on missing embedClientKey", async ({ page }) => {
  await expect(embed.body).toBeAttached();
  await page.evaluate(`
    window.manager.destroy();
    window.QualifiedEmbed.QualifiedEmbedManager.init({ autoCreate: true });
  `);
  await expect(embed.body).toContainText("Error Loading Challenge");
  await expect(embed.body).toContainText("No embedClientKey provided");
});

test("reports error on incorrect embedClientKey", async ({ page }) => {
  await expect(embed.body).toBeAttached();
  await page.evaluate(`
    window.manager.destroy();
    window.QualifiedEmbed.QualifiedEmbedManager.init({
      autoCreate: true,
      options: { embedClientKey: "Incorrect embedClientKey" }
    });
  `);
  await expect(embed.body).toContainText("Error Loading Challenge");
  await expect(embed.body).toContainText("embedClientKey does not match team");
});

test("reports error on incorrect baseURL", async ({ page }) => {
  await expect(embed.body).toBeAttached();
  await page.evaluate(`
    window.manager.destroy();
    window.QualifiedEmbed.QualifiedEmbedManager.init({
      autoCreate: true,
      options: {
        embedClientKey: "${embed.embedClientKey}",
        baseURL: "incorrect baseURL",
      }
    });
  `);
  await expect(embed.body).toHaveText(/Cannot GET.*incorrect.*baseURL/);
});

test("reports error trying to create an editor without a node", async ({
  page,
}) => {
  await expect(embed.body).toBeAttached();
  const createEditor = page.evaluate("manager.createEditor();");
  await expect(createEditor).rejects.toThrowError(
    "Cannot create an embedded editor without a node",
  );
});

test("reports error on missing challengeId", async ({ page }) => {
  await expect(embed.body).toBeAttached();
  const createEditor = page.evaluate(
    "manager.createEditor({node: document.body});",
  );
  await expect(createEditor).rejects.toThrowError(
    "Unable to determine challenge ID from node: no value for data-qualified-embed",
  );
});

test("reports error on incorrect challengeId", async ({ page }) => {
  await expect(embed.body).toBeAttached();
  await page.evaluate(`
    manager.createEditor({
      node: document.querySelector("[data-qualified-embed]"),
      challengeId: "bad challenge id"
    });
  `);
  await expect(embed.body).toContainText("Error Loading Challenge");
  await expect(embed.body).toContainText(
    "Invalid challengeId: bad challenge id",
  );
});

test("allows editing text", async ({ page }) => {
  await embed.solutionEditor.getByText("Complete this function").click();
  await page.keyboard.press("PageUp");
  await page.keyboard.type("// foobar");
  await page.keyboard.press("Enter");
  await expect(embed.solutionEditor).toContainText("// foobar");
});

test("allows setting file contents", async ({ page }) => {
  await embed.waitForCRToken();
  await page.waitForFunction("window.manager.editors[0]");
  const files = {
    code: "// solution",
    testcases: "// tests",
  };
  const options = await page.evaluate(`
    window.manager.editors[0].setFileContents(${JSON.stringify(files)})
  `);
  expect(options.files).toEqual(files);
  await expect(embed.solutionEditor).toContainText(files.code);
  await expect(embed.testEditor).toContainText(files.testcases);
});

test("allows setting run callbacks", async ({ page }) => {
  await embed.waitForCRToken();
  await page.evaluate(`
    window.manager.updateEditor({
      node: document.querySelector("[data-qualified-embed]"),
      options: {
        onRun({ manager, editor, challengeId, data }) {
          window._run = data;
        },
        onRunStart({ manager, editor, challengeId, data }) {
          window._runStart = data;
        },
      },
    });
  `);
  await embed.run.click();

  await page.waitForFunction("window._runStart");
  const runStart = await page.evaluate("window._runStart");
  expect(runStart).toEqual(
    expect.objectContaining({
      type: "test",
      fileData: expect.objectContaining({
        files: {
          code: expect.stringContaining("say_hello"),
          testcases: expect.stringContaining("criterion"),
        },
      }),
    }),
  );

  await page.waitForFunction("window._run");
  const run = await page.evaluate("window._run");
  expect(run).toEqual(
    expect.objectContaining({
      type: "test",
      fileData: expect.objectContaining({
        files: {
          code: expect.stringContaining("say_hello"),
          testcases: expect.stringContaining("criterion"),
        },
      }),
      result: expect.objectContaining({
        serverError: false,
        completed: false,
        passed: 0,
      }),
    }),
  );
});
