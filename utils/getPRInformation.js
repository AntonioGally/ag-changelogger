/**
 * Function to get the new tag version
 * @param {any} octokit - octokit to do requests
 * @param {number} prNumber - Number of PR in this context
 * @param {string} owner - repo's owner
 * @param {string} repo - repository name
 */
async function getPRInformation(octokit, prNumber, owner, repo) {
    const prRequest = await octokit.request('GET /repos/{owner}/{repo}/pulls/{pull_number}', {
        owner,
        repo,
        pull_number: prNumber,
    });

    const commitsRequest = await octokit.request('GET /repos/{owner}/{repo}/pulls/{pull_number}/commits', {
        owner, repo,
        pull_number: prNumber,
    })

    let commitsArray = commitsRequest.data.map((commit) => ({
        url: commit.html_url,
        minSha: commit.sha.substring(0, 7),
        message: commit.commit.message,
        authorImage: commit.author.avatar_url,
        sha: commit.sha
    }));

    const prData = {
        title: prRequest.data.title,
        description: prRequest.data.body,
        commits: commitsArray,
        baseBranch: prRequest.data.base.ref,
        prUrl: prRequest.data.html_url,
        prCreatedDate: prRequest.data.created_at,
        prNumber: prRequest.data.number
    }

    return prData;
}

module.exports = {
    getPRInformation
}