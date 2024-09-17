//Libs
const github = require('@actions/github');
const { Octokit } = require("@octokit/core");
const core = require('@actions/core');
//Scripts
const { getPRInformation } = require('./utils/getPRInformation');
const { getNewTagVersion } = require('./utils/getLatestTag');
const { appendToChangelog } = require('./utils/appendToChangelog');
const { createTag } = require('./utils/createTag');


async function main() {
    const context = github.context;

    const changelogRelativePath = core.getInput("changelogPath");
    const commitEmail = core.getInput("commitEmail");
    const commitUserName = core.getInput("commitUserName");
    const shouldCreateNewTag = core.getInput("shouldCreateNewTag");
    const githubToken = core.getInput("githubToken");

    const octokit = new Octokit({ auth: githubToken });

    const prNumber = context.payload.pull_request.number;
    const owner = context.repo.owner;
    const repo = context.repo.repo;

    const prData = await getPRInformation(octokit, prNumber, owner, repo);
    const nextVersion = await getNewTagVersion(prData.title, octokit, owner, repo);

    if (shouldCreateNewTag === "true") {
        await createTag(octokit, prData, owner, repo, nextVersion);
    }

    appendToChangelog(prData, nextVersion, changelogRelativePath, commitEmail, commitUserName);
}

main();