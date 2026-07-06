import React from 'react';
import ContactSection from '../components/ContactSection';

const ContactPage: React.FC = () => {
    return (
        <div style={{ minHeight: '100vh', backgroundColor: 'var(--surface)', paddingTop: '64px', transition: 'background-color 0.4s ease' }}>
            {/* Page header */}
            <div
                style={{
                    backgroundColor: 'var(--surface-white)',
                    borderBottom: '1px solid var(--outline-variant)',
                    padding: '64px 80px 48px',
                    transition: 'background-color 0.4s ease, border-color 0.4s ease',
                }}
                className="px-6 md:px-[80px]"
            >
                <div style={{ maxWidth: '1400px', margin: '0 auto' }}>
                    <p className="label-caps" style={{ color: 'var(--outline)', marginBottom: '16px' }}>
                        Reach Out
                    </p>
                    <h1
                        className="font-caslon"
                        style={{
                            fontSize: 'clamp(32px, 4vw, 56px)',
                            fontWeight: 400,
                            color: 'var(--on-surface)',
                            lineHeight: 1.1,
                            maxWidth: '600px',
                        }}
                    >
                        Let's Build Something<br />Extraordinary.
                    </h1>
                </div>
            </div>

            <ContactSection />
        </div>
    );
};

export default ContactPage;
