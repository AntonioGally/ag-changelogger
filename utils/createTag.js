// docs: https://docs.github.com/en/rest/reference/git#create-a-tag

async function createTag(octokit, prData, owner, repo, nextVersion) {
    const response = await octokit.request('POST /repos/{owner}/{repo}/git/tags', {
        owner,
        repo,
        tag: nextVersion,
        message: prData.title,
        object: prData.commits.at(-1).sha,
        type: 'commit'
    });

    await octokit.request('POST /repos/{owner}/{repo}/git/refs', {
        owner,
        repo,
        ref: `refs/tags/${response.data.tag}`,
        sha: response.data.sha,
        headers: {
            'X-GitHub-Api-Version': '2022-11-28'
        }
    })
}

module.exports = {
    createTag
}