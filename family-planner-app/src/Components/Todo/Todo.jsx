import { useState, useEffect } from "react";
import { supabase } from "../../Config/supabaseClient";
import { useAuth } from "../../Hooks/useAuth";
import TextField from "@mui/material/TextField";
import Button from "@mui/material/Button";
import TodoList from "./TodoList";
import noTodoImg from "../../Images/todo/noTodos.jpg";

const Todo = () => {
  const [name, setName] = useState("");
  const [todos, setTodos] = useState([]);
  const { user } = useAuth();

  useEffect(() => {
    getTodos();
  });

  const getTodos = async () => {
    try {
      const { data, error } = await supabase
        .from("todoList")
        .select("*")
        .eq("user_id", user.id);

      if (error) throw error;
      if (data !== null) {
        setTodos(data);
      }
    } catch (error) {
      console.log(error.message);
    }
  };

  const addTodo = async (event) => {
    event.preventDefault();

    try {
      const { error } = await supabase
        .from("todoList")
        .insert({
          task: name,
          user_id: user.id,
        })
        .single();

      if (error) throw error;
      window.location.reload();
    } catch (error) {
      console.log(error.message);
    }
  };

  return (
    <div className="mt-20 mb-10 flex flex-col justify-center items-center">
      <h2 className="text-xl font-bold text-center">To-dos</h2>

      <div className="mt-10 w-full flex justify-center">
        <form className="flex w-4/5 max-w-2xl" onSubmit={addTodo}>
          <TextField
            size="medium"
            placeholder="Add something to do..."
            sx={{ width: "80%" }}
            autoComplete="off"
            onChange={(e) => setName(e.target.value)}
          />
          <Button variant="contained" sx={{ width: "20%" }} type="submit">
            Add
          </Button>
        </form>
      </div>

      {todos.length === 0 ? (
        <div className="w-4/5 max-w-2xl">
          <img src={noTodoImg} alt="No Todos" />
        </div>
      ) : (
        <div className="mt-10 w-full flex flex-col justify-center items-center">
          {todos.map((todo) => (
            <TodoList key={todo.id} todo={todo} />
          ))}
        </div>
      )}
    </div>
  );
};

export default Todo;
