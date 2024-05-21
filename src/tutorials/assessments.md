Embedding assessments allows you to embed an entire Qualified assessment directly in another page. This makes it easy to fully test candidates and students without them leaving your site.

You should embed the full assessment whenever you need the following:

- The complete assessment experience, including getting full scores & playback.
- The full project challenge experience, including creating and moving files.
- Q&A challenges

## Quick Start Example

```xml
<!DOCTYPE html>
<html lang="en">
<head>
  <title>Embedded Full Assessment</title>
  <style>
  [data-qualified-embed] {
    width: 100%;
    height: 60vh;
    border: none;
  }
  </style>
</head>
<body>

<h1>Embedded Full Assessment</h1>

<!-- replace with your assessment id -->
<iframe data-qualified-embed="5a309e7cac5e2d0013af6bdb"></iframe>

<script src="https://cdn.jsdelivr.net/gh/andela-technology/qualified-embed@v1.0.1/dist/embed.min.js"></script>
<script>
const assessmentEditor = new window.QualifiedEmbed.QualifiedEmbeddedAssessment({
  // the node hosting the iframe
  node: document.querySelector(
    '[data-qualified-embed="5a309e7cac5e2d0013af6bdb"]',
  ),

  // options for this assessment editor
  options: {
    // invitePath and authToken from assessment invitation API call
    invitePath: invitePathFromAssessmentInvitation,
    authToken: authTokenFromAssessmentInvitation,

    embedClientKey: embedClientKeyFromTeamSettings,

    onLoaded({ assessment, data }) {
      // Respond to the assessment solver being loaded
    },
    onUpdated({ assessment, data }) {
      // save changes made to the solution
    },
    onSolutionUpdated({ assessment, data }) {
      console.log(`solution for challenge ${data.title} was updated`);
    },
    onSubmitted({ assessment, data }) {
      console.log("assessment was submitted", data);
    },
    onError({ assessment, data }) {
      console.error(`There was an error in ${data.context}`, data);
    },
  },
});
</script>
</body>
</html>
```

## Usage

Before you can use embedded assessments, you need to [invite the candidate or student using the AssessmentInvitations API](https://docs.qualified.io/integrations/custom-integrations/api/#assessment-invitations). This provides you with the unique `invitePath` and `authToken` properties needed to load the assessment.

Then simply create a new `QualifiedEmbeddedAssessment` with a DOM node and those properties, the assessment will be loaded into your page automatically.

## Configuration Details

There are a few options you can use to customize the assessment editor, as well as interact with the editor directly.

Below will highlight some of the more useful options. **[A complete list of options is available in `AssessmentOptions`]{@linkplain AssessmentOptions}.**

### Example Appearance Options

These options will help you configure the style and visible components of the editor.

- [mode]{@linkcode AssessmentOptions#mode} can be set to `readonly` or `restricted` to change how editing and saving works.

- [hideSidebar]{@linkcode AssessmentOptions#hideSidebar} can be used to completely hide the built-in navigation sidebar. If you do this, you may want to provide external controls for challenge navigation. However, the internal challenge buttons will allow the candidate to move forward to the next challenge and through to submission (but never backwards to a previous one).

  **Also note this hides the timer.** On timed assessments, this means you'll need to provide your own external timer. You can use [`startedAt`, `timeLimit`, and `cutOffTime` from `onLoaded` to create an external timer]{@linkplain AssessmentOptions~LoadData}.

- [hideWelcome]{@linkcode AssessmentOptions#hideWelcome} can be used to immediately start a candidate on the assessment. This also hides any welcome screen information, such as navigation and timer information.

## Callbacks

The embedded editor provides several callbacks throughout its lifecycle. Click on any callback for details.

- [onLoaded()]{@linkcode AssessmentOptions#onLoaded} is called after the assessment editor has been loaded. It can be used to learn more about the assessment.
- [onUpdated()]{@linkcode AssessmentOptions#onUpdated} is called whenever there is an update to the assessment result, including events that affect score & completion information.
- [onSolutionUpdated()]{@linkcode AssessmentOptions#onSolutionUpdated} is called as challenges are changed and solutions are modified.
- [onSubmitted()]{@linkcode AssessmentOptions#onSubmitted} is called once the entire assessment has been submitted.
- [onError()]{@linkcode AssessmentOptions#onError} is called for unrecoverable error events, such as network errors or permissions errors.
