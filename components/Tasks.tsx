
import React, { useState } from 'react';
import { MOCK_TASKS } from '../constants';
import { Task } from '../types';
import { Search, Filter, Plus, Calendar, User, AlertCircle, CheckCircle, Clock, ArrowRight, Phone, Mail, FileText, MessageSquare } from 'lucide-react';

const Tasks: React.FC = () => {
  const [tasks, setTasks] = useState<Task[]>(MOCK_TASKS);
  const [filterStatus, setFilterStatus] = useState<'All' | 'Pending' | 'In Progress' | 'Completed'>('All');

  const getPriorityColor = (priority: string) => {
    switch (priority) {
      case 'High': return 'text-rose-600 bg-rose-50 border-rose-100';
      case 'Medium': return 'text-amber-600 bg-amber-50 border-amber-100';
      default: return 'text-emerald-600 bg-emerald-50 border-emerald-100';
    }
  };

  const getTypeIcon = (type: string) => {
    switch (type) {
      case 'Call': return <Phone className="w-3.5 h-3.5" />;
      case 'Email': return <Mail className="w-3.5 h-3.5" />;
      case 'Meeting': return <User className="w-3.5 h-3.5" />;
      case 'Follow-up': return <ArrowRight className="w-3.5 h-3.5" />;
      default: return <CheckCircle className="w-3.5 h-3.5" />;
    }
  };

  const filteredTasks = tasks.filter(t => filterStatus === 'All' || t.status === filterStatus);

  return (
    <div className="h-full bg-[#f8fafc] flex flex-col">
      {/* Header */}
      <div className="h-18 px-8 flex items-center justify-between bg-white border-b border-slate-200 shrink-0">
        <h2 className="text-lg font-bold text-slate-900">My Tasks</h2>
        <div className="flex items-center gap-3">
          <div className="relative group">
            <Search className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 text-slate-400 group-focus-within:text-cyan-600" />
            <input type="text" placeholder="Search tasks..." className="pl-10 pr-4 py-2 bg-slate-50 border-none rounded-lg text-sm focus:ring-2 focus:ring-cyan-500/20 w-64" />
          </div>
          <button className="flex items-center gap-2 px-4 py-2 bg-slate-900 text-white rounded-lg text-sm font-bold hover:bg-slate-800 shadow-lg shadow-slate-900/10">
            <Plus className="w-4 h-4" /> Create Task
          </button>
        </div>
      </div>

      {/* Toolbar */}
      <div className="px-8 py-4 flex items-center gap-4">
        <div className="flex p-1 bg-slate-200/50 rounded-lg">
          {['All', 'Pending', 'In Progress', 'Completed'].map((status) => (
            <button
              key={status}
              onClick={() => setFilterStatus(status as any)}
              className={`px-4 py-1.5 rounded-md text-sm font-medium transition-all
                ${filterStatus === status ? 'bg-white text-slate-900 shadow-sm' : 'text-slate-500 hover:text-slate-700'}
              `}
            >
              {status}
            </button>
          ))}
        </div>
      </div>

      {/* Task List */}
      <div className="flex-1 overflow-y-auto custom-scrollbar p-8 pt-0">
        <div className="bg-white rounded-2xl border border-slate-200 shadow-sm overflow-hidden">
          <table className="w-full">
            <thead className="bg-slate-50 border-b border-slate-200">
              <tr>
                <th className="text-left py-4 px-6 text-xs font-bold text-slate-500 uppercase tracking-wider w-10">
                  <input type="checkbox" className="rounded border-slate-300 text-cyan-600 focus:ring-cyan-500" />
                </th>
                <th className="text-left py-4 px-6 text-xs font-bold text-slate-500 uppercase tracking-wider">Task</th>
                <th className="text-left py-4 px-6 text-xs font-bold text-slate-500 uppercase tracking-wider">Related To</th>
                <th className="text-left py-4 px-6 text-xs font-bold text-slate-500 uppercase tracking-wider">Due Date</th>
                <th className="text-left py-4 px-6 text-xs font-bold text-slate-500 uppercase tracking-wider">Priority</th>
                <th className="text-left py-4 px-6 text-xs font-bold text-slate-500 uppercase tracking-wider">Assignee</th>
                <th className="text-left py-4 px-6 text-xs font-bold text-slate-500 uppercase tracking-wider">Status</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-slate-100">
              {filteredTasks.map(task => (
                <tr key={task.id} className="hover:bg-slate-50 transition-colors group cursor-pointer">
                  <td className="py-4 px-6">
                    <input type="checkbox" className="rounded border-slate-300 text-cyan-600 focus:ring-cyan-500" />
                  </td>
                  <td className="py-4 px-6">
                    <div className="flex items-center gap-3">
                      <div className={`w-8 h-8 rounded-lg flex items-center justify-center bg-slate-100 text-slate-500`}>
                        {getTypeIcon(task.type)}
                      </div>
                      <div>
                        <div className="font-bold text-sm text-slate-900">{task.title}</div>
                        <div className="text-xs text-slate-400">{task.type}</div>
                      </div>
                    </div>
                  </td>
                  <td className="py-4 px-6">
                    {task.relatedTo ? (
                      <span className="inline-flex items-center gap-1.5 px-2.5 py-1 rounded-md border border-slate-200 bg-white text-xs font-medium text-slate-600">
                        {task.relatedTo.type === 'Property' ? <FileText className="w-3 h-3" /> : <User className="w-3 h-3" />}
                        {task.relatedTo.label}
                      </span>
                    ) : (
                      <span className="text-slate-400 text-xs">-</span>
                    )}
                  </td>
                  <td className="py-4 px-6">
                    <div className={`flex items-center gap-1.5 text-sm font-medium
                      ${task.status === 'Overdue' ? 'text-rose-600' : 'text-slate-600'}
                    `}>
                      <Calendar className="w-3.5 h-3.5" />
                      {task.dueDate}
                    </div>
                  </td>
                  <td className="py-4 px-6">
                    <span className={`px-2.5 py-0.5 rounded-full text-[10px] font-bold uppercase tracking-wide border ${getPriorityColor(task.priority)}`}>
                      {task.priority}
                    </span>
                  </td>
                  <td className="py-4 px-6">
                    <div className="flex items-center gap-2">
                      <div className="w-6 h-6 rounded-full bg-indigo-100 text-indigo-600 flex items-center justify-center text-[10px] font-bold">
                        {task.assignee.split(' ').map(n => n[0]).join('')}
                      </div>
                      <span className="text-sm text-slate-600">{task.assignee}</span>
                    </div>
                  </td>
                  <td className="py-4 px-6">
                    <span className={`text-xs font-bold
                      ${task.status === 'Completed' ? 'text-emerald-600' : 
                        task.status === 'Overdue' ? 'text-rose-600' : 
                        task.status === 'In Progress' ? 'text-blue-600' : 'text-slate-500'}
                    `}>
                      {task.status}
                    </span>
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      </div>
    </div>
  );
};

export default Tasks;
