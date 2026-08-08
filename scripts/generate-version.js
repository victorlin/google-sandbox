const fs = require('fs');
const path = require('path');
const { execSync } = require('child_process');

let commitSha = process.env.GITHUB_SHA || '';
if (!commitSha) {
  try {
    commitSha = execSync('git rev-parse HEAD').toString().trim();
  } catch (e) {
    commitSha = '';
  }
}

const versionData = {
  commitSha: commitSha,
  builtAt: new Date().toISOString()
};

const targetPath = path.join(__dirname, '..', 'build', 'version.json');
fs.writeFileSync(targetPath, JSON.stringify(versionData, null, 2));
console.log(`Generated build/version.json with commit SHA: ${commitSha}`);
