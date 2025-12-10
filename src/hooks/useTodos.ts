import { useState, useEffect } from 'react';
import {
    collection,
    onSnapshot,
    addDoc,
    deleteDoc,
    doc,
    updateDoc,
    query,
    orderBy
} from 'firebase/firestore';
import { db } from '../lib/firebase';
import { useAuth } from './useAuth';

export interface Todo {
    id: string;
    text: string;
    completed: boolean;
    createdAt: number;
    scheduledTime?: string; // Format: "HH:mm"
    comment?: string;
}

export const useTodos = () => {
    const [todos, setTodos] = useState<Todo[]>([]);
    const { user } = useAuth();

    useEffect(() => {
        if (!user) return; // Hook shouldn't really run if no user, but safe guard without state update

        const q = query(collection(db, `users/${user.uid}/todos`), orderBy('createdAt', 'desc'));

        const unsubscribe = onSnapshot(q, (snapshot) => {
            const newTodos = snapshot.docs.map(doc => ({
                id: doc.id,
                ...doc.data()
            } as Todo));
            setTodos(newTodos);
        });

        return () => unsubscribe();
    }, [user]);

    const addTodo = async (text: string) => {
        if (!user) return;
        try {
            await addDoc(collection(db, `users/${user.uid}/todos`), {
                text,
                completed: false,
                createdAt: Date.now()
            });
        } catch (error) {
            console.error("Error adding todo:", error);
        }
    };

    const toggleTodo = async (id: string) => {
        if (!user) return;
        const todo = todos.find(t => t.id === id);
        if (todo) {
            await updateDoc(doc(db, `users/${user.uid}/todos`, id), {
                completed: !todo.completed
            });
        }
    };

    const updateTodo = async (id: string, updates: Partial<Todo>) => {
        if (!user) return;
        // Optimistic update
        setTodos(prev => prev.map(t => t.id === id ? { ...t, ...updates } : t));

        await updateDoc(doc(db, `users/${user.uid}/todos`, id), updates);
    };

    const deleteTodo = async (id: string) => {
        if (!user) return;
        await deleteDoc(doc(db, `users/${user.uid}/todos`, id));
    };

    const reorderTodos = () => {
        // Drag reordering with Firestore sync requires a dedicated 'order' field and complex batching.
        // For this iteration, we accept local-only visual reorder or no reorder persistence.
        console.warn("Reordering not persisted in Firestore mode.");
    };

    return { todos, addTodo, toggleTodo, deleteTodo, reorderTodos, updateTodo };
};
