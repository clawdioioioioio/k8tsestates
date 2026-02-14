'use client';

import { useEffect, useState, useCallback } from 'react';
import { useParams } from 'next/navigation';
import { createClient } from '@/lib/supabase/client';
import Link from 'next/link';
import {
  ArrowLeft, Mail, Phone, Calendar, MessageSquare, CheckSquare,
  Plus, Check, Loader2, Trash2, ChevronDown, ChevronUp, FileText
} from 'lucide-react';

const STATUS_OPTIONS = [
  { value: 'new', label: 'New', color: 'bg-emerald-100 text-emerald-700 border-emerald-200' },
  { value: 'contacted', label: 'Contacted', color: 'bg-blue-100 text-blue-700 border-blue-200' },
  { value: 'active', label: 'Active', color: 'bg-amber-100 text-amber-700 border-amber-200' },
  { value: 'closed_won', label: 'Closed (Won)', color: 'bg-green-100 text-green-700 border-green-200' },
  { value: 'closed_lost', label: 'Closed (Lost)', color: 'bg-gray-100 text-gray-600 border-gray-200' },
];

type Client = {
  id: string; first_name: string; last_name: string; email: string;
  phone: string | null; created_at: string; updated_at: string;
};
type Inquiry = {
  id: string; client_id: string; interest_type: string; message: string | null;
  status: string; created_at: string; updated_at: string;
};
type Note = {
  id: string; client_id: string | null; inquiry_id: string | null;
  content: string; created_by: string | null; created_at: string;
};
type Task = {
  id: string; client_id: string | null; inquiry_id: string | null;
  title: string; description: string | null; completed: boolean;
  due_date: string | null; completed_at: string | null; created_at: string;
};

