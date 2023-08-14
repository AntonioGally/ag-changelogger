function getVersionByPrTitle(prTitle, startTag) {
    let newVersion = startTag;
    let versionParts = startTag.replace('v', '').split('.').map(Number);

    const patchRegex = /\bpatch\b/i;
    const minorRegex = /\bminor\b/i;
    const majorRegex = /\bmajor\b/i;

    if (patchRegex.test(prTitle)) {
        versionParts[2]++;
    } else if (minorRegex.test(prTitle)) {
        versionParts[1]++;
        versionParts[2] = 0; // Reset patch version on minor change
    } else if (majorRegex.test(prTitle)) {
        versionParts[0]++;
        versionParts[1] = 0;
        versionParts[2] = 0
        // Reset minor and patch versions on major change
    } else {
        // If no keyword is found, patch added
        versionParts[2]++;
    }
    // Reconstruct the version number
    newVersion = 'v' + versionParts.join('.');
    return newVersion;
}


/**
 * Function to get the new tag version
 * @param {string} prTitle - The PR title
 * @param {any} octokit - octokit to do requests
 * @param {string} owner - repo's owner
 * @param {string} repo - repository name
 */
async function getNewTagVersion(prTitle, octokit, owner, repo) {
    let latestTag = "";
    const tagRequest = await octokit.request('GET /repos/{owner}/{repo}/tags', {
        owner, repo
    })
    if (tagRequest.data.length === 0) latestTag = "v0.1.0";
    else latestTag = tagRequest.data[0].name;

    let newVersion = getVersionByPrTitle(prTitle, latestTag);
    return newVersion;
}

module.exports = {
    getNewTagVersion,
    getVersionByPrTitle
}