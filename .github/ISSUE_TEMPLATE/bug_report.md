name: Bug Report
description: Report a bug or issue
title: "[BUG] "
labels: ["bug"]

body:

- type: textarea
  id: description
  attributes:
  label: Description
  placeholder: A clear and concise description of what the bug is
  validations:
  required: true

- type: textarea
  id: reproduce
  attributes:
  label: Steps to Reproduce
  description: Steps to reproduce the problem
  placeholder: | 1. Go to '...' 2. Click on '....' 3. Scroll down to '....' 4. See error
  validations:
  required: true

- type: textarea
  id: expected
  attributes:
  label: Expected Behavior
  placeholder: What should happen instead?
  validations:
  required: true

- type: textarea
  id: actual
  attributes:
  label: Actual Behavior
  placeholder: What actually happened?
  validations:
  required: true

- type: dropdown
  id: browser
  attributes:
  label: Browser
  options: - Chrome - Firefox - Safari - Edge - Other
  validations:
  required: true

- type: input
  id: version
  attributes:
  label: Version/Commit
  placeholder: e.g., v0.1.0 or commit hash

- type: textarea
  id: environment
  attributes:
  label: Environment
  placeholder: |
  OS: Windows 10
  Node version: 18.0.0
  npm version: 9.0.0
  validations:
  required: false

- type: textarea
  id: logs
  attributes:
  label: Console Logs / Error Messages
  placeholder: Paste any relevant logs or error messages from the console
  render: bash

- type: textarea
  id: additional
  attributes:
  label: Additional Context
  placeholder: Any other context about the problem?

- type: checkboxes
  id: checklist
  attributes:
  label: Checklist
  options: - label: I have checked if this issue already exists
  required: true - label: I have provided reproduction steps
  required: true - label: I am using the latest version
  required: true
