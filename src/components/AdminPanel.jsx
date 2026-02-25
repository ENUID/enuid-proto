import { useState } from 'react';
import {
    addJournalEntry,
    updateJournalEntry,
    deleteJournalEntry,
    auth,
    signInWithEmailAndPassword,
} from '../firebase';

function AdminPanel({ entries, onClose, onRefresh, onUpdateLocal }) {
    const [isAuthed, setIsAuthed] = useState(false);
    const [email, setEmail] = useState('');
    const [password, setPassword] = useState('');
    const [loginError, setLoginError] = useState('');
    const [loggingIn, setLoggingIn] = useState(false);
    const [editing, setEditing] = useState(null);
    const [saving, setSaving] = useState(false);

    // Form state
    const [form, setForm] = useState({
        title: '',
        paragraph: '',
        highlight: '',
        meta: '',
        subsectionTitle: '',
        subsectionItems: '',
        footerMeta: '',
        order: 1,
    });

    const handleLogin = async (e) => {
        e.preventDefault();
        setLoggingIn(true);
        try {
            await signInWithEmailAndPassword(auth, email, password);
            setIsAuthed(true);
            setLoginError('');
        } catch (err) {
            setLoginError('Invalid email or password');
        } finally {
            setLoggingIn(false);
        }
    };

    const resetForm = () => {
        setForm({
            title: '',
            paragraph: '',
            highlight: '',
            meta: '',
            subsectionTitle: '',
            subsectionItems: '',
            footerMeta: '',
            order: entries.length + 1,
        });
    };

    const startNew = () => {
        resetForm();
        setForm((f) => ({ ...f, order: entries.length + 1 }));
        setEditing('new');
    };

    const startEdit = (entry) => {
        const para = entry.paragraphs && entry.paragraphs.length > 0
            ? entry.paragraphs.join('\n\n')
            : '';
        setForm({
            title: entry.title || '',
            paragraph: para,
            highlight: entry.highlight || '',
            meta: (entry.meta || []).join('\n'),
            subsectionTitle:
                entry.subsections && entry.subsections[0]
                    ? entry.subsections[0].title
                    : '',
            subsectionItems:
                entry.subsections && entry.subsections[0]
                    ? entry.subsections[0].items.join('\n')
                    : '',
            footerMeta: (entry.footerMeta || []).join('\n'),
            order: entry.order || 1,
        });
        setEditing(entry.id);
    };



    const isDefaultEntry = (id) => typeof id === 'string' && id.startsWith('default-');

    const handleSave = () => {
        if (!form.title.trim()) return;

        const data = {
            title: form.title.trim(),
            paragraphs: form.paragraph
                .split('\n\n')
                .map((p) => p.trim())
                .filter(Boolean),
            highlight: form.highlight.trim(),
            meta: form.meta
                .split('\n')
                .map((m) => m.trim())
                .filter(Boolean),
            subsections:
                form.subsectionItems.trim()
                    ? [
                        {
                            title: form.subsectionTitle.trim(),
                            items: form.subsectionItems
                                .split('\n')
                                .map((i) => i.trim())
                                .filter(Boolean),
                        },
                    ]
                    : [],
            footerMeta: form.footerMeta
                .split('\n')
                .map((f) => f.trim())
                .filter(Boolean),
            order: Number(form.order) || 1,
        };

        // ── Optimistic update: apply locally FIRST, then sync Firestore in background ──
        if (editing === 'new' || isDefaultEntry(editing)) {
            const tempId = 'local-' + Date.now();
            const newEntry = { id: tempId, ...data };
            const updated = [...entries.filter(e => e.id !== editing), newEntry]
                .sort((a, b) => (a.order || 0) - (b.order || 0));
            onUpdateLocal(updated);

            // Background Firestore save (non-blocking)
            addJournalEntry(data)
                .then(() => onRefresh())
                .catch((err) => console.warn('Firestore save (background):', err));
        } else {
            const updated = entries.map(e =>
                e.id === editing ? { ...e, ...data } : e
            ).sort((a, b) => (a.order || 0) - (b.order || 0));
            onUpdateLocal(updated);

            updateJournalEntry(editing, data)
                .then(() => onRefresh())
                .catch((err) => console.warn('Firestore update (background):', err));
        }

        setEditing(null);
    };

    const handleDelete = (id) => {
        if (isDefaultEntry(id)) {
            // Remove default entry locally
            const updated = entries.filter(e => e.id !== id);
            onUpdateLocal(updated);
            return;
        }
        if (!window.confirm('Delete this entry permanently?')) return;

        // Remove locally first
        const updated = entries.filter(e => e.id !== id);
        onUpdateLocal(updated);

        // Background Firestore delete
        deleteJournalEntry(id)
            .then(() => onRefresh())
            .catch((err) => console.warn('Firestore delete (background):', err));
    };

    // ── Password gate ──
    if (!isAuthed) {
        return (
            <div className="admin-overlay" onClick={onClose}>
                <div className="admin-modal" onClick={(e) => e.stopPropagation()}>
                    <button className="admin-close" onClick={onClose}>✕</button>
                    <h2 className="admin-title">Admin Login</h2>
                    <form onSubmit={handleLogin} className="admin-login-form">
                        <input
                            type="email"
                            placeholder="Admin email"
                            value={email}
                            onChange={(e) => setEmail(e.target.value)}
                            className="admin-input"
                            autoFocus
                        />
                        <input
                            type="password"
                            placeholder="Password"
                            value={password}
                            onChange={(e) => setPassword(e.target.value)}
                            className="admin-input"
                        />
                        {loginError && <div className="admin-error">{loginError}</div>}
                        <button type="submit" className="admin-btn admin-btn-primary" disabled={loggingIn}>
                            {loggingIn ? 'Logging in…' : 'Log In'}
                        </button>
                    </form>
                </div>
            </div>
        );
    }

    // ── Entry editor form ──
    if (editing !== null) {
        return (
            <div className="admin-overlay" onClick={onClose}>
                <div className="admin-modal admin-modal-wide" onClick={(e) => e.stopPropagation()}>
                    <button className="admin-close" onClick={() => setEditing(null)}>✕</button>
                    <h2 className="admin-title">
                        {editing === 'new'
                            ? 'New Journal Entry'
                            : isDefaultEntry(editing)
                                ? 'Edit Default Entry'
                                : 'Edit Entry'}
                    </h2>

                    <div className="admin-form">
                        <label className="admin-label">
                            Section Title
                            <input
                                type="text"
                                className="admin-input"
                                value={form.title}
                                onChange={(e) => setForm({ ...form, title: e.target.value })}
                                placeholder="e.g. 1. ENUID"
                            />
                        </label>



                        {/* ── Single paragraph content ── */}
                        <label className="admin-label">
                            Content
                            <span className="admin-hint">Write all content here. Use a blank line (double Enter) to separate paragraphs.</span>
                            <textarea
                                className="admin-textarea"
                                rows={10}
                                value={form.paragraph}
                                onChange={(e) => setForm({ ...form, paragraph: e.target.value })}
                                placeholder="Write your journal entry content here..."
                            />
                        </label>

                        <label className="admin-label">
                            Highlight Quote (optional)
                            <input
                                type="text"
                                className="admin-input"
                                value={form.highlight}
                                onChange={(e) => setForm({ ...form, highlight: e.target.value })}
                                placeholder="An italic highlighted statement"
                            />
                        </label>

                        <label className="admin-label">
                            Subsection Title (optional)
                            <input
                                type="text"
                                className="admin-input"
                                value={form.subsectionTitle}
                                onChange={(e) =>
                                    setForm({ ...form, subsectionTitle: e.target.value })
                                }
                                placeholder="e.g. What Fluid Orbit Does:"
                            />
                        </label>

                        <label className="admin-label">
                            Subsection Bullet Items (optional)
                            <span className="admin-hint">One item per line — these will appear as bullet points</span>
                            <textarea
                                className="admin-textarea"
                                rows={5}
                                value={form.subsectionItems}
                                onChange={(e) =>
                                    setForm({ ...form, subsectionItems: e.target.value })
                                }
                                placeholder={"First bullet point\nSecond bullet point"}
                            />
                        </label>

                        <label className="admin-label">
                            Metadata Lines (optional)
                            <span className="admin-hint">One per line, shown in small text at section end</span>
                            <textarea
                                className="admin-textarea"
                                rows={3}
                                value={form.meta}
                                onChange={(e) => setForm({ ...form, meta: e.target.value })}
                                placeholder={"By Team ENUID\nPosted: 9 December 2025"}
                            />
                        </label>


                        <div className="admin-actions">
                            <button
                                className="admin-btn admin-btn-secondary"
                                onClick={() => setEditing(null)}
                            >
                                Cancel
                            </button>
                            <button
                                className="admin-btn admin-btn-primary"
                                onClick={handleSave}
                                disabled={saving}
                            >
                                {saving ? 'Saving...' : 'Save Entry'}
                            </button>
                        </div>
                    </div>
                </div>
            </div>
        );
    }

    // ── Entry list ──
    return (
        <div className="admin-overlay" onClick={onClose}>
            <div className="admin-modal admin-modal-wide" onClick={(e) => e.stopPropagation()}>
                <button className="admin-close" onClick={onClose}>✕</button>
                <h2 className="admin-title">Manage Journal</h2>

                <button className="admin-btn admin-btn-primary admin-new-btn" onClick={startNew}>
                    + New Entry
                </button>

                {entries.length === 0 && (
                    <p className="admin-empty">No entries yet. Click "+ New Entry" to create one.</p>
                )}

                <div className="admin-entry-list">
                    {entries.map((entry) => (
                        <div key={entry.id} className="admin-entry-row">
                            <div className="admin-entry-info">
                                <span className="admin-entry-order">#{entry.order}</span>
                                <span className="admin-entry-title">{entry.title}</span>
                                {isDefaultEntry(entry.id) && (
                                    <span className="admin-entry-badge">DEFAULT</span>
                                )}
                            </div>
                            <div className="admin-entry-actions">
                                <button
                                    className="admin-btn admin-btn-small"
                                    onClick={() => startEdit(entry)}
                                >
                                    Edit
                                </button>
                                <button
                                    className="admin-btn admin-btn-small admin-btn-danger"
                                    onClick={() => handleDelete(entry.id)}
                                    disabled={saving}
                                >
                                    Delete
                                </button>
                            </div>
                        </div>
                    ))}
                </div>
            </div>
        </div>
    );
}

export default AdminPanel;
