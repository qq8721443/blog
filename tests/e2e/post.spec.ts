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

  test("opens the global search overlay from the header", async ({ page }) => {
    await page.goto("/posts/first");

    await page.getByRole("button", { name: "검색 열기" }).click();
    await expect(
      page.getByRole("dialog", { name: "블로그 글 검색" }),
    ).toBeVisible();
    await expect(
      page.getByRole("searchbox", { name: "블로그 글 검색" }),
    ).toBeFocused();
  });

  test("keeps tab focus trapped inside the search overlay", async ({
    page,
  }) => {
    await page.goto("/posts/first");

    await page.getByRole("button", { name: "검색 열기" }).click();

    const dialog = page.getByRole("dialog", { name: "블로그 글 검색" });
    const searchInput = dialog.getByRole("searchbox", {
      name: "블로그 글 검색",
    });

    await expect(searchInput).toBeFocused();

    for (let index = 0; index < 6; index += 1) {
      await page.keyboard.press("Tab");

      const activeElementIsInsideDialog = await dialog.evaluate((element) =>
        element.contains(document.activeElement),
      );

      expect(activeElementIsInsideDialog).toBeTruthy();
    }

    await page.keyboard.press("Shift+Tab");
    await expect(
      dialog.evaluate((element) => element.contains(document.activeElement)),
    ).resolves.toBeTruthy();

    await page.keyboard.press("Shift+Tab");
    await expect(
      dialog.evaluate((element) => element.contains(document.activeElement)),
    ).resolves.toBeTruthy();
  });
});
