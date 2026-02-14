'use client';

import { useEffect, useState, useCallback } from 'react';
import { useParams, useRouter } from 'next/navigation';
import { createClient } from '@/lib/supabase/client';
import Link from 'next/link';
import {
  ArrowLeft, Mail, Phone, Calendar, MessageSquare, CheckSquare,
  Plus, Check, Loader2, Trash2, ChevronDown, ChevronUp, FileText,
  PhoneCall, MessageCircle, Home, Users, Gift, Award, X, Pencil,
  Activity, Building, DollarSign, Tag
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
type Transaction = {
  id: string; client_id: string; type: string; property_address: string;
  city: string | null; neighborhood: string | null; property_type: string | null;
  price: number | null; closing_date: string | null; mls_number: string | null;
  status: string; notes: string | null; created_at: string; updated_at: string;
};
type OpenHouseVisit = {
  id: string; signed_in_at: string;
  open_houses: { id: string; property_address: string; date: string; city: string | null };
};

const PROPERTY_TYPES = ['detached', 'semi', 'townhouse', 'condo', 'commercial', 'land'];
const TX_STATUSES = [
  { value: 'active', label: 'Active', color: 'bg-blue-100 text-blue-700' },
  { value: 'pending', label: 'Pending', color: 'bg-amber-100 text-amber-700' },
  { value: 'closed', label: 'Closed', color: 'bg-emerald-100 text-emerald-700' },
  { value: 'fell_through', label: 'Fell Through', color: 'bg-rose-100 text-rose-700' },
];

export default function ClientDetailPage() {
  const { id } = useParams<{ id: string }>();
  const router = useRouter();
  const supabase = createClient();

  const [client, setClient] = useState<Client | null>(null);
  const [inquiries, setInquiries] = useState<Inquiry[]>([]);
  const [notes, setNotes] = useState<Note[]>([]);
  const [tasks, setTasks] = useState<Task[]>([]);
  const [interactions, setInteractions] = useState<Interaction[]>([]);
  const [allTags, setAllTags] = useState<Tag[]>([]);
  const [clientTagIds, setClientTagIds] = useState<string[]>([]);
  const [transactions, setTransactions] = useState<Transaction[]>([]);
  const [ohVisits, setOhVisits] = useState<OpenHouseVisit[]>([]);
  const [referrer, setReferrer] = useState<{ id: string; first_name: string; last_name: string } | null>(null);
  const [referrals, setReferrals] = useState<ReferredClient[]>([]);
  const [allClients, setAllClients] = useState<{ id: string; first_name: string; last_name: string }[]>([]);
  const [loading, setLoading] = useState(true);
  const [expandedInquiry, setExpandedInquiry] = useState<string | null>(null);

  // Delete modals
  const [deleteInquiryModal, setDeleteInquiryModal] = useState<{ id: string; type: string } | null>(null);
  const [deletingInquiry, setDeletingInquiry] = useState(false);
  const [deleteClientModal, setDeleteClientModal] = useState(false);
  const [deletingClient, setDeletingClient] = useState(false);

  // Forms
  const [newClientNote, setNewClientNote] = useState('');
  const [savingClientNote, setSavingClientNote] = useState(false);
  const [newInqNote, setNewInqNote] = useState<Record<string, string>>({});
  const [savingInqNote, setSavingInqNote] = useState<Record<string, boolean>>({});
  const [newTask, setNewTask] = useState<Record<string, string>>({});
  const [newTaskDue, setNewTaskDue] = useState<Record<string, string>>({});
  const [savingTask, setSavingTask] = useState<Record<string, boolean>>({});

  // Interaction form
  const [showTxForm, setShowTxForm] = useState(false);
  const [savingTx, setSavingTx] = useState(false);
  const [editingTx, setEditingTx] = useState<string | null>(null);
  const [txForm, setTxForm] = useState({
    type: 'buy', property_address: '', city: '', neighborhood: '', property_type: '',
    price: '', closing_date: '', mls_number: '', status: 'active', notes: '',
  });

  const [showInteractionForm, setShowInteractionForm] = useState(false);
  const [interactionType, setInteractionType] = useState('call');
  const [interactionNotes, setInteractionNotes] = useState('');
  const [interactionDate, setInteractionDate] = useState(new Date().toISOString().slice(0, 16));
  const [savingInteraction, setSavingInteraction] = useState(false);

  // Inline editing
  const [editingField, setEditingField] = useState<string | null>(null);
  const [editValue, setEditValue] = useState('');

  // Create referrer form
  const [showCreateReferrer, setShowCreateReferrer] = useState(false);
  const [newReferrerFirst, setNewReferrerFirst] = useState('');
  const [newReferrerLast, setNewReferrerLast] = useState('');
  const [newReferrerEmail, setNewReferrerEmail] = useState('');
  const [newReferrerPhone, setNewReferrerPhone] = useState('');
  const [savingReferrer, setSavingReferrer] = useState(false);
  const [referrerSearch, setReferrerSearch] = useState('');

  const [tab, setTab] = useState<'inquiries' | 'notes' | 'tasks' | 'activity' | 'transactions'>('inquiries');

  const fetchAll = useCallback(async () => {
    const [clientRes, inqRes, notesRes, tasksRes, interactionsRes, tagsRes, clientTagsRes, allClientsRes, txRes, ohvRes] = await Promise.all([
      supabase.from('clients').select('*').eq('id', id).single(),
      supabase.from('inquiries').select('*').eq('client_id', id).order('created_at', { ascending: false }),
      supabase.from('notes').select('*').eq('client_id', id).order('created_at', { ascending: false }),
      supabase.from('tasks').select('*').eq('client_id', id).order('created_at', { ascending: false }),
      supabase.from('interactions').select('*').eq('client_id', id).order('interaction_date', { ascending: false }),
      supabase.from('tags').select('*').order('name'),
      supabase.from('client_tags').select('tag_id').eq('client_id', id),
      supabase.from('clients').select('id, first_name, last_name').order('first_name'),
      supabase.from('transactions').select('*').eq('client_id', id).order('created_at', { ascending: false }),
      supabase.from('open_house_visitors').select('id, signed_in_at, open_houses(id, property_address, date, city)').eq('client_id', id).order('signed_in_at', { ascending: false }),
    ]);
    setClient(clientRes.data);
    setInquiries(inqRes.data || []);
    setNotes(notesRes.data || []);
    setTasks(tasksRes.data || []);
    setInteractions(interactionsRes.data || []);
    setAllTags(tagsRes.data || []);
    setClientTagIds((clientTagsRes.data || []).map((ct: any) => ct.tag_id));
    setAllClients((allClientsRes.data || []).filter((c: any) => c.id !== id));
    setTransactions(txRes.data || []);
    setOhVisits((ohvRes.data || []) as any);

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

  // --- Create referrer (non-client) ---
  async function createAndSetReferrer() {
    if (!newReferrerFirst.trim() || !newReferrerLast.trim()) return;
    setSavingReferrer(true);
    // Create minimal client record
    const { data: newClient } = await supabase
      .from('clients')
      .insert({
        first_name: newReferrerFirst.trim(),
        last_name: newReferrerLast.trim(),
        email: newReferrerEmail.trim() || `${newReferrerFirst.trim().toLowerCase()}.${newReferrerLast.trim().toLowerCase()}@referrer.placeholder`,
        phone: newReferrerPhone.trim() || null,
      })
      .select()
      .single();

    if (newClient) {
      // Tag as "Referral Source"
      const referralTag = allTags.find((t) => t.name === 'Referral Source');
      if (referralTag) {
        await supabase.from('client_tags').insert({ client_id: newClient.id, tag_id: referralTag.id });
      }
      // Set as referrer
      await supabase.from('clients').update({ referred_by: newClient.id }).eq('id', id);
      setClient(client ? { ...client, referred_by: newClient.id } : client);
      setReferrer({ id: newClient.id, first_name: newClient.first_name, last_name: newClient.last_name });
      setAllClients([...allClients, { id: newClient.id, first_name: newClient.first_name, last_name: newClient.last_name }]);
    }

    setShowCreateReferrer(false);
    setNewReferrerFirst('');
    setNewReferrerLast('');
    setNewReferrerEmail('');
    setNewReferrerPhone('');
    setSavingReferrer(false);
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

  // --- Delete inquiry ---
  async function handleDeleteInquiry() {
    if (!deleteInquiryModal) return;
    setDeletingInquiry(true);
    await supabase.from('inquiries').delete().eq('id', deleteInquiryModal.id);
    setInquiries(inquiries.filter((i) => i.id !== deleteInquiryModal.id));
    // Remove related notes and tasks from state
    setNotes(notes.filter((n) => n.inquiry_id !== deleteInquiryModal.id));
    setTasks(tasks.filter((t) => t.inquiry_id !== deleteInquiryModal.id));
    setDeleteInquiryModal(null);
    setDeletingInquiry(false);
  }

  // --- Delete client ---
  async function handleDeleteClient() {
    if (!client) return;
    setDeletingClient(true);
    await supabase.from('clients').delete().eq('id', id);
    router.push('/admin/clients');
  }

  // --- Transactions ---
  async function addTransaction() {
    if (!txForm.property_address) return;
    setSavingTx(true);
    const { data: { user } } = await supabase.auth.getUser();
    const payload = {
      client_id: id,
      type: txForm.type,
      property_address: txForm.property_address,
      city: txForm.city || null,
      neighborhood: txForm.neighborhood || null,
      property_type: txForm.property_type || null,
      price: txForm.price ? parseFloat(txForm.price) : null,
      closing_date: txForm.closing_date || null,
      mls_number: txForm.mls_number || null,
      status: txForm.status,
      notes: txForm.notes || null,
      created_by: user?.id || null,
    };

    if (editingTx) {
      const { data } = await supabase.from('transactions').update(payload).eq('id', editingTx).select().single();
      if (data) setTransactions(transactions.map((t) => t.id === editingTx ? data : t));
    } else {
      const { data } = await supabase.from('transactions').insert(payload).select().single();
      if (data) setTransactions([data, ...transactions]);
    }

    // Auto-update closing anniversary from most recent closed tx
    const allTx = editingTx
      ? transactions.map((t) => t.id === editingTx ? { ...t, ...payload } : t)
      : [{ ...payload, id: 'new' }, ...transactions];
    const closedTx = allTx.filter((t) => t.status === 'closed' && t.closing_date).sort((a, b) => (b.closing_date || '').localeCompare(a.closing_date || ''));
    if (closedTx.length > 0) {
      await supabase.from('clients').update({ closing_anniversary: closedTx[0].closing_date }).eq('id', id);
      if (client) setClient({ ...client, closing_anniversary: closedTx[0].closing_date });
    }

    setTxForm({ type: 'buy', property_address: '', city: '', neighborhood: '', property_type: '', price: '', closing_date: '', mls_number: '', status: 'active', notes: '' });
    setShowTxForm(false);
    setEditingTx(null);
    setSavingTx(false);
  }

  function startEditTx(tx: Transaction) {
    setTxForm({
      type: tx.type,
      property_address: tx.property_address,
      city: tx.city || '',
      neighborhood: tx.neighborhood || '',
      property_type: tx.property_type || '',
      price: tx.price ? String(tx.price) : '',
      closing_date: tx.closing_date || '',
      mls_number: tx.mls_number || '',
      status: tx.status,
      notes: tx.notes || '',
    });
    setEditingTx(tx.id);
    setShowTxForm(true);
  }

  async function deleteTx(txId: string) {
    setTransactions(transactions.filter((t) => t.id !== txId));
    await supabase.from('transactions').delete().eq('id', txId);
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
          <button
            onClick={() => setDeleteClientModal(true)}
            className="p-1.5 text-brand-400 hover:text-rose-500 transition-colors"
            title="Delete client"
          >
            <Trash2 className="h-4 w-4" />
          </button>
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
        <div className="grid grid-cols-1 sm:grid-cols-2 gap-4 mt-5 pt-5 border-t border-brand-100">
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
          <div className="sm:col-span-2 lg:col-span-2">
            <label className="block text-xs font-medium text-brand-400 mb-1">Referred By</label>
            {editingField === 'referred_by' ? (
              <div className="space-y-2">
                {!showCreateReferrer ? (
                  <div>
                    {/* Search existing clients */}
                    <input
                      type="text"
                      autoFocus
                      placeholder="Search clients..."
                      value={referrerSearch}
                      onChange={(e) => setReferrerSearch(e.target.value)}
                      className="w-full px-2 py-1.5 text-sm border border-accent-300 rounded-lg outline-none mb-1"
                    />
                    <div className="max-h-36 overflow-y-auto border border-brand-200 rounded-lg bg-white">
                      <button
                        onClick={() => { saveField('referred_by', ''); setReferrer(null); setReferrerSearch(''); }}
                        className="w-full text-left px-3 py-1.5 text-sm text-brand-400 hover:bg-brand-50"
                      >
                        None
                      </button>
                      {allClients
                        .filter((c) => {
                          if (!referrerSearch) return true;
                          const s = referrerSearch.toLowerCase();
                          return `${c.first_name} ${c.last_name}`.toLowerCase().includes(s);
                        })
                        .slice(0, 20)
                        .map((c) => (
                          <button
                            key={c.id}
                            onClick={() => {
                              saveField('referred_by', c.id);
                              setReferrer(c);
                              setReferrerSearch('');
                            }}
                            className={`w-full text-left px-3 py-1.5 text-sm hover:bg-brand-50 ${client.referred_by === c.id ? 'bg-accent-50 text-accent-700 font-medium' : 'text-brand-700'}`}
                          >
                            {c.first_name} {c.last_name}
                          </button>
                        ))}
                    </div>
                    <div className="flex items-center gap-2 mt-2">
                      <button
                        onClick={() => setShowCreateReferrer(true)}
                        className="inline-flex items-center gap-1 text-xs font-medium text-accent-600 hover:text-accent-700"
                      >
                        <Plus className="h-3 w-3" /> Create new referrer
                      </button>
                      <button
                        onClick={() => { setEditingField(null); setReferrerSearch(''); }}
                        className="text-xs text-brand-400 hover:text-brand-600"
                      >
                        Cancel
                      </button>
                    </div>
                  </div>
                ) : (
                  /* Create new referrer form */
                  <div className="bg-brand-50 rounded-lg p-3 space-y-2">
                    <p className="text-xs font-semibold text-brand-700">New Referrer</p>
                    <div className="grid grid-cols-2 gap-2">
                      <input
                        type="text"
                        placeholder="First name *"
                        value={newReferrerFirst}
                        onChange={(e) => setNewReferrerFirst(e.target.value)}
                        className="px-2 py-1.5 text-sm border border-brand-200 rounded-lg outline-none focus:border-accent-400"
                      />
                      <input
                        type="text"
                        placeholder="Last name *"
                        value={newReferrerLast}
                        onChange={(e) => setNewReferrerLast(e.target.value)}
                        className="px-2 py-1.5 text-sm border border-brand-200 rounded-lg outline-none focus:border-accent-400"
                      />
                    </div>
                    <input
                      type="email"
                      placeholder="Email (optional)"
                      value={newReferrerEmail}
                      onChange={(e) => setNewReferrerEmail(e.target.value)}
                      className="w-full px-2 py-1.5 text-sm border border-brand-200 rounded-lg outline-none focus:border-accent-400"
                    />
                    <input
                      type="tel"
                      placeholder="Phone (optional)"
                      value={newReferrerPhone}
                      onChange={(e) => setNewReferrerPhone(e.target.value)}
                      className="w-full px-2 py-1.5 text-sm border border-brand-200 rounded-lg outline-none focus:border-accent-400"
                    />
                    <p className="text-[10px] text-brand-400">This creates a contact tagged as &ldquo;Referral Source&rdquo;</p>
                    <div className="flex items-center gap-2">
                      <button
                        onClick={createAndSetReferrer}
                        disabled={!newReferrerFirst.trim() || !newReferrerLast.trim() || savingReferrer}
                        className="inline-flex items-center gap-1 px-3 py-1.5 bg-brand-900 text-white text-xs font-medium rounded-lg hover:bg-brand-800 disabled:opacity-40"
                      >
                        {savingReferrer ? <Loader2 className="h-3 w-3 animate-spin" /> : <Plus className="h-3 w-3" />}
                        Create & Set
                      </button>
                      <button
                        onClick={() => setShowCreateReferrer(false)}
                        className="text-xs text-brand-400 hover:text-brand-600"
                      >
                        Back
                      </button>
                    </div>
                  </div>
                )}
              </div>
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
          { key: 'transactions' as const, label: 'Transactions', icon: Building, count: transactions.length },
          { key: 'inquiries' as const, label: 'Inquiries', icon: FileText, count: inquiries.length },
          { key: 'activity' as const, label: 'Activity', icon: Activity, count: interactions.length },
          { key: 'notes' as const, label: 'Notes', icon: MessageSquare, count: clientNotes.length },
          { key: 'tasks' as const, label: 'Tasks', icon: CheckSquare, count: clientTasks.filter((t) => !t.completed).length },
        ]).map(({ key, label, icon: Icon, count }) => (
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

      {/* Transactions tab */}
      {tab === 'transactions' && (
        <div className="space-y-4">
          {showTxForm ? (
            <div className="bg-white rounded-xl border border-brand-100 p-5 space-y-4">
              <div className="flex items-center justify-between">
                <h3 className="font-semibold text-brand-900 text-sm">{editingTx ? 'Edit Transaction' : 'Add Transaction'}</h3>
                <button onClick={() => { setShowTxForm(false); setEditingTx(null); }} className="text-brand-400 hover:text-brand-700"><X className="h-4 w-4" /></button>
              </div>
              <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
                <div>
                  <label className="block text-xs font-medium text-brand-500 mb-1">Type *</label>
                  <select value={txForm.type} onChange={(e) => setTxForm({ ...txForm, type: e.target.value })} className="w-full px-3 py-2 bg-brand-50 rounded-lg border border-brand-200 text-sm text-brand-900 outline-none focus:border-accent-400">
                    <option value="buy">Buy</option>
                    <option value="sell">Sell</option>
                  </select>
                </div>
                <div>
                  <label className="block text-xs font-medium text-brand-500 mb-1">Status</label>
                  <select value={txForm.status} onChange={(e) => setTxForm({ ...txForm, status: e.target.value })} className="w-full px-3 py-2 bg-brand-50 rounded-lg border border-brand-200 text-sm text-brand-900 outline-none focus:border-accent-400">
                    {TX_STATUSES.map((s) => <option key={s.value} value={s.value}>{s.label}</option>)}
                  </select>
                </div>
              </div>
              <div>
                <label className="block text-xs font-medium text-brand-500 mb-1">Property Address *</label>
                <input type="text" required value={txForm.property_address} onChange={(e) => setTxForm({ ...txForm, property_address: e.target.value })} className="w-full px-3 py-2 bg-brand-50 rounded-lg border border-brand-200 text-sm text-brand-900 outline-none focus:border-accent-400" />
              </div>
              <div className="grid grid-cols-1 sm:grid-cols-3 gap-3">
                <div>
                  <label className="block text-xs font-medium text-brand-500 mb-1">City</label>
                  <input type="text" value={txForm.city} onChange={(e) => setTxForm({ ...txForm, city: e.target.value })} className="w-full px-3 py-2 bg-brand-50 rounded-lg border border-brand-200 text-sm text-brand-900 outline-none focus:border-accent-400" />
                </div>
                <div>
                  <label className="block text-xs font-medium text-brand-500 mb-1">Neighborhood</label>
                  <input type="text" value={txForm.neighborhood} onChange={(e) => setTxForm({ ...txForm, neighborhood: e.target.value })} className="w-full px-3 py-2 bg-brand-50 rounded-lg border border-brand-200 text-sm text-brand-900 outline-none focus:border-accent-400" />
                </div>
                <div>
                  <label className="block text-xs font-medium text-brand-500 mb-1">Property Type</label>
                  <select value={txForm.property_type} onChange={(e) => setTxForm({ ...txForm, property_type: e.target.value })} className="w-full px-3 py-2 bg-brand-50 rounded-lg border border-brand-200 text-sm text-brand-900 outline-none focus:border-accent-400">
                    <option value="">—</option>
                    {PROPERTY_TYPES.map((pt) => <option key={pt} value={pt}>{pt.charAt(0).toUpperCase() + pt.slice(1)}</option>)}
                  </select>
                </div>
              </div>
              <div className="grid grid-cols-1 sm:grid-cols-3 gap-3">
                <div>
                  <label className="block text-xs font-medium text-brand-500 mb-1">Price</label>
                  <input type="number" value={txForm.price} onChange={(e) => setTxForm({ ...txForm, price: e.target.value })} className="w-full px-3 py-2 bg-brand-50 rounded-lg border border-brand-200 text-sm text-brand-900 outline-none focus:border-accent-400" />
                </div>
                <div>
                  <label className="block text-xs font-medium text-brand-500 mb-1">Closing Date</label>
                  <input type="date" value={txForm.closing_date} onChange={(e) => setTxForm({ ...txForm, closing_date: e.target.value })} className="w-full px-3 py-2 bg-brand-50 rounded-lg border border-brand-200 text-sm text-brand-900 outline-none focus:border-accent-400" />
                </div>
                <div>
                  <label className="block text-xs font-medium text-brand-500 mb-1">MLS #</label>
                  <input type="text" value={txForm.mls_number} onChange={(e) => setTxForm({ ...txForm, mls_number: e.target.value })} className="w-full px-3 py-2 bg-brand-50 rounded-lg border border-brand-200 text-sm text-brand-900 outline-none focus:border-accent-400" />
                </div>
              </div>
              <div>
                <label className="block text-xs font-medium text-brand-500 mb-1">Notes</label>
                <textarea value={txForm.notes} onChange={(e) => setTxForm({ ...txForm, notes: e.target.value })} rows={2} className="w-full px-3 py-2 bg-brand-50 rounded-lg border border-brand-200 text-sm text-brand-900 outline-none focus:border-accent-400 resize-none" />
              </div>
              <div className="flex justify-end">
                <button onClick={addTransaction} disabled={!txForm.property_address || savingTx} className="inline-flex items-center gap-1.5 px-4 py-2 bg-brand-900 text-white text-sm font-medium rounded-lg hover:bg-brand-800 disabled:opacity-40 transition-colors">
                  {savingTx ? <Loader2 className="h-3.5 w-3.5 animate-spin" /> : <Plus className="h-3.5 w-3.5" />}
                  {editingTx ? 'Update' : 'Add'} Transaction
                </button>
              </div>
            </div>
          ) : (
            <button onClick={() => setShowTxForm(true)} className="w-full bg-white rounded-xl border border-dashed border-brand-200 p-4 text-sm font-medium text-brand-500 hover:border-accent-400 hover:text-accent-600 transition-colors flex items-center justify-center gap-2">
              <Plus className="h-4 w-4" /> Add Transaction
            </button>
          )}

          {transactions.length === 0 ? (
            <div className="text-center py-8 text-brand-400 text-sm">
              <Building className="h-8 w-8 mx-auto mb-2 text-brand-300" />
              No transactions yet
            </div>
          ) : (
            <div className="space-y-3">
              {transactions.map((tx) => {
                const sc = TX_STATUSES.find((s) => s.value === tx.status);
                return (
                  <div key={tx.id} className="bg-white rounded-xl border border-brand-100 p-4 group">
                    <div className="flex items-start justify-between gap-3">
                      <div className="flex items-start gap-3 flex-1 min-w-0">
                        <div className="w-9 h-9 rounded-lg bg-brand-50 flex items-center justify-center flex-shrink-0 text-lg">
                          {tx.type === 'buy' ? '🏠' : '🏷️'}
                        </div>
                        <div className="flex-1 min-w-0">
                          <div className="flex items-center gap-2 flex-wrap">
                            <p className="font-medium text-brand-900">{tx.property_address}</p>
                            <span className={`text-xs px-2 py-0.5 rounded-full font-medium ${sc?.color || ''}`}>{sc?.label || tx.status}</span>
                          </div>
                          <div className="flex flex-wrap items-center gap-3 text-xs text-brand-500 mt-1">
                            <span className="capitalize">{tx.type}</span>
                            {tx.city && <span>{tx.city}</span>}
                            {tx.price && <span>${tx.price.toLocaleString()}</span>}
                            {tx.closing_date && <span>Closing: {new Date(tx.closing_date + 'T00:00:00').toLocaleDateString()}</span>}
                            {tx.mls_number && <span>MLS# {tx.mls_number}</span>}
                            {tx.property_type && <span className="capitalize">{tx.property_type}</span>}
                          </div>
                          {tx.notes && <p className="text-xs text-brand-400 mt-1">{tx.notes}</p>}
                        </div>
                      </div>
                      <div className="flex items-center gap-1 opacity-0 group-hover:opacity-100 transition-all">
                        <button onClick={() => startEditTx(tx)} className="p-1 text-brand-400 hover:text-accent-600"><Pencil className="h-3.5 w-3.5" /></button>
                        <button onClick={() => deleteTx(tx.id)} className="p-1 text-brand-400 hover:text-rose-500"><Trash2 className="h-3.5 w-3.5" /></button>
                      </div>
                    </div>
                  </div>
                );
              })}
            </div>
          )}

          {/* Open House Visits */}
          {ohVisits.length > 0 && (
            <div className="mt-6">
              <h3 className="text-sm font-semibold text-brand-700 mb-3 flex items-center gap-2">
                <Home className="h-4 w-4" /> Open House Visits
              </h3>
              <div className="space-y-2">
                {ohVisits.map((v) => (
                  <Link
                    key={v.id}
                    href={`/admin/open-houses/${v.open_houses.id}`}
                    className="block bg-white rounded-xl border border-brand-100 p-3 hover:bg-brand-50/50 transition-colors"
                  >
                    <p className="text-sm text-brand-900">
                      Attended open house at <span className="font-medium">{v.open_houses.property_address}</span>
                    </p>
                    <p className="text-xs text-brand-400 mt-0.5">
                      {new Date(v.open_houses.date + 'T00:00:00').toLocaleDateString('en-US', { month: 'short', day: 'numeric', year: 'numeric' })}
                      {v.open_houses.city && ` · ${v.open_houses.city}`}
                    </p>
                  </Link>
                ))}
              </div>
            </div>
          )}
        </div>
      )}

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
                  className="flex items-center justify-between px-5 py-4 cursor-pointer hover:bg-brand-50/50 transition-colors group"
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
                  <div className="flex items-center gap-3 ml-3">
                    <span className="text-xs text-brand-400">{inqNotes.length} notes · {inqTasks.length} tasks</span>
                    <button
                      onClick={(e) => {
                        e.stopPropagation();
                        setDeleteInquiryModal({ id: inq.id, type: inq.interest_type });
                      }}
                      className="p-1 text-brand-400 hover:text-rose-500 transition-colors opacity-0 group-hover:opacity-100"
                      title="Delete inquiry"
                    >
                      <Trash2 className="h-3.5 w-3.5" />
                    </button>
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

      {/* Delete Inquiry Confirmation Modal */}
      {deleteInquiryModal && (
        <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/30" onClick={() => !deletingInquiry && setDeleteInquiryModal(null)}>
          <div className="bg-white rounded-2xl p-6 max-w-sm w-full mx-4 shadow-xl" onClick={(e) => e.stopPropagation()}>
            <div className="flex items-center justify-between mb-4">
              <h3 className="font-semibold text-brand-900">Delete Inquiry</h3>
              <button onClick={() => setDeleteInquiryModal(null)} disabled={deletingInquiry} className="text-brand-400 hover:text-brand-700 disabled:opacity-40">
                <X className="h-4 w-4" />
              </button>
            </div>
            <p className="text-sm text-brand-600 mb-2">{deleteInquiryModal.type}</p>
            <p className="text-sm text-brand-500 mb-6">
              Delete this inquiry? Notes and tasks associated with it will also be removed. This cannot be undone.
            </p>
            <div className="flex gap-2">
              <button
                onClick={() => setDeleteInquiryModal(null)}
                disabled={deletingInquiry}
                className="flex-1 py-2 border border-brand-200 text-brand-700 text-sm font-medium rounded-lg hover:bg-brand-50 disabled:opacity-40"
              >
                Cancel
              </button>
              <button
                onClick={handleDeleteInquiry}
                disabled={deletingInquiry}
                className="flex-1 inline-flex items-center justify-center gap-1.5 py-2 bg-rose-600 text-white text-sm font-medium rounded-lg hover:bg-rose-700 disabled:opacity-40"
              >
                {deletingInquiry ? <Loader2 className="h-4 w-4 animate-spin" /> : <Trash2 className="h-4 w-4" />}
                Delete
              </button>
            </div>
          </div>
        </div>
      )}

      {/* Delete Client Confirmation Modal */}
      {deleteClientModal && (
        <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/30" onClick={() => !deletingClient && setDeleteClientModal(false)}>
          <div className="bg-white rounded-2xl p-6 max-w-sm w-full mx-4 shadow-xl" onClick={(e) => e.stopPropagation()}>
            <div className="flex items-center justify-between mb-4">
              <h3 className="font-semibold text-brand-900">Delete Client</h3>
              <button onClick={() => setDeleteClientModal(false)} disabled={deletingClient} className="text-brand-400 hover:text-brand-700 disabled:opacity-40">
                <X className="h-4 w-4" />
              </button>
            </div>
            <p className="text-sm text-brand-600 mb-2">{client.first_name} {client.last_name}</p>
            <p className="text-sm text-brand-500 mb-6">
              Delete this client and all their data (inquiries, notes, tasks, interactions, transactions)? This cannot be undone.
            </p>
            <div className="flex gap-2">
              <button
                onClick={() => setDeleteClientModal(false)}
                disabled={deletingClient}
                className="flex-1 py-2 border border-brand-200 text-brand-700 text-sm font-medium rounded-lg hover:bg-brand-50 disabled:opacity-40"
              >
                Cancel
              </button>
              <button
                onClick={handleDeleteClient}
                disabled={deletingClient}
                className="flex-1 inline-flex items-center justify-center gap-1.5 py-2 bg-rose-600 text-white text-sm font-medium rounded-lg hover:bg-rose-700 disabled:opacity-40"
              >
                {deletingClient ? <Loader2 className="h-4 w-4 animate-spin" /> : <Trash2 className="h-4 w-4" />}
                Delete
              </button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
}
