const notasContainer = document.querySelector("#notas-container");
const noteInput = document.querySelector("#anotacao");
const addNoteBtn = document.querySelector("#add-note-btn");
const searchInput = document.querySelector("#search-input");
const exportBtn = document.querySelector("#exports-notes");

let notes = []; // Armazena as notas na memória.

loadNotes();

searchInput.addEventListener("keydown", (e) => { // Pesquisa ao pressionar Enter
    if (e.key === "Enter") {
        const searchTerm = searchInput.value.toLowerCase();
        const notesElements = document.querySelectorAll(".card-notas");

        notesElements.forEach((note) => {
            const content = note.querySelector("textarea").value.toLowerCase();
            note.style.display = content.includes(searchTerm) ? "block" : "none";
        });

        searchInput.value = ""; // Limpa o input.
    }
});

exportBtn.addEventListener("click", () => { // Exportar o CSV
    const notesElements = document.querySelectorAll(".card-notas");

    let csvContent = "data:text/csv;charset=utf-8,Id,Conteudo,Fixada\n";

    notesElements.forEach((note) => {
        const id = note.getAttribute("data-id") || "";
        const content = note.querySelector("textarea").value.replace(/(\r\n|\n|\r)/gm, "");
        const fixed = note.classList.contains("fixed") ? "Sim" : "Não";

        csvContent += `${id}, "${content}", ${fixed}\n`;
    });

    const encodedUri = encodeURI(csvContent);
    const link = document.createElement("a");
    link.setAttribute("href", encodedUri);
    link.setAttribute("download", "notas.csv");
    document.body.appendChild(link);

    link.click();
    document.body.removeChild(link);
});

addNoteBtn.addEventListener("click", () => { // Adicionar anotação.
    if (!noteInput.value.trim()) return;

    const noteObject = { // Criação do objeto "anotação". Determina quais informações ele vai receber.
        id: Date.now(),
        content: noteInput.value,
        fixed: false
    };

    const noteElement = createNote(noteObject.id, noteObject.content, noteObject.fixed) // noteElement - Cria a função createNote e usa as informações de ID e conteúdo da noteObject.
    notasContainer.appendChild(noteElement); // Insere as informações de noteElement em notasContainer.

    notes.push(noteObject); // Adiciona ao array.

    saveNotes(); // Salva no localStorage.
    noteInput.value = ""; // Limpa o input depois de adicionar.
});

function createNote(id, content, fixed) { // Criação da nota.
    const element = document.createElement("div"); // Cria uma div.
    element.classList.add("card-notas"); // Define a classe da div.
    element.setAttribute("data-id", id);

    const textarea = document.createElement("textarea"); // Cria uma nova textarea.
    textarea.value = content; // Informa de onde vem a informação que a textarea vai receber.
    element.appendChild(textarea); // Insere a informação em textarea.

    textarea.addEventListener("input", () => {
        const note = notes.find(note => note.id === id);
        if (note) {
            note.content = textarea.value;
            saveNotes();
        }
    });

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

    duplicateIcon.addEventListener("click", () => {
        duplicateNote(id, content);
    });

    deleteIcon.addEventListener("click", () => {
        deleteNote(id, element);
    });

    pinIcon.addEventListener("click", () => {
        toggleFixed(id, element);
    });

    return element; // Retorna os valores de element para o programa.
}

function deleteNote(id, element) { // Excluir nota
    element.remove();
    notes = notes.filter(note => note.id !== id); // Remove a anotação do array.
    saveNotes(); // Atualiza o localStorage.
}

function duplicateNote(id, content) { // Duplicar nota
    const newNote = {
        id: Date.now(),
        content: content,
        fixed: false
    };

    notes.push(newNote); // Adiciona no array.

    const newNoteElement = createNote(newNote.id, newNote.content, newNote.fixed);
    notasContainer.appendChild(newNoteElement); // Renderiza no container.

    saveNotes();
}

function toggleFixed(id, element) { // Fixar nota
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

    saveNotes();
}

function saveNotes() { // Salva as notas no localStorage
    if (!Array.isArray(notes)) {
        notes = [];
    }
    localStorage.setItem("notes", JSON.stringify(notes));
}

function loadNotes() { // Carrega as notas no localStorage
    let savedNotes = [];
    try {
        const stored = localStorage.getItem("notes");
        if (stored) {
            savedNotes = JSON.parse(stored);
        }
    } catch (e) {
        console.error("Erro ao carregar notas do localStorage:", e);
        savedNotes = [];
    }

    notes = savedNotes;

    savedNotes.forEach(note => {
        const noteElement = createNote(note.id, note.content, note.fixed);
        notasContainer.appendChild(noteElement);
    });
}