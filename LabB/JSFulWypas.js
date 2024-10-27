class Todo {
    constructor() {
        this.tasks = JSON.parse(localStorage.getItem('tasks')) || [];
        this.todoList = document.getElementById("todo-list");
        this.inputField = document.getElementById("todo-input");
        this.dateField = document.getElementById("date-input");
        this.addButton = document.getElementById("add-btn");
        this.clearButton = document.getElementById("clear-btn");
        this.deleteButton = document.getElementById("delete-btn");
        this.searchField = document.getElementById("search");

        this.term = '';

        this.searchField.addEventListener("input", () => this.searchTasks());
        this.addButton.addEventListener("click", () => this.addTask());
        this.clearButton.addEventListener("click", () => this.clearAll());
        this.deleteButton.addEventListener("click", () => this.deleteSelected());

        this.draw();
    }

    addTask() {
        const taskText = this.inputField.value.trim();
        const taskDate = this.dateField.value;
        const currentDate = new Date().toISOString().split("T")[0];

        if (taskText.length < 3 || taskText.length > 255) {
            alert("Task text must be between 3 and 255 characters.");
            return;
        }

        if (taskDate && taskDate <= currentDate) {
            alert("Date must be in the future.");
            return;
        }

        this.tasks.push({ text: taskText, date: taskDate, completed: false });
        this.inputField.value = "";
        this.dateField.value = "";
        this.saveTasks();
        this.draw();
    }

    removeTask(index) {
        this.tasks.splice(index, 1);
        this.saveTasks();
        this.draw();
    }

    clearAll() {
        this.tasks = [];
        this.saveTasks();
        this.draw();
    }

    deleteSelected() {
        this.tasks = this.tasks.filter(task => !task.completed);
        this.saveTasks();
        this.draw();
    }

    searchTasks() {
        this.term = this.searchField.value.trim().toLowerCase();
        this.draw();
    }

    get filteredTasks() {
        return this.tasks.filter(task => task.text.toLowerCase().includes(this.term));
    }

    draw() {
        this.todoList.innerHTML = "";
        this.filteredTasks.forEach((task, index) => {
            const listItem = document.createElement("li");

            let taskText = task.text;
            if (this.term && taskText.toLowerCase().includes(this.term)) {
                const startIndex = taskText.toLowerCase().indexOf(this.term);
                const endIndex = startIndex + this.term.length;

                const highlightedText = `
                    ${taskText.substring(0, startIndex)}
                    <span class="highlight">${taskText.substring(startIndex, endIndex)}</span>
                    ${taskText.substring(endIndex)}
                `;
                listItem.innerHTML = `${highlightedText} - ${task.date}`;
            } else {
                listItem.textContent = `${task.text} - ${task.date}`;
            }

            listItem.addEventListener("click", (e) => {
                e.stopPropagation();
                this.enableEditing(listItem, index);
            });

            const deleteTaskBtn = document.createElement("button");
            deleteTaskBtn.textContent = "Usuń";
            deleteTaskBtn.addEventListener("click", (e) => {
                e.stopPropagation();
                this.removeTask(index);
            });

            listItem.appendChild(deleteTaskBtn);
            this.todoList.appendChild(listItem);
        });
    }

    enableEditing(listItem, index) {
        const task = this.tasks[index];

        const input = document.createElement("input");
        const dateinput = document.createElement("input");
        input.type = "text";
        dateinput.type = "date";
        input.value = task.text;
        dateinput.value = task.date;
        input.classList.add("edit-input");

        listItem.innerHTML = "";
        listItem.appendChild(input);
        listItem.appendChild(dateinput);
        input.focus();


        const saveEdit = (e) => {
            if (e.target !== input && e.target !== dateinput) {
                task.text = input.value.trim() || task.text;
                task.date = dateinput.value || task.date;
                this.saveTasks();
                this.draw();
                document.removeEventListener("click", saveEdit);
            }
        };


        document.addEventListener("click", saveEdit);


        input.addEventListener("click", (e) => e.stopPropagation());
        dateinput.addEventListener("click", (e) => e.stopPropagation());
    }


    saveTasks() {
        localStorage.setItem('tasks', JSON.stringify(this.tasks));
    }
}

document.addEventListener("DOMContentLoaded", function () {
    new Todo();
});
