#!/usr/bin/env node

const fs = require("fs");
const path = require("path");

/**
 * Creates a symbolic link from the specified target to the specified path within the given directory.
 *
 * @param {string} dir - The directory in which the symbolic link will be created.
 * @param {string} target - The target of the symbolic link.
 * @param {string} path - The path at which the symbolic link will be created within the directory.
 */
const symlink = (dir, target, path) => {
  const currentDir = process.cwd()
  process.chdir(dir)
  fs.symlinkSync(target, path)
  process.chdir(currentDir)
};

const COURSE_TYPES = fs.readdirSync('./course', { withFileTypes: true })
  .filter((dirent) => dirent.isDirectory())
  .map((dirent) => dirent.name);

const hasCourseLinked = () => {
  const dir = './course';
  const directories = fs.readdirSync(dir).filter((file) => fs.statSync(path.join(dir, file)).isDirectory());
  return directories.length > 0;
};

const writeNav = () => {
  const langDirs = new Set(COURSE_TYPES.map((courseType) => {
    const translationsDir = `./course/${courseType}/lessons/config/translations`;
    const translationsDirectories = fs.readdirSync(translationsDir, { withFileTypes: true })
      .filter((dirent) => dirent.isDirectory())
      .map((dirent) => dirent.name);
    return translationsDirectories;
  }).flat());

  langDirs.forEach((langDir) => {
    fs.rmSync(`./app/src/i18n/translations/${langDir}/nav.ts`, { recursive: true, force: true });

    if (langDir === "en") {
      fs.appendFileSync(`./app/src/i18n/translations/${langDir}/nav.ts`, 'export default [\n');
    } else {
      fs.appendFileSync(`./app/src/i18n/translations/${langDir}/nav.ts`, 'import { NavDictionary } from "../../translation-checkers";\n');
      fs.appendFileSync(`./app/src/i18n/translations/${langDir}/nav.ts`, 'export default NavDictionary({\n');
    }

    COURSE_TYPES.slice().reverse().forEach((courseType, courseTypeIndex) => {
      if (courseTypeIndex > 0) {
        // We're dealing with a two-piece frontend / backend course. Let's add a divider in the nav
        if (langDir === "en") {
          fs.appendFileSync(`./app/src/i18n/translations/${langDir}/nav.ts`, '  { text: "----------", header: true, key: "fe-be-divider" },\n');
        } else {
          fs.appendFileSync(`./app/src/i18n/translations/${langDir}/nav.ts`, '  "fe-be-divider": "----------",\n');
        }
      }

      const navFileContent = fs.readFileSync(`./course/${courseType}/lessons/config/translations/${langDir}/nav.ts`, 'utf8');
      navFileContent.split('\n')
        .forEach((line) => {
          if (langDir === "en") {
            if (line.includes('{ text:')) {
              line = line.replace('slug: "', `slug: "${courseType}/`);
              line = line.replace('key: "', `key: "${courseType}/`);
              fs.appendFileSync(`./app/src/i18n/translations/${langDir}/nav.ts`, line + '\n');
            }
          } else {
            if (line.replace(/^\s+/, "").startsWith("\"")) {
              line = line.replace('"', `"${courseType}/`);
              fs.appendFileSync(`./app/src/i18n/translations/${langDir}/nav.ts`, line + '\n');
            }
          }
        });
    });

    if (langDir === "en") {
      fs.appendFileSync(`./app/src/i18n/translations/${langDir}/nav.ts`, '] as const\n');
    } else {
      fs.appendFileSync(`./app/src/i18n/translations/${langDir}/nav.ts`, '});\n');
    }
  });
};

const linkContent = () => {
  COURSE_TYPES.forEach((courseType, courseTypeIndex) => {
    const contentDir = `./course/${courseType}/lessons/content`;
    const contentDirectories = fs.readdirSync(contentDir, { withFileTypes: true })
      .filter((dirent) => dirent.isDirectory())
      .map((dirent) => dirent);
    contentDirectories.forEach((langDir) => {
      if (courseTypeIndex === 0) {
        // If we have more than one course, only clean the language directory for the first course.
        // This is so that any additional course's content can be sym-linked in the same language
        // directory.
        fs.rmSync(`./app/src/content/docs/${langDir.name}`, { recursive: true, force: true })
        fs.mkdirSync(`./app/src/content/docs/${langDir.name}`, { recursive: true, force: true });
      }
      fs.rmSync(`./app/src/content/docs/${langDir.name}/${courseType}`, { recursive: true, force: true })
      symlink(`./app/src/content/docs/${langDir.name}`, path.relative(`./app/src/content/docs/${langDir.name}`, `./course/${courseType}/lessons/content/${langDir.name}`), courseType)
    });
  });
};

if (hasCourseLinked()) {
  writeNav();
  linkContent();
} else {
  console.log("");
  console.log("It looks like no course is available in the ./course directory.");
  console.log("");
  console.log("If you are a student, please contact us. If you are a creator, make sure your course repository is linked.");
  console.log("");
}