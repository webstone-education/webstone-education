#!/usr/bin/env node
import fs from 'fs';
import path from 'path';

const COURSE_ROUTE_BASE_DIR = './app/src/routes/course';

// A full-stack course, such as SvelteKit, Next.js, etc.
// A Frontend & backend course, such as Svelte, React, etc on the frontend and Node.js, Rust, Go, etc. on the backend
const IS_FULLSTACK_COURSE = fs.existsSync('./course/package.json');

const symlink = (target, path, baseDir = COURSE_ROUTE_BASE_DIR) => {
	process.chdir(baseDir);
	fs.symlinkSync(target, path);
	process.chdir('../'.repeat(baseDir.split('/').length - 1));
};

const courses = IS_FULLSTACK_COURSE
	? [
			{
				lessonBaseDir: './course/lessons',
				routeDirName: ''
			}
	  ]
	: [
			{
				lessonBaseDir: './course/frontend/lessons',
				routeDirName: '[...1]frontend'
			},
			{
				lessonBaseDir: './course/backend/lessons',
				routeDirName: '[...2]backend'
			}
	  ];

courses.forEach(({ lessonBaseDir, routeDirName }) => {
	if (fs.existsSync(lessonBaseDir)) {
		// 1. Clean up old course routes
		fs.readdirSync(COURSE_ROUTE_BASE_DIR, { withFileTypes: true })
			.filter((dirent) => dirent.isSymbolicLink())
			.forEach(({ name }) => fs.unlinkSync(`${COURSE_ROUTE_BASE_DIR}/${name}`));

		if (fs.existsSync(`${COURSE_ROUTE_BASE_DIR}${routeDirName === '' ? '' : `/${routeDirName}`}`)) {
			fs.readdirSync(`${COURSE_ROUTE_BASE_DIR}${routeDirName === '' ? '' : `/${routeDirName}`}`, {
				withFileTypes: true
			})
				.filter((dirent) => dirent.isSymbolicLink())
				.forEach(({ name }) =>
					fs.unlinkSync(
						`${COURSE_ROUTE_BASE_DIR}${routeDirName === '' ? '' : `/${routeDirName}`}/${name}`
					)
				);
		} else {
			fs.mkdirSync(`${COURSE_ROUTE_BASE_DIR}${routeDirName === '' ? '' : `/${routeDirName}`}`);
		}

		// 2. Link new course routes
		fs.readdirSync(`${lessonBaseDir}`, { withFileTypes: true })
			.filter((entry) => entry.isDirectory())
			.forEach(({ name }) => {
				try {
					fs.statSync(`${lessonBaseDir}/${name}/content`);
					symlink(
						path.relative(
							`${COURSE_ROUTE_BASE_DIR}${routeDirName === '' ? '' : `/${routeDirName}`}`,
							`${lessonBaseDir}/${name}/content`
						),
						`${name}${routeDirName === '' ? '' : `---${routeDirName.substring('[...x]'.length)}`}`,
						`${COURSE_ROUTE_BASE_DIR}${routeDirName === '' ? '' : `/${routeDirName}`}`
					);
				} catch (error) {
					if (error.code === 'ENOENT') {
						console.warn(`No "content" directory available at ${lessonBaseDir}/${name}`);
					} else {
						console.error(error);
					}
				}
			});
	}
});

if (IS_FULLSTACK_COURSE) {
	// A full-stack course, such as SvelteKit, Next.js, etc.
	symlink(path.relative(COURSE_ROUTE_BASE_DIR, `./course/README.md`), `[...00_00]overview.md`);
} else {
	// A Frontend & backend course, such as Svelte, React, etc on the frontend and Node.js, Rust, Go, etc. on the backend
	fs.writeFileSync(
		`${COURSE_ROUTE_BASE_DIR}/[...00_00]overview.md`,
		`${fs.readFileSync(`./course/frontend/README.md`)}`
	);
	fs.writeFileSync(
		`${COURSE_ROUTE_BASE_DIR}/[...00_01]overview-backend}.md`,
		`${fs.readFileSync(`./course/backend/README.md`)}`
	);
}
