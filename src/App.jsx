import { useEffect, useMemo, useRef, useState } from "react";
import { useScroll, useSpring } from "framer-motion";
import { Beaker, BookOpenText, Radar } from "lucide-react";
import Header from "./components/Header";
import Hero from "./components/Hero";
import ExplanationSection from "./components/ExplanationSection";
import OdeSimulatorSection from "./components/OdeSimulatorSection";
import SirSection from "./components/SirSection";

function App() {
    const explanationRef = useRef(null);
    const simulatorRef = useRef(null);
    const epidemiologyRef = useRef(null);

    const sections = useMemo(
        () => [
            {
                id: "explicacion",
                title: "Explicacion",
                ref: explanationRef,
                icon: BookOpenText,
            },
            {
                id: "simulador",
                title: "Simulador",
                ref: simulatorRef,
                icon: Beaker,
            },
            {
                id: "epidemiologia",
                title: "Epidemiologia",
                ref: epidemiologyRef,
                icon: Radar,
            },
        ],
        []
    );

    const [activeSection, setActiveSection] = useState("explicacion");
    const { scrollYProgress } = useScroll();
    const progress = useSpring(scrollYProgress, {
        stiffness: 135,
        damping: 27,
        mass: 0.3,
    });

    const navigateTo = (id) => {
        const target = sections.find((item) => item.id === id);
        if (!target?.ref?.current) return;

        target.ref.current.scrollIntoView({ behavior: "smooth", block: "start" });
    };

    useEffect(() => {
        const observer = new IntersectionObserver(
            (entries) => {
                entries.forEach((entry) => {
                    if (entry.isIntersecting) {
                        setActiveSection(entry.target.id);
                    }
                });
            },
            {
                rootMargin: "-40% 0px -45% 0px",
                threshold: 0.1,
            }
        );

        sections.forEach((section) => {
            if (section.ref.current) {
                observer.observe(section.ref.current);
            }
        });

        return () => observer.disconnect();
    }, [sections]);

    return (
        <div className="app-shell">
            <div className="noise-layer" aria-hidden />
            <div className="bg-blob bg-blob-a" aria-hidden />
            <div className="bg-blob bg-blob-b" aria-hidden />

            <Header
                sections={sections}
                activeSection={activeSection}
                onNavigate={navigateTo}
                progress={progress}
            />

            <main className="main-content">
                <Hero onExplore={() => navigateTo("explicacion")} />

                <section id="explicacion" ref={explanationRef} className="stage-block">
                    <ExplanationSection />
                </section>

                <section id="simulador" ref={simulatorRef} className="stage-block">
                    <OdeSimulatorSection />
                </section>

                <section id="epidemiologia" ref={epidemiologyRef} className="stage-block">
                    <SirSection />
                </section>
            </main>
        </div>
    );
}

export default App;
