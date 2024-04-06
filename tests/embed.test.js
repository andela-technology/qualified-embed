import { expect, test } from "@playwright/test";

class Embed {
  constructor(page) {
    this.page = page;
    this.embedSelector = 'iframe[src*="embed"]';
    const embed = (this.embed = page.frameLocator(this.embedSelector));

    this.editor = embed.locator(".multi-file-layout-code-editor").first();
    this.editorSettings = embed.getByText("Editor Settings", { exact: true });
    this.instructions = embed.locator("tab-heading :text('Instructions')");
    this.layout = embed.locator("multi-file-layout");
    this.readOnly = embed.getByText("Read-Only");
    this.run = embed.getByRole("button", { name: "Run" });
    this.runner = embed.frameLocator("#runner-frame");
    this.runOutput = embed.getByText("Run Output", { exact: true });
    this.settings = embed.locator("tab-heading :text('Editor Settings')");
    this.solutionCode = embed.getByText("Solution Code", { exact: true });
    this.startHere = embed.locator(":text('Start Here!')");
    this.submit = embed.getByRole("button", { name: "Submit" });
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

test("submits and shows run response", async ({ page }) => {
  await embed.waitForCRToken();
  await embed.submit.click();
  await expect(embed.testResults).toBeVisible();
});

test("runs and shows run response", async ({ page }) => {
  await embed.waitForCRToken();
  await embed.run.click();
  await expect(embed.testResults).toBeVisible();
});

test("can be destroyed", async ({ page }) => {
  await expect(page.locator(embed.embedSelector)).toBeVisible();
  await page.evaluate("window.manager.destroy()");
  await expect(page.locator(embed.embedSelector)).not.toBeVisible();
});

test("loads the correct challenge instructions", async ({ page }) => {
  await expect(embed.startHere).not.toBeVisible();
  await embed.instructions.click();
  await expect(embed.instructions).toBeVisible();
  await embed.settings.click();
  await expect(embed.startHere).not.toBeVisible();
});

test("updates an editor config", async ({ page }) => {
  const pyCode = embed.editor.getByText("def say_hello");

  await expect(embed.run).toBeVisible();
  await expect(embed.submit).toBeVisible();
  await expect(embed.readOnly).not.toBeVisible();
  await expect(pyCode).not.toBeVisible();

  const options = {
    language: "python",
    mode: "readonly",
    hideTabs: "instructions",
  };
  const config = await page.evaluate(`window.manager.updateEditor({
    node: document.querySelector('[data-qualified-embed]'),
    options: ${JSON.stringify(options)},
  })`);
  expect(config.options).toEqual(expect.objectContaining(options));

  await expect(embed.readOnly).toBeVisible();
  await expect(embed.run).not.toBeVisible();
  await expect(embed.submit).not.toBeVisible();
  await expect(pyCode).toBeVisible();
});

test("allows editing text", async ({ page }) => {
  await embed.editor.getByText("Complete this function").click();
  await page.keyboard.press("PageUp");
  await page.keyboard.type("// foobar");
  await page.keyboard.press("Enter");
  await expect(embed.editor).toContainText("// foobar");
});
