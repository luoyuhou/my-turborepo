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
  if (!shell.which("prettier")) {
    shell.echo('Error, this script requires prettier');
    shell.exit(1);
  }

  const output = shell.exec(`prettier --write ${files.join(" ")}`);
  if (output.code) {
    shell.echo(`Error, ${output.stderr}`);
    shell.exit(1);
  }

  shell.echo(`Success, ${output.stdout}`);
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

  prettierWriteFile(files);
  shell.echo(`Finish..., len = ${files.length}`);
}

main();