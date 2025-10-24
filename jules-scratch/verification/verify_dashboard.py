# jules-scratch/verification/verify_dashboard.py
from playwright.sync_api import sync_playwright

def run(playwright):
    browser = playwright.chromium.launch()
    page = browser.new_page()
    page.goto("http://localhost:3000/dashboard")

    # Click the "Create Agent" button
    page.click("text=Create Agent")

    # Fill in the form
    page.fill("input[id=name]", "Test Agent")
    page.fill("input[id=specialty]", "Testing")
    page.fill("input[id=capabilities]", "running tests, reporting results")

    # Click the "Create" button
    page.click("text=Create")

    # Take a screenshot
    page.screenshot(path="jules-scratch/verification/verification.png")

    browser.close()

with sync_playwright() as playwright:
    run(playwright)
