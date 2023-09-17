build:
    rm -rf OmniObsidian.omnifocusjs
    mkdir OmniObsidian.omnifocusjs
    cp -r Resources OmniObsidian.omnifocusjs/
    cp manifest.json OmniObsidian.omnifocusjs/

install: build
    rm -r "$HOME/Library/Mobile Documents/iCloud~com~omnigroup~OmniFocus/Documents/Plug-Ins/OmniObsidian.omnifocusjs"
    cp -r OmniObsidian.omnifocusjs "$HOME/Library/Mobile Documents/iCloud~com~omnigroup~OmniFocus/Documents/Plug-Ins"
