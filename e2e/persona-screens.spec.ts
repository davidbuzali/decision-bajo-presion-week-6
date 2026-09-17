import { expect, test, type Page } from "@playwright/test";

const evidenceDirectory = "docs/evidence/persona";

async function capture(page: Page, filename: string) {
  await page.evaluate(() => window.scrollTo(0, 0));
  await page.screenshot({ path: `${evidenceDirectory}/${filename}` });
}

test("capture Screens 1–5 in order for the fresh persona pass", async ({ page }) => {
  await page.setViewportSize({ width: 1440, height: 1000 });
  await page.goto("/");

  await expect(
    page.getByRole("heading", { name: "Decisión Bajo Presión" }),
  ).toBeVisible();
  await capture(page, "screen-1-safe-start.png");

  await page.getByRole("radio", { name: /Movimiento reducido/i }).check();
  await page.getByRole("radio", { name: /Vista plana/i }).check();
  await page.getByRole("button", { name: /Comenzar ensayo/i }).click();
  await expect(
    page.getByRole("heading", {
      name: "La alerta comienza. ¿Qué haces primero?",
    }),
  ).toBeVisible();
  await capture(page, "screen-2-baseline.png");

  await page.getByRole("button", { name: /Observar el entorno/i }).click();
  await page
    .getByRole("button", { name: /Intentar pasar por la salida obstruida/i })
    .click();
  await page
    .getByRole("button", {
      name: /^Reportar la diferencia y pedir apoyo coordinado$/i,
    })
    .click();
  await expect(
    page.getByRole("heading", {
      name: "Lo que ocurrió en el escenario inicial",
    }),
  ).toBeVisible();
  await capture(page, "screen-3-human-debrief.png");

  await page
    .getByRole("button", {
      name: "Confirmo que ocurrió el debrief humano",
    })
    .click();
  await expect(
    page.getByRole("heading", {
      name: "La ruta alterna habitual también está cerrada. ¿Qué haces?",
    }),
  ).toBeVisible();
  await capture(page, "screen-4-unseen-retest.png");

  await page
    .getByRole("button", {
      name: "Verificar y seguir la ruta temporal señalizada",
    })
    .click();
  await expect(
    page.getByRole("heading", {
      name: "Lo observado en las dos simulaciones",
    }),
  ).toBeVisible();
  await capture(page, "screen-5-comparison.png");
});
