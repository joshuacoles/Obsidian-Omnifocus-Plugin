/* eslint-disable no-bitwise, no-plusplus */

(() => {
  const dependencyLibrary = new PlugIn.Library(new Version('1.0'));

  const vault = encodeURIComponent("My Life");

  dependencyLibrary.getJoinery = async function getJoinery(projectId) {
    console.log(`Finding joinery for ${projectId}`);
    const request = new URL.FetchRequest();
    request.method = 'GET';
    request.url = URL.fromString(`http://localhost:9002/joinery/projects`);
    const response = await request.fetch();

    if (response.statusCode !== 200) {
      throw buildErrorObject(response);
    }

    console.log(response.bodyString)
    const projects = JSON.parse(response.bodyString);

    if (projectId) {
      const projectLink = `omnifocus:///task/${encodeURIComponent(projectId)}`;
      return projects.find((p) => {
        console.log(`Considering: ${p.omnifocusProjectLink} === ${projectLink}`)
        return p.omnifocusProjectLink === projectLink
      });
    } else {
      return projects;
    }
  };

  dependencyLibrary.openObsidianNote = function openObsidianNote(obsidianFilePath) {
    const encodedFilePath = encodeURIComponent(obsidianFilePath);
    console.log(`Opening ${`obsidian://vault/${vault}/${encodedFilePath}`}`)
    URL.fromString(`obsidian://vault/${vault}/${encodedFilePath}`).open();
  };

  dependencyLibrary.appendToObsidianNote = function openObsidianNote(obsidianFilePath, content) {
    const encodedFilePath = encodeURIComponent(obsidianFilePath);
    const encodedContent = encodeURIComponent(content);
    const appendURI = `obsidian://advanced-uri?vault=${vault}&filepath=${encodedFilePath}&mode=append&data=${encodedContent}`;
    URL.fromString(appendURI).open();
  };

  return dependencyLibrary;
})();
