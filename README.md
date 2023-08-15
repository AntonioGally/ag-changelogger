## GitHub Changelog Updater Action

This action automatically updates the `CHANGELOG.md` file in your repository whenever a new pull request is merged. It uses the your Pull Request as data and append it to the changelog. The data that the action gets in yout repository is: 
`title`, `body`, `commits`, `baseBranch`, `prUrl`, `createdAt`, `prNumber`.

### Inputs

| **Name**           | Type   | Description                                                                                               | Required |
|--------------------|--------|-----------------------------------------------------------------------------------------------------------|----------|
| **commitEmail**    | string | The email used for committing the updated CHANGELOG.md.                                                   | true     |
| **commitUserName** | string | The username used for committing the updated CHANGELOG.md.                                                | true     |
| **changelogPath**  | string | Relative path to your changelog file, starting from the root of your project. Default is "./CHANGELOG.md" | false    |
| **githubToken**    | string | GH token that will provide the permissions to read and write in your repository                           | true     |


### Usage
Include this action in your workflow file. Here is an example:

```yml
on:
  pull_request:
    types: [closed] #only closed pr
    branches:
      - main #trigger this action if the pr is related with this branch

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
        uses: AntonioGally/ag-changelogger/@main
        with:
          commitEmail: antonio.gally@gmail.com
          commitUserName: AntonioGally
          changelogPath: ./CHANGELOG.md #Relative path
          githubToken: ${{ secrets.GITHUB_TOKEN }} #Github default token, PATs are recomended
```

### Observations
 - 🚨 Your repository must have another script/action that creates the tags. This action doesn't create any tags it self, just read the last created tag and increase one version for loggin the changes, expecting that other script will create the new tag **using the same versioning logic** (with major, minor and patch regex). The function that do that can be finded in `./utils/getLatestTag` and is called `getVersionByPrTitle`.
 - The changelog file must exist in the repository's main branch. 
 - If the pr's title doesn't contains major, minor or patch name, the script will increase the patch number of the version.

### Example

<img width="800" alt="image" src="https://github.com/AntonioGally/ag-changelogger/assets/68209906/b09547da-ad6d-4908-8223-20d1a3a53a3e">


### Contributing
Just send a nice PR that I'll review it with love :D Or just email me as well I'll read

### Under the hood
I'm using ncc build to generate... a build, with all the node_modules that the script need to be executed. I need to do this because I wanted to minimize the effort to run this actions in other repositories. I could make a sh executable file and install the dependencies and stuff, but I wont :D.
The script is simple, the `changeLogger.js` is the entrancy to my dirty code files. It will start getting all the inputs that you pass by workflow and will create a authenticated connection with github api. Then, will first get the pr information, including the commits that are part of the PR. After that, the script will get the next tag version, starting from the last tag that you have in your repo. If you don't have any, the first tag will be `v0.1.0`. After get the next version, the script will gatter all the informations into one big string and will try to find your changelog file. After finding the file, the script concats the new big string with the old string in your changelog. With this big and updated string, the script will commit the changes using `execSync` function from `child_process` and done, you have a nice changelog now!

### Best practices
Try to fill the description as much as you can, put images and texts that describe directly what was your change in that PR. In a long run, will help a lot in the changelog file, and will be much nicier to see :D
### Contacts

 - antonio.gally@gmail.com
 - https://www.linkedin.com/in/antonio-gally/
 - https://github.com/AntonioGally