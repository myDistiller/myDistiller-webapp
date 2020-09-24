module.exports = {
  pluginOptions: {
    electronBuilder: {
      builderOptions: {
        win: {
          publish: [
            {
              "provider": "github",
              "vPrefixedTagName ": false,
              "releaseType": "release"
            }
          ]
        },
        linux: {
          publish: [
            {
              "provider": "github",
              "vPrefixedTagName ": false,
              "releaseType": "release"
            }
          ]
        },
        dmg: {
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
