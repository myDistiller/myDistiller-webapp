module.exports = {
  pluginOptions: {
    electronBuilder: {
      builderOptions: {
        extraFiles: [
          "build/icon.ico"
        ],
        win: {
          target: ["portable", "msi", "zip"],
          icon: "build/icon.ico",
          publish: [
            {
              "provider": "github",
              "vPrefixedTagName ": false,
              "releaseType": "release"
            }
          ]
        },
        linux: {
          target: ["deb", "rpm", "apk", "zip"],
          icon: "build/128x128.png",
          publish: [
            {
              "provider": "github",
              "vPrefixedTagName ": false,
              "releaseType": "release"
            }
          ]
        },
        mac: {
          target: ["dmg", "zip"],
          icon: "build/icon.icns",
          publish: [
            {
              "provider": "github",
              "vPrefixedTagName ": false,
              "releaseType": "release"
            }
          ]
        }
      }
    }
  }
}
