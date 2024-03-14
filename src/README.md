# Qualified Embed SDK

With Embed, you can now build advanced, developer-friendly coding products for education, recruiting, upskilling, and more. Our simple SDK makes it simple to embed code challenges and assessments into your existing products.


## See embeds in action

We have several places you can see embeds in action:

* [**View an interactive demo here.**](/embedded) This demo lets you see different challenges embedded right in the page, as well as see some of the events & data.

* [**View a collection of example use cases.**](https://qualified.github.io/embed-demos/) Use these to get inspired for how you can use the Embed SDK to build creative solutions to your own code testing needs.


## Tutorials

### [Embedding Individual Challenges]{@tutorial challenges}

The Embed tool makes it easy to [embed single code challenges]{@tutorial challenges} in your page. This makes it possible to use Qualified for training, low-stakes testing, and other creative uses.

This is the best method if you want to have more control over the experience. With this method, you can:

* Completely control the candidate experience, including setting the theme and controlling the workflow better.
* Provide inline access to practice or example challenges.
* Override or limit some functionality.
* Enable read-only or restricted editing modes.
* Dynamically change file contents.

**[➔ &nbsp; Embedding Challenges]{@tutorial challenges}**

### [Embedding Full Assessments]{@tutorial assessments}

You also can [embed entire assessments easily]{@tutorial assessments}. This requires using the Qualified API to generate invitations, but provides the complete assessment experience, including Q&A challenges.

This is the method to use if you require any of the following:

* The complete assessment experience, including getting full scores & playback.
* The full project challenge experience, including creating and moving files.
* Q&A challenges

This method also has several great features to control the experience, such as:

* Adjusting the workflow by hiding sidebar navigation, the welcome screen, or the review screen.
* Enable read-only or restricted editing modes.
* Hook into the assessment experience with methods to track loading, progress, and errors.

It's also a good method if you don't really want to customize the experience, but just want to use Qualified Assessments inside your own page.

**[➔ &nbsp; Embedding Assessments]{@tutorial assessments}**


## Example Use Cases

There's a list of ideas below to get you started, but you can also check out our [collection of example use cases here](https://qualified.github.io/embed-demos/). These examples are available as starter code to make it easy to try out some usage ideas immediately.

### Code Challenges

An embedded challenge can be modified (or put into read-only mode), the code can be run against tests, results saved, and you can save & restore the candidate's code within your own page. Some example uses include:

* Inline, runnable code demos. These could be used within documentation or as example educational material.
* Lightweight, pre-screening tests for developer applications. By capturing the response, you can use simple challenges as an intelligent sentry before letting developers continue.
* Inline educational practice challenges. Right alongside the training documentation, you can have editable examples that make it easy for students to master a concept.

### Assessment-Backed Challenges

You can embed challenges backed by an assessment. This provides all the benefits of the embedded challenge above, while also creating a complete assessment result, with solutions, which is stored in Qualified. You can use these to build out complete tests of your own with one or more code challenges.

* Control the candidate experience more tightly, directly within your own site.
* Expand on the Qualified testing scenario by processing code and results in ways not currently supported within Qualified.
* Enable a custom solution reviewing experience by using the readonly or restricted modes.

### Complete Assessments

If the limitations or complexity of embedding individual challenges doesn't work, we also offer embedding the entire assessment. This allows you to provide the full assessment experience, while still interacting with Qualified from your outer page.

* Include a complete assessment at the bottom of your education-oriented page, so the student can immediately test what they learned.
* Inline the pre-screen assessment experience right in your hiring page, without the delayed steps of inviting them and waiting for a response.
* Automatically handle responding to the submission of an assessment immediately (possibly using webhooks to determine the candidate's score).


## Library Docs

### Challenges

* {@link QualifiedEmbedManager} - The easiest way to embed individual challenges
* {@link QualifiedEmbeddedChallenge} - Main module for interacting with an embedded challenge
* {@link ChallengeOptions} - Options & configuration for embedded challenges

### Assessments

* {@link QualifiedEmbeddedAssessment} - Main module for creating and interacting with an embedded assessment
* {@link AssessmentOptions} - Options & configuration for embedded assessments
