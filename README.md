# Carthage workaround

GitHub action performing workaround so Carthage is capable of building dependencies without M1 arch

## Usage

Just call this action instead of direct carthage call. Use `action` parameter to pass desired arguments to carthage call.

```
name: Build

on: [pull_request, push]

jobs:
  tests:
    name: Build
    runs-on: macos-latest
    steps:
      - uses: actions/checkout@v2
      - uses: olejnjak/carthage-workaround@v1
        with:
          action: bootstrap --platform iOS --cache-builds
```

By default the workaround script will be used only if you are building using Xcode 12.0 and higher and also if you are not using the `--use-xcframeworks` parameter. 
If you still want to use the workaround script, you can use the `force` input parameter.

```
name: Build

on: [pull_request, push]

jobs:
  tests:
    name: Build
    runs-on: macos-latest
    steps:
      - uses: actions/checkout@v2
      - uses: olejnjak/carthage-workaround@v1
        with:
          action: bootstrap --platform iOS --cache-builds
          force: true
```