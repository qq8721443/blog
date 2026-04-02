import { expect, test } from "@playwright/test";
import { firstPostTitle } from "./fixtures";

test.describe("post detail", () => {
  test("renders title, metadata, body, and comments section", async ({
    page,
  }) => {
    await page.goto("/posts/first");

    await expect(
      page.getByRole("heading", { name: firstPostTitle }),
    ).toBeVisible();
    await expect(page.getByText("Engineering")).toBeVisible();
    await expect(
      page.getByRole("heading", { name: "장식의 부담" }),
    ).toBeVisible();
    await expect(page.getByRole("heading", { name: "Comments" })).toBeVisible();
  });

  test("renders either a giscus mount or the fallback", async ({ page }) => {
    await page.goto("/posts/first");

    const fallback = page.getByText(
      "Comments will appear here after giscus is configured.",
    );
    const giscusFrame = page.locator("iframe.giscus-frame");

    await expect(fallback.or(giscusFrame)).toBeVisible();
  });
});
