(() => {

    // Main action
    const action = new PlugIn.Action(async function reviewProject(
        this: PlugIn & { obsidian: PlugIn.Library & ObsidianLibrary },
        selection: Selection,
    ) {
        const obsidian = this.obsidian;

        const project = selection.projects[0];
        const projectJoinery = await obsidian.getJoinery(project.id.primaryKey);

        if (!projectJoinery) {
            const projectLink = `omnifocus:///task/${encodeURIComponent(project.id.primaryKey)}`;
            await new Alert("Project file not found", "We couldn't find a project file in Obsidian associated with this project, double check that the file exits and has the correct omnifocus project URL in its properties").show()
            console.error("Project file not found:");
            console.error(projectLink);
            console.error("In dataset:");
            return;
        }

        const obsidianFilePath = projectJoinery.filePath;
        const appendContent = `\n\n## Review ${obsidian.dailyNoteLink(new Date())}\n\n`;

        await obsidian.appendToObsidianNote(obsidianFilePath, appendContent);
        obsidian.openObsidianNote(obsidianFilePath);
    });

    action.validate = function startTogglTimerValidate(selection: Selection) {
        return selection.tasks.length === 0 &&
            selection.projects.length === 1 &&
            selection.projects[0].nextReviewDate < new Date();
    };

    return action;
})();
