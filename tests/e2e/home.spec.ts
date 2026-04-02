import AxeBuilder from "@axe-core/playwright";
import { expect, test } from "@playwright/test";
import {
  clickTag,
  expectMainContent,
  expectPostLinkVisible,
  fillSearch,
  firstPostTitle,
} from "./fixtures";

test.describe("home", () => {
  test("renders the latest post list", async ({ page }) => {
    await page.goto("/");

    await expectMainContent(page);
    await expectPostLinkVisible(page);
    await expect(page.getByRole("button", { name: "All" })).toHaveAttribute(
      "aria-pressed",
      "true",
    );
  });

  test("filters posts by Korean search text", async ({ page }) => {
    await page.goto("/");

    await fillSearch(page, "테슽");
    await expectPostLinkVisible(page);
  });

  test("filters posts by tag", async ({ page }) => {
    await page.goto("/");

    await clickTag(page, "Engineering");
    await expectPostLinkVisible(page);

    await clickTag(page, "Architecture");
    await expectPostLinkVisible(page);

    await clickTag(page, "All");
    await expect(page.getByRole("button", { name: "All" })).toHaveAttribute(
      "aria-pressed",
      "true",
    );
  });

  test("has no critical accessibility violations on the home page", async ({
    page,
  }) => {
    await page.goto("/");

    const accessibilityScanResults = await new AxeBuilder({ page })
      .disableRules("color-contrast")
      .analyze();

    expect(accessibilityScanResults.violations).toEqual([]);
  });

  test("supports theme toggling", async ({ page }) => {
    await page.goto("/");

    const root = page.locator("html");
    const toggle = page.getByRole("button", { name: /모드로 전환/ });
    const initialTheme = (await root.getAttribute("data-theme")) ?? "light";

    await toggle.click();

    const expectedTheme = initialTheme === "dark" ? "light" : "dark";
    await expect(root).toHaveAttribute("data-theme", expectedTheme);
  });

  test("moves focus to the home search field from the header search button", async ({
    page,
  }) => {
    await page.goto("/");

    await page.getByRole("button", { name: "검색으로 이동" }).click();
    await expect(
      page.getByRole("searchbox", { name: "글 검색" }),
    ).toBeFocused();
  });

  test("navigates to the detail page from the list", async ({ page }) => {
    await page.goto("/");

    await page.getByRole("link", { name: firstPostTitle }).click();
    await expect(page).toHaveURL("/posts/first");
    await expect(
      page.getByRole("heading", { name: firstPostTitle }),
    ).toBeVisible();
  });
});
