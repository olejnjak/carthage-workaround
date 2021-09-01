# carthage-build.sh
# Usage example: ./carthage-build.sh --platform iOS

set -euo pipefail

xcconfig=$(mktemp /tmp/static.xcconfig.XXXXXX)
trap 'rm -f "$xcconfig"' INT TERM HUP EXIT

# For Xcode 12+ make sure EXCLUDED_ARCHS is set to arm architectures otherwise
# the build will fail on lipo due to duplicate architectures.

CURRENT_XCODE_VERSION=$(xcodebuild -version | grep "Build version" | cut -d' ' -f3)
CURRENT_XCODE_MAJOR=$(echo $CURRENT_XCODE_VERSION | cut -c1-2)00
echo "EXCLUDED_ARCHS__EFFECTIVE_PLATFORM_SUFFIX_simulator__NATIVE_ARCH_64_BIT_x86_64__XCODE_${CURRENT_XCODE_MAJOR}__BUILD_${CURRENT_XCODE_VERSION} = arm64 arm64e armv7 armv7s armv6 armv8" >> $xcconfig

echo 'EXCLUDED_ARCHS__EFFECTIVE_PLATFORM_SUFFIX_simulator__NATIVE_ARCH_64_BIT_x86_64__XCODE_'${CURRENT_XCODE_MAJOR}' = $(EXCLUDED_ARCHS__EFFECTIVE_PLATFORM_SUFFIX_simulator__NATIVE_ARCH_64_BIT_x86_64__XCODE_'${CURRENT_XCODE_MAJOR}'__BUILD_$(XCODE_PRODUCT_BUILD_VERSION))' >> $xcconfig
echo 'EXCLUDED_ARCHS = $(inherited) $(EXCLUDED_ARCHS__EFFECTIVE_PLATFORM_SUFFIX_$(EFFECTIVE_PLATFORM_SUFFIX)__NATIVE_ARCH_64_BIT_$(NATIVE_ARCH_64_BIT)__XCODE_$(XCODE_VERSION_MAJOR))' >> $xcconfig

export XCODE_XCCONFIG_FILE="$xcconfig"
carthage "$@"
