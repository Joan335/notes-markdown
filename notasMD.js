const d = document,
    $template = d.getElementById("note-template").content,
    $fragment = d.createDocumentFragment(),
    $notes = d.querySelector(".notes"),
    $templateNoteShown = d.getElementById("note-show-template").content,
    converter = new showdown.Converter({ metadata: true }),
    $showNote = d.querySelector(".show-note"),
    $containerAboutMe = d.querySelector(".about-me");

async function cargarVistaPreviaNotas() {
    const urlCarpeta = "/.netlify/functions/function-server.js";

    try {
        // 1. Obtenemos la lista de archivos de la carpeta
        const respuesta = await fetch(urlCarpeta);
        const archivos = await respuesta.json();

        // Filtramos para asegurarnos de que solo procesamos archivos .md
        const archivosMD = archivos.filter(archivo => archivo.name.endsWith('.md'));

        // 2. Recorremos cada archivo para obtener su contenido
        for (const archivo of archivosMD) {
            const resContenido = await fetch(archivo.download_url);
            const content = await resContenido.text();

            // 3. Usamos Showdown para extraer los metadatos
            converter.makeHtml(content);
            const metadata = converter.getMetadata();

            console.log(metadata);

            $template.querySelector(".note").setAttribute("id", metadata.id);
            $template.querySelector(".note").dataset.content = content;
            $template.querySelector("h3").textContent = metadata.title || "Sin título";
            $template.querySelector("p").textContent = metadata.description || "";
            $template.querySelector("span").textContent = metadata.date || "";

            let clone = d.importNode($template, true);
            $fragment.appendChild(clone);

            // 4. Imprimimos o renderizamos la información
            console.log("Título:", metadata.title || "Sin título");
            console.log("Descripción:", metadata.description || "Sin descripción");
            console.log("---");

            // Aquí podrías llamar a una función para crear el HTML de la "tarjeta"
            // crearTarjeta(metadata.titulo, metadata.descripcion);
        }
        $notes.appendChild($fragment);
    } catch (error) {
        console.error("Error al cargar las notas:", error);
    }
}

$notes.addEventListener("click", (e) => {
    e.preventDefault();
    $showNote.style.display = "";
    const clickedNote = e.target.closest('.note');

    const htmlConvertido = converter.makeHtml(clickedNote.dataset.content);

    // console.log(htmlConvertido);

    $notes.style.display = "none";

    $templateNoteShown.querySelector(".markdown-body").innerHTML = htmlConvertido; //

    let clone = d.importNode($templateNoteShown, true);
    $fragment.appendChild(clone);

    $showNote.appendChild($fragment);
});

d.addEventListener("click", (e) => {
    e.preventDefault();

    if (e.target.matches(".about-me-link")) {
        $notes.style.display = "none";
        $showNote.style.display = "none";
        $showNote.innerHTML = "";
        $containerAboutMe.style.display = "";
        $containerAboutMe.innerHTML = `
        <div class="author-bio">
            <h3>Sobre mi</h3>
            <p>
                Soy un desarrollador apasionado por la web, el codigo limpio y las herramientas simples. Este blog es mi cuaderno
                digital donde comparto notas sobre desarrollo, tecnologia y las cosas que aprendo en el camino.
            </p>
            <p>
                Escribo en markdown porque creo que la mejor forma de escribir es la mas sencilla. Sin distracciones, sin formato
                complejo. Solo texto e ideas.
            </p>
            <p>
                Cuando no estoy escribiendo codigo, probablemente estoy leyendo documentacion, experimentando con un nuevo framework o
                tomando cafe.
            </p>               
        </div>
        <div class="contact-info">
            <span>CONTACTO</span>
            <span>GitHub: <span style="color: black">@Joan335</span></span>
            <span>Correo: <span style="color: black">joancalderon513@gmail.com</span></span>
        </div>
        `;
    } else if (e.target.matches(".home-link")) {
        $notes.style.display = "";
        $showNote.style.display = "none";
        $showNote.innerHTML = "";
        $containerAboutMe.style.display = "none";
    }
});

// Ejecutamos la función
cargarVistaPreviaNotas();