export default function ClientDetailPage() {
  const { id } = useParams<{ id: string }>();
  const supabase = createClient();

  const [client, setClient] = useState<Client | null>(null);
  const [inquiries, setInquiries] = useState<Inquiry[]>([]);
  const [notes, setNotes] = useState<Note[]>([]);
  const [tasks, setTasks] = useState<Task[]>([]);
  const [loading, setLoading] = useState(true);
  const [expandedInquiry, setExpandedInquiry] = useState<string | null>(null);

  // Client-level note form
  const [newClientNote, setNewClientNote] = useState('');
  const [savingClientNote, setSavingClientNote] = useState(false);

  // Inquiry-level note form (keyed by inquiry id)
  const [newInqNote, setNewInqNote] = useState<Record<string, string>>({});
  const [savingInqNote, setSavingInqNote] = useState<Record<string, boolean>>({});

  // Task form (keyed: 'client' or inquiry id)
  const [newTask, setNewTask] = useState<Record<string, string>>({});
  const [newTaskDue, setNewTaskDue] = useState<Record<string, string>>({});
  const [savingTask, setSavingTask] = useState<Record<string, boolean>>({});

  const [tab, setTab] = useState<'inquiries' | 'notes' | 'tasks'>('inquiries');

  const fetchAll = useCallback(async () => {
    const [clientRes, inqRes, notesRes, tasksRes] = await Promise.all([
      supabase.from('clients').select('*').eq('id', id).single(),
      supabase.from('inquiries').select('*').eq('client_id', id).order('created_at', { ascending: false }),
      supabase.from('notes').select('*').eq('client_id', id).order('created_at', { ascending: false }),
      supabase.from('tasks').select('*').eq('client_id', id).order('created_at', { ascending: false }),
    ]);
    setClient(clientRes.data);
    setInquiries(inqRes.data || []);
    setNotes(notesRes.data || []);
    setTasks(tasksRes.data || []);
    setLoading(false);
  }, [id]);

  useEffect(() => { fetchAll(); }, [fetchAll]);

  // --- Inquiry status ---
  async function updateInquiryStatus(inqId: string, newStatus: string) {
    setInquiries(inquiries.map((i) => i.id === inqId ? { ...i, status: newStatus } : i));
    await supabase.from('inquiries').update({ status: newStatus }).eq('id', inqId);
  }

  // --- Client-level notes ---
  async function addClientNote() {
    if (!newClientNote.trim()) return;
    setSavingClientNote(true);
    const { data: { user } } = await supabase.auth.getUser();
    const { data } = await supabase
      .from('notes')
      .insert({ client_id: id, content: newClientNote.trim(), created_by: user?.id || null })
      .select()
      .single();
    if (data) setNotes([data, ...notes]);
    setNewClientNote('');
    setSavingClientNote(false);
  }

  // --- Inquiry-level notes ---
  async function addInquiryNote(inqId: string) {
    const text = newInqNote[inqId]?.trim();
    if (!text) return;
    setSavingInqNote({ ...savingInqNote, [inqId]: true });
    const { data: { user } } = await supabase.auth.getUser();
    const { data } = await supabase
      .from('notes')
      .insert({ client_id: id, inquiry_id: inqId, content: text, created_by: user?.id || null })
      .select()
      .single();
    if (data) setNotes([data, ...notes]);
    setNewInqNote({ ...newInqNote, [inqId]: '' });
    setSavingInqNote({ ...savingInqNote, [inqId]: false });
  }

  async function deleteNote(noteId: string) {
    setNotes(notes.filter((n) => n.id !== noteId));
    await supabase.from('notes').delete().eq('id', noteId);
  }

  // --- Tasks ---
  async function addTaskFor(scope: string, inqId?: string) {
    const key = inqId || 'client';
    const title = newTask[key]?.trim();
    if (!title) return;
    setSavingTask({ ...savingTask, [key]: true });
    const { data: { user } } = await supabase.auth.getUser();
    const { data } = await supabase
      .from('tasks')
      .insert({
        client_id: id,
        inquiry_id: inqId || null,
        title,
        due_date: newTaskDue[key] || null,
        created_by: user?.id || null,
      })
      .select()
      .single();
    if (data) setTasks([data, ...tasks]);
    setNewTask({ ...newTask, [key]: '' });
    setNewTaskDue({ ...newTaskDue, [key]: '' });
    setSavingTask({ ...savingTask, [key]: false });
  }

  async function toggleTask(taskId: string, completed: boolean) {
    setTasks(tasks.map((t) => t.id === taskId ? { ...t, completed, completed_at: completed ? new Date().toISOString() : null } : t));
    await supabase.from('tasks').update({ completed, completed_at: completed ? new Date().toISOString() : null }).eq('id', taskId);
  }

  async function deleteTask(taskId: string) {
    setTasks(tasks.filter((t) => t.id !== taskId));
    await supabase.from('tasks').delete().eq('id', taskId);
  }

  // --- Helpers ---
  const clientNotes = notes.filter((n) => !n.inquiry_id);
  const clientTasks = tasks.filter((t) => !t.inquiry_id);
  const inquiryNotes = (inqId: string) => notes.filter((n) => n.inquiry_id === inqId);
  const inquiryTasks = (inqId: string) => tasks.filter((t) => t.inquiry_id === inqId);
  const statusConfig = (s: string) => STATUS_OPTIONS.find((o) => o.value === s);

  if (loading) return <div className="p-8 text-center text-brand-400">Loading...</div>;
  if (!client) return <div className="p-8 text-center text-brand-400">Client not found</div>;

  return (
    <div>
      <Link href="/admin/clients" className="inline-flex items-center gap-1.5 text-sm text-brand-500 hover:text-brand-900 mb-4">
        <ArrowLeft className="h-4 w-4" /> Back to Clients
      </Link>

      {/* Client header */}
      <div className="bg-white rounded-xl border border-brand-100 p-6 mb-6">
        <h1 className="text-xl font-bold text-brand-900">{client.first_name} {client.last_name}</h1>
        <div className="flex flex-wrap items-center gap-3 mt-2 text-sm text-brand-500">
          <a href={`mailto:${client.email}`} className="flex items-center gap-1.5 hover:text-accent-600">
            <Mail className="h-3.5 w-3.5" /> {client.email}
          </a>
          {client.phone && (
            <a href={`tel:${client.phone}`} className="flex items-center gap-1.5 hover:text-accent-600">
              <Phone className="h-3.5 w-3.5" /> {client.phone}
            </a>
          )}
          <span className="flex items-center gap-1.5">
            <Calendar className="h-3.5 w-3.5" />
            Member since {new Date(client.created_at).toLocaleDateString()}
          </span>
        </div>
        <p className="text-sm text-brand-400 mt-1">{inquiries.length} inquir{inquiries.length === 1 ? 'y' : 'ies'}</p>
      </div>

      {/* Tabs */}
      <div className="flex gap-1 mb-4 bg-white rounded-lg p-1 border border-brand-100 w-fit">
        {([
          { key: 'inquiries', label: 'Inquiries', icon: FileText, count: inquiries.length },
          { key: 'notes', label: 'Notes', icon: MessageSquare, count: clientNotes.length },
          { key: 'tasks', label: 'Tasks', icon: CheckSquare, count: clientTasks.filter((t) => !t.completed).length },
        ] as const).map(({ key, label, icon: Icon, count }) => (
          <button
            key={key}
            onClick={() => setTab(key)}
            className={`flex items-center gap-2 px-4 py-2 rounded-md text-sm font-medium transition-colors ${
              tab === key ? 'bg-brand-900 text-white' : 'text-brand-600 hover:bg-brand-50'
            }`}
          >
            <Icon className="h-4 w-4" /> {label} ({count})
          </button>
        ))}
      </div>

      {/* Inquiries tab */}
      {tab === 'inquiries' && (
        <div className="space-y-4">
          {inquiries.length === 0 && <p className="text-center text-brand-400 text-sm py-6">No inquiries yet</p>}
          {inquiries.map((inq) => {
            const expanded = expandedInquiry === inq.id;
            const sc = statusConfig(inq.status);
            const inqNotes = inquiryNotes(inq.id);
            const inqTasks = inquiryTasks(inq.id);
            return (
              <div key={inq.id} className="bg-white rounded-xl border border-brand-100 overflow-hidden">
                {/* Inquiry header */}
                <div
                  className="flex items-center justify-between px-5 py-4 cursor-pointer hover:bg-brand-50/50 transition-colors"
                  onClick={() => setExpandedInquiry(expanded ? null : inq.id)}
                >
                  <div className="flex-1 min-w-0">
                    <div className="flex items-center gap-3 flex-wrap">
                      <p className="font-medium text-brand-900">{inq.interest_type}</p>
                      <span className={`text-xs px-2.5 py-1 rounded-full font-medium ${sc?.color || 'bg-gray-100'}`}>
                        {sc?.label || inq.status}
                      </span>
                    </div>
                    <p className="text-xs text-brand-400 mt-1">
                      {new Date(inq.created_at).toLocaleDateString()}
                      {inq.message && ` — "${inq.message.slice(0, 80)}${inq.message.length > 80 ? '...' : ''}"`}
                    </p>
                  </div>
                  <div className="flex items-center gap-2 ml-3">
                    <span className="text-xs text-brand-400">{inqNotes.length} notes · {inqTasks.length} tasks</span>
                    {expanded ? <ChevronUp className="h-4 w-4 text-brand-400" /> : <ChevronDown className="h-4 w-4 text-brand-400" />}
                  </div>
                </div>

                {/* Expanded inquiry detail */}
                {expanded && (
                  <div className="border-t border-brand-100 px-5 py-4 space-y-4">
                    {/* Status + full message */}
                    <div className="flex items-start justify-between gap-4">
                      <div className="flex-1">
                        {inq.message && (
                          <div className="bg-brand-50 rounded-lg p-3 text-sm text-brand-700 italic">
                            &ldquo;{inq.message}&rdquo;
                          </div>
                        )}
                      </div>
                      <div>
                        <label className="block text-xs font-medium text-brand-400 mb-1">Status</label>
                        <select
                          value={inq.status}
                          onChange={(e) => updateInquiryStatus(inq.id, e.target.value)}
                          className={`px-3 py-2 rounded-lg border text-sm font-medium cursor-pointer ${sc?.color || ''}`}
                        >
                          {STATUS_OPTIONS.map((s) => (
                            <option key={s.value} value={s.value}>{s.label}</option>
                          ))}
                        </select>
                      </div>
                    </div>

                    {/* Inquiry notes */}
                    <div>
                      <h4 className="text-sm font-semibold text-brand-700 mb-2">Notes</h4>
                      <div className="space-y-2 mb-2">
                        {inqNotes.map((note) => (
                          <div key={note.id} className="bg-brand-50 rounded-lg p-3 group flex justify-between">
                            <div>
                              <p className="text-sm text-brand-900 whitespace-pre-wrap">{note.content}</p>
                              <p className="text-xs text-brand-400 mt-1">{new Date(note.created_at).toLocaleString()}</p>
                            </div>
                            <button onClick={() => deleteNote(note.id)} className="opacity-0 group-hover:opacity-100 p-1 text-brand-400 hover:text-rose-500">
                              <Trash2 className="h-3.5 w-3.5" />
                            </button>
                          </div>
                        ))}
                        {inqNotes.length === 0 && <p className="text-xs text-brand-400">No notes for this inquiry</p>}
                      </div>
                      <div className="flex gap-2">
                        <input
                          value={newInqNote[inq.id] || ''}
                          onChange={(e) => setNewInqNote({ ...newInqNote, [inq.id]: e.target.value })}
                          placeholder="Add a note..."
                          className="flex-1 px-3 py-2 bg-white rounded-lg border border-brand-200 text-sm text-brand-900 outline-none focus:border-accent-400"
                          onKeyDown={(e) => e.key === 'Enter' && addInquiryNote(inq.id)}
                        />
                        <button
                          onClick={() => addInquiryNote(inq.id)}
                          disabled={!newInqNote[inq.id]?.trim() || savingInqNote[inq.id]}
                          className="px-3 py-2 bg-brand-900 text-white text-sm rounded-lg hover:bg-brand-800 disabled:opacity-40"
                        >
                          {savingInqNote[inq.id] ? <Loader2 className="h-3.5 w-3.5 animate-spin" /> : <Plus className="h-3.5 w-3.5" />}
                        </button>
                      </div>
                    </div>

                    {/* Inquiry tasks */}
                    <div>
                      <h4 className="text-sm font-semibold text-brand-700 mb-2">Tasks</h4>
                      <div className="space-y-2 mb-2">
                        {inqTasks.map((task) => (
                          <div key={task.id} className="flex items-center gap-3 group bg-brand-50 rounded-lg p-3">
                            <button
                              onClick={() => toggleTask(task.id, !task.completed)}
                              className={`w-5 h-5 rounded border-2 flex items-center justify-center flex-shrink-0 transition-colors ${
                                task.completed ? 'bg-accent-500 border-accent-500 text-white' : 'border-brand-300 hover:border-accent-400'
                              }`}
                            >
                              {task.completed && <Check className="h-3 w-3" />}
                            </button>
                            <div className="flex-1 min-w-0">
                              <p className={`text-sm font-medium ${task.completed ? 'line-through text-brand-400' : 'text-brand-900'}`}>{task.title}</p>
                              {task.due_date && <p className="text-xs text-brand-400">Due: {new Date(task.due_date).toLocaleDateString()}</p>}
                            </div>
                            <button onClick={() => deleteTask(task.id)} className="opacity-0 group-hover:opacity-100 p-1 text-brand-400 hover:text-rose-500">
                              <Trash2 className="h-3.5 w-3.5" />
                            </button>
                          </div>
                        ))}
                        {inqTasks.length === 0 && <p className="text-xs text-brand-400">No tasks for this inquiry</p>}
                      </div>
                      <div className="flex gap-2">
                        <input
                          value={newTask[inq.id] || ''}
                          onChange={(e) => setNewTask({ ...newTask, [inq.id]: e.target.value })}
                          placeholder="New task..."
                          className="flex-1 px-3 py-2 bg-white rounded-lg border border-brand-200 text-sm text-brand-900 outline-none focus:border-accent-400"
                          onKeyDown={(e) => e.key === 'Enter' && addTaskFor('inquiry', inq.id)}
                        />
                        <input
                          type="date"
                          value={newTaskDue[inq.id] || ''}
                          onChange={(e) => setNewTaskDue({ ...newTaskDue, [inq.id]: e.target.value })}
                          className="px-3 py-2 bg-white rounded-lg border border-brand-200 text-sm text-brand-600"
                        />
                        <button
                          onClick={() => addTaskFor('inquiry', inq.id)}
                          disabled={!newTask[inq.id]?.trim() || savingTask[inq.id]}
                          className="px-3 py-2 bg-brand-900 text-white text-sm rounded-lg hover:bg-brand-800 disabled:opacity-40"
                        >
                          {savingTask[inq.id] ? <Loader2 className="h-3.5 w-3.5 animate-spin" /> : <Plus className="h-3.5 w-3.5" />}
                        </button>
                      </div>
                    </div>
                  </div>
                )}
              </div>
            );
          })}
        </div>
      )}

      {/* Client-level notes tab */}
      {tab === 'notes' && (
        <div className="space-y-4">
          <div className="bg-white rounded-xl border border-brand-100 p-4">
            <textarea
              value={newClientNote}
              onChange={(e) => setNewClientNote(e.target.value)}
              placeholder="Add a client-level note..."
              rows={3}
              className="w-full px-3 py-2 bg-brand-50 rounded-lg border border-brand-200 focus:border-accent-400 focus:ring-2 focus:ring-accent-100 outline-none transition resize-none text-brand-900 text-sm"
            />
            <div className="flex justify-end mt-2">
              <button
                onClick={addClientNote}
                disabled={!newClientNote.trim() || savingClientNote}
                className="inline-flex items-center gap-1.5 px-4 py-2 bg-brand-900 text-white text-sm font-medium rounded-lg hover:bg-brand-800 disabled:opacity-40 transition-colors"
              >
                {savingClientNote ? <Loader2 className="h-3.5 w-3.5 animate-spin" /> : <Plus className="h-3.5 w-3.5" />}
                Add Note
              </button>
            </div>
          </div>
          {clientNotes.map((note) => (
            <div key={note.id} className="bg-white rounded-xl border border-brand-100 p-4 group">
              <div className="flex items-start justify-between gap-2">
                <div className="flex-1">
                  <p className="text-sm text-brand-900 whitespace-pre-wrap">{note.content}</p>
                  <p className="text-xs text-brand-400 mt-2">{new Date(note.created_at).toLocaleString()}</p>
                </div>
                <button onClick={() => deleteNote(note.id)} className="opacity-0 group-hover:opacity-100 p-1 text-brand-400 hover:text-rose-500 transition-all">
                  <Trash2 className="h-3.5 w-3.5" />
                </button>
              </div>
            </div>
          ))}
          {clientNotes.length === 0 && <p className="text-center text-brand-400 text-sm py-6">No client-level notes</p>}
        </div>
      )}

      {/* Client-level tasks tab */}
      {tab === 'tasks' && (
        <div className="space-y-4">
          <div className="bg-white rounded-xl border border-brand-100 p-4">
            <div className="flex gap-2">
              <input
                value={newTask['client'] || ''}
                onChange={(e) => setNewTask({ ...newTask, client: e.target.value })}
                placeholder="New task..."
                className="flex-1 px-3 py-2 bg-brand-50 rounded-lg border border-brand-200 focus:border-accent-400 focus:ring-2 focus:ring-accent-100 outline-none transition text-brand-900 text-sm"
                onKeyDown={(e) => e.key === 'Enter' && addTaskFor('client')}
              />
              <input
                type="date"
                value={newTaskDue['client'] || ''}
                onChange={(e) => setNewTaskDue({ ...newTaskDue, client: e.target.value })}
                className="px-3 py-2 bg-brand-50 rounded-lg border border-brand-200 text-brand-600 text-sm"
              />
              <button
                onClick={() => addTaskFor('client')}
                disabled={!newTask['client']?.trim() || savingTask['client']}
                className="inline-flex items-center gap-1.5 px-4 py-2 bg-brand-900 text-white text-sm font-medium rounded-lg hover:bg-brand-800 disabled:opacity-40 transition-colors"
              >
                {savingTask['client'] ? <Loader2 className="h-3.5 w-3.5 animate-spin" /> : <Plus className="h-3.5 w-3.5" />}
                Add
              </button>
            </div>
          </div>
          {clientTasks.map((task) => (
            <div key={task.id} className="bg-white rounded-xl border border-brand-100 p-4 group flex items-center gap-3">
              <button
                onClick={() => toggleTask(task.id, !task.completed)}
                className={`w-5 h-5 rounded border-2 flex items-center justify-center flex-shrink-0 transition-colors ${
                  task.completed ? 'bg-accent-500 border-accent-500 text-white' : 'border-brand-300 hover:border-accent-400'
                }`}
              >
                {task.completed && <Check className="h-3 w-3" />}
              </button>
              <div className="flex-1 min-w-0">
                <p className={`text-sm font-medium ${task.completed ? 'line-through text-brand-400' : 'text-brand-900'}`}>{task.title}</p>
                {task.due_date && (
                  <p className={`text-xs mt-0.5 ${!task.completed && new Date(task.due_date) < new Date() ? 'text-rose-500 font-medium' : 'text-brand-400'}`}>
                    Due: {new Date(task.due_date).toLocaleDateString()}
                  </p>
                )}
              </div>
              <button onClick={() => deleteTask(task.id)} className="opacity-0 group-hover:opacity-100 p-1 text-brand-400 hover:text-rose-500 transition-all">
                <Trash2 className="h-3.5 w-3.5" />
              </button>
            </div>
          ))}
          {clientTasks.length === 0 && <p className="text-center text-brand-400 text-sm py-6">No client-level tasks</p>}
        </div>
      )}
    </div>
  );
}
