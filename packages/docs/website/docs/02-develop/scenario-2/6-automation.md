---
title: Pipeline Automation
---

:::tip GUIDANCE

What automation is used to complete this scenario?

- Resource management scripts (Az CLI, AZD cli, SWA CLI, Func CLI, PowerShell)
 \- GitHub Actions and Azure DevOps Pipelines
- GitHub Actions, Azure DevOps Pipelines
- AAD automation
- Custom or 3rd party automation
  - GH CLI
  - Stripe CLI
  - Mongo CLI
- Any `hidden` or poorly known areas such as https://resources.azure.com - explain why you needed it so that can translate into content.

All automation must include cleanup/teardown scripts
:::

## GitHub Actions

When an application is deployed to Azure Static Web Apps, a workflow file is automatically generated. This file contains the necessary instructions to enable CI/CD integrations for build and deployment, and can be extended with custom or marketplace actions from the [GitHub Marketplace](https://github.com/marketplace?type=actions)

If you would like to learn more about GitHub Actions, follow [this link](https://docs.github.com/en/actions/learn-github-actions/workflow-syntax-for-github-actions)

## Static Web Apps CLI

The Contoso Real Estate Portal application is deployed to Azure Static Web Apps. The Azure Static Web Apps CLI is used to manage and configure resources for the project, as well as to integrate it with the CI/CD pipelines. This command line tool has extensive documentation, which can be found [here](https://azure.github.io/static-web-apps-cli/)
