import { useState, useEffect } from 'react';
import { fetchJournalEntries } from '../firebase';
import AdminPanel from './AdminPanel';

/* ── Default entries shown when Firestore is not configured or empty ── */
const DEFAULT_ENTRIES = [
    {
        id: 'default-1',
        title: '1. ENUID',
        order: 1,
        paragraphs: [
            'ENUID is a lab, a focused and independent space where intelligence is studied, questioned, built, broken, and rebuilt until it is actually useful. The mission is not to impress the world. It is to change what\'s possible. We believe the next generation of intelligence should not be built by accident. Instead intelligence should be built by intention, deliberately and with care. ENUID is a lab for intelligence that works rather than merely performs. Our aim is intelligence that thinks, adapts, and respects the humans using it.',
            'Our first product is Fluid Orbit. According to ENUID, Fluid Orbit is not a store or a marketplace. It is a Shopping OS — a conversational system that understands your intent and helps you find the products you actually need across the entire internet. e-commerce marketplaces today are stores run by companies and individuals. We build solutions because online shopping today is messy: fake reviews, ads and sponsored products, endless tested filters. Fluid Orbit aims to deliver trusted, quality results fast, clean, honest, and convenient.',
            'The current state of online intelligence whether in AI or e-commerce discovery often values hype over utility. ENUID challenges that by building systems with purpose, clarity, and human respect. For us, intelligence is not a badge, it is a responsibility. A system that helps people find what they truly need, whether it is information or products, must be built transparently, ethically, and with care.',
        ],
        highlight:
            'ENUID is not chasing trends. We are building tools that should exist. Tools that matter, for people. We are building tools that should exist. Tools that matter, for people.',
        meta: ['By team ENUID', 'Posted on 15 February 2026'],
        subsections: [],
        footerMeta: [],
    },
    {
        id: 'default-2',
        title: '2. FLUID ORBIT',
        order: 2,
        paragraphs: [
            'Today, e-commerce is fragmented. Huge marketplaces dominate. Small shops, niche retailers, and specialty stores are scattered across the web. For a customer, finding the right product often means jumping across dozens of marketplaces, reading through pages of mediocre recommendations, and sorting through inconsistent reviews and details.',
            'Many products are buried. Many good shops go unnoticed. Many buyers settle for convenience over quality. The result: a poor shopping experience, low discoverability for small sellers, and commoditization that favors volume over quality.',
            'Fluid Orbit is built to solve this. A Shopping OS — a one place to find products across all kinds of stores from giant marketplaces to niche boutiques. Our goal is to break down marketplace monopoly, surface trusted, high quality and unique products, and give small businesses a fair shot.',
            'We believe the shopping should be where people describe what they want and get trusted quality products from the best stores not what an algorithm or marketplace decided to push.',
            'E-commerce doesn\'t have to be a race to the bottom on price and volume. With Fluid Orbit, we can bring back trust, quality, fairness, and convenience. Buyers get better choices. Sellers get fair visibility. The internet becomes a place where unique, well-made products find, not just bulk commoditized items.',
            'As global commerce becomes more complex and as consumers care more about value, sustainability, and curation, Fluid Orbit stands for a return to thoughtful shopping. Fluid Orbit is an example of what\'s possible when you apply intelligent design and principled architecture to real-world problems.',
            'We try to solve root causes not just build another "better marketplace." It addresses fragmentation, discoverability, quality bias, and the monopoly power of large players.',
            'We are currently prototyping the product that can ingest listings from multiple sources, standardize metadata, and rank them intelligently.',
        ],
        highlight: '',
        meta: [],
        subsections: [
            {
                title: 'What Fluid Orbit Does:',
                items: [
                    'Unified shopping: Aggregates products across major marketplaces, niche stores, and niche independent sellers.',
                    'Rich listing and discovery enabled tags: Not just based on popularity or sales volume. Uses review analysis (price, reviews, relevancy), backend data (inventory, vendor quality), and NLP-driven signals (keyword, category, niche fit).',
                    'Curated quality monitoring: Focused on quality, uniqueness, and value not just what\'s trending.',
                    'Gateways for small sellers and niche businesses: By featuring their products alongside big platforms and options, Fluid Orbit gives them visibility and a chance to compete.',
                    'Transparent metadata and product context: Provides detailed descriptions, origin info, seller data, and honest reviews helping users make informed decisions rather than impulse buys.',
                ],
            },
        ],
        footerMeta: ['by Team ENUID', 'Posted: 9 December 2025'],
    },
];

function Journal({ onBack }) {
    const [entries, setEntries] = useState(DEFAULT_ENTRIES);
    const [showAdmin, setShowAdmin] = useState(false);

    const loadEntries = async () => {
        try {
            const data = await fetchJournalEntries();
            if (data.length > 0) setEntries(data);
        } catch {
            // Firestore not configured or offline — keep defaults
        }
    };

    useEffect(() => {
        loadEntries();
    }, []);

    return (
        <div className="journal-page">
            <header className="journal-topbar">
                <div className="journal-logo">
                    <img src="/IMG_5313.png" alt="ENUID" className="journal-logo-img" />
                    <span className="journal-logo-text">ENUID</span>
                </div>
                <div className="journal-topbar-actions">
                    <button
                        className="journal-admin-btn"
                        onClick={() => setShowAdmin(true)}
                    >
                        ADMIN
                    </button>
                    <button className="journal-home-btn" onClick={onBack}>
                        HOME
                    </button>
                </div>
            </header>

            <div className="journal-content">
                <h1 className="journal-main-title">Journal!</h1>

                {entries.map((entry) => (
                    <section key={entry.id} className="journal-section">
                        <h2 className="journal-section-title">{entry.title}</h2>

                        {entry.paragraphs &&
                            entry.paragraphs.map((p, i) => (
                                <p key={i}>{p}</p>
                            ))}

                        {entry.highlight && (
                            <p className="journal-highlight">{entry.highlight}</p>
                        )}

                        {entry.subsections &&
                            entry.subsections.map((sub, si) => (
                                <div key={si} className="journal-subsection">
                                    <h3 className="journal-subsection-title">{sub.title}</h3>
                                    <ul className="journal-list">
                                        {sub.items.map((item, ii) => (
                                            <li key={ii}>{item}</li>
                                        ))}
                                    </ul>
                                </div>
                            ))}

                        {entry.meta && entry.meta.length > 0 && (
                            <div className="journal-meta">
                                {entry.meta.map((m, i) => (
                                    <div key={i}>{m}</div>
                                ))}
                            </div>
                        )}

                        {entry.footerMeta && entry.footerMeta.length > 0 && (
                            <div className="journal-footer-meta">
                                {entry.footerMeta.map((f, i) => (
                                    <div key={i}>{f}</div>
                                ))}
                            </div>
                        )}
                    </section>
                ))}
            </div>

            {showAdmin && (
                <AdminPanel
                    entries={entries}
                    onClose={() => setShowAdmin(false)}
                    onRefresh={loadEntries}
                    onUpdateLocal={setEntries}
                />
            )}
        </div>
    );
}

export default Journal;
