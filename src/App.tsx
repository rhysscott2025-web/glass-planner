import {
  DndContext,
  DragOverlay,
  PointerSensor,
  useSensor,
  useSensors,
  type DragEndEvent,
  type DragStartEvent,
} from '@dnd-kit/core';
import { useState } from 'react';
import { Layout } from './components/Layout/Layout';
import { TodoList } from './components/TodoList/TodoList';
import { PomodoroTimer } from './components/PomodoroTimer/PomodoroTimer';
import { LandingPage } from './components/LandingPage/LandingPage';
import { MusicPlayer } from './components/MusicPlayer/MusicPlayer';
import { TimeBlocker } from './components/TimeBlocker/TimeBlocker';
import { useAuth } from './hooks/useAuth';
import { useTodos } from './hooks/useTodos';
import { TodoItem } from './components/TodoItem/TodoItem';
import './App.css';

function App() {
  const { user, userName, login, loading } = useAuth();
  const { todos, updateTodo } = useTodos();
  const [activeId, setActiveId] = useState<string | null>(null);

  const sensors = useSensors(
    useSensor(PointerSensor, {
      activationConstraint: {
        distance: 8,
      },
    })
  );

  const handleDragStart = (event: DragStartEvent) => {
    setActiveId(event.active.id as string);
  };

  const handleDragEnd = (event: DragEndEvent) => {
    const { active, over } = event;
    setActiveId(null);

    if (over && over.data.current?.type === 'time-slot') {
      const time = over.data.current.time;
      if (time) {
        updateTodo(active.id as string, { scheduledTime: time });
      }
    }
  };

  if (loading) return <div className="loading-screen">Loading...</div>;

  if (!user) {
    return <LandingPage onLogin={login} />;
  }

  const activeTodo = activeId ? todos.find(t => t.id === activeId) : null;

  return (
    <DndContext sensors={sensors} onDragStart={handleDragStart} onDragEnd={handleDragEnd}>
      <Layout>
        <div className="left-column">
          <header className="app-header">
            <h1>Glass Planner</h1>
            <p className="app-subtitle">Welcome back, {userName}</p>
          </header>
          <PomodoroTimer />
          <TodoList />
        </div>
        <div className="right-column">
          <MusicPlayer />
          <TimeBlocker todos={todos} />
        </div>
      </Layout>
      <DragOverlay>
        {activeTodo ? <TodoItem todo={activeTodo} onToggle={() => { }} onDelete={() => { }} onUpdate={() => { }} /> : null}
      </DragOverlay>
    </DndContext>
  );
}

export default App;
