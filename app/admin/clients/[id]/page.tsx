'use client';

import { useEffect, useState, useCallback } from 'react';
import { useParams } from 'next/navigation';
import { createClient } from '@/lib/supabase/client';
import Link from 'next/link';
import {
  ArrowLeft, Mail, Phone, Calendar, MessageSquare, CheckSquare,
  Plus, Check, Loader2, Trash2, ChevronDown, ChevronUp, FileText,
  PhoneCall, MessageCircle, Home, Users, Gift, Award, X, Pencil,
  Activity
} from 'lucide-react';

const STATUS_OPTIONS = [
  { value: 'new', label: 'New', color: 'bg-emerald-100 text-emerald-700 border-emerald-200' },
  { value: 'contacted', label: 'Contacted', color: 'bg-blue-100 text-blue-700 border-blue-200' },
  { value: 'active', label: 'Active', color: 'bg-amber-100 text-amber-700 border-amber-200' },
  { value: 'closed_won', label: 'Closed (Won)', color: 'bg-green-100 text-green-700 border-green-200' },
  { value: 'closed_lost', label: 'Closed (Lost)', color: 'bg-gray-100 text-gray-600 border-gray-200' },
];

const INTERACTION_TYPES = [
  { value: 'call', label: 'Phone Call', icon: PhoneCall },
  { value: 'text', label: 'Text Message', icon: MessageCircle },
  { value: 'email', label: 'Email', icon: Mail },
  { value: 'meeting', label: 'Meeting', icon: Users },
  { value: 'showing', label: 'Showing', icon: Home },
];

