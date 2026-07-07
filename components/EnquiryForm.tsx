import React, {useState} from 'react';
import {CheckCircle, ChevronDown} from 'lucide-react';
import {CATEGORIES} from '../constants';
import {databaseService} from '../services/databaseService';
import {useProducts} from '../contexts/ProductContext';
import {useTheme} from '@/contexts/ThemeContext';

const inputStyle: React.CSSProperties = {
    width: '100%',
    padding: '0 0 12px 0',
    border: 'none',
    borderBottom: '1px solid var(--outline-variant)',
    background: 'transparent',
    fontSize: '15px',
    color: 'var(--on-surface)',
    outline: 'none',
    fontFamily: 'Inter, sans-serif',
    transition: 'border-color 0.2s'
};

const labelStyle: React.CSSProperties = {
    display: 'block',
    fontFamily: 'Inter, sans-serif',
    fontSize: '10px',
    fontWeight: 600,
    letterSpacing: '0.12em',
    textTransform: 'uppercase' as const,
        color: 'var(--outline)',
        marginBottom: '10px'
    };

    const optionStyle: React.CSSProperties = {
        backgroundColor: 'var(--surface-white)',
        color: 'var(--on-surface)',
    };

    const EnquiryForm: React.FC = () => {
        const {theme} = useTheme();
        const {categories} = useProducts();
        const categoryList = categories && categories.length > 0 ? categories.map(c => c.name) : CATEGORIES;
        const [isSubmitted, setIsSubmitted] = useState(false);
        const [formData, setFormData] = useState({
            name: '',
            email: '',
            phone: '',
            category: '',
            message: ''
        });

        const handleSubmit = async (e : React.FormEvent) => {
            e.preventDefault();
            try {
                let locationData = undefined;
                if ("geolocation" in navigator) {
                    try {
                        const position = await new Promise<GeolocationPosition>((resolve, reject) => {
                            navigator.geolocation.getCurrentPosition(resolve, reject, {timeout: 5000});
                        });
                        locationData = {
                            lat: position.coords.latitude,
                            lng: position.coords.longitude
                        };
                    } catch {
                        console.log('Location permission denied or timeout');
                    }}
                const finalData = {
                    ...formData,
                    location: locationData
                };
                await databaseService.saveEnquiry(finalData);
                setIsSubmitted(true);
                setTimeout(() => setIsSubmitted(false), 5000);
            } catch (error) {
                console.error('Failed to send enquiry:', error);
                alert('Failed to send enquiry. Please try again.');
            }
        };

        if (isSubmitted) {
            return (<div style={
                {
                    padding: '64px 0',
                    display: 'flex',
                    flexDirection: 'column',
                    alignItems: 'flex-start',
                    gap: '16px'
                }
            }>
                <div style={
                    {
                        display: 'flex',
                        alignItems: 'center',
                        gap: '12px'
                    }
                }>
                    <CheckCircle size={20}
                        color="var(--on-surface)"/>
                    <h3 className="font-caslon"
                        style={
                            {
                                fontSize: '24px',
                                fontWeight: 400,
                                color: 'var(--on-surface)'
                            }
                    }>
                        Message Received.
                    </h3>
                </div>
                <p style={
                    {
                        color: 'var(--on-surface-variant)',
                        fontSize: '15px',
                        lineHeight: '26px',
                        maxWidth: '480px'
                    }
                }>
                    Thank you for reaching out to Noori Marbles. Our expert consultant will contact you within 24 hours.
                </p>
            </div>);
        }

        return (<div>
            <h2 className="font-caslon"
                style={
                    {
                        fontSize: '32px',
                        fontWeight: 400,
                        color: 'var(--on-surface)',
                        marginBottom: '8px'
                    }
            }>
                Book a Consultation
            </h2>
            <p style={
                {
                    color: 'var(--outline)',
                    fontSize: '15px',
                    marginBottom: '48px'
                }
            }>
                Discuss your interior project with our design specialists.
            </p>

            <form onSubmit={handleSubmit}
                style={
                    {
                        display: 'flex',
                        flexDirection: 'column',
                        gap: '40px'
                    }
            }>
                <div style={
                        {
                            display: 'grid',
                            gridTemplateColumns: '1fr 1fr',
                            gap: '40px'
                        }
                    }
                    className="grid-cols-1 sm:grid-cols-2">
                    <div>
                        <label style={labelStyle}>Your Name</label>
                        <input required type="text" placeholder="Full name"
                            style={inputStyle}
                            onChange={
                                (e) => setFormData({
                                    ...formData,
                                    name: e.target.value
                                })
                            }
                            onFocus={
                                e => (e.target.style.borderBottomColor = 'var(--on-surface)')
                            }
                            onBlur={
                                e => (e.target.style.borderBottomColor = 'var(--outline-variant)')
                            }/>
                    </div>
                    <div>
                        <label style={labelStyle}>Phone Number</label>
                        <input required type="tel" placeholder="+91 00000 00000"
                            style={inputStyle}
                            onChange={
                                (e) => setFormData({
                                    ...formData,
                                    phone: e.target.value
                                })
                            }
                            onFocus={
                                e => (e.target.style.borderBottomColor = 'var(--on-surface)')
                            }
                            onBlur={
                                e => (e.target.style.borderBottomColor = 'var(--outline-variant)')
                            }/>
                    </div>
                </div>

                <div style={
                        {
                            display: 'grid',
                            gridTemplateColumns: '1fr 1fr',
                            gap: '40px'
                        }
                    }
                    className="grid-cols-1 sm:grid-cols-2">
                    <div>
                        <label style={labelStyle}>Email Address</label>
                        <input required type="email" placeholder="you@example.com"
                            style={inputStyle}
                            onChange={
                                (e) => setFormData({
                                    ...formData,
                                    email: e.target.value
                                })
                            }
                            onFocus={
                                e => (e.target.style.borderBottomColor = 'var(--on-surface)')
                            }
                            onBlur={
                                e => (e.target.style.borderBottomColor = 'var(--outline-variant)')
                            }/>
                    </div>
                    <div>
                        <label style={labelStyle}>Interested In</label>
                        <div style={
                            {position: 'relative'}
                        }>
                            <select required
                                style={
                                    {
                                        ... inputStyle,
                                        cursor: 'pointer',
                                        appearance: 'none',
                                        colorScheme: theme
                                    }
                                }
                                onChange={
                                    (e) => setFormData({
                                        ...formData,
                                        category: e.target.value
                                    })
                                }
                                onFocus={
                                    e => (e.target.style.borderBottomColor = 'var(--on-surface)')
                                }
                                onBlur={
                                    e => (e.target.style.borderBottomColor = 'var(--outline-variant)')
                            }>
                                <option value="" style={optionStyle}>Select category</option>
                                {
                                categoryList.map(cat => (<option key={cat}
                                    value={cat} style={optionStyle}> {cat}</option>))
                            } </select>
                            <ChevronDown size={14}
                                style={
                                    {
                                        position: 'absolute',
                                        right: 0,
                                        top: '50%',
                                        transform: 'translateY(-50%)',
                                        color: 'var(--outline)',
                                        pointerEvents: 'none'
                                    }
                                }/>
                        </div>
                    </div>
                </div>

                <div>
                    <label style={labelStyle}>Project Details</label>
                    <textarea rows={4}
                        placeholder="Describe your requirements…"
                        style={
                            {
                                ... inputStyle,
                                resize: 'vertical',
                                lineHeight: '24px',
                                paddingBottom: '12px'
                            }
                        }
                        onChange={
                            (e) => setFormData({
                                ...formData,
                                message: e.target.value
                            })
                        }
                        onFocus={
                            e => (e.target.style.borderBottomColor = 'var(--on-surface)')
                        }
                        onBlur={
                            e => (e.target.style.borderBottomColor = 'var(--outline-variant)')
                        }/>
                </div>

                <div>
                    <button type="submit"
                        style={
                            {
                                backgroundColor: 'var(--on-surface)',
                                color: 'var(--surface-white)',
                                border: '1px solid var(--on-surface)',
                                padding: '16px 48px',
                                fontFamily: 'Inter, sans-serif',
                                fontSize: '11px',
                                fontWeight: 600,
                                letterSpacing: '0.12em',
                                textTransform: 'uppercase',
                                cursor: 'pointer',
                                transition: 'background 0.25s, color 0.25s'
                            }
                        }
                        onMouseOver={
                            e => {
                                e.currentTarget.style.background = 'transparent';
                                e.currentTarget.style.color = 'var(--on-surface)';
                            }
                        }
                        onMouseOut={
                            e => {
                                e.currentTarget.style.background = 'var(--on-surface)';
                                e.currentTarget.style.color = 'var(--surface-white)';
                            }
                    }>
                        Send Enquiry
                    </button>
                </div>
            </form>
        </div>);
    };

    export default EnquiryForm;
