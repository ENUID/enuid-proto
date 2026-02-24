import { useState } from 'react';
import {
    addJournalEntry,
    updateJournalEntry,
    deleteJournalEntry,
} from '../firebase';

function AdminPanel({ entries, onClose, onRefresh, onUpdateLocal }) {
    const [isAuthed, setIsAuthed] = useState(false);
    const [email, setEmail] = useState('');
    const [password, setPassword] = useState('');
    const [loginError, setLoginError] = useState('');
    const [editing, setEditing] = useState(null);
    const [saving, setSaving] = useState(false);

    // Form state
    const [form, setForm] = useState({
        title: '',
        paragraphs: [''],
        highlight: '',
        meta: '',
        subsectionTitle: '',
        subsectionItems: '',
        footerMeta: '',
        order: 1,
    });

    const handleLogin = (e) => {
        e.preventDefault();
        const adminEmail = import.meta.env.VITE_ADMIN_EMAIL;
        const adminPw = import.meta.env.VITE_ADMIN_PASSWORD;
        if (email === adminEmail && password === adminPw) {
            setIsAuthed(true);
            setLoginError('');
        } else {
            setLoginError('Invalid email or password');
        }
    };

    const resetForm = () => {
        setForm({
            title: '',
            paragraphs: [''],
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
        const paras = entry.paragraphs && entry.paragraphs.length > 0
            ? [...entry.paragraphs]
            : [''];
        setForm({
            title: entry.title || '',
            paragraphs: paras,
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

    // ── Paragraph management ──
    const updateParagraph = (index, value) => {
        const updated = [...form.paragraphs];
        updated[index] = value;
        setForm({ ...form, paragraphs: updated });
    };

    const addParagraph = () => {
        setForm({ ...form, paragraphs: [...form.paragraphs, ''] });
    };

    const removeParagraph = (index) => {
        if (form.paragraphs.length <= 1) return;
        const updated = form.paragraphs.filter((_, i) => i !== index);
        setForm({ ...form, paragraphs: updated });
    };

    const moveParagraph = (index, direction) => {
        const newIndex = index + direction;
        if (newIndex < 0 || newIndex >= form.paragraphs.length) return;
        const updated = [...form.paragraphs];
        [updated[index], updated[newIndex]] = [updated[newIndex], updated[index]];
        setForm({ ...form, paragraphs: updated });
    };

    const isDefaultEntry = (id) => typeof id === 'string' && id.startsWith('default-');

    const handleSave = () => {
        if (!form.title.trim()) return;

        const data = {
            title: form.title.trim(),
            paragraphs: form.paragraphs
                .map((p) => p.trim())
                .filter(Boolean),
            highlight: form.highlight.trim(),
            meta: form.meta
                .split('\n')
                .map((m) => m.trim())
                .filter(Boolean),
            subsections:
                form.subsectionTitle.trim()
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
                        <button type="submit" className="admin-btn admin-btn-primary">
                            Log In
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
                                ? 'Edit Default Entry (will save to database)'
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

                        <label className="admin-label">
                            Order (number)
                            <input
                                type="number"
                                className="admin-input"
                                value={form.order}
                                onChange={(e) => setForm({ ...form, order: e.target.value })}
                                min="1"
                            />
                        </label>

                        {/* ── Individual paragraphs ── */}
                        <div className="admin-label">
                            Paragraphs
                            <span className="admin-hint">Each paragraph is a separate block. Reorder with ▲ ▼ arrows.</span>
                        </div>

                        {form.paragraphs.map((para, i) => (
                            <div key={i} className="admin-para-row">
                                <div className="admin-para-header">
                                    <span className="admin-para-num">¶{i + 1}</span>
                                    <div className="admin-para-controls">
                                        <button
                                            type="button"
                                            className="admin-btn admin-btn-icon"
                                            onClick={() => moveParagraph(i, -1)}
                                            disabled={i === 0}
                                            title="Move up"
                                        >▲</button>
                                        <button
                                            type="button"
                                            className="admin-btn admin-btn-icon"
                                            onClick={() => moveParagraph(i, 1)}
                                            disabled={i === form.paragraphs.length - 1}
                                            title="Move down"
                                        >▼</button>
                                        <button
                                            type="button"
                                            className="admin-btn admin-btn-icon admin-btn-danger"
                                            onClick={() => removeParagraph(i)}
                                            disabled={form.paragraphs.length <= 1}
                                            title="Remove paragraph"
                                        >✕</button>
                                    </div>
                                </div>
                                <textarea
                                    className="admin-textarea"
                                    rows={4}
                                    value={para}
                                    onChange={(e) => updateParagraph(i, e.target.value)}
                                    placeholder={`Paragraph ${i + 1}...`}
                                />
                            </div>
                        ))}

                        <button
                            type="button"
                            className="admin-btn admin-btn-secondary admin-add-para-btn"
                            onClick={addParagraph}
                        >
                            + Add Paragraph
                        </button>

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

                        {form.subsectionTitle && (
                            <label className="admin-label">
                                Subsection Bullet Items
                                <span className="admin-hint">One item per line</span>
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
                        )}

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
