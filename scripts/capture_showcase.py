from pathlib import Path
import re

from playwright.sync_api import sync_playwright


OUTPUT = Path("public/images/showcase")
OUTPUT.mkdir(parents=True, exist_ok=True)


def admin_password() -> str:
    content = Path(".env.local").read_text(encoding="utf-8")
    match = re.search(r"^ADMIN_PASSWORD=[\"']?([^\r\n\"']+)", content, re.MULTILINE)
    if not match:
        raise RuntimeError("ADMIN_PASSWORD is missing from .env.local")
    return match.group(1).strip()


with sync_playwright() as p:
    browser = p.chromium.launch(headless=True)
    page = browser.new_page(viewport={"width": 1440, "height": 900}, device_scale_factor=1)

    for path, filename in [
        ("/", "home.png"),
        ("/category/%E8%A1%8C%E4%B8%9A%E6%A0%87%E5%87%86", "category.png"),
        ("/doc/1", "document-detail.png"),
    ]:
        page.goto(f"http://localhost:3000{path}", wait_until="networkidle")
        page.screenshot(path=str(OUTPUT / filename), full_page=True)

    page.goto("http://localhost:3000/admin", wait_until="networkidle")
    page.locator("#password").fill(admin_password())
    page.get_by_role("button", name="登录").click()
    page.wait_for_timeout(800)
    page.wait_for_load_state("networkidle")
    page.screenshot(path=str(OUTPUT / "admin-dashboard.png"), full_page=True)
    browser.close()
