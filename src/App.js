import React, { Component } from "react";
import axios from 'axios';
import "./App.css";
import ListItem from './component/ListItem';

class App extends Component {
  constructor() {
    super();

    this.state = {
      newTodo: "",

      editingTodo: false,

      editingIndex:null,

      notification :null,

      todos: []
    };

    this.apiUrl ="https://5d39358ed8bb290014d28107.mockapi.io"

    this.changeHandler = this.changeHandler.bind(this);
    this.addTodo = this.addTodo.bind(this);
    this.deleteTodo = this.deleteTodo.bind(this);
    this.editTodo = this.editTodo.bind(this);
    this.updateTodo =this.updateTodo.bind(this);
    // this.generateTodo=this.generateTodo.bind(this);
    this.alert=this.alert.bind(this);
  }

async componentDidMount(){
  const response = await axios.get(`${this.apiUrl}/todos`);
  console.log(response);
  this.setState({
    todos: response.data
  });
}

  alert (notification){
    this.setState({
      notification
    });

  setTimeout(() => 
    {
      this.setState(
        {notification:null});
      
    }, 2000);



  }

  changeHandler(e) {
    this.setState({
      newTodo: e.target.value
    });
  }

  // generateTodo(){
  //   const lastTodo = this.state.todos[this.state.todos.length-1];
  //   if(lastTodo){
  //     return lastTodo.id + 1;
  //   }
  //    return 1
  // }

 async addTodo() {
    // const newTodo = {
    //   name: this.state.newTodo,
    //   id: this.generateTodo()
    // };

    const response = await axios.post(`${this.apiUrl}/todos`,{
      name : this.state.newTodo
    });
   

    const oldTodos = this.state.todos;

    oldTodos.push(response.data);

    this.setState({
      todos: oldTodos,
      newTodo: ""
    });

    this.alert('added successfully')
  }

  async deleteTodo(index) {
    const todos = this.state.todos;
    const todo = todos[index];

    await axios.delete(`${this.apiUrl}/todos/${todo.id}`);

    delete todos[index];

    this.setState({
      todos
    });
    this.alert('deleted successfully')
  }

  editTodo(index) {
    const todo = this.state.todos[index];
    this.setState({
      editingTodo: true,
      newTodo : todo.name,
      editingIndex :index
    });

  }

  async updateTodo() {
    const todo = this.state.todos[this.state.editingIndex];
    
    
    todo.name = this.state.newTodo;

    const response = await axios.put(`${this.apiUrl}/todos/${todo.id}`,{
      name : this.state.newTodo
    })
    
    const todos = this.state.todos;

    todos[this.state.editingIndex]= response.data;
    


    this.setState({
      todos,
      editingTodo: false,
      editingIndex:null,
      newTodo:""
    });
    this.alert("updated successfully")




  }

  render() {
    return (
      <div className="App">
        <div className="container">
          {
            this.state.notification &&
            <div className="alert mt-3 alert-success">
            {this.state.notification}
          </div>
          }
         
          <input
            className="form-control"
            type="text"
            placeholder="add new todo"
            name="todo"
            onChange={this.changeHandler}
            value={this.state.newTodo}
          />
          <button
            className="btn-info form-control mt-4"
            onClick={this.state.editingTodo ? this.updateTodo : this.addTodo}
          >
            {this.state.editingTodo ? "Update Todo" : "Add Todo"}
          </button>
          {!this.state.editingTodo && (
            <ul className="list-group">
              {this.state.todos.map((item, index) => {
                return (
                  <ListItem 
                    key={item.id}
                    item = {item}
                    editTodo = {()=>{this.editTodo(index);}}
                    deleteTodo = {()=>{this.deleteTodo(index);}}
                  />
                );
              })}
            </ul>
          )}
        </div>
      </div>
    );
  }
}

export default App;
