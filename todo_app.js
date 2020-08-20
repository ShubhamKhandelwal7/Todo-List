// JavaScript source code
/* global $, alert, document */

class User {
  constructor(username) {
    this.name = username;
    this.Todos = [];
  }
  incompleteTasks() {
    return this.Todos.filter(todo => todo.done === false).length;
  }
}

class ToDoApp {
  constructor(defaultSelectors, customSelectors) {
    var updatedSelectors = Object.assign({}, defaultSelectors, customSelectors);
    this.inputUserBtn = $(updatedSelectors.inputUserBtn);
    this.inputToDoBtn = $(updatedSelectors.inputToDoBtn);
    this.$addUserBtn = $(updatedSelectors.addUserBtn);
    this.$addTodoBtn = $(updatedSelectors.addTodoBtn);
    this.$userElements = $(updatedSelectors.userElements);
    this.$todoElements = $(updatedSelectors.todoElements);
    this.$userNameBox = $(updatedSelectors.userNameBox);
    this.$todoNameBox = $(updatedSelectors.todoNameBox);
    this.userContainer = updatedSelectors.userContainer;
    this.todoContainer = updatedSelectors.todoContainer;
    this.$userSelectBox = $(updatedSelectors.userSelectBox);
    this.users = [];
    this.$userElements.hide();
    this.$todoElements.hide();
  }

  init() {
    this.inputUserBtn.on("click", () => { this.$userElements.show(); });
    this.inputToDoBtn.on("click", () => {
      if (this.checkUserExist()) {
        this.$todoElements.show();
      } else {
        alert("Please add a user !!");
      }
    });
    const clickHandlerUser = () => {
      this.userAdd();
      this.$userElements.hide();
      this.$userNameBox.val("");
    };
    const clickHandlerTodo = () => {
      this.createTodo();
      this.$todoElements.hide();
      this.$todoNameBox.val("");
    };
    this.$addUserBtn.on("click", clickHandlerUser);
    this.$addTodoBtn.on("click", clickHandlerTodo);
  }

  bindChckboxes(todoObj, name) {
    $(this.addCheckboxDOM(name)).on("change", (event) => {
      if (event.target.checked) {
        this.taskDone($(event.target), todoObj);
      }
    });
  }

  checkUserExist() {
    return Object.keys(this.users).length;
  }

  userAdd() {
    let username = this.$userNameBox.val();
    if (username && !this.users[username]) {
      this.users[username] = new User(username);
      this.addUserDOM(username);
    } else {
      alert("Please enter correct and unique username");
    }
  }

  addUserDOM(username) {
    ToDoApp.htmlCreator("div", this.userContainer, username, username + " (" + this.users[username].incompleteTasks() + ")");
    ToDoApp.htmlCreator("option", this.$userSelectBox, username + "-opt", username);
  }

  createTodo() {
    var todoString = this.$todoNameBox.val();
    if (todoString) {
      var name = $("#added-users-name :selected").val();
      let todoObj = new Todo(name, todoString);
      this.bindChckboxes(todoObj, name);
      this.addTodoDOM(name, todoString);
      this.users[name].Todos.push(todoObj);
      this.updateCountDOM(name);
    } else {
      alert("Please add proper Todo.");
    }
  }

  addTodoDOM(name, todoString) {
    ToDoApp.htmlCreator("label", this.todoContainer, name + "lbl", todoString + " assigned by (" + name + ")", name);
  }

  addCheckboxDOM(name) {
    return $("<input type=checkbox />").appendTo(this.todoContainer).data("name", name);
  }

  taskDone($target, todoObj) {
    var name = $target.data("name");
    todoObj.done = true;
    $target.next().wrap("<strike>");
    this.updateCountDOM(name);
  }

  updateCountDOM(name) {
    $("#" + name).text(name + "(" + this.users[name].incompleteTasks() + ")");
  }

  static htmlCreator(tag, appendToName, idName, text, className) {
    $("<" + tag + ">").appendTo(appendToName).attr({ id: idName, class: className }).text(text);
    $("<br/>").appendTo(appendToName);
  }
}

class Todo {
  constructor(username, task) {
    this.task = task;
    this.username = username;
    this.done = false;
  }
}

$(document).ready(() => {
  var defaultSelectors = {
    inputUserBtn: "#input-user",
    inputToDoBtn: "#input-todo",
    userElements: "#user-create-form",
    todoElements: "#todo-create-form",
    userNameBox: "#user-name",
    todoNameBox: "#todo-name",
    addUserBtn: "#add-user",
    addTodoBtn: "#add-todo",
    userSelectBox: "#added-users-name",
    userContainer: "#users-list-container",
    todoContainer: "#todos-list-container"
  };
  var customSelectors = {};
  var taskManager = new ToDoApp(defaultSelectors, customSelectors);
  taskManager.init();
});
