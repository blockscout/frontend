/* eslint-disable no-console */
const { execSync } = require('child_process');
const dependencyTree = require('dependency-tree');
const fs = require('fs');
const path = require('path');

const rootDir = path.resolve(__dirname, '../../../');
const targetFile = path.resolve(rootDir, './playwright/affected-tests.txt');
const NON_EXISTENT_DEPS = [];

function getAllPwFilesInDirectory(directory) {
  const files = fs.readdirSync(directory, { recursive: true });
  return files
    .filter((file) => file.endsWith('.pw.tsx'))
    .map((file) => path.join(directory, file));
}

function getFileDeps(filename) {
  return dependencyTree.toList({
    filename,
    directory: rootDir,
    filter: (path) => {
      return path.indexOf('node_modules') === -1;
    },
    tsConfig: path.resolve(rootDir, './tsconfig.json'),
    nonExistent: NON_EXISTENT_DEPS,
  });
}

async function getChangedFiles() {
  // eslint-disable-next-line max-len
  const command = `git diff --name-only origin/${ process.env.GITHUB_BASE_REF || 'main' } origin/${ process.env.GITHUB_HEAD_REF || '$(git branch --show-current)' } -- ${ rootDir }`;
  console.log('Executing command: ', command);
  const files = execSync(command)
    .toString()
    .trim()
    .split('\n')
    .filter(Boolean);

  return files.map((file) => path.join(rootDir, file));
}

async function run() {
  fs.unlink(targetFile, () => {});

  const changedFiles = await getChangedFiles();
  console.log('ChangedFiles: ', changedFiles);

  if (!changedFiles.length) {
    console.log('No changed files found. Exiting...');
    return;
  }

  const targetDir = path.resolve(rootDir, './ui/shared');

  const start = Date.now();
  const testFilesToRun = getAllPwFilesInDirectory(targetDir)
    .slice(0, 10)
    .map((file) => ({
      file,
      deps: getFileDeps(file),
    }))
    .filter(({ deps }) => deps.some((dep) => changedFiles.includes(dep)));
  const testFileNamesToRun = testFilesToRun.map(({ file }) => path.relative(rootDir, file));

  if (!testFileNamesToRun.length) {
    console.log('No tests to run. Exiting...');
    return;
  }

  const end = Date.now();
  console.log('Total time: ', ((end - start) / 1_000).toLocaleString());

  console.log('Tests to run: ', testFileNamesToRun);
  console.log('Non existent deps: ', NON_EXISTENT_DEPS);

  fs.writeFileSync(targetFile, testFileNamesToRun.join('\n'));
}

run();
