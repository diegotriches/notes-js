const notasContainer = document.querySelector("#notas-container");
const noteInput = document.querySelector("#anotacao");
const addNoteBtn = document.querySelector("#add-note-btn");
const searchInput = document.querySelector("#search-input");
const exportBtn = document.querySelector("#exports-notes");

let notes = []; // Armazena as notas na memória.

searchInput.addEventListener("keydown", (e) => {
    if (e.key === "Enter") {

        const searchTerm = searchInput.value.toLowerCase();
        const notes = document.querySelectorAll(".card-notas");

        notes.forEach((note) => {
            const content = note.querySelector("textarea").value.toLowerCase();

            if (content.includes(searchTerm)) {
                note.style.display = "block";
            } else {
                note.style.display = "none";
            }
        });

        searchInput.value = "";
    }
});

addNoteBtn.addEventListener("click", () => {
    const content = noteInput.value;

    if (!content) {
        return;
    }

    const noteObject = { // Criação do objeto "anotação". Determina quais informações ele vai receber.
        id: Date.now(),
        content: noteInput.value,
        fixed: false
    };

    notes.push(noteObject); // Adiciona ao array.

    const noteElement = createNote(noteObject.id, noteObject.content) // noteElement - Cria a função createNote e usa as informações de ID e conteúdo da noteObject.
    notasContainer.appendChild(noteElement); // Insere as informações de noteElement em notasContainer.

    noteInput.value = ""; // Limpa o input depois de adicionar.
});

function createNote(id, content, fixed = false) {
    const element = document.createElement("div"); // Cria uma div.
    element.classList.add("card-notas"); // Define a classe da div.

    const textarea = document.createElement("textarea"); // Cria uma nova textarea.
    textarea.value = content; // Informa de onde vem a informação que a textarea vai receber.
    element.appendChild(textarea); // Insere a informação em textarea.

    const pinIcon = document.createElement("i");
    pinIcon.classList.add(...["bi", "bi-pin"]);
    element.appendChild(pinIcon);

    const deleteIcon = document.createElement("i");
    deleteIcon.classList.add(...["bi", "bi-x", "lg"]);
    element.appendChild(deleteIcon);

    const duplicateIcon = document.createElement("i");
    duplicateIcon.classList.add(...["bi", "bi-file-earmark-plus"]);
    element.appendChild(duplicateIcon);

    if (fixed) {
        element.classList.add("fixed");
    }

    element.querySelector(".bi-file-earmark-plus").addEventListener("click", () => {
        duplicateNote(id, content);
    });

    element.querySelector(".bi-x.lg").addEventListener("click", () => {
        deleteNote(id, element);
    });

    element.querySelector(".bi-pin").addEventListener("click", () => {
        toggleFixed(id, element);
    });

    return element; // Retorna os valores de element para o programa.
}

function deleteNote(id, element) {
    element.remove();
    notes = notes.filter(note => note.id !== id); // Remove a anotação do array.
}

function duplicateNote(id, content) {
    const newNote = {
        id: Date.now(),
        content: content,
        fixed: false
    };

    notes.push(newNote); // Adiciona no array.

    const newNoteElement = createNote(newNote.id, newNote.content, newNote.fixed);
    notasContainer.appendChild(newNoteElement); // Renderiza no container.
}

function toggleFixed(id, element) {
    const note = notes.find(note => note.id === id); // Encontra a nota no array.

    if (!note) return;

    note.fixed = !note.fixed; // Alterna o valor de fixo.

    if (note.fixed) {
        element.classList.add("fixed");
        notasContainer.prepend(element);
    } else {
        element.classList.remove("fixed");
        notasContainer.appendChild(element);
    }
}