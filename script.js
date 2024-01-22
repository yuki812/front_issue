document.addEventListener('DOMContentLoaded', function() {
    const todoForm = document.getElementById('todo-form');
    const newTodoInput = document.getElementById('new-todo');
    const deadlineInput = document.getElementById('deadline');
    const searchTodoInput = document.getElementById('search-todo');
    const todoList = document.getElementById('todo-list');

    let todos = JSON.parse(localStorage.getItem('todos')) || [];
    renderTodos(todos);

    todoForm.addEventListener('submit', function(event) {
        event.preventDefault();
        const newTodo = newTodoInput.value.trim();
        const deadline = deadlineInput.value;
        const addedDate = new Date().toLocaleDateString('ja-JP');
        if (newTodo) {
            const todoObject = { task: newTodo, addedDate, deadline };
            todos.push(todoObject);
            localStorage.setItem('todos', JSON.stringify(todos));
            addTodoElement(todoObject);
            newTodoInput.value = '';
            deadlineInput.value = '';
        }
    });

    searchTodoInput.addEventListener('input', function() {
        const filteredTodos = todos.filter(todoObject =>
            todoObject.task.toLowerCase().includes(searchTodoInput.value.toLowerCase()));
        renderTodos(filteredTodos);
    });

    function addTodoElement(todoObject) {
        const todoItem = document.createElement('li');
        todoItem.classList.add('list-group-item');
        todoItem.style.display = 'flex';
        todoItem.style.alignItems = 'center';
        todoItem.style.justifyContent = 'space-between';

        // テキストを含むspan要素を追加
        const todoText = document.createElement('span');
        todoText.textContent = todoObject.task;
        todoItem.appendChild(todoText);

        // 操作要素を格納するコンテナ
        const controlContainer = document.createElement('div');
        controlContainer.style.display = 'flex';
        controlContainer.style.alignItems = 'center';

        // 日時と期限を表示するための折りたたみ可能な要素
        const dateInfo = document.createElement('div');
        dateInfo.style.display = 'none'; // 初期状態では非表示
        dateInfo.innerHTML = `<small>追加日: ${todoObject.addedDate}</small><br><small>期限: ${todoObject.deadline}</small>`;
        controlContainer.appendChild(dateInfo);

        // 折りたたみ/展開を制御するボタン
        const toggleButton = document.createElement('button');
        toggleButton.textContent = '▼';
        toggleButton.classList.add('btn', 'btn-sm');
        toggleButton.onclick = function() {
            if (dateInfo.style.display === 'none') {
                dateInfo.style.display = 'block';
                toggleButton.textContent = '▲';
            } else {
                dateInfo.style.display = 'none';
                toggleButton.textContent = '▼';
            }
        };
        controlContainer.appendChild(toggleButton);

        // 消去ボタンを追加
        const deleteButton = document.createElement('button');
        deleteButton.textContent = '消去';
        deleteButton.classList.add('btn', 'btn-danger', 'btn-sm');
        deleteButton.onclick = function() {
            todos = todos.filter(t => t !== todoObject);
            localStorage.setItem('todos', JSON.stringify(todos));
            renderTodos(todos);
        };
        controlContainer.appendChild(deleteButton);

        // コントロールコンテナをリストアイテムに追加
        todoItem.appendChild(controlContainer);

        todoList.appendChild(todoItem);
    }

    function renderTodos(todos) {
        todoList.innerHTML = '';
        todos.forEach(addTodoElement);
    }
});
