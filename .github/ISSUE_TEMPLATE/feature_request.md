name: Feature Request
description: Suggest an idea for this project
title: "[FEATURE] "
labels: ["enhancement"]

body:

- type: textarea
  id: problem
  attributes:
  label: Problem Statement
  description: Is your feature request related to a problem? Describe it.
  placeholder: I'm always frustrated when ...
  validations:
  required: true

- type: textarea
  id: solution
  attributes:
  label: Proposed Solution
  description: Describe the solution you'd like
  placeholder: It would be great if...
  validations:
  required: true

- type: textarea
  id: alternatives
  attributes:
  label: Alternative Approaches
  description: Describe any alternative solutions or features you've considered
  placeholder: Another way to solve this could be...

- type: textarea
  id: benefits
  attributes:
  label: Benefits
  description: What are the benefits of this feature?
  placeholder: | - Benefit 1 - Benefit 2 - Benefit 3

- type: textarea
  id: context
  attributes:
  label: Additional Context
  placeholder: Any other context or screenshots?

- type: checkboxes
  id: checklist
  attributes:
  label: Checklist
  options: - label: I have checked if this feature already exists
  required: true - label: I have searched for related issues
  required: true - label: This feature aligns with the project goals
  required: true
