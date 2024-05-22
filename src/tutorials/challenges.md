Embedding challenges allows you to show one or more challenges on a page. These are great for education & training,
but can also be used for quick, low-stakes tests.

When embedding challenges, you can:

- Completely control the candidate experience, including setting the theme and controlling the workflow better.
- Provide inline access to practice or example challenges.
- Override or limit some functionality.
- Enable read-only or restricted editing modes.
- Dynamically change file contents.

## Quick Start Example

```xml
<!DOCTYPE html>
<html lang="en">
<head>
  <title>Embedded Challenge</title>
  <style>
  [data-qualified-embed] {
    position: relative;
    max-width: 100%;
    width: 100em;
    display: flex;
    resize: both;
    overflow: hidden;
    height: 60vh;
  }
  [data-qualified-embed] > iframe {
    border: none;
    flex-grow: 1;
  }
  </style>
</head>
<body>

<!-- replace with your challenge id -->
<div data-qualified-embed="5c817855557303000a2f82b9"></div>

<script src="https://cdn.jsdelivr.net/gh/andela-technology/qualified-embed@v1.0.1/dist/embed.min.js"></script>
<script>
  var manager = window.QualifiedEmbed.QualifiedEmbedManager.init({
    // generate editors by looking through nodes
    autoCreate: true,

    // shared options for new editors
    options: {
      // optional authToken for saving results from API call
      authToken: authTokenFromAssessmentInvitation,
      embedClientKey: embedClientKeyFromTeamSettings,
    },

    // challenge-specific options
    challengeOptions: {
      "5c817855557303000a2f82b9": {
        language: "javascript"
      }
    },

    // The following events can also be handled per-challenge

    onLoaded({ manager, editor, challengeId, data }) {
      // Respond to challenge being loaded and ready for solving
    },

    onChange({ manager, editor, challengeId, data }) {
      // save changes made to the solution
    },

    onRunStart({ manager, editor, challengeId, data }) {
      console.log("challenge " + challengeId + " was run as a " + data.type); // test or attempt
    },

    onRun({ manager, editor, challengeId, data }) {
      console.log("challenge " + challengeId + " was run with this result:");
      console.log(data);
    }
  });
</script>
</body>
</html>
```

## Usage

There are two main ways to use embedded challenges: authenticated and public.

- **Public** Means using individual challenges with the `embeddable` flag set. These challenges will not save solutions back to the Qualified service. This mode lets you build your own system around individual challenges.
- **Authenticated** Means [inviting a user using the AssessmentInvitations API](https://docs.qualified.io/integrations/custom-integrations/api/#assessment-invitations), and supplying an `authToken` to have the candidate take the embedded challenge similar to a full assessment.

You can mix both techniques in the same page, within the same manager. This can be useful for including practice or example challenges within a larger assessment.

### Embedded Challenge Limitations

The Embed editor is not intended as a 1-to-1 replacement for the dedicated assessment suite. Several features are not available within the embedded app at this time, including:

- **Time-Limits** are not shown or enforced, either for whole assessments or for individual challenges. If you need to enforce time limits, you should manage them within your application.
- **Quiz Challenges** are not currently supported at all.
- **Project Code Challenges** are presented in a limited format:
  - Candidates are not able to add, rename, or delete files.
  - There is no file tree.
  - The editor also only shows editable (`readwrite`) files to the candidate.
- **External IDE** is not supported.
- For **Assessments**, your system will be required to mark the assessment as submitted for complete scoring.

If any of the above are necessary for your use case, [try embedding full assessments instead]{@tutorial assessments}.

## Initial Setup

For configuring group of challenges, please use `init` on [window.QualifiedEmbed.QualifiedEmbedManager]{@linkcode QualifiedEmbedManager}. Once you've set up your manager, you can create individual embeds using {@link QualifiedEmbedManager#createEditor}. See {@link QualifiedEmbeddedChallenge} for the editor functions.

### Direct Challenge Creation

If you only plan on using a single challenge, and want to control the creation and removal of that challenge through code, you can also [create an embedded challenge directly]{@linkplain QualifiedEmbeddedChallenge}:

```javascript
const editor = new window.QualifiedEmbed.QualifiedEmbeddedChallenge({
  node: iframeNode,

  challengeId: "507f19cde860e19729a1e810",

  options: {
    embedClientKey: embedClientKeyFromTeamSettings,
    theme: "dark",
    language: "javascript",
  },
});
```

Note that this method doesn't allow the use of `autoCreate`.

### Simple Embedding

If you do not need to interact with the challenge, you can directly embed an iframe and configure some options via the URL. This could be used for static site generators, where you might not have easy access to injecting the embed library.

To learn more about this, [see the `UrlParams` page]{@linkplain UrlParams}.

## Configuration Details

The Embed SDK includes a lot of functionality to fine-tune your embeds. Options can be set on the manager (for shared options across all embeds), and further customized on each editor individually.

Below will highlight some of the more useful options. **[A complete list of options is available in `ChallengeOptions`]{@linkplain ChallengeOptions}.**

### Example Appearance Options

These options will help you configure the style and visible components of the editor.

- [mode]{@linkcode ChallengeOptions#mode} can be set to `readonly` or `restricted` to change how editing and saving works.
- [theme]{@linkcode ChallengeOptions#theme} can be forced to be one of `light` (default) or `dark`. If you don't set the theme, the user can change the theme in the `idesettings` tab, and it will sync across embeds.
- [hideTabs]{@linkcode ChallengeOptions#hideTabs} and [showTabs]{@linkcode ChallengeOptions#showTabs} can be used to hide challenge tabs you do not want, such as `instructions` or `idesettings`. See {@link TAB_IDS} for common tab names.
- [hideActions]{@linkcode ChallengeOptions#hideActions} can be set to `true` if you want to wrap the Qualified editor with your own custom controls.
- [initialLayout]{@linkcode ChallengeOptions#initialLayout} is an advanced option that lets you configure exactly where each editor tab shows up.

### Example Challenge Content Options

These options will help you set up the challenge correctly.

- [language]{@linkcode ChallengeOptions#language} is used to set the language on multi-language classic code challenges.
- [initialFiles]{@linkcode ChallengeOptions#initialFiles} is used to override the contents of the files used within the challenge.
- [localStorageId]{@linkcode ChallengeOptions#localStorageId} can be set to automatically back up and restore the editor's contents within the browser's localStorage.

## Callbacks

The embedded editor provides several callbacks throughout its lifecycle. Click on any callback for details.

- [onLoaded()]{@linkcode ChallengeOptions#onLoaded} is called once after the challenge is loaded. It includes information about the loaded challenge.
- [onChange()]{@linkcode ChallengeOptions#onChange} is called every time the editor's contents change (debounced to prevent too much noise). Use this to build a custom save/restore along with [initialFiles]{@linkcode ChallengeOptions#initialFiles}.
- [onRunStart()]{@linkcode ChallengeOptions#onRunStart} is called at the start of any run of the code.
- [onRun()]{@linkcode ChallengeOptions#onRun} is called after every completed run of the code. It includes a lot of detailed information about the run results.
