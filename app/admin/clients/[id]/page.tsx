'use client';

import { useEffect, useState, useCallback } from 'react';
import { useParams, useRouter } from 'next/navigation';
import { createClient } from '@/lib/supabase/client';
import Link from 'next/link';
import {
  ArrowLeft, Mail, Phone, Calendar, MessageSquare, CheckSquare,
  Plus, Check, Loader2, Trash2
} from 'lucide-react';

const STATUS_OPTIONS = [
  { value: 'new', label: 'New', color: 'bg-emerald-100 text-emerald-700 border-emerald-200' },
  { value: 'contacted', label: 'Contacted', color: 'bg-blue-100 text-blue-700 border-blue-200' },
  { value: 'active', label: 'Active', color: 'bg-amber-100 text-amber-700 border-amber-200' },
  { value: 'closed', label: 'Closed', color: 'bg-gray-100 text-gray-600 border-gray-200' },
];

type Lead = {
  id: string; first_name: string; last_name: string; email: string;
  phone: string | null; interest_type: string; message: string | null;
  status: string; created_at: string; updated_at: string;
};

type Note = {
  id: string; content: string; author_email: string; created_at: string;
};

type Task = {
  id: string; title: string; completed: boolean; due_date: string | null;
  created_at: string;
};

export default function ClientDetailPage() {
  const { id } = useParams<{ id: string }>();
  const router = useRouter();
  const supabase = createClient();

  const [lead, setLead] = useState<Lead | null>(null);
  const [notes, setNotes] = useState<Note[]>([]);
  const [tasks, setTasks] = useState<Task[]>([]);
  const [loading, setLoading] = useState(true);
  const [tab, setTab] = useState<'notes' | 'tasks'>('notes');

  // Note form
  const [newNote, setNewNote] = useState('');
  const [savingNote, setSavingNote] = useState(false);

  // Task form
  const [newTask, setNewTask] = useState('');
  const [newTaskDue, setNewTaskDue] = useState('');
  const [savingTask, setSavingTask] = useState(false);

  const fetchAll = useCallback(async () => {
    const [leadRes, notesRes, tasksRes] = await Promise.all([
      supabase.from('leads').select('*').eq('id', id).single(),
      supabase.from('notes').select('*').eq('lead_id', id).order('created_at', { ascending: false }),
      supabase.from('tasks').select('*').eq('lead_id', id).order('created_at', { ascending: false }),
    ]);
    setLead(leadRes.data);
    setNotes(notesRes.data || []);
    setTasks(tasksRes.data || []);
    setLoading(false);
  }, [id]);

  useEffect(() => { fetchAll(); }, [fetchAll]);

  async function updateStatus(newStatus: string) {
    if (!lead) return;
    setLead({ ...lead, status: newStatus }); // optimistic
    await supabase.from('leads').update({ status: newStatus }).eq('id', id);
  }

  async function addNote() {
    if (!newNote.trim()) return;
    setSavingNote(true);
    const { data: { user } } = await supabase.auth.getUser();
    const { data } = await supabase
      .from('notes')
      .insert({ lead_id: id, content: newNote.trim(), author_email: user?.email || '' })
      .select()
      .single();
    if (data) setNotes([data, ...notes]);
    setNewNote('');
    setSavingNote(false);
  }

  async function deleteNote(noteId: string) {
    setNotes(notes.filter((n) => n.id !== noteId));
    await supabase.from('notes').delete().eq('id', noteId);
  }

  async function addTask() {
    if (!newTask.trim()) return;
    setSavingTask(true);
    const { data } = await supabase
      .from('tasks')
      .insert({
        lead_id: id,
        title: newTask.trim(),
        due_date: newTaskDue || null,
      })
      .select()
      .single();
    if (data) setTasks([data, ...tasks]);
    setNewTask('');
    setNewTaskDue('');
    setSavingTask(false);
  }

  async function toggleTask(taskId: string, completed: boolean) {
    setTasks(tasks.map((t) => (t.id === taskId ? { ...t, completed } : t)));
    await supabase.from('tasks').update({ completed }).eq('id', taskId);
  }

  async function deleteTask(taskId: string) {
    setTasks(tasks.filter((t) => t.id !== taskId));
    await supabase.from('tasks').delete().eq('id', taskId);
  }

  if (loading) {
    return <div className="p-8 text-center text-brand-400">Loading...</div>;
  }

  if (!lead) {
    return <div className="p-8 text-center text-brand-400">Client not found</div>;
  }

  return (
    <div>
      {/* Back */}
      <Link href="/admin/clients" className="inline-flex items-center gap-1.5 text-sm text-brand-500 hover:text-brand-900 mb-4">
        <ArrowLeft className="h-4 w-4" /> Back to Clients
      </Link>

      {/* Header card */}
      <div className="bg-white rounded-xl border border-brand-100 p-6 mb-6">
        <div className="flex flex-col sm:flex-row sm:items-start sm:justify-between gap-4">
          <div>
            <h1 className="text-xl font-bold text-brand-900">
              {lead.first_name} {lead.last_name}
            </h1>
            <div className="flex flex-wrap items-center gap-3 mt-2 text-sm text-brand-500">
              <a href={`mailto:${lead.email}`} className="flex items-center gap-1.5 hover:text-accent-600">
                <Mail className="h-3.5 w-3.5" /> {lead.email}
              </a>
              {lead.phone && (
                <a href={`tel:${lead.phone}`} className="flex items-center gap-1.5 hover:text-accent-600">
                  <Phone className="h-3.5 w-3.5" /> {lead.phone}
                </a>
              )}
              <span className="flex items-center gap-1.5">
                <Calendar className="h-3.5 w-3.5" />
                {new Date(lead.created_at).toLocaleDateString()}
              </span>
            </div>
            <p className="text-sm text-brand-500 mt-1">Interest: <strong className="text-brand-700">{lead.interest_type}</strong></p>
            {lead.message && (
              <p className="text-sm text-brand-500 mt-2 bg-brand-50 rounded-lg p-3 italic">&ldquo;{lead.message}&rdquo;</p>
            )}
          </div>

          {/* Status dropdown */}
          <div>
            <label className="block text-xs font-medium text-brand-400 mb-1">Status</label>
            <select
              value={lead.status}
              onChange={(e) => updateStatus(e.target.value)}
              className={`px-3 py-2 rounded-lg border text-sm font-medium cursor-pointer ${
                STATUS_OPTIONS.find((s) => s.value === lead.status)?.color || ''
              }`}
            >
              {STATUS_OPTIONS.map((s) => (
                <option key={s.value} value={s.value}>{s.label}</option>
              ))}
            </select>
          </div>
        </div>
      </div>

      {/* Tabs */}
      <div className="flex gap-1 mb-4 bg-white rounded-lg p-1 border border-brand-100 w-fit">
        <button
          onClick={() => setTab('notes')}
          className={`flex items-center gap-2 px-4 py-2 rounded-md text-sm font-medium transition-colors ${
            tab === 'notes' ? 'bg-brand-900 text-white' : 'text-brand-600 hover:bg-brand-50'
          }`}
        >
          <MessageSquare className="h-4 w-4" /> Notes ({notes.length})
        </button>
        <button
          onClick={() => setTab('tasks')}
          className={`flex items-center gap-2 px-4 py-2 rounded-md text-sm font-medium transition-colors ${
            tab === 'tasks' ? 'bg-brand-900 text-white' : 'text-brand-600 hover:bg-brand-50'
          }`}
        >
          <CheckSquare className="h-4 w-4" /> Tasks ({tasks.filter((t) => !t.completed).length})
        </button>
      </div>

      {/* Notes tab */}
      {tab === 'notes' && (
        <div className="space-y-4">
          {/* Add note */}
          <div className="bg-white rounded-xl border border-brand-100 p-4">
            <textarea
              value={newNote}
              onChange={(e) => setNewNote(e.target.value)}
              placeholder="Add a note..."
              rows={3}
              className="w-full px-3 py-2 bg-brand-50 rounded-lg border border-brand-200 focus:border-accent-400 focus:ring-2 focus:ring-accent-100 outline-none transition resize-none text-brand-900 text-sm"
            />
            <div className="flex justify-end mt-2">
              <button
                onClick={addNote}
                disabled={!newNote.trim() || savingNote}
                className="inline-flex items-center gap-1.5 px-4 py-2 bg-brand-900 text-white text-sm font-medium rounded-lg hover:bg-brand-800 disabled:opacity-40 transition-colors"
              >
                {savingNote ? <Loader2 className="h-3.5 w-3.5 animate-spin" /> : <Plus className="h-3.5 w-3.5" />}
                Add Note
              </button>
            </div>
          </div>

          {/* Notes list */}
          {notes.map((note) => (
            <div key={note.id} className="bg-white rounded-xl border border-brand-100 p-4 group">
              <div className="flex items-start justify-between gap-2">
                <div className="flex-1">
                  <p className="text-sm text-brand-900 whitespace-pre-wrap">{note.content}</p>
                  <p className="text-xs text-brand-400 mt-2">
                    {note.author_email} · {new Date(note.created_at).toLocaleString()}
                  </p>
                </div>
                <button
                  onClick={() => deleteNote(note.id)}
                  className="opacity-0 group-hover:opacity-100 p-1 text-brand-400 hover:text-rose-500 transition-all"
                >
                  <Trash2 className="h-3.5 w-3.5" />
                </button>
              </div>
            </div>
          ))}
          {notes.length === 0 && (
            <p className="text-center text-brand-400 text-sm py-6">No notes yet</p>
          )}
        </div>
      )}

      {/* Tasks tab */}
      {tab === 'tasks' && (
        <div className="space-y-4">
          {/* Add task */}
          <div className="bg-white rounded-xl border border-brand-100 p-4">
            <div className="flex gap-2">
              <input
                value={newTask}
                onChange={(e) => setNewTask(e.target.value)}
                placeholder="New task..."
                className="flex-1 px-3 py-2 bg-brand-50 rounded-lg border border-brand-200 focus:border-accent-400 focus:ring-2 focus:ring-accent-100 outline-none transition text-brand-900 text-sm"
                onKeyDown={(e) => e.key === 'Enter' && addTask()}
              />
              <input
                type="date"
                value={newTaskDue}
                onChange={(e) => setNewTaskDue(e.target.value)}
                className="px-3 py-2 bg-brand-50 rounded-lg border border-brand-200 text-brand-600 text-sm"
              />
              <button
                onClick={addTask}
                disabled={!newTask.trim() || savingTask}
                className="inline-flex items-center gap-1.5 px-4 py-2 bg-brand-900 text-white text-sm font-medium rounded-lg hover:bg-brand-800 disabled:opacity-40 transition-colors"
              >
                {savingTask ? <Loader2 className="h-3.5 w-3.5 animate-spin" /> : <Plus className="h-3.5 w-3.5" />}
                Add
              </button>
            </div>
          </div>

          {/* Tasks list */}
          {tasks.map((task) => (
            <div key={task.id} className="bg-white rounded-xl border border-brand-100 p-4 group flex items-center gap-3">
              <button
                onClick={() => toggleTask(task.id, !task.completed)}
                className={`w-5 h-5 rounded border-2 flex items-center justify-center flex-shrink-0 transition-colors ${
                  task.completed
                    ? 'bg-accent-500 border-accent-500 text-white'
                    : 'border-brand-300 hover:border-accent-400'
                }`}
              >
                {task.completed && <Check className="h-3 w-3" />}
              </button>
              <div className="flex-1 min-w-0">
                <p className={`text-sm font-medium ${task.completed ? 'line-through text-brand-400' : 'text-brand-900'}`}>
                  {task.title}
                </p>
                {task.due_date && (
                  <p className={`text-xs mt-0.5 ${
                    !task.completed && new Date(task.due_date) < new Date()
                      ? 'text-rose-500 font-medium'
                      : 'text-brand-400'
                  }`}>
                    Due: {new Date(task.due_date).toLocaleDateString()}
                  </p>
                )}
              </div>
              <button
                onClick={() => deleteTask(task.id)}
                className="opacity-0 group-hover:opacity-100 p-1 text-brand-400 hover:text-rose-500 transition-all"
              >
                <Trash2 className="h-3.5 w-3.5" />
              </button>
            </div>
          ))}
          {tasks.length === 0 && (
            <p className="text-center text-brand-400 text-sm py-6">No tasks yet</p>
          )}
        </div>
      )}
    </div>
  );
}
