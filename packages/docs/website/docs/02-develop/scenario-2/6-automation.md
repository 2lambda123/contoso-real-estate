---
title: Pipeline Automation
---

:::tip GUIDANCE

What automation is used to complete this scenario?

- Resource management scripts (Az CLI, AZD cli, SWA CLI, Func CLI, PowerShell, GH CLI, Stripe CLI, Mongo CLI)
- GitHub Actions, Azure DevOps Pipelines
- AAD automation
- Custom or 3rd party automation
  - GH CLI
  - Stripe CLI
  - Mongo CLI
- Any `hidden` or poorly known areas such as https://resources.azure.com - explain why you needed it so that can translate into content.

All automation must include cleanup/teardown scripts. This is important to ensure that all resources created during the automation processes are properly managed.
:::

## GitHub Actions

GitHub Actions automates the deployment of applications to Azure Static Web Apps by generating a workflow file that is automatically pushed to the GitHub repository. This file contains the necessary instructions to enable CI/CD integrations for build and deployment, and it can be extended with additional custom or marketplace actions.

If you would like to extend the workflow file with custom or marketplace actions, refer to the [GitHub Marketplace](https://github.com/marketplace?type=actions) for available actions. You can also learn more about GitHub Actions in the [GitHub Actions documentation](https://docs.github.com/en/actions/learn-github-actions/understanding-github-actions).


