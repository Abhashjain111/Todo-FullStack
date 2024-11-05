import { createSlice, PayloadAction, createAsyncThunk } from '@reduxjs/toolkit';
import axios from 'axios';
import { v4 as uuidv4 } from 'uuid'; // Import uuid for unique ID generation

export interface Todo {
    id: string; // ID is a string for UUID
    title: string;
    completed: boolean;
}

interface TodoState {
    todos: Todo[];
}

const initialState: TodoState = {
    todos: [],
};

// Async Actions
export const addTodoAsync = createAsyncThunk<Todo, Omit<Todo, 'id'>>(
    'todos/addTodo',
    async (newTodo) => {
        const response = await axios.post('http://localhost:5000/todos', newTodo);
        return response.data; // Ensure response data matches Todo interface
    }
);

export const toggleTodoAsync = createAsyncThunk<Todo, string>(
    'todos/toggleTodo',
    async (id, { getState }) => {
        const state = getState() as { todo: TodoState };
        const todo = state.todo.todos.find(todo => todo.id === id);

        if (!todo) {
            throw new Error('Todo not found');
        }

        const response = await axios.patch(`http://localhost:5000/todos/${id}`, { completed: !todo.completed });
        return response.data; // Ensure response data matches Todo interface
    }
);

export const removeTodoAsync = createAsyncThunk<string, string>(
    'todos/removeTodo',
    async (id) => {
        await axios.delete(`http://localhost:5000/todos/${id}`);
        return id; // Return the ID of the removed todo
    }
);

// Slice
const todoSlice = createSlice({
    name: 'todos',
    initialState,
    reducers: {
        addTodo: (state, action: PayloadAction<Omit<Todo, 'id'>>) => {
            const newTodo = { ...action.payload, id: uuidv4() }; // Generate a unique ID
            state.todos.push(newTodo);
        },
        toggleTodo: (state, action: PayloadAction<string>) => {
            const todo = state.todos.find(todo => todo.id === action.payload);
            if (todo) {
                todo.completed = !todo.completed;
            }
        },
        removeTodo: (state, action: PayloadAction<string>) => {
            state.todos = state.todos.filter(todo => todo.id !== action.payload);
        },
    },
    extraReducers: (builder) => {
        builder
            .addCase(addTodoAsync.fulfilled, (state, action) => {
                state.todos.push(action.payload); // Add the todo from API response
            })
            .addCase(toggleTodoAsync.fulfilled, (state, action) => {
                const index = state.todos.findIndex(todo => todo.id === action.payload.id);
                if (index !== -1) {
                    state.todos[index] = action.payload; // Update the todo with the API response
                }
            })
            .addCase(removeTodoAsync.fulfilled, (state, action) => {
                state.todos = state.todos.filter(todo => todo.id !== action.payload); // Remove the todo by ID
            });
    },
});

export const { addTodo, toggleTodo, removeTodo } = todoSlice.actions;
export default todoSlice.reducer;
