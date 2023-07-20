const fs = require('fs');
const { execSync } = require('child_process');
const path = require('path');

function generateDate() {
    const date = new Date();
    const options = { year: 'numeric', month: 'short', day: 'numeric' };
    return date.toLocaleDateString("pt-BR", options);
}

function createLog(prData, tagName) {
    let body = `## ${tagName} (${generateDate()}) \n`;
    body += `<p> <b> ${prData.title} </b> </p> \n`;
    body += `<p> ${prData.description} </p> \n`;
    body += `<details> <summary><h2>Commits</h2></summary> \n\n`
    body += `| Commit | Messsage | Author |\n`;
    body += `| -- | -- | -- |\n`;
    prData.commits.forEach(data => {
        body += `| <a href="${data.url}">${data.minSha}</a> | ${data.message} | <img width="30px" src="${data.authorImage}"/> \n`
    })
    body += `\n</details>`
    return body;
}

async function appendToChangelog(prData, tagName, changelogRelativePath) {

    const logInfo = createLog(prData, tagName);

    const currentWorkingDir = process.cwd();

    const changelogPath = path.join(currentWorkingDir, changelogRelativePath);

    console.log({ currentWorkingDir, changelogPath })

    // Check if the file exists
    fs.access(changelogPath, fs.constants.F_OK, (err) => {
        if (err) {
            console.error(`CHANGELOG.md does not exist: ${err}`);
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

    // Add, commit, and push the changes
    execSync('git config --global user.email "antonio.gally@gmail.com"', { stdio: 'inherit' });
    execSync('git config --global user.name "AntonioGally"', { stdio: 'inherit' });
    execSync(`git add ${changelogPath}`, { stdio: 'inherit' });
    execSync(`git commit -m "docs: :memo: Updating changelog [${tagName}]"`, { stdio: 'inherit' });
    execSync('git push', { stdio: 'inherit' });
}

module.exports = {
    appendToChangelog
}