import { expect, test } from "@playwright/test";

test("renders the 404 page for unknown routes", async ({ page }) => {
  await page.goto("/missing-page");

  await expect(
    page.getByRole("heading", {
      name: "찾고 있는 페이지가 사라졌거나 이동했어요.",
    }),
  ).toBeVisible();
  await expect(page.getByRole("link", { name: "Go home" })).toBeVisible();
  await expect(page.getByRole("link", { name: "Read Latest Post" })).toBeVisible();
});
