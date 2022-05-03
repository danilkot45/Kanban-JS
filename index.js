var defaultSections = [
    {
        id: 1,
        title: 'Backlog',
        tasks: []
    },
    {
        id: 2,
        title: 'A faire',
        tasks: []
    },
    {
        id: 3,
        title: 'En cours',
        tasks: []
    },
    {
        id: 4,
        title: 'A tester',
        tasks: []
    },
    {
        id: 5,
        title: 'A livrer',
        tasks: []
    },
];
var sections = localStorage.getItem('kanban_sections');
sections = sections ? JSON.parse(sections) : defaultSections;

const sectionsElement = document.getElementById('sections');

function renderBoard() {
    console.log("Rendering", sections);

    sectionsElement.innerHTML = sections.map(section => {
        return `
        <div class="section" section-id="${section.id}" ondblclick="addTask('${section.id}'); ">
            <div class="title">
                <div class="text">
                <input type="text" id="inputes" placeholder="Введите название" value='${section.title}' oninput=" test = this.value;" onblur="editSection('${section.id}',test)">
              <div class="count"> ${section.tasks.length ? section.tasks.length : ''}</div>
               </div>
                <div class="toolbar">
                    <button title="Delete Section" class="delete" onclick="deleteSection('${section.id}')"></button>
                </div>
            </div>

                ${section.tasks.map(task => {
            return `
           
                    <div class="task" id="${task.id}" style = "background-color: ${task.color};" >
                        <div class="title-task" style="z-index:-1">
                            <input type="text" id="text" style = "background-color: ${task.color};" value= '${task.title}' oninput=" testT = this.value;" onblur="editTaskTitle('${section.id}','${task.id}',testT)">
                            
                            <div class="toolbar" style="z-index:1">
                                <button title="Delete Task" class="delete" onclick="deleteTask('${section.id}', '${task.id}')"></button>
                            </div>
                        </div>

                        <textarea id="description" style = "background-color: ${task.color};" oninput=" testDesc = this.value;" onblur="editTaskDesc('${section.id}','${task.id}',testDesc)">${task.description}</textarea>
                        
                        <input type="text" id="color" style = "background-color: ${task.color};"  value ='${task.color}' oninput=" testCol = this.value;" onblur="editTaskColor('${section.id}','${task.id}',testCol)">
                        <div id="${task.id}" section-id="${section.id}" style="text-align:center;font-size:25px" >... </div>
                    </div>   
                    `
        }).join("")}
            </div>
        </div>
        `;

    }).join("");

    // Update localStorage
    localStorage.setItem('kanban_sections', JSON.stringify(sections))
}
renderBoard();
function addSection() {
    let section = askInput(['title']);
    let RandId = Math.random()
    let SectionId = ("" + RandId).split(".")
    section.id = SectionId[1];
    section.tasks = [];

    sections.push(section);
    renderBoard();
}

function deleteSection(id) {
    sections = sections.filter(x => x.id != id);
    renderBoard();
}

function editSection(id, test) {
    let section = sections.find(x => x.id == id);
    section.title = test;
    renderBoard();
}
function addTask(id) {
    let section = sections.find(x => x.id == id);
    let task = askInput(['title', 'description', 'color']);

    // task.color = askInput(['color'])
    // console.log(task.color)
    let RandId = Math.random()
    let TaskId = ("" + RandId).split(".")
    task.id = TaskId[1];

    section.tasks.push(task);
    renderBoard();

}

function deleteTask(sectionId, taskId) {
    let section = sections.find(x => x.id == sectionId);
    section.tasks = section.tasks.filter(task => task.id != taskId);

    renderBoard();
}
function editTaskTitle(sectionId, taskId, test) {
    let section = sections.find(x => x.id == sectionId);
    let task = section.tasks.find(task => task.id == taskId);
    task.title = test
    // let updateTitle = prompt("Введите заголовок карточки", task.title)
    // let updateDescription = prompt("Введите описание карточки", task.description)
    // let updateColor = prompt("Введите цвет фона карточки", task.color)
    // task.title = updateTitle;
    // task.description = updateDescription;
    // task.color = updateColor;
    renderBoard();
}
function editTaskDesc(sectionId, taskId, test) {
    let section = sections.find(x => x.id == sectionId);
    let task = section.tasks.find(task => task.id == taskId);

    task.description = test
    renderBoard();
}


function editTaskColor(sectionId, taskId, test) {
    let section = sections.find(x => x.id == sectionId);
    let task = section.tasks.find(task => task.id == taskId);
    task.color = test
    renderBoard();
}
function askInput(input) {
    let result = {};
    input.forEach(item => {
        if (item == "description") {
            result[item] = prompt("Введите описание ")
        } else if (item == "title") {
            result[item] = prompt("Введите заголовок ")
        } else {
            result[item] = prompt("Введите цвет фона(Пример:blue)")
        }
    })
    return result;
}




// DRAG & DROP
let activeDrag = {};
let activeDragElement;
function mouseDown(event) {
    console.log(event);

    if (event.target.hasAttribute('id') && event.target.hasAttribute('section-id')) {
        activeDrag.task = event.target.getAttribute('id');
        activeDrag.section = event.target.getAttribute('section-id');

        activeDragElement = event.target.parentElement;
        activeDrag.width = activeDragElement.clientWidth;
        activeDrag.height = activeDragElement.clientHeight;
        activeDragElement.style.position = 'absolute';
        activeDragElement.style.width = activeDrag.width - 20 + 'px';

        mouseMove(event)

        document.addEventListener('mousemove', mouseMove)
        document.addEventListener('mouseup', mouseUp)
    }
}
document.addEventListener('mousedown', mouseDown);

function mouseMove(event) {

    activeDragElement.style.top = event.y + window.scrollY - activeDrag.height - 2 + "px";
    activeDragElement.style.left = event.x + window.scrollX - (activeDrag.width / 2) + "px";
}

function mouseUp(event) {
    console.log("Dropped", event);

    activeDragElement.style.position = 'initial';
    activeDragElement.style.top = 'unset';
    activeDragElement.style.left = 'unset';
    document.removeEventListener('mousemove', mouseMove);
    document.removeEventListener('mouseup', mouseUp);


    if (event.target.hasAttribute('section-id')) {
        console.log("Correct place");

        let section = sections.find(x => x.id == activeDrag.section);
        let task = section.tasks.find(x => x.id == activeDrag.task);

        section.tasks = section.tasks.filter(x => x.id != activeDrag.task)

        let dropSection = event.target.getAttribute('section-id');
        sections.find(x => x.id == dropSection).tasks.unshift(task)

        renderBoard();
    }
}
document.addEventListener('selectstart', e => { e.preventDefault() })