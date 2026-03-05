const urlRepo = "https://api.github.com/repos/Joan335/notes-markdown/contents/notes/gola.md";

fetch(urlRepo)
    .then(res => res.json())
    .then(data => {
        const content = atob(data.content.replace(/\n/g, ""));

        const converter = new showdown.Converter({ metadata: true });
        converter.makeHtml(content);

        const metadata = converter.getMetadata();
        console.log(metadata);
    });
