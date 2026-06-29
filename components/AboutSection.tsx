import React from 'react';

const AboutSection: React.FC = () => {
    return (
        <section id="about" className="py-24 bg-slate-900 text-white overflow-hidden relative">
            <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
                <div className="grid grid-cols-1 lg:grid-cols-2 gap-16 items-center">
                    <div className="relative">
                        <div className="aspect-square rounded-2xl overflow-hidden shadow-2xl border-8 border-white/5">
                            <img
                                src="https://images.unsplash.com/photo-1616486338812-3dadae4b4ace?auto=format&fit=crop&q=80&w=1000"
                                alt="Showroom"
                                className="w-full h-full object-cover"
                            />
                        </div>
                        <div className="absolute -bottom-8 -right-8 bg-amber-500 p-8 rounded-2xl hidden md:block">
                            <h3 className="text-5xl font-serif font-bold mb-1">25+</h3>
                            <p className="text-xs uppercase tracking-widest font-bold">Years of Trust</p>
                        </div>
                    </div>

                    <div>
                        <h2 className="text-4xl md:text-5xl font-serif font-bold mb-8">
                            Welcome to <br />
                            <span className="text-amber-500">Noori Marbels</span>
                        </h2>
                        <p className="text-slate-400 text-lg leading-relaxed mb-8">
                            Established with a vision to bring world-class interior solutions to Bareilly, Noori Marbels has become the city's premier destination for homeowners, architects, and designers.
                        </p>
                        <div className="space-y-6">
                            {[
                                'One-stop showroom for all construction finishes.',
                                'Direct sourcing from leading global brands.',
                                'Expert design consultation for every project.',
                                'Commitment to quality and long-term durability.'
                            ].map((item, idx) => (
                                <div key={idx} className="flex items-center gap-4 group">
                                    <div className="w-10 h-10 rounded-full bg-white/5 flex items-center justify-center group-hover:bg-amber-500 transition-colors">
                                        <div className="w-2 h-2 rounded-full bg-amber-500 group-hover:bg-white"></div>
                                    </div>
                                    <span className="text-slate-300 font-medium">{item}</span>
                                </div>
                            ))}
                        </div>
                    </div>
                </div>
            </div>
        </section>
    );
};

export default AboutSection;
