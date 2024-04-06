import { expect, test } from "@playwright/test";

const embedSelector = 'iframe[src*="embed"]';
let embed;

test.beforeEach(async ({ page }) => {
  embed = page.frameLocator(embedSelector);
  await page.goto("/", { waitUntil: "commit" });
});

test("loads", async () => {
  await expect(embed.locator("multi-file-layout")).toBeVisible();
});

test("shows the correct tabs", async () => {
  const solutionCode = embed.getByText("Solution Code", { exact: true });
  const testCases = embed.getByText("Test Cases", { exact: true });
  const runOutput = embed.getByText("Run Output", { exact: true });
  const editorSettings = embed.getByText("Editor Settings", { exact: true });
  const instructions = embed.locator("tab-heading :text('Instructions')");

  await expect(solutionCode).toBeVisible();
  await expect(testCases).toBeVisible();
  await expect(runOutput).toBeVisible();
  await expect(instructions).toBeVisible();
  await expect(editorSettings).toBeVisible();
});

test("submits and shows run response", async ({ page }) => {
  const runner = embed.frameLocator("#runner-frame");
  await page.waitForResponse(
    (response) =>
      response.status() === 200 &&
      response.url() === "https://coderunner-production.qualified.io/token",
  );
  await embed.getByText("Submit", { exact: true }).click();
  await expect(runner.getByText("Test Results:")).toBeVisible();
});

test("runs and shows run response", async ({ page }) => {
  const runner = embed.frameLocator("#runner-frame");
  await page.waitForResponse(
    (response) =>
      response.status() === 200 &&
      response.url() === "https://coderunner-production.qualified.io/token",
  );
  await embed.getByText("Run", { exact: true }).click();
  await expect(runner.getByText("Test Results:")).toBeVisible();
});

test("can be destroyed", async ({ page }) => {
  await expect(page.locator(embedSelector)).toBeVisible();
  await page.evaluate("window.manager.destroy()");
  await expect(page.locator(embedSelector)).not.toBeVisible();
});

test("loads the correct challenge instructions", async ({ page }) => {
  const startHere = embed.locator(":text('Start Here!')");
  const instructions = embed.locator("tab-heading :text('Instructions')");
  const settings = embed.locator("tab-heading :text('Editor Settings')");

  await expect(startHere).not.toBeVisible();
  await instructions.click();
  await expect(instructions).toBeVisible();
  await settings.click();
  await expect(startHere).not.toBeVisible();
});

test("updates an editor config", async ({ page }) => {
  const readOnly = embed.getByText("Read-Only");
  const run = embed.getByText("Run", { exact: true });
  const submit = embed.getByText("Submit", { exact: true });
  const pyCode = embed.getByText("def say_hello");

  await expect(run).toBeVisible();
  await expect(submit).toBeVisible();
  await expect(readOnly).not.toBeVisible();
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

  await expect(readOnly).toBeVisible();
  await expect(run).not.toBeVisible();
  await expect(submit).not.toBeVisible();
  await expect(pyCode).toBeVisible();
});
