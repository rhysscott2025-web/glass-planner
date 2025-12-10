import React, { useState } from 'react';
import {
    SortableContext,
    verticalListSortingStrategy,
} from '@dnd-kit/sortable';
import { Plus } from 'lucide-react';
import { useTodos } from '../../hooks/useTodos';
import { TodoItem } from '../TodoItem/TodoItem';
import { GlassCard } from '../GlassCard/GlassCard';
import './TodoList.css';

export const TodoList: React.FC = () => {
    // Note: We use useTodos only for data here, but drag handlers are now in App
    const { todos, addTodo, toggleTodo, deleteTodo, updateTodo } = useTodos();
    const [inputValue, setInputValue] = useState('');

    const handleSubmit = (e: React.FormEvent) => {
        e.preventDefault();
        if (inputValue.trim()) {
            addTodo(inputValue.trim());
            setInputValue('');
        }
    };

    // Filter out generic todos (un-scheduled) or show all? 
    // Standard approach: Show all in list, but maybe indicate if scheduled.
    // For now: Just show all.

    return (
        <div className="todo-container">
            <GlassCard className="todo-input-card">
                <form onSubmit={handleSubmit} className="todo-form">
                    <input
                        type="text"
                        className="todo-input"
                        placeholder="What needs to be done?"
                        value={inputValue}
                        onChange={(e) => setInputValue(e.target.value)}
                    />
                    <button type="submit" className="todo-add-btn">
                        <Plus size={20} />
                    </button>
                </form>
            </GlassCard>

            <div className="todo-list-wrapper">
                <SortableContext
                    items={todos}
                    strategy={verticalListSortingStrategy}
                >
                    {todos.map((todo) => (
                        <TodoItem
                            key={todo.id}
                            todo={todo}
                            onToggle={toggleTodo}
                            onDelete={deleteTodo}
                            onUpdate={updateTodo}
                        />
                    ))}
                </SortableContext>

                {todos.length === 0 && (
                    <div className="empty-state">
                        <p>No tasks yet. Add one to get started!</p>
                    </div>
                )}
            </div>
        </div>
    );
};
