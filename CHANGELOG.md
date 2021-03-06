# [3.8]
- **Change** Updated `star-rounded` icon to fix stroke cut

# [3.7]

- **Change** Added new star icon with more rounded edges (`star-rounded`)

# [3.6]

- **Change** Added `yarn build:svgSrc` script. This lets us generate an icon distribution for the Web from `src/svg` without the user needing to have Sketch installed. This should also let us run a build for Web icon distributions in Travis.

# [3.4]

- **Change** Added `list` and `grid` icons

# [3.3]

- **BREAKING CHANGE** Removes `triangle-down` icon. Use `chevron-down` in its place.

# [2.3.310]

- **Change** Android dist Travis build disabled to unblock build pipeline.
  Ticket to fix the Travis build is [here](https://meetup.atlassian.net/browse/ICONS-3);

# [2.0]

- **BREAKING CHANGE** Removed `overflow-horizontal` icon shape.

# [1.3]

- **Change** Added `chevron-down` icon shape. Renamed sketch files to match base
  artboard names.

# [1.2]

- **Change** Major non-breaking changes to sketch file artboards and pages.
  Artboard names are now used to generate file names. Artboards are now organized
  in pages by "platform" (web, android, iOS).
	- Build now generates distributions directly from sketch files.
	- **The `sketchtool` cli is now required to build**
	- Added `pdf` dist for iOS

# [1.1]

- **Removed Icon** `chevron-down`. No consumer usage, so not a breaking change.

# [1.0]

- **BREAKING CHANGE** Deleted a number of icon shapes, updated some existing shapes,
  and created `--small` shape variants for `xs` size icons. Third party icons now
  have `external-` prefix.

- **Deleted shapes:**
	- `messages-new`
	- `messages-notif`
	- `messages`
	- `pause`
	- `start-new`
