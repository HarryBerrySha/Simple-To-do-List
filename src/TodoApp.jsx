import React, { useState, useEffect } from 'react';
import { Trash2, Plus, Calendar, AlertCircle } from 'lucide-react';

const TodoApp = () => {
    const [todos, setTodos] = useState([]);
    const [input, setInput] = useState('');
    const [deadline, setDeadline] = useState('');
    const [priority, setPriority] = useState('medium');
    const [filter, setFilter] = useState('all');

    const addTodo = () => {
        if (input.trim()) {
            const newTodo = {
                id: Date.now(),
                text: input,
                completed: false,
                deadline: deadline || null,
                priority: priority,
                createdAt: new Date().toISOString()
            };
            setTodos([newTodo, ...todos]);
            setInput('');
            setDeadline('');
            setPriority('medium');
        }
    };

    const deleteTodo = (id) => {
        setTodos(todos.filter(todo => todo.id !== id));
    };

    const toggleComplete = (id) => {
        setTodos(todos.map(todo =>
            todo.id === id ? { ...todo, completed: !todo.completed } : todo
        ));
    };

    const isOverdue = (deadline) => {
        if (!deadline) return false;
        return new Date(deadline) < new Date() && new Date(deadline).toDateString() !== new Date().toDateString();
    };

    const filteredTodos = todos.filter(todo => {
        if (filter === 'active') return !todo.completed;
        if (filter === 'completed') return todo.completed;
        return true;
    });

    const sortedTodos = [...filteredTodos].sort((a, b) => {
        const priorityOrder = { high: 0, medium: 1, low: 2 };
        return priorityOrder[a.priority] - priorityOrder[b.priority];
    });

    const getPriorityColor = (priority) => {
        switch (priority) {
            case 'high': return 'bg-red-100 text-red-800 border-red-300';
            case 'medium': return 'bg-yellow-100 text-yellow-800 border-yellow-300';
            case 'low': return 'bg-green-100 text-green-800 border-green-300';
            default: return 'bg-gray-100 text-gray-800 border-gray-300';
        }
    };

    const formatDate = (dateString) => {
        if (!dateString) return null;
        const date = new Date(dateString);
        return date.toLocaleDateString('en-US', { month: 'short', day: 'numeric', year: 'numeric' });
    };

    return (
        <div className="min-h-screen bg-gradient-to-br from-indigo-100 via-purple-50 to-pink-100">
            <div className="max-w-4xl mx-auto p-6">
                <div className="bg-white rounded-2xl shadow-2xl overflow-hidden">
                    {/* Header */}
                    <div className="bg-gradient-to-r from-indigo-600 to-purple-600 p-8 text-white">
                        <h1 className="text-4xl font-bold mb-2">My Tasks</h1>
                        {/* <p className="text-indigo-100">Stay organized and productive</p> */}
                    </div>

                    {/* Add Todo Form */}
                    <div className="p-6 bg-gray-50 border-b border-gray-200">
                        <div className="space-y-4">
                            <input
                                type="text"
                                value={input}
                                onChange={(e) => setInput(e.target.value)}
                                onKeyPress={(e) => e.key === 'Enter' && addTodo()}
                                placeholder="Task Description"
                                className="w-full px-4 py-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-indigo-500 focus:border-transparent outline-none text-lg"
                            />

                            <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
                                <div>
                                    <label className="block text-sm font-medium text-gray-700 mb-1">Deadline</label>
                                    <input
                                        type="date"
                                        value={deadline}
                                        onChange={(e) => setDeadline(e.target.value)}
                                        className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-indigo-500 focus:border-transparent outline-none"
                                    />
                                </div>

                                <div>
                                    <label className="block text-sm font-medium text-gray-700 mb-1">Priority</label>
                                    <select
                                        value={priority}
                                        onChange={(e) => setPriority(e.target.value)}
                                        className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-indigo-500 focus:border-transparent outline-none"
                                    >
                                        <option value="low">Low</option>
                                        <option value="medium">Medium</option>
                                        <option value="high">High</option>
                                    </select>
                                </div>

                                <div className="flex items-end">
                                    <button
                                        onClick={addTodo}
                                        className="w-full bg-indigo-600 hover:bg-indigo-700 text-white px-6 py-2 rounded-lg font-medium transition-colors duration-200 flex items-center justify-center gap-2"
                                    >
                                        <Plus size={20} />
                                        Add Task
                                    </button>
                                </div>
                            </div>
                        </div>
                    </div>

                    {/* Filter Tabs */}
                    <div className="flex gap-2 p-6 border-b border-gray-200">
                        {['all', 'active', 'completed'].map((f) => (
                            <button
                                key={f}
                                onClick={() => setFilter(f)}
                                className={`px-4 py-2 rounded-lg font-medium capitalize transition-colors duration-200 ${filter === f
                                    ? 'bg-indigo-600 text-white'
                                    : 'bg-gray-100 text-gray-700 hover:bg-gray-200'
                                    }`}
                            >
                                {f}
                            </button>
                        ))}
                        <div className="ml-auto text-sm text-gray-600 flex items-center">
                            {todos.filter(t => !t.completed).length} active tasks
                        </div>
                    </div>

                    {/* Todo List */}
                    <div className="p-6 max-h-96 overflow-y-auto">
                        {sortedTodos.length === 0 ? (
                            <div className="text-center py-12 text-gray-400">
                                <p className="text-lg">No tasks yet.</p>
                            </div>
                        ) : (
                            <div className="space-y-3">
                                {sortedTodos.map((todo) => (
                                    <div
                                        key={todo.id}
                                        className={`group bg-white border-2 rounded-xl p-4 transition-all duration-200 hover:shadow-md ${todo.completed ? 'border-gray-200 bg-gray-50' : 'border-gray-300'
                                            }`}
                                    >
                                        <div className="flex items-start gap-3">
                                            <input
                                                type="checkbox"
                                                checked={todo.completed}
                                                onChange={() => toggleComplete(todo.id)}
                                                className="mt-1 w-5 h-5 rounded border-gray-300 text-indigo-600 focus:ring-indigo-500 cursor-pointer"
                                            />

                                            <div className="flex-1 min-w-0">
                                                <p className={`text-lg ${todo.completed ? 'line-through text-gray-400' : 'text-gray-800'}`}>
                                                    {todo.text}
                                                </p>

                                                <div className="flex flex-wrap gap-2 mt-2">
                                                    <span className={`inline-flex items-center px-2 py-1 rounded-md text-xs font-medium border ${getPriorityColor(todo.priority)}`}>
                                                        {todo.priority.toUpperCase()}
                                                    </span>

                                                    {todo.deadline && (
                                                        <span className={`inline-flex items-center gap-1 px-2 py-1 rounded-md text-xs font-medium ${isOverdue(todo.deadline) && !todo.completed
                                                            ? 'bg-red-100 text-red-800 border border-red-300'
                                                            : 'bg-blue-100 text-blue-800 border border-blue-300'
                                                            }`}>
                                                            {isOverdue(todo.deadline) && !todo.completed && <AlertCircle size={12} />}
                                                            <Calendar size={12} />
                                                            {formatDate(todo.deadline)}
                                                        </span>
                                                    )}
                                                </div>
                                            </div>

                                            <button
                                                onClick={() => deleteTodo(todo.id)}
                                                className="opacity-0 group-hover:opacity-100 text-red-500 hover:text-red-700 hover:bg-red-50 p-2 rounded-lg transition-all duration-200"
                                            >
                                                <Trash2 size={20} />
                                            </button>
                                        </div>
                                    </div>
                                ))}
                            </div>
                        )}
                    </div>
                </div>
            </div>
        </div>
    );
};

export default TodoApp;