## GitHub Changelog Updater Action

This action automatically updates the `CHANGELOG.md` file in your repository whenever a new pull request is merged. It uses the title of the pull request to determine the type of changes (major, minor, or patch) and appends this to the changelog.

### Inputs
`commitEmail`
**Required** The email used for committing the updated CHANGELOG.md. Default "action@github.com".

`commitUserName`
**Required** The username used for committing the updated CHANGELOG.md. Default "GitHub Action".

Usage
Include this action in your workflow file. Here is an example:

```yml
on:
  pull_request:
    types: [closed]
    branches:
      - main

jobs:
  update_changelog:
    runs-on: ubuntu-latest
    if: github.event.pull_request.merged == true
    steps:
      - name: Checkout code
        uses: actions/checkout@v3
        with:
          ref: main

      - name: Update Changelog
        uses: AntonioGally/ag-changelogger@v0.1.1
        with:
          commitEmail: ${{ secrets.GITHUB_EMAIL }}
          commitUserName: ${{ secrets.GITHUB_USERNAME }}
          changelogPath: ./CHANGELOG.md #Relative path
```

## Example

<img width="800" alt="image" src="https://github.com/AntonioGally/ag-changelogger/assets/68209906/b09547da-ad6d-4908-8223-20d1a3a53a3e">


## Contacts

 - antonio.gally@gmail.com
 - https://www.linkedin.com/in/antonio-gally/
 - https://github.com/AntonioGally