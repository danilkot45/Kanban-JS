
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
                    <div class="task" id="${task.id}" style = "background-color: ${task.color};">
                    <i id="${task.id}" section-id="${section.id}"; onclick="openForm('${section.id}','${task.id}')"> 
                        <div class="title-task">
                            <div class="text" id="${task.id}" style="width:10px">${task.title}</div>

                        </div>

                        <div class="description">${task.description}</div>

                        </i>  
                        <div class="toolbar">
                        <button title="Delete Task" class="delete" onclick="deleteTask('${section.id}', '${task.id}')"></button>
                    </div>
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
function openForm(sectionId, taskId) {

    let section = sections.find(x => x.id == sectionId);
    let task = section.tasks.find(task => task.id == taskId);
    document.getElementById('blackfon').style.display = 'block';
    document.getElementById("myForm").style.display = "block";
    let Title = document.getElementById("title");
    let Description = document.getElementById("description");
    let Color = document.getElementById("color");
    Title.setAttribute("value", task.title);
    Description.setAttribute("value", task.description);
    Color.setAttribute("value", task.color);
    var button = document.querySelector('#btn');
    function LoadForm() {
        let t = document.getElementById("title").value;
        let d = document.getElementById("description").value
        let c = document.getElementById("color").value
        task.title = t;
        task.description = d;
        task.color = c;
        document.getElementById('blackfon').style.display = 'none';
        renderBoard();
    }
    button.addEventListener('click', LoadForm);
}
function closeForm() {
    document.getElementById("myForm").style.display = "none";
    document.getElementById('blackfon').style.display = 'none';
}

function addTask(id) {
    let section = sections.find(x => x.id == id);
    document.getElementById('blackfon').style.display = 'block';
    document.getElementById("myForm").style.display = "block";
    var button = document.querySelector('#btn');
    function CreateForm() {
        let t = document.getElementById("title").value;
        let d = document.getElementById("description").value
        let c = document.getElementById("color").value
        let task = { title: t, description: d, color: c }
        let RandId = Math.random()
        let TaskId = ("" + RandId).split(".")
        task.id = TaskId[1];

        section.tasks.push(task);
        document.getElementById('blackfon').style.display = 'none';
        renderBoard();
    }
    button.addEventListener('click', CreateForm);
    // task.color = askInput(['color'])
    // console.log(task.color)

}

function deleteTask(sectionId, taskId) {
    let section = sections.find(x => x.id == sectionId);

    section.tasks = section.tasks.filter(task => task.id != taskId);

    renderBoard();
}
function askInput(input) {
    let result = {};
    input.forEach(item => {
        if (item == "title") {
            result[item] = prompt("Введите заголовок ")
        }
    })
    return result;
}

/**
 * DRAG & DROP FEATURE
 */

let activeDrag = {};
let activeDragElement;
function mouseDown(event) {
    console.log(event);

    if (event.target.hasAttribute('id') && event.target.hasAttribute('section-id')) {
        activeDrag.task = event.target.getAttribute('id');
        activeDrag.section = event.target.getAttribute('section-id');

        activeDragElement = event.target.parentElement;
        activeDrag.width = activeDragElement.offsetWidth;
        activeDrag.height = activeDragElement.offsetHeight;
        activeDragElement.style.position = 'absolute';
        activeDragElement.style.width = activeDrag.width - 20 + 'px';

        mouseMove(event)

        // Прислушайтесь к движению мыши и наведите курсор вверх
        document.addEventListener('mousemove', mouseMove)
        document.addEventListener('mouseup', mouseUp)
    }
}
document.addEventListener('mousedown', mouseDown);

function mouseMove(event) {

    activeDragElement.style.top = event.y + window.scrollY - activeDrag.height - 10 + "px";
    activeDragElement.style.left = event.x + window.scrollX - (activeDrag.width / 2) + "px";
}

function mouseUp(event) {
    console.log("Dropped", event);

    activeDragElement.style.position = 'initial';
    activeDragElement.style.top = 'unset';
    activeDragElement.style.left = 'unset';
    document.removeEventListener('mousemove', mouseMove);
    // document.removeEventListener('mousedown', mouseDown);
    document.removeEventListener('mouseup', mouseUp);


    if (event.target.hasAttribute('section-id')) {
        console.log("Correct place");

        let section = sections.find(x => x.id == activeDrag.section);
        let task = section.tasks.find(x => x.id == activeDrag.task);

        // Remove from where drag started
        section.tasks = section.tasks.filter(x => x.id != activeDrag.task)

        // Add to where drag ended
        let dropSection = event.target.getAttribute('section-id');
        sections.find(x => x.id == dropSection).tasks.push(task)

        renderBoard();
    }
}

// Remove select listener
document.addEventListener('selectstart', e => { e.preventDefault() })