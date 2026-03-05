const urlRepo = "https://api.github.com/repos/Joan335/notes-markdown";

fetch(urlRepo)
    .then(res => res.json())
    .then(data => console.log(data));
