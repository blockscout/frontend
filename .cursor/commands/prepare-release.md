# Prepare Release

## Overview
Prepare the next release of the application.

## Steps
1. **Get the next release tag name**
    - Fetch the latest release from GitHub and retrieve its name.
    - If not specified, calculate the next __minor__ version according to [semantic versioning](https://semver.org).
    - If specified, calculate the next __major__ or __patch__ version.

2. **Update `./docs/ENVS.md` and `./docs/DEPRECATED_ENVS.md` files**
    - In these files, update all placeholders containing "upcoming" text with the next release tag, adding a "+" at the end. Examples:
        - "upcoming" -> "v1.2.3+"
        - "<upcoming>" -> "v1.2.3+"

3. **Create release notes**
    - Use `./RELEASE_NOTES.md` as a reference and this release notes [link](https://github.com/blockscout/frontend/releases/tag/v2.3.0) as an example.
    - Get all commits between the head of the remote main branch and the latest release tag.
    - Use the GitHub API to draft the next release notes using the main branch as a target. Parse the response to obtain the list of pull requests and new contributors.
    - Copy `./RELEASE_NOTES.md` into a new file named `./RELEASE_NOTES_<release-tag>.md`.
    - For every section (except "Changes in ENV variables") in the file, add the appropriate pull requests from previous steps using the pattern for each line: `- <pull-request-name> by <pull-request-author> in <link-to-pull-request>`. Example: "- API documentation page by @tom2drum in https://github.com/blockscout/frontend/pull/2725". Capitalize first letter in the PR name if needed.
    - To determine the correct section in the release notes file, use the labels assigned to each pull request (which need to be fetched separately from the GitHub API alongside the pull request description, as the description will be used in the next step) and the table below. If a pull request belongs to several sections, mention it in each section. If a pull request lacks labels or its section cannot be determined, place it in the "Other Changes" section.

        | Section                     | Labels                                          |
        | --------------------------- | ----------------------------------------------- |
        | New Features                | feature, enhancement, client feature           |
        | Bug Fixes                  | bug                                            |
        | Performance Improvements     | performance                                    |
        | Dependencies updates        | dependencies                                   |
        | Design updates              | design                                        |

    - Compose the "Changes in ENV variables" section with the following rules:
        - Find all pull requests with the "ENVs" tag.
        - Create a temporary file and paste the pull request numbers along with their descriptions, excluding the "Checklist for PR author" section. Then, remove any content from the descriptions that is unrelated to the enviroment variables or does not describe changes in them. Rephrase sentences if necessary. If pull request description doesn't mention any of these changes, use "Cannot find any changes in ENVs in PR description" as a placeholder.
        - Copy the result to the `./RELEASE_NOTES_<release-tag>.md` file. Group all changes by the pull request number, leaving the link to it. Use the following formatting:
            ```
            - <link-to-pull-request>:
                - <change-1>
                - <change-1>
            ```
    - Update the "Full list of the ENV variables" and "Full Changelog" with the correct version tags.
    - Update the "New Contributors" section if necessary.
    - Keep the "Compatibility" section unchanged.
    - Remove all empty sections.