import { motion } from "framer-motion";

export default function Header({ sections, activeSection, onNavigate, progress }) {
    return (
        <header className="topbar">
            <div className="topbar-inner">
                <div className="brand">
                    <span className="brand-dot" />
                    <span className="brand-title">edo studio</span>
                </div>

                <nav className="nav-cluster" aria-label="Navegacion principal">
                    {sections.map((section) => {
                        const Icon = section.icon;
                        const isActive = activeSection === section.id;

                        return (
                            <button
                                key={section.id}
                                type="button"
                                className={`nav-pill-btn ${isActive ? "is-active" : ""}`}
                                onClick={() => onNavigate(section.id)}
                            >
                                {isActive && (
                                    <motion.span
                                        className="nav-pill-bg"
                                        layoutId="active-pill"
                                        transition={{ type: "spring", stiffness: 320, damping: 28 }}
                                    />
                                )}
                                <Icon size={16} strokeWidth={2.1} />
                                <span>{section.title}</span>
                            </button>
                        );
                    })}
                </nav>
                <div className="topbar-credit">Desarrollado por Andres Jaramillo y Diego Carrasquilla</div>
            </div>

            <motion.div className="scroll-progress" style={{ scaleX: progress }} />
        </header>
    );
}
