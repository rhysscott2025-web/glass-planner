import { useDroppable } from '@dnd-kit/core';
import { GlassCard } from '../GlassCard/GlassCard';
import type { Todo } from '../../hooks/useTodos';
import './TimeBlocker.css';

interface TimeBlockerProps {
    todos: Todo[];
}

const HOURS = Array.from({ length: 16 }, (_, i) => i + 5); // 5am to 8pm (last slot starts 20:45)
const INTERVALS = ['00', '15', '30', '45'];

export const TimeBlocker: React.FC<TimeBlockerProps> = ({ todos }) => {
    return (
        <GlassCard className="time-blocker-card">
            <h2 className="time-blocker-title">Day Schedule</h2>
            <div className="time-grid">
                {HOURS.map(hour => (
                    INTERVALS.map(min => {
                        const timeId = `${hour.toString().padStart(2, '0')}:${min}`;
                        const isHourStart = min === '00';
                        // Stop at 9pm (21:00)
                        if (hour === 21 && min !== '00') return null;

                        return (
                            <TimeSlot
                                key={timeId}
                                id={timeId}
                                label={isHourStart ? `${hour}:00` : ''}
                                todos={todos.filter(t => t.scheduledTime === timeId)}
                            />
                        );
                    })
                ))}
            </div>
        </GlassCard>
    );
};

const TimeSlot: React.FC<{ id: string, label: string, todos: Todo[] }> = ({ id, label, todos }) => {
    const { setNodeRef, isOver } = useDroppable({
        id: id,
        data: { type: 'time-slot', time: id }
    });

    return (
        <div ref={setNodeRef} className={`time-slot ${isOver ? 'highlight' : ''}`}>
            <div className="time-label">{label}</div>
            <div className="time-content">
                {todos.map(todo => (
                    <div key={todo.id} className="mini-todo">
                        {todo.text}
                        {todo.comment && (
                            <div className="todo-tooltip">
                                <strong>Note:</strong> {todo.comment}
                            </div>
                        )}
                    </div>
                ))}
            </div>
        </div>
    );
};
