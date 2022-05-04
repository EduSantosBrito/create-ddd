#!/usr/bin/env node

//@ts-check
const fs = require("fs");
const path = require("path");
const replace = require("replace-in-file");
const camelCase = require("lodash.camelcase");
const startCase = require("lodash.startcase");
const argv = require("minimist")(process.argv.slice(2), { string: ["_"] });
const prompts = require("prompts");
const {
  yellow,
  green,
  cyan,
  blue,
  magenta,
  lightRed,
  red,
  reset,
} = require("kolorist");

const cwd = process.cwd();

const TOOLINGS = [
  {
    name: "vite",
    color: green,
    variants: [
      {
        name: "vite",
        display: "JavaScript",
        color: yellow,
      },
      {
        name: "vite-ts",
        display: "Typescript",
        color: blue,
      },
    ],
  },
];

const TEMPLATES = TOOLINGS.map(
  (f) => (f.variants && f.variants.map((v) => v.name)) || [f.name]
).reduce((a, b) => a.concat(b), []);

const renameFiles = {
  _gitignore: ".gitignore",
};

async function handleDomainCreation({ domainName }) {
  const defaultDomainName = !domainName ? "domain" : domainName;

  let result = {};

  result = await prompts([
    {
      type: domainName ? null : "text",
      name: "domainName",
      message: reset("Domain name:"),
      initial: defaultDomainName,
      onState: (state) =>
        (domainName = state.value.trim() || defaultDomainName),
    },
    {
      type: () =>
        !fs.existsSync(domainName) || isEmpty(domainName) ? null : "confirm",
      name: "overwrite",
      message: () =>
        domainName === "."
          ? "Current directory"
          : `Target directory "${domainName}"` +
            ` is not empty. Remove existing files and continue?`,
    },
    {
      // @ts-ignore
      type: (_, { overwrite } = {}) => {
        if (overwrite === false) {
          throw new Error(red("✖") + " Operation cancelled");
        }
        return null;
      },
      name: "overwriteChecker",
    },
    {
      type: "confirm",
      name: "useTypescript",
      message: "Your project uses Typescript?",
    },
  ]);

  // user choice associated with prompts
  const { useTypescript, overwrite } = result;

  const root = path.join(cwd, domainName);

  if (overwrite) {
    emptyDir(root);
  } else if (!fs.existsSync(root)) {
    fs.mkdirSync(root);
  }

  console.log(`\nCreating domain ${root}...`);

  const templateDir = path.join(
    __dirname,
    useTypescript ? "template-domain-ts" : "template-domain"
  );
  const domainNameCamelized = camelCase(domainName);
  const domainNamePascalized = startCase(domainNameCamelized);
  const domainNameLower = domainName.toLowerCase();

  const replaceDomainName = (path) =>
    path
      .replace(/__PASCAL_REPLACE__/g, domainNamePascalized)
      .replace(/__CAMEL_REPLACE__/g, domainNameCamelized)
      .replace(/__LOWER_REPLACE__/g, domainNameLower);

  const write = (filePath, name, isDirectory, targetParentFolder) => {
    if (isDirectory) {
      return;
    }

    const targetPath = path.join(
      replaceDomainName(targetParentFolder),
      replaceDomainName(name)
    );

    fs.copyFileSync(filePath, targetPath);
    replace.sync({
      files: targetPath,
      from: /__PASCAL_REPLACE__/g,
      to: domainNamePascalized,
    });
    replace.sync({
      files: targetPath,
      from: /__CAMEL_REPLACE__/g,
      to: domainNameCamelized,
    });
    replace.sync({
      files: targetPath,
      from: /__LOWER_REPLACE__/g,
      to: domainNameLower,
    });
  };

  const writeFolder = (currentFolder) => {
    const files = fs.readdirSync(currentFolder);
    for (const file of files) {
      const targetPath = path.join(currentFolder, file);
      const stat = fs.statSync(targetPath);
      const isDirectory = stat.isDirectory();
      const parentFolder = targetPath
        .replace(`/${file}`, "")
        .replace(templateDir, "");
      const targetParentFolder = path.join(root, parentFolder);
      const targetParentFolderExists = fs.existsSync(targetParentFolder);
      if (!targetParentFolderExists) {
        const folderName = replaceDomainName(targetParentFolder);
        fs.mkdirSync(folderName);
      }
      if (isDirectory) {
        writeFolder(targetPath);
      }
      write(targetPath, file, isDirectory, targetParentFolder);
    }
  };

  writeFolder(templateDir);
  console.log(`\nDone. Enjoy your new domain :)\n`);
}

