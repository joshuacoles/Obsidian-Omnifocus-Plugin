build:
    rm -rf OmniObsidian.omnifocusjs
    mkdir OmniObsidian.omnifocusjs

    tsc
    cp -r Resources OmniObsidian.omnifocusjs/
    cp -r dist/* OmniObsidian.omnifocusjs/Resources/
    cp manifest.json OmniObsidian.omnifocusjs/

install: build
    rm -r "$HOME/Library/Mobile Documents/iCloud~com~omnigroup~OmniFocus/Documents/Plug-Ins/OmniObsidian.omnifocusjs"
    cp -r OmniObsidian.omnifocusjs "$HOME/Library/Mobile Documents/iCloud~com~omnigroup~OmniFocus/Documents/Plug-Ins"