type Client = {
  id: string; first_name: string; last_name: string; email: string;
  phone: string | null; created_at: string; updated_at: string;
  birthday: string | null; closing_anniversary: string | null;
  referred_by: string | null; referral_source: string | null;
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
type Interaction = {
  id: string; client_id: string; interaction_type: string;
  notes: string | null; interaction_date: string; created_at: string;
};
type Tag = {
  id: string; name: string; color: string;
};
type ReferredClient = {
  id: string; first_name: string; last_name: string;
};

export default function ClientDetailPage() {
  const { id } = useParams<{ id: string }>();
  const supabase = createClient();

  const [client, setClient] = useState<Client | null>(null);
  const [inquiries, setInquiries] = useState<Inquiry[]>([]);
  const [notes, setNotes] = useState<Note[]>([]);
  const [tasks, setTasks] = useState<Task[]>([]);
  const [interactions, setInteractions] = useState<Interaction[]>([]);
  const [allTags, setAllTags] = useState<Tag[]>([]);
  const [clientTagIds, setClientTagIds] = useState<string[]>([]);
  const [referrer, setReferrer] = useState<{ id: string; first_name: string; last_name: string } | null>(null);
  const [referrals, setReferrals] = useState<ReferredClient[]>([]);
  const [allClients, setAllClients] = useState<{ id: string; first_name: string; last_name: string }[]>([]);
  const [loading, setLoading] = useState(true);
  const [expandedInquiry, setExpandedInquiry] = useState<string | null>(null);

  // Forms
  const [newClientNote, setNewClientNote] = useState('');
  const [savingClientNote, setSavingClientNote] = useState(false);
  const [newInqNote, setNewInqNote] = useState<Record<string, string>>({});
  const [savingInqNote, setSavingInqNote] = useState<Record<string, boolean>>({});
  const [newTask, setNewTask] = useState<Record<string, string>>({});
  const [newTaskDue, setNewTaskDue] = useState<Record<string, string>>({});
  const [savingTask, setSavingTask] = useState<Record<string, boolean>>({});

  // Interaction form
  const [showInteractionForm, setShowInteractionForm] = useState(false);
  const [interactionType, setInteractionType] = useState('call');
  const [interactionNotes, setInteractionNotes] = useState('');
  const [interactionDate, setInteractionDate] = useState(new Date().toISOString().slice(0, 16));
  const [savingInteraction, setSavingInteraction] = useState(false);

  // Inline editing
  const [editingField, setEditingField] = useState<string | null>(null);
  const [editValue, setEditValue] = useState('');

  const [tab, setTab] = useState<'inquiries' | 'notes' | 'tasks' | 'activity'>('inquiries');

  const fetchAll = useCallback(async () => {
    const [clientRes, inqRes, notesRes, tasksRes, interactionsRes, tagsRes, clientTagsRes, allClientsRes] = await Promise.all([
      supabase.from('clients').select('*').eq('id', id).single(),
      supabase.from('inquiries').select('*').eq('client_id', id).order('created_at', { ascending: false }),
      supabase.from('notes').select('*').eq('client_id', id).order('created_at', { ascending: false }),
      supabase.from('tasks').select('*').eq('client_id', id).order('created_at', { ascending: false }),
      supabase.from('interactions').select('*').eq('client_id', id).order('interaction_date', { ascending: false }),
      supabase.from('tags').select('*').order('name'),
      supabase.from('client_tags').select('tag_id').eq('client_id', id),
      supabase.from('clients').select('id, first_name, last_name').order('first_name'),
    ]);
    setClient(clientRes.data);
    setInquiries(inqRes.data || []);
    setNotes(notesRes.data || []);
    setTasks(tasksRes.data || []);
    setInteractions(interactionsRes.data || []);
    setAllTags(tagsRes.data || []);
    setClientTagIds((clientTagsRes.data || []).map((ct: any) => ct.tag_id));
    setAllClients((allClientsRes.data || []).filter((c: any) => c.id !== id));

    // Fetch referrer
    if (clientRes.data?.referred_by) {
      const { data: ref } = await supabase.from('clients').select('id, first_name, last_name').eq('id', clientRes.data.referred_by).single();
      setReferrer(ref);
    }

    // Fetch referrals (clients referred by this person)
    const { data: refs } = await supabase.from('clients').select('id, first_name, last_name').eq('referred_by', id);
    setReferrals(refs || []);

    setLoading(false);
  }, [id]);

  useEffect(() => { fetchAll(); }, [fetchAll]);

  // --- Inline edit save ---
  async function saveField(field: string, value: string | null) {
    if (!client) return;
    const update: any = { [field]: value || null };
    await supabase.from('clients').update(update).eq('id', id);
    setClient({ ...client, ...update });
    setEditingField(null);
  }

  // --- Tag toggle ---
  async function toggleTag(tagId: string) {
    const has = clientTagIds.includes(tagId);
    if (has) {
      await supabase.from('client_tags').delete().eq('client_id', id).eq('tag_id', tagId);
      setClientTagIds(clientTagIds.filter((t) => t !== tagId));
    } else {
      await supabase.from('client_tags').insert({ client_id: id, tag_id: tagId });
      setClientTagIds([...clientTagIds, tagId]);
    }
  }

  // --- Inquiry status ---
  async function updateInquiryStatus(inqId: string, newStatus: string) {
    setInquiries(inquiries.map((i) => i.id === inqId ? { ...i, status: newStatus } : i));
    await supabase.from('inquiries').update({ status: newStatus }).eq('id', inqId);
  }

  // --- Interactions ---
  async function addInteraction() {
    if (!interactionType) return;
    setSavingInteraction(true);
    const { data: { user } } = await supabase.auth.getUser();
    const { data } = await supabase
      .from('interactions')
      .insert({
        client_id: id,
        interaction_type: interactionType,
        notes: interactionNotes.trim() || null,
        interaction_date: interactionDate,
        created_by: user?.id || null,
      })
      .select()
      .single();
    if (data) setInteractions([data, ...interactions]);
    setInteractionNotes('');
    setInteractionDate(new Date().toISOString().slice(0, 16));
    setInteractionType('call');
    setShowInteractionForm(false);
    setSavingInteraction(false);
  }

  async function deleteInteraction(intId: string) {
    setInteractions(interactions.filter((i) => i.id !== intId));
    await supabase.from('interactions').delete().eq('id', intId);
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
  const getInteractionIcon = (type: string) => {
    const config = INTERACTION_TYPES.find((t) => t.value === type);
    return config?.icon || Activity;
  };

  function formatRelativeDate(dateStr: string) {
    const d = new Date(dateStr);
    const now = new Date();
    const diff = now.getTime() - d.getTime();
    const days = Math.floor(diff / (1000 * 60 * 60 * 24));
    if (days === 0) return 'Today';
    if (days === 1) return 'Yesterday';
    if (days < 7) return `${days} days ago`;
    return d.toLocaleDateString();
  }

  if (loading) return <div className="p-8 text-center text-brand-400">Loading...</div>;
  if (!client) return <div className="p-8 text-center text-brand-400">Client not found</div>;

  const activeTags = allTags.filter((t) => clientTagIds.includes(t.id));

  return (
    <div>
      <Link href="/admin/clients" className="inline-flex items-center gap-1.5 text-sm text-brand-500 hover:text-brand-900 mb-4">
        <ArrowLeft className="h-4 w-4" /> Back to Clients
      </Link>

      {/* Client header */}
      <div className="bg-white rounded-xl border border-brand-100 p-6 mb-6">
        <div className="flex items-start justify-between">
          <div>
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
          </div>
        </div>

        {/* Tags */}
        <div className="mt-4 flex flex-wrap items-center gap-2">
          {activeTags.map((tag) => (
            <button
              key={tag.id}
              onClick={() => toggleTag(tag.id)}
              className="inline-flex items-center gap-1 px-2.5 py-1 rounded-full text-xs font-medium text-white transition-opacity hover:opacity-80"
              style={{ backgroundColor: tag.color }}
            >
              {tag.name}
              <X className="h-3 w-3" />
            </button>
          ))}
          <div className="relative group">
            <button className="inline-flex items-center gap-1 px-2.5 py-1 rounded-full text-xs font-medium border border-dashed border-brand-300 text-brand-500 hover:border-brand-400 hover:text-brand-700">
              <Plus className="h-3 w-3" /> Tag
            </button>
            <div className="absolute left-0 top-full mt-1 bg-white rounded-lg border border-brand-100 shadow-lg p-2 hidden group-hover:block z-10 min-w-[160px]">
              {allTags.filter((t) => !clientTagIds.includes(t.id)).map((tag) => (
                <button
                  key={tag.id}
                  onClick={() => toggleTag(tag.id)}
                  className="flex items-center gap-2 w-full px-3 py-1.5 text-sm text-brand-700 hover:bg-brand-50 rounded-md"
                >
                  <span className="w-3 h-3 rounded-full flex-shrink-0" style={{ backgroundColor: tag.color }} />
                  {tag.name}
                </button>
              ))}
              {allTags.filter((t) => !clientTagIds.includes(t.id)).length === 0 && (
                <p className="text-xs text-brand-400 px-3 py-1">All tags applied</p>
              )}
            </div>
          </div>
        </div>

        {/* Editable fields: Birthday, Closing Anniversary, Referral */}
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4 mt-5 pt-5 border-t border-brand-100">
          {/* Birthday */}
          <div>
            <label className="block text-xs font-medium text-brand-400 mb-1">Birthday</label>
            {editingField === 'birthday' ? (
              <input
                type="date"
                autoFocus
                defaultValue={client.birthday || ''}
                onBlur={(e) => saveField('birthday', e.target.value)}
                onKeyDown={(e) => { if (e.key === 'Enter') saveField('birthday', (e.target as HTMLInputElement).value); if (e.key === 'Escape') setEditingField(null); }}
                className="w-full px-2 py-1 text-sm border border-accent-300 rounded-lg outline-none"
              />
            ) : (
              <button
                onClick={() => setEditingField('birthday')}
                className="flex items-center gap-1.5 text-sm text-brand-700 hover:text-accent-600 group"
              >
                <Gift className="h-3.5 w-3.5 text-brand-400" />
                {client.birthday ? new Date(client.birthday + 'T00:00:00').toLocaleDateString('en-US', { month: 'long', day: 'numeric' }) : <span className="text-brand-400 italic">Add birthday</span>}
                <Pencil className="h-3 w-3 text-brand-300 opacity-0 group-hover:opacity-100" />
              </button>
            )}
          </div>

          {/* Closing Anniversary */}
          <div>
            <label className="block text-xs font-medium text-brand-400 mb-1">Closing Anniversary</label>
            {editingField === 'closing_anniversary' ? (
              <input
                type="date"
                autoFocus
                defaultValue={client.closing_anniversary || ''}
                onBlur={(e) => saveField('closing_anniversary', e.target.value)}
                onKeyDown={(e) => { if (e.key === 'Enter') saveField('closing_anniversary', (e.target as HTMLInputElement).value); if (e.key === 'Escape') setEditingField(null); }}
                className="w-full px-2 py-1 text-sm border border-accent-300 rounded-lg outline-none"
              />
            ) : (
              <button
                onClick={() => setEditingField('closing_anniversary')}
                className="flex items-center gap-1.5 text-sm text-brand-700 hover:text-accent-600 group"
              >
                <Award className="h-3.5 w-3.5 text-brand-400" />
                {client.closing_anniversary ? new Date(client.closing_anniversary + 'T00:00:00').toLocaleDateString('en-US', { month: 'long', day: 'numeric', year: 'numeric' }) : <span className="text-brand-400 italic">Add anniversary</span>}
                <Pencil className="h-3 w-3 text-brand-300 opacity-0 group-hover:opacity-100" />
              </button>
            )}
          </div>

          {/* Referred By */}
          <div>
            <label className="block text-xs font-medium text-brand-400 mb-1">Referred By</label>
            {editingField === 'referred_by' ? (
              <select
                autoFocus
                defaultValue={client.referred_by || ''}
                onBlur={(e) => saveField('referred_by', e.target.value)}
                onChange={(e) => saveField('referred_by', e.target.value)}
                className="w-full px-2 py-1 text-sm border border-accent-300 rounded-lg outline-none"
              >
                <option value="">None</option>
                {allClients.map((c) => (
                  <option key={c.id} value={c.id}>{c.first_name} {c.last_name}</option>
                ))}
              </select>
            ) : (
              <button
                onClick={() => setEditingField('referred_by')}
                className="flex items-center gap-1.5 text-sm text-brand-700 hover:text-accent-600 group"
              >
                <Users className="h-3.5 w-3.5 text-brand-400" />
                {referrer ? (
                  <Link href={`/admin/clients/${referrer.id}`} className="text-accent-600 hover:underline" onClick={(e) => e.stopPropagation()}>
                    {referrer.first_name} {referrer.last_name}
                  </Link>
                ) : (
                  <span className="text-brand-400 italic">Add referrer</span>
                )}
                <Pencil className="h-3 w-3 text-brand-300 opacity-0 group-hover:opacity-100" />
              </button>
            )}
          </div>

          {/* Referral Source */}
          <div>
            <label className="block text-xs font-medium text-brand-400 mb-1">Referral Source</label>
            {editingField === 'referral_source' ? (
              <input
                type="text"
                autoFocus
                placeholder="e.g. Google, Open House"
                defaultValue={client.referral_source || ''}
                onBlur={(e) => saveField('referral_source', e.target.value)}
                onKeyDown={(e) => { if (e.key === 'Enter') saveField('referral_source', (e.target as HTMLInputElement).value); if (e.key === 'Escape') setEditingField(null); }}
                className="w-full px-2 py-1 text-sm border border-accent-300 rounded-lg outline-none"
              />
            ) : (
              <button
                onClick={() => setEditingField('referral_source')}
                className="flex items-center gap-1.5 text-sm text-brand-700 hover:text-accent-600 group"
              >
                <FileText className="h-3.5 w-3.5 text-brand-400" />
                {client.referral_source || <span className="text-brand-400 italic">Add source</span>}
                <Pencil className="h-3 w-3 text-brand-300 opacity-0 group-hover:opacity-100" />
              </button>
            )}
          </div>
        </div>

        {/* Referrals from this client */}
        {referrals.length > 0 && (
          <div className="mt-4 pt-4 border-t border-brand-100">
            <h3 className="text-xs font-medium text-brand-400 mb-2">Referrals Made ({referrals.length})</h3>
            <div className="flex flex-wrap gap-2">
              {referrals.map((r) => (
                <Link
                  key={r.id}
                  href={`/admin/clients/${r.id}`}
                  className="inline-flex items-center gap-1.5 px-3 py-1.5 bg-amber-50 text-amber-700 rounded-full text-xs font-medium hover:bg-amber-100 transition-colors"
                >
                  <Users className="h-3 w-3" />
                  {r.first_name} {r.last_name}
                </Link>
              ))}
            </div>
          </div>
        )}

        <p className="text-sm text-brand-400 mt-3">{inquiries.length} inquir{inquiries.length === 1 ? 'y' : 'ies'} · {interactions.length} interaction{interactions.length !== 1 ? 's' : ''}</p>
      </div>

      {/* Tabs */}
      <div className="flex gap-1 mb-4 bg-white rounded-lg p-1 border border-brand-100 w-fit overflow-x-auto">
        {([
          { key: 'inquiries', label: 'Inquiries', icon: FileText, count: inquiries.length },
          { key: 'activity', label: 'Activity', icon: Activity, count: interactions.length },
          { key: 'notes', label: 'Notes', icon: MessageSquare, count: clientNotes.length },
          { key: 'tasks', label: 'Tasks', icon: CheckSquare, count: clientTasks.filter((t) => !t.completed).length },
        ] as const).map(({ key, label, icon: Icon, count }) => (
          <button
            key={key}
            onClick={() => setTab(key)}
            className={`flex items-center gap-2 px-4 py-2 rounded-md text-sm font-medium transition-colors whitespace-nowrap ${
              tab === key ? 'bg-brand-900 text-white' : 'text-brand-600 hover:bg-brand-50'
            }`}
          >
            <Icon className="h-4 w-4" /> {label} ({count})
          </button>
        ))}
      </div>

      {/* Activity tab */}
      {tab === 'activity' && (
        <div className="space-y-4">
          {/* Log interaction button / form */}
          {showInteractionForm ? (
            <div className="bg-white rounded-xl border border-brand-100 p-5 space-y-4">
              <div className="flex items-center justify-between">
                <h3 className="font-semibold text-brand-900 text-sm">Log Interaction</h3>
                <button onClick={() => setShowInteractionForm(false)} className="text-brand-400 hover:text-brand-700">
                  <X className="h-4 w-4" />
                </button>
              </div>
              <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
                <div>
                  <label className="block text-xs font-medium text-brand-500 mb-1">Type</label>
                  <select
                    value={interactionType}
                    onChange={(e) => setInteractionType(e.target.value)}
                    className="w-full px-3 py-2 bg-brand-50 rounded-lg border border-brand-200 text-sm text-brand-900 outline-none focus:border-accent-400"
                  >
                    {INTERACTION_TYPES.map((t) => (
                      <option key={t.value} value={t.value}>{t.label}</option>
                    ))}
                  </select>
                </div>
                <div>
                  <label className="block text-xs font-medium text-brand-500 mb-1">Date & Time</label>
                  <input
                    type="datetime-local"
                    value={interactionDate}
                    onChange={(e) => setInteractionDate(e.target.value)}
                    className="w-full px-3 py-2 bg-brand-50 rounded-lg border border-brand-200 text-sm text-brand-900 outline-none focus:border-accent-400"
                  />
                </div>
              </div>
              <div>
                <label className="block text-xs font-medium text-brand-500 mb-1">Notes (optional)</label>
                <textarea
                  value={interactionNotes}
                  onChange={(e) => setInteractionNotes(e.target.value)}
                  placeholder="What happened?"
                  rows={3}
                  className="w-full px-3 py-2 bg-brand-50 rounded-lg border border-brand-200 text-sm text-brand-900 outline-none focus:border-accent-400 resize-none"
                />
              </div>
              <div className="flex justify-end">
                <button
                  onClick={addInteraction}
                  disabled={savingInteraction}
                  className="inline-flex items-center gap-1.5 px-4 py-2 bg-brand-900 text-white text-sm font-medium rounded-lg hover:bg-brand-800 disabled:opacity-40 transition-colors"
                >
                  {savingInteraction ? <Loader2 className="h-3.5 w-3.5 animate-spin" /> : <Plus className="h-3.5 w-3.5" />}
                  Log Interaction
                </button>
              </div>
            </div>
          ) : (
            <button
              onClick={() => setShowInteractionForm(true)}
              className="w-full bg-white rounded-xl border border-dashed border-brand-200 p-4 text-sm font-medium text-brand-500 hover:border-accent-400 hover:text-accent-600 transition-colors flex items-center justify-center gap-2"
            >
              <Plus className="h-4 w-4" /> Log Interaction
            </button>
          )}

          {/* Timeline */}
          {interactions.length === 0 ? (
            <div className="text-center py-8 text-brand-400 text-sm">
              <Activity className="h-8 w-8 mx-auto mb-2 text-brand-300" />
              No interactions logged yet
            </div>
          ) : (
            <div className="space-y-2">
              {interactions.map((interaction) => {
                const Icon = getInteractionIcon(interaction.interaction_type);
                const typeLabel = INTERACTION_TYPES.find((t) => t.value === interaction.interaction_type)?.label || interaction.interaction_type;
                return (
                  <div key={interaction.id} className="bg-white rounded-xl border border-brand-100 p-4 group flex items-start gap-3">
                    <div className="w-9 h-9 rounded-lg bg-brand-50 flex items-center justify-center flex-shrink-0">
                      <Icon className="h-4 w-4 text-brand-600" />
                    </div>
                    <div className="flex-1 min-w-0">
                      <div className="flex items-center gap-2">
                        <p className="text-sm font-medium text-brand-900">{typeLabel}</p>
                        <span className="text-xs text-brand-400">{formatRelativeDate(interaction.interaction_date)}</span>
                      </div>
                      {interaction.notes && (
                        <p className="text-sm text-brand-600 mt-1 whitespace-pre-wrap">{interaction.notes}</p>
                      )}
                      <p className="text-xs text-brand-300 mt-1">
                        {new Date(interaction.interaction_date).toLocaleString()}
                      </p>
                    </div>
                    <button onClick={() => deleteInteraction(interaction.id)} className="opacity-0 group-hover:opacity-100 p-1 text-brand-400 hover:text-rose-500 transition-all">
                      <Trash2 className="h-3.5 w-3.5" />
                    </button>
                  </div>
                );
              })}
            </div>
          )}
        </div>
      )}

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

                {expanded && (
                  <div className="border-t border-brand-100 px-5 py-4 space-y-4">
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
