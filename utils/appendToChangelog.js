const fs = require('fs');
const { execSync } = require('child_process');
const path = require('path');

function generateDate(dateString) {
    const date = new Date(dateString);
    const options = { year: 'numeric', month: 'short', day: 'numeric' };
    return date.toLocaleDateString("pt-BR", options);
}

function normalizeCommitMessage(commitMessage) {
    return JSON.stringify(commitMessage).replace(/\\n/g, ' ');
}

function createLog(prData, tagName) {
    let body = `<h2>${tagName}</h2> \n`;
    body += `<small>${generateDate(prData.prCreatedDate)}</small> \n`
    body += `<p> <h3> ${prData.title} (<a href="${prData.prUrl}">#${prData.prNumber}</a>) </h3> </p> \n\n`;
    body += `${prData.description || "<h5> Empty description </h5>"} \n\n`;
    body += `<details> <summary><h5>Commits</h5></summary> \n\n`
    body += `| Commit | Messsage | Author |\n`;
    body += `| -- | -- | -- |\n`;
    prData.commits.forEach(data => {
        body += `| <a href="${data.url}">${data.minSha}</a> | <p>${normalizeCommitMessage(data.message)}</p> | <img width="30px" src="${data.authorImage}"/> \n`
    })
    body += `\n</details>`
    return body;
}

function writeLog(logInfo, changelogRelativePath) {
    const currentWorkingDir = process.cwd();

    const changelogPath = path.join(currentWorkingDir, changelogRelativePath);

    // Check if the file exists
    fs.access(changelogPath, fs.constants.F_OK, (err) => {
        if (err) {
            fs.writeFileSync(changelogPath, '', err => {
                console.error(`CHANGELOG.md could not be created: ${err}`);
            });
        } else {
            console.log(`Found CHANGELOG.md at: ${changelogPath}`);
        }
    });

    // Read the existing content
    const oldContent = fs.readFileSync(changelogPath, 'utf8');

    // Concatenate the new content at the beginning
    const newContent = `${logInfo}\n\n${oldContent}`;

    // Write the new content back to the file
    fs.writeFileSync(changelogPath, newContent, { flag: "w" });
}

async function appendToChangelog(prData, tagName, changelogRelativePath, commitEmail, commitUserName) {

    const logInfo = createLog(prData, tagName);

    writeLog(logInfo, changelogRelativePath);

    // Add, commit, and push the changes
    execSync(`git config --global user.email "${commitEmail}"`, { stdio: 'inherit' });
    execSync(`git config --global user.name "${commitUserName}"`, { stdio: 'inherit' });

    execSync(`git add ${changelogRelativePath}`, { stdio: 'inherit' });
    execSync(`git commit -m "docs: :memo: Updating changelog [${tagName}]"`, { stdio: 'inherit' });
    execSync(`git push -u origin ${prData.baseBranch}`, { stdio: 'inherit' });
}

module.exports = {
    appendToChangelog,
    createLog,
    writeLog
}