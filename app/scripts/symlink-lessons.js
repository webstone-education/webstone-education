#!/usr/bin/env node
import fs from "fs";
import path from "path";

const COURSE = process.argv[2] ?? "todo-app";
const CURRICULUM = process.argv[3] ?? "framework/sveltekit-css-rest-postgresql";
const LESSONS_BASE_DIR = `./courses/${COURSE}/${CURRICULUM}/lessons`;
const COURSE_ROUTE_BASE_DIR = "./app/src/routes/course";

// 1. Clean up old course routes
fs
  .readdirSync(COURSE_ROUTE_BASE_DIR, { withFileTypes: true })
  .filter(dirent => dirent.isSymbolicLink())
  .forEach(({name}) => fs.unlinkSync(`${COURSE_ROUTE_BASE_DIR}/${name}`))

// 2. Link new course routes
fs
  .readdirSync(`${LESSONS_BASE_DIR}`, { withFileTypes: true })
  .filter(entry => entry.isDirectory())
  .forEach(({name}) => {
    try {
      fs.statSync(`${LESSONS_BASE_DIR}/${name}/content`)
      process.chdir(COURSE_ROUTE_BASE_DIR)
      fs.symlinkSync(path.relative(COURSE_ROUTE_BASE_DIR, `${LESSONS_BASE_DIR}/${name}/content`), name)
      process.chdir("../../../..")
    } catch (error) {
      if (error.code === "ENOENT") {
        console.warn(`No "content" directory available at ${LESSONS_BASE_DIR}/${name}`)
      } else {
        console.error(error)
      }
    }
  })

// 3. Link course README as the highest-priority route in the navigation (i.e. [...00-00])
process.chdir(COURSE_ROUTE_BASE_DIR)
fs.symlinkSync(path.relative(COURSE_ROUTE_BASE_DIR, `./courses/${COURSE}/${CURRICULUM}/README.md`), `[...00_00]overview.md`)
process.chdir("../../../..")