async function handleProjectScaffolding({ targetDir, template }) {
  const defaultProjectName = !targetDir ? "ddd-project" : targetDir;

  let result = {};

  result = await prompts(
    [
      {
        type: targetDir ? null : "text",
        name: "projectName",
        message: reset("Project name:"),
        initial: defaultProjectName,
        onState: (state) =>
          (targetDir = state.value.trim() || defaultProjectName),
      },
      {
        type: () =>
          !fs.existsSync(targetDir) || isEmpty(targetDir) ? null : "confirm",
        name: "overwrite",
        message: () =>
          targetDir === "."
            ? "Current directory"
            : `Target directory "${targetDir}"` +
              ` is not empty. Remove existing files and continue?`,
      },
      {
        // @ts-ignore
        type: (_, { overwrite } = {}) => {
          if (overwrite === false) {
            throw new Error(red("✖") + " Operation cancelled");
          }
          return null;
        },
        name: "overwriteChecker",
      },
      {
        type: () => (isValidPackageName(targetDir) ? null : "text"),
        name: "packageName",
        message: reset("Package name:"),
        initial: () => toValidPackageName(targetDir),
        validate: (dir) =>
          isValidPackageName(dir) || "Invalid package.json name",
      },
      {
        type: template && TEMPLATES.includes(template) ? null : "select",
        name: "tooling",
        message:
          typeof template === "string" && !TEMPLATES.includes(template)
            ? reset(
                `"${template}" isn't a valid template. Please choose from below: `
              )
            : reset("Select a tooling:"),
        initial: 0,
        choices: TOOLINGS.map((tooling) => {
          const toolingColor = tooling.color;
          return {
            title: toolingColor(tooling.name),
            value: tooling,
          };
        }),
      },
      {
        type: (tooling) => (tooling && tooling.variants ? "select" : null),
        name: "variant",
        message: reset("Select a variant:"),
        choices: (tooling) =>
          tooling.variants.map((variant) => {
            const variantColor = variant.color;
            return {
              title: variantColor(variant.name),
              value: variant.name,
            };
          }),
      },
    ],
    {
      onCancel: () => {
        throw new Error(red("✖") + " Operation cancelled");
      },
    }
  );

  // user choice associated with prompts
  const { tooling, overwrite, packageName, variant } = result;

  const root = path.join(cwd, targetDir);

  if (overwrite) {
    emptyDir(root);
  } else if (!fs.existsSync(root)) {
    fs.mkdirSync(root);
  }

  // determine template
  template = variant || tooling || template;

  console.log(`\nScaffolding project in ${root}...`);

  const templateDir = path.join(__dirname, `template-${template}`);

  const write = (file, content) => {
    const targetPath = renameFiles[file]
      ? path.join(root, renameFiles[file])
      : path.join(root, file);
    if (content) {
      fs.writeFileSync(targetPath, content);
    } else {
      copy(path.join(templateDir, file), targetPath);
    }
  };

  const files = fs.readdirSync(templateDir);
  for (const file of files.filter((f) => f !== "package.json")) {
    write(file);
  }

  const pkg = require(path.join(templateDir, `package.json`));

  pkg.name = packageName || targetDir;

  write("package.json", JSON.stringify(pkg, null, 2));

  const pkgInfo = pkgFromUserAgent(process.env.npm_config_user_agent);
  const pkgManager = pkgInfo ? pkgInfo.name : "npm";
  const startScript = "run dev";

  console.log(`\nDone. Now run:\n`);
  if (root !== cwd) {
    console.log(`  cd ${path.relative(cwd, root)}`);
  }
  console.log(`  git init`);
  console.log(`  npx husky-init`);
  switch (pkgManager) {
    case "yarn":
      console.log("  yarn");
      console.log(`  yarn ${startScript}`);
      break;
    default:
      console.log(`  ${pkgManager} install`);
      console.log(`  ${pkgManager} ${startScript}`);
      break;
  }
  console.log();
}

async function init() {
  let name = argv._[0];
  let template = argv.template || argv.t;
  let isProject = !argv.domain && !argv.d;

  try {
    if (isProject) {
      return handleProjectScaffolding({ targetDir: name, template });
    }
    return handleDomainCreation({ domainName: name });
  } catch (cancelled) {
    console.log(cancelled.message);
    return;
  }
}

function isEmpty(path) {
  const files = fs.readdirSync(path);
  return files.length === 0 || (files.length === 1 && files[0] === ".git");
}

function isValidPackageName(projectName) {
  return /^(?:@[a-z0-9-*~][a-z0-9-*._~]*\/)?[a-z0-9-~][a-z0-9-._~]*$/.test(
    projectName
  );
}

function toValidPackageName(projectName) {
  return projectName
    .trim()
    .toLowerCase()
    .replace(/\s+/g, "-")
    .replace(/^[._]/, "")
    .replace(/[^a-z0-9-~]+/g, "-");
}

function emptyDir(dir) {
  if (!fs.existsSync(dir)) {
    return;
  }
  for (const file of fs.readdirSync(dir)) {
    const abs = path.resolve(dir, file);
    // baseline is Node 12 so can't use rmSync :(
    if (fs.lstatSync(abs).isDirectory()) {
      emptyDir(abs);
      fs.rmdirSync(abs);
    } else {
      fs.unlinkSync(abs);
    }
  }
}

function copy(src, dest) {
  const stat = fs.statSync(src);
  if (stat.isDirectory()) {
    copyDir(src, dest);
  } else {
    fs.copyFileSync(src, dest);
  }
}

function copyDir(srcDir, destDir) {
  fs.mkdirSync(destDir, { recursive: true });
  for (const file of fs.readdirSync(srcDir)) {
    const srcFile = path.resolve(srcDir, file);
    const destFile = path.resolve(destDir, file);
    copy(srcFile, destFile);
  }
}

function pkgFromUserAgent(userAgent) {
  if (!userAgent) return undefined;
  const pkgSpec = userAgent.split(" ")[0];
  const pkgSpecArr = pkgSpec.split("/");
  return {
    name: pkgSpecArr[0],
    version: pkgSpecArr[1],
  };
}

init().catch((e) => {
  console.error(e);
});
