const fs = require('fs');
const exec = require('child_process').exec;
const xml2js = require('xml2js');
const Mustache = require('mustache');

/**
 * Creates Android distribution of XML `vectorDrawable`
 * from sketch files.
 *
 * Usage:
 * `node generateAndroidDist '<src dir path>' '<dest dir path>'`
 */

const TEST_SVG = `<?xml version="1.0" encoding="UTF-8" standalone="no"?>
<svg width="28px" height="28px" viewBox="0 0 28 28" version="1.1" xmlns="http://www.w3.org/2000/svg" xmlns:xlink="http://www.w3.org/1999/xlink">
    <!-- Generator: sketchtool 43.2 (39069) - http://www.bohemiancoding.com/sketch -->
    <title>arrow-left</title>
    <desc>Created with sketchtool.</desc>
    <defs></defs>
    <g id="Web" stroke="none" stroke-width="1" fill="none" fill-rule="evenodd">
        <g id="arrow-left" fill="#000000">
            <path d="M25.00025,13 L5.41425,13 L13.70725,4.707 C14.09825,4.316 14.09825,3.684 13.70725,3.293 C13.31625,2.902 12.68425,2.902 12.29325,3.293 L2.29425,13.292 C2.20225,13.384 2.12825,13.495 2.07725,13.618 C1.97625,13.862 1.97625,14.138 2.07725,14.382 C2.12825,14.505 2.20225,14.616 2.29425,14.708 L12.29325,24.707 C12.48825,24.902 12.74425,25 13.00025,25 C13.25625,25 13.51225,24.902 13.70725,24.707 C14.09825,24.316 14.09825,23.684 13.70725,23.293 L5.41425,15 L25.00025,15 C25.55325,15 26.00025,14.553 26.00025,14 C26.00025,13.447 25.55325,13 25.00025,13" id="Fill-1"></path>
        </g>
    </g>
</svg>`;

const SRC_DIR = process.argv[2];
const DEST_DIR = process.argv[3];
const TEMP_DIR = './.android-temp';
const PARSER_OPTIONS = {
	trim: true,
	normalizeTags: true,
	strict: false,
	explicitRoot: false,
	mergeAttrs: true,
	explicitArray: false,
};

const TEMPLATE = `
<!--
DO NOT EDIT DIRECTLY
This file is generated by [swarm-icons](https://github.com/meetup/swarm-icons)
-->
<vector
	xmlns:android="http://schemas.android.com/apk/res/android"
	android:height="24dp"
	android:width="24dp"
	android:viewportWidth="24"
	android:viewportHeight="24"
>
	<path
		android:name="{{iconName}}"
		android:pathData="{{iconPath}}"
		android:fillColor="#FF000000"
	/>
</vector>
`;
Mustache.parse(TEMPLATE);


/**
 * Converts kebab-case icon names to ic_snake_case
 * for Android
 *
 * @param {String} iconName - icon name in kebab-case
 * @returns {String} - icon name with android snake_case convention
 */
const toAndroidSnakeCase = iconName => iconName
	.replace(/[-]+/, '_')   // replace double and single hyphens with a single '_'
	.replace(/^/, 'ic_');   // prepend `ic_` for android icon naming convention


/**
 * Returns rendered vectorDrawable template from values pulled
 * from the given `svgFile`
 *
 * @param {String} svgFile - svg file content to parse
 * @param {String} destination - destination path for XMl file
 * @returns {String} - rendered `vectorDrawable`
 */
const vectorDrawableFromSVG = (svgFile, destination) => {
	const parser = new xml2js.Parser(PARSER_OPTIONS);

	console.warn('\n--------------SVG INPUT-------------------\n', `${svgFile}\n\n`);

	parser.parseString(svgFile, (err, data) => {
		if (err) throw new Error(`xml2js parse error:\n${err}`);

		console.warn('\n\n--------------PARSED DATA----------------------\n', JSON.stringify(data, null, 2));

		const result = Mustache.render(TEMPLATE, {
			iconName: toAndroidSnakeCase(data.title),
			iconPath: data.path.D
		});

		console.warn('\n\n--------------OUTPUT----------------------\n', result);
		fs.writeFileSync(`${DEST_DIR}/${toAndroidSnakeCase(data.title)}.xml`, result);
	});
};

fs.readdirSync(SRC_DIR)
	.forEach(file => {
		vectorDrawableFromSVG(
			fs.readFileSync(`${SRC_DIR}/${file}`),
			DEST_DIR
		);
	});

/*
 *exec(
 *   `node exportFromSketch ${SRC_DIR} ${TEMP_DIR} android svg`,
 *   (error, result) => {
 *         if (error !== null) throw new Error(`exec error:\n${error}`);
 *   }
 *);
 */
