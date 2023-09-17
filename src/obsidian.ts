function formatDate(date) {
    const year = date.getFullYear();
    const month = String(date.getMonth() + 1).padStart(2, '0');
    const day = String(date.getDate()).padStart(2, '0');
    return `${year}-${month}-${day}`;
}

interface JoineryProject {
    filePath: string
    togglProjectId?: string | null
    timingProjectId?: string | null
    omnifocusProjectLink?: string | null
}

interface ObsidianLibrary extends PlugIn.Library {
    getJoinery(): Promise<JoineryProject[]>;
    getJoinery(projectId: string): Promise<JoineryProject | undefined>;

    dailyNoteLink(date: Date): string;

    openObsidianNote(obsidianFilePath: string): void;

    appendToObsidianNote(obsidianFilePath: string, content: string): void;
}

(() => {
    const dependencyLibrary: ObsidianLibrary = new PlugIn.Library(new Version('1.0')) as ObsidianLibrary;

    const vault = encodeURIComponent("My Life");

    dependencyLibrary.getJoinery = async function getJoinery(projectId?: string) {
        console.log(`Finding joinery for ${projectId}`);
        const request = new URL.FetchRequest();
        request.method = 'GET';
        request.url = URL.fromString(`http://100.113.78.9:9002/joinery/projects`);
        const response = await request.fetch();

        if (response.statusCode !== 200) {
            throw response;
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

    dependencyLibrary.dailyNoteLink = function dailyNoteLink(date) {
        return `[[${formatDate(date)}]]`;
    }

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
