function formatDate(date) {
  const year = date.getFullYear();
  const month = String(date.getMonth() + 1).padStart(2, '0');
  const day = String(date.getDate()).padStart(2, '0');
  return `${year}-${month}-${day}`;
}

(() => {
  // Main action
  const action = new PlugIn.Action(async function reviewProject(
    selection,
  ) {
    const project = selection.projects[0];
    const projectJoinery = await this.common.getJoinery(project.id.primaryKey);

    if (!projectJoinery) {
      const projectLink = `omnifocus:///task/${encodeURIComponent(project.id.primaryKey)}`;
      new Alert("Project file not found", "We couldn't find a project file in Obsidian associated with this project, double check that the file exits and has the correct omnifocus project URL in its properties").show()
			console.error("Project file not found:");
      console.error(projectLink);
			console.error("In dataset:");
      console.error(response.bodyString)
      return;
    }

    const obsidianFilePath = projectJoinery.filePath;
    const appendContent = `\n\n## Review [[${formatDate(new Date())}]]\n\n`;

    await this.common.appendToObsidianNote(obsidianFilePath, appendContent);
    this.common.openObsidianNote(obsidianFilePath);
  });

  action.validate = function startTogglTimerValidate(selection) {
    return selection.tasks.length === 0 &&
      selection.projects.length === 1 &&
      selection.projects[0].nextReviewDate < new Date();
  };

  return action;
})();
