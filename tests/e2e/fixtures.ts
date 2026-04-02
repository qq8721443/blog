import { expect, type Locator, type Page } from "@playwright/test";

export const firstPostTitle = "테스트글입니다~";

export async function expectMainContent(page: Page) {
  await expect(page.locator("main")).toBeVisible();
}

export async function fillSearch(page: Page, value: string) {
  await page.getByRole("searchbox", { name: "글 검색" }).fill(value);
}

export async function expectPostLinkVisible(
  page: Page,
  title = firstPostTitle,
) {
  await expect(page.getByRole("link", { name: title })).toBeVisible();
}

export async function expectPostLinkHidden(page: Page, title = firstPostTitle) {
  await expect(page.getByRole("link", { name: title })).toHaveCount(0);
}

export async function clickTag(page: Page, tag: string) {
  await page.getByRole("button", { name: tag }).click();
}

export async function expectThemeToggled(
  root: Locator,
  nextTheme: "light" | "dark",
) {
  await expect(root).toHaveAttribute("data-theme", nextTheme);
}
