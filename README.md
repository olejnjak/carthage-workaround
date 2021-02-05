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
      - uses: olejnjak/carthage-workaround@main
        with:
          action: bootstrap --platform iOS --cache-builds
```
