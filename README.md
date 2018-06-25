swarm-icons
===========
[![npm version](https://badge.fury.io/js/swarm-icons.svg)](https://badge.fury.io/js/swarm-icons)
[![Build Status](https://travis-ci.org/meetup/swarm-icons.svg?branch=master)](https://travis-ci.org/meetup/swarm-icons)

Icon library module of the [Swarm Design System](https://github.com/meetup/swarm-design-system)

## Documentation
[https://meetup.github.io/swarm-icons/](https://meetup.github.io/swarm-icons/)

---------

## Using `swarm-icons` in your project

#### Installation

```bash
yarn add swarm-icons
```

#### Usage

##### Optimized svg files
If you need individual `svg` files for your project, you will find them in `dist/optimized`.

##### SVG sprite
For an svg sprite, `swarm-icons` also generates an HTML include, `dist/sprite/sprite.inc`.
You can inject this include into the top of an HTML document (right after the opening `body` tag).
For more information about svg sprites, see this article from [CSS Tricks](https://css-tricks.com/svg-sprites-use-better-icon-fonts/).

##### React
If the svg sprite is included at the top of every HTML document in your React project, you can use the
`Icon` component in [`meetup-web-components`](https://github.com/meetup/meetup-web-components) to render the icon.

----------

## Modifying the icon library

#### Sketch file organization
Each platform (web, iOS, Android) has its own page in an icon sketch file. Each platform page contains
normal and "small" icon variants. We use this information hierarchy to support different shapes based
on platform or variant.

#### SVG conventions
- Icons should be filled with #000000 at 100% opacity
- Icons should be compound paths - these are easier to create in Adobe Illustrator
- The icon path should not contain a stroke
- If it's not an icon (e.g.: Meetup script logotype), send it directly to the engineer

**Sketch file structure**
```
<file.sketch>
   |
   | - Web (page)
	|   |- icon-name (artboard for default icon)
	|   |- icon-name--small (artboard for small variant)
	|   |- icon-name--[otherVariant] (artboard for other variant)
   | - iOS (page)
	|   |- icon-name (artboard for default icon)
	|   |- icon-name--small (artboard for small variant)
	|   |- icon-name--[otherVariant] (artboard for other variant)
   | - Android (page)
	    |- icon-name (artboard for default icon)
	    |- icon-name--small (artboard for small variant)
	    |- icon-name--[otherVariant] (artboard for other variant)
```

##### Artboard naming conventions
- Use lower case letters and hyphens only
- For icon variants such as "small", use a double dash
	- for example, `my-icon--small`


#### Adding new icons
0. Check out a new branch. For example, `new_fancy_icon`.
1. Use Sketch or Adobe Illustrator templates in `design_resources/` to design a new icon
	- `IconGrid.ai` contains the icon grid
	- `IconExport.sketch` contains the basic setup for an icon sketch file
2. Save the sketch file for your icon to `src/sketch/`
3. Run `yarn run build` to export icon distribution from sketch files checked into `src/sketch`
4. Commit the resulting changes
5. Submit a pull request
6. The PR will publish a `-beta` tag to npm if you need to test the icon in a consumer app

#### Changing an icon
0. Check out a new branch. For example, `edit_camera_icon`.
1. Use the sketch source file in `src/sketch/` to make edits
2. Commit any changes to files in `src/sketch`
3. Run `yarn run build` to export icon distributions from sketch files
4. Commit the resulting changes
5. Submit a pull request
6. The PR will publish a `-beta` tag to npm

#### Reviewing pull requests

Use this handy checklist to review pull requests:

- [ ] Was an icon deleted? If so, did we bump the _major_ version in `Makefile`?
- [ ] If the _major_ version was updated in `Makefile`, was the `CHANGELOG` updated with release notes?
- [ ] Does the icon name make sense out of context, or is it ambiguous?
- [ ] Do the generated SVG exports fit the criteria listed [here](https://github.com/meetup/swarm-icons/wiki/Reviewing-icon-pull-requests)?

#### Releases
This package uses semver versioning to tag releases, although the patch version
is determined exclusively by the Travis build number for pushes to `master`.
Major and minor versions are hard-coded into the [Makefile](Makefile#L2).

Manual pushes to `master` and PR merges to master will be built by Travis, and
will kick off the yarn publish routine. The currently-published version of the
package is shown on the repo homepage on GitHub in a badge at the top of the
README.

----------

## Development

### Setup
**You must have the [`sketchtool cli`](https://www.sketchapp.com/tool/) installed to run `build` commands**

Once you have the latest version of Sketch installed, run the following to set up `sketchtool`:

```bash
~/Applications/Sketch.app/Contents/Resources/sketchtool/install.sh
```

#### yarn commands

task                      | description
------------------------- | ------------------------
`yarn run build`          | builds all icon distributions to `dist/`; builds docs to `doc/build`
`yarn run publish-docs`   | builds and publishes documentation to github pages

#### Sketch export configuration
The script that exports artboards from sketch files, `scripts/exportFromSketch`, reads from a configuration file, `exportConfig.json`.
The config file for this script follows this format:

```
{
	"name": <name of export set for reference>,
	"options": {
		"destination": <destination for exported files>,
		"platform": <name of platform "page" in sketch file>,
		"format": <export file format>
	}
}
```
