End-to-End QA Workflow with Natural Language
Workflow Overview
This prompt guides you through a complete 7-step QA workflow using MCP servers and AI agents to go from user story to committed automated test scripts.
---
STEP 1: Read User Story
Prompt:
I need to start a new QA session. Please read the user story from the file:
`user-stories/SCRUM-101-ecommerce-checkout.md`
Summarize the key requirements, acceptance criteria, and testing scope.
Expected Output:
Summary of the user story
List of acceptance criteria
Application URL and test credentials
Key features to test
---
STEP 2: Create Test Plan
Prompt:
Based on the user story SCRUM-101 that we just reviewed, use the `playwright-test-planner` agent to:
Read the application URL and test credentials from the user story
Explore the application and understand all workflows mentioned in the acceptance criteria
Create a comprehensive test plan that covers all acceptance criteria including:
Happy path scenarios
Negative scenarios (validation errors, empty fields, invalid data)
Edge cases and boundary conditions
Navigation flow tests
UI element validation
Save the test plan as: `specs/saucedemo-checkout-test-plan.md`
Ensure each test scenario includes:
Clear test case title
Detailed step-by-step instructions
Expected results for each step
Test data requirements
Expected Output:
Complete test plan markdown file saved to `specs/`
Organized test scenarios with clear structure
Browser exploration screenshots (if needed)
---
STEP 3: Perform Exploratory Testing
Prompt:
Now I need to perform manual exploratory testing using Playwright MCP browser tools.
Please read the test plan from: `specs/saucedemo-checkout-test-plan.md`
Then execute the test scenarios defined in that plan:
Use Playwright browser tools to manually execute each test scenario from the plan
Follow the step-by-step instructions in each test case
Verify expected results match actual results
Take screenshots at key steps and error states
Document your findings:
Test execution results for each scenario
Any UI inconsistencies or unexpected behaviors
Missing validations or bugs discovered
Screenshots as evidence
Expected Output:
Manual test execution results
Screenshots of the application at various states
List of observations and findings
Any issues discovered during exploration
---
STEP 4: Generate Automation Scripts
Prompt:
Now I need to create automated test scripts using the `playwright-test-generator` agent.
Please review:
Test plan from: `specs/saucedemo-checkout-test-plan.md` (for test scenarios and steps)
Exploratory testing results from Step 3 (for actual element selectors and UI insights)
Using insights from the manual exploratory testing:
Leverage the element selectors and locators that were successfully used in Step 3
Use stable element properties (IDs, data attributes, roles) discovered during exploration
Apply wait strategies and UI behaviors observed during manual testing
Incorporate any workarounds for UI quirks discovered
Generate Playwright JavaScript automation scripts:
Create scripts for each test scenario from the test plan
Organize scripts into appropriate test suite files in: `tests/saucedemo-checkout/`
Use the test case names and steps from the test plan
Use reliable selectors and strategies from exploratory testing
Requirements for all scripts:
Follow Playwright best practices
Include proper assertions using `expect()`
Use descriptive test names matching the format in the test plan
Use robust element selectors discovered during manual testing
Add comments for complex steps
Use proper wait strategies based on actual application behavior
Add proper test hooks (`beforeEach`, `afterEach`)
Configure for multiple browsers (Chrome, Firefox, Safari)
After generating the scripts, run the tests to verify they pass.
Expected Output:
Test suite files created in `tests/saucedemo-checkout/` based on test plan scenarios
Scripts using robust selectors discovered during exploratory testing
All scripts follow Playwright best practices
Initial test generation complete