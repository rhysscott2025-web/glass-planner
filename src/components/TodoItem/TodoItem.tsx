import React, { useState } from 'react';
import { useSortable } from '@dnd-kit/sortable';
import { CSS } from '@dnd-kit/utilities';
import { Check, Trash2, GripVertical, MessageSquare } from 'lucide-react';
import { clsx } from 'clsx';
import type { Todo } from '../../hooks/useTodos';
import './TodoItem.css';

interface TodoItemProps {
    todo: Todo;
    onToggle: (id: string) => void;
    onDelete: (id: string) => void;
    onUpdate: (id: string, updates: Partial<Todo>) => void;
}

export const TodoItem: React.FC<TodoItemProps> = ({ todo, onToggle, onDelete, onUpdate }) => {
    const [isExpanded, setIsExpanded] = useState(false);
    const {
        attributes,
        listeners,
        setNodeRef,
        transform,
        transition,
        isDragging,
    } = useSortable({ id: todo.id });

    const style = {
        transform: CSS.Transform.toString(transform),
        transition,
        opacity: isDragging ? 0.5 : 1,
    };

    const handleCommentChange = (e: React.ChangeEvent<HTMLTextAreaElement>) => {
        onUpdate(todo.id, { comment: e.target.value });
    };

    return (
        <div
            ref={setNodeRef}
            style={style}
            className={clsx('todo-item-wrapper', { 'is-expanded': isExpanded })}
        >
            <div className={clsx('todo-item', { 'todo-item--completed': todo.completed })}>
                <div className="todo-drag-handle" {...attributes} {...listeners}>
                    <GripVertical size={16} />
                </div>

                <button
                    className={clsx('todo-checkbox', { 'todo-checkbox--checked': todo.completed })}
                    onClick={() => onToggle(todo.id)}
                >
                    {todo.completed && <Check size={14} />}
                </button>

                <span className="todo-text">{todo.text}</span>

                <button
                    className={clsx("todo-action-btn", { 'active': isExpanded || !!todo.comment })}
                    onClick={() => setIsExpanded(!isExpanded)}
                    title="Add comment"
                >
                    <MessageSquare size={16} />
                </button>

                <button className="todo-action-btn delete-btn" onClick={() => onDelete(todo.id)}>
                    <Trash2 size={16} />
                </button>
            </div>

            {isExpanded && (
                <div className="todo-details">
                    <textarea
                        className="todo-comment-input"
                        placeholder="Add details or notes..."
                        value={todo.comment || ''}
                        onChange={handleCommentChange}
                        rows={3}
                    />
                </div>
            )}
        </div>
    );
};
