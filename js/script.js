const notasContainer = document.querySelector("#notas-container");
const noteInput = document.querySelector("#anotacao");
const addNoteBtn = document.querySelector("#add-note-btn");
const searchInput = document.querySelector("#search-input");
const exportBtn = document.querySelector("#exports-notes");

addNoteBtn.addEventListener("click", () => {
    const noteObject = { // Criação do objeto "anotação". Determina quais informações ele vai receber.
        id: Date.now(),
        content: noteInput.value,
        fixed: false
    };

    const noteElement = createNote(noteObject.id, noteObject.content) // noteElement - Cria a função createNote e usa as informações de ID e conteúdo da noteObject.

    notasContainer.appendChild(noteElement); // Insere as informações de noteElement em notasContainer.
});

function createNote(id, content, fixed) {
    const element = document.createElement("div"); // Cria uma div.
    element.classList.add("card-notas"); // Define a classe da div.

    const textarea = document.querySelector("textarea"); // Seleciona a textarea.
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

    element.querySelector(".bi-x.lg").addEventListener("click", () => {
        deleteNote(id, element);
    });

    return element; // Retorna os valores de element para o programa.
}