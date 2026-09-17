import {
  expect,
  test,
  type Locator,
  type Page,
  type TestInfo,
} from "@playwright/test";

async function tabTo(page: Page, target: Locator) {
  for (let attempt = 0; attempt < 20; attempt += 1) {
    const isFocused = await target.evaluate(
      (element) => element === document.activeElement,
    );
    if (isFocused) {
      return;
    }
    await page.keyboard.press("Tab");
  }
  throw new Error("Keyboard focus did not reach the expected control.");
}

async function chooseWithKeyboard(page: Page, name: string | RegExp) {
  const button = page.getByRole("button", { name });
  await tabTo(page, button);
  await page.keyboard.press("Enter");
}

async function completeRouteJourney(
  page: Page,
  input: "keyboard" | "pointer",
  onStep: () => Promise<void> = async () => undefined,
) {
  const activate =
    input === "keyboard"
      ? (name: string | RegExp) => chooseWithKeyboard(page, name)
      : (name: string | RegExp) => page.getByRole("button", { name }).click();

  const flatView = page.getByRole("radio", { name: /Vista plana/i });
  if (input === "keyboard") {
    const selectedView = page.getByRole("radio", {
      name: /Simulación 3D en pantalla/i,
    });
    await tabTo(page, selectedView);
    await page.keyboard.press("ArrowDown");
    await expect(flatView).toBeChecked();
  } else {
    await flatView.check();
  }
  await onStep();

  await activate(/Comenzar ensayo/i);
  await onStep();
  await activate(/Observar el entorno/i);
  await onStep();

  await activate(/Pausar y salir/i);
  await expect(
    page.getByRole("dialog", { name: /Tómate el tiempo/i }),
  ).toBeVisible();
  await expect(page.getByRole("button", { name: /Reanudar ensayo/i })).toBeFocused();
  await onStep();
  await activate(/Reanudar ensayo/i);
  await onStep();

  await activate(/Intentar pasar por la salida obstruida/i);
  await onStep();
  await activate(/^Reportar la diferencia y pedir apoyo coordinado$/i);
  await onStep();
  await activate("Confirmo que ocurrió el debrief humano");
  await onStep();
  await activate("Verificar y seguir la ruta temporal señalizada");
  await onStep();
}

async function attachScreenshot(
  page: Page,
  testInfo: TestInfo,
  name: string,
  path: string,
) {
  await page.screenshot({ path });
  await testInfo.attach(name, {
    path,
    contentType: "image/png",
  });
}

async function expectNoHorizontalOverflow(page: Page) {
  const dimensions = await page.locator("html").evaluate((element) => ({
    clientWidth: element.clientWidth,
    scrollWidth: element.scrollWidth,
  }));
  expect(dimensions.scrollWidth).toBeLessThanOrEqual(dimensions.clientWidth);
}

test("M11–M13: keyboard journey reaches the immutable physical gate and reload clears it", async ({
  page,
}, testInfo) => {
  const applicationRequests: Array<Readonly<{ method: string; url: string }>> = [];
  page.on("request", (request) => {
    applicationRequests.push({ method: request.method(), url: request.url() });
  });
  await page.setViewportSize({ width: 1280, height: 800 });
  await page.goto("/");

  await completeRouteJourney(page, "keyboard");

  await expect(
    page.getByRole("heading", { name: "Lo observado en las dos simulaciones" }),
  ).toBeVisible();
  await expect(
    page.getByText("Demostrado después del debrief en el retest no visto"),
  ).toBeVisible();
  await expect(page.getByText("Pendiente de validación física")).toBeVisible();
  await expect(page.getByRole("button")).toHaveCount(0);
  await page.evaluate(() => window.scrollTo(0, 0));
  await attachScreenshot(
    page,
    testInfo,
    "m12-desktop-comparison",
    "docs/evidence/m12-desktop-comparison.png",
  );

  await page.reload();
  await expect(
    page.getByRole("heading", { name: "Decisión Bajo Presión" }),
  ).toBeVisible();
  await expect(page.getByText("Pendiente de validación física")).toHaveCount(0);
  expect(
    applicationRequests.filter((request) => {
      const url = new URL(request.url);
      return url.origin !== "http://127.0.0.1:4173" || request.method !== "GET";
    }),
  ).toEqual([]);
});

test("M14: the complete journey remains usable at 390 × 844 without horizontal clipping", async ({
  page,
}, testInfo) => {
  await page.setViewportSize({ width: 390, height: 844 });
  await page.goto("/");
  await expectNoHorizontalOverflow(page);

  await completeRouteJourney(page, "pointer", () =>
    expectNoHorizontalOverflow(page),
  );

  await expect(page.getByText("Pendiente de validación física")).toBeVisible();
  await expectNoHorizontalOverflow(page);
  await page.evaluate(() => window.scrollTo(0, 0));
  await attachScreenshot(
    page,
    testInfo,
    "m14-mobile-comparison-top",
    "docs/evidence/m14-mobile-comparison.png",
  );
  await page.getByText("Pendiente de validación física").scrollIntoViewIfNeeded();
  await attachScreenshot(
    page,
    testInfo,
    "m14-mobile-physical-gate",
    "docs/evidence/m14-mobile-physical-gate.png",
  );
});
