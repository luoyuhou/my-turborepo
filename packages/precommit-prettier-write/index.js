const shell = require("shelljs");

const approveFile = (file) => {
  const suffix = ['.js', '.ts', '.jsx'];

  return suffix.some((suf) => {
    const reg = new RegExp(`${suf}$`);
    return reg.test(file);
  })
}

const filterFiles = (stdout) => {
  const arr = stdout.split("\n").map((r) => r.trim())
  const flag = "modified:   ";
  const len = flag.length;

  return arr.map((s) => {
    if (!s) {
      return;
    }
    if (!s.includes(flag)) {
      return;
    }
    if (!approveFile(s)) {
      return;
    }
    return s.slice(len);
  }).filter(Boolean);
}

const prettierWriteFile = (files) => {
  const prettier = shell.exec("npx prettier -v");
  if (prettier.code) {
    shell.echo('Error, this script requires prettier');
    shell.exit(1);
  }
  shell.echo(`Prettier, Version $${prettier.stdout}`)

  const output = shell.exec(`npx prettier --write ${files.join(" ")}`);
  if (output.code) {
    shell.echo(`Error, ${output.stderr}`);
    shell.exit(1);
  }

  shell.echo(`Prettier Success, ${output.stdout}`);
}

const stageCode = () => {
  const output = shell.exec("git stash");
  if (output.code) {
    shell.echo(`Error, ${output.stderr}`);
    shell.exit(1);
  }

  shell.echo(`Stash Success, ${output.stdout}`);
}

const main = () => {
  if (!shell.which("git")) {
    shell.echo('Sorry, this script requires git');
    shell.exit(1);
  }

  const output = shell.exec("git status");
  if (output.code) {
    shell.echo(`Error, ${output.stderr}`);
    shell.exit(1);
  }

  const files = filterFiles(output.stdout);
  if (!files.length) {
    shell.echo(`Error, files array is empty`);
    shell.exit(1);
  }

  stageCode();

  prettierWriteFile(files);
  shell.echo(`Finish..., len = ${files.length}`);
}

module.exports = main;