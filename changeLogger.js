//Libs
const github = require('@actions/github');
const { Octokit } = require("@octokit/core");
const core = require('@actions/core');
//Scripts
const { getPRInformation } = require('./utils/getPRInformation');
const { getNewTagVersion } = require('./utils/getLatestTag');
const { appendToChangelog } = require('./utils/appendToChangelog');


async function main() {
    const context = github.context;
    const changelogPath = core.getInput("changelogPath");
    const octokit = new Octokit({ auth: process.env.GITHUB_TOKEN });

    const prNumber = context.payload.pull_request.number;
    const owner = context.repo.owner;
    const repo = context.repo.repo;

    const prData = await getPRInformation(octokit, prNumber, owner, repo);
    const nextVersion = await getNewTagVersion(prData.title, octokit, owner, repo);

    appendToChangelog(prData, nextVersion, changelogPath);
}

main();