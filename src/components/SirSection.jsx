import { useMemo, useState } from "react";
import { motion } from "framer-motion";
import {
    CartesianGrid,
    Legend,
    Line,
    LineChart,
    ResponsiveContainer,
    Tooltip,
    XAxis,
    YAxis,
} from "recharts";
import { Activity, Biohazard, FileCode2, Orbit, ShieldCheck } from "lucide-react";
import { sirDefaults } from "../data/models";
import { rk4Sir, summarizeSir } from "../utils/solvers";
import NotebookCodeBlock from "./NotebookCodeBlock";
import Reveal from "./Reveal";
import StatTile from "./StatTile";

function fixed(value, digits = 2) {
    return Number(value).toFixed(digits);
}

function sliderProgress(value, min, max) {
    const ratio = (value - min) / (max - min);
    return Math.max(0, Math.min(100, ratio * 100));
}

export default function SirSection() {
    const [beta, setBeta] = useState(sirDefaults.beta);
    const [gamma, setGamma] = useState(sirDefaults.gamma);
    const [infected0, setInfected0] = useState(sirDefaults.infected0);
    const [step, setStep] = useState(sirDefaults.step);

    const sirPoints = useMemo(
        () =>
            rk4Sir({
                population: sirDefaults.population,
                beta,
                gamma,
                infected0,
                recovered0: sirDefaults.recovered0,
                step,
                days: sirDefaults.days,
            }),
        [beta, gamma, infected0, step]
    );

    const stats = useMemo(() => summarizeSir(sirPoints, beta, gamma), [sirPoints, beta, gamma]);
    const growthLabel = `${fixed(stats.initialGrowthRate * 100, 2)}%/dia`;
    const doublingLabel = Number.isFinite(stats.doublingDays)
        ? `${fixed(stats.doublingDays, 1)} dias`
        : "No aplica";
    const criticalWindowLabel =
        stats.criticalWindowDays !== null
            ? `${fixed(stats.criticalWindowDays, 1)} dias`
            : "No definido";

    const statCards = [
        {
            label: "R0 actual",
            value: fixed(stats.r0, 2),
            tone: stats.r0 > 1 ? "orange" : "green",
            hint: stats.r0 > 1 ? "Riesgo de expansion" : "Tendencia al control",
        },
        {
            label: "Pico de contagio",
            value: `Dia ${Math.round(stats.peakDay)}`,
            tone: "orange",
            hint: `${fixed(stats.peakInfectedPct, 1)}% infectados`,
        },
        {
            label: "Impacto acumulado",
            value: `${fixed(stats.totalAffectedPct, 1)}%`,
            tone: "green",
            hint: "Infectados + recuperados al final",
        },
        {
            label: "Inmunidad de rebanio",
            value: stats.r0 > 1 ? `${fixed(stats.herdThresholdPct, 1)}%` : "n/a",
            tone: "purple",
            hint: "Umbral teorico",
        },
    ];

    const tableRows = sirPoints.slice(0, 21);

    return (
        <div className="section-shell">
            <Reveal>
                <div className="section-head">
                    <span className="section-tag">Parte 3 · Ejemplo epidemiologico</span>
                    <h2>Modelo SIR con Runge-Kutta de orden 4</h2>
                    <p>
                        Aqui aterrizamos la matematica en un escenario real: propagacion de
                        enfermedad. Puedes mover parametros y observar decisiones de politica
                        sanitaria casi en tiempo real. No solo simulamos: tambien interpretamos
                        el brote con un flujo de analisis epidemiologico.
                    </p>
                </div>
            </Reveal>

            <Reveal delay={0.05}>
                <article className="sir-flow-card">
                    <div className="sir-node tone-blue">
                        <h4>S</h4>
                        <p>Susceptibles</p>
                    </div>
                    <span className="sir-arrow">beta * S * I / N</span>
                    <div className="sir-node tone-orange">
                        <h4>I</h4>
                        <p>Infectados</p>
                    </div>
                    <span className="sir-arrow">gamma * I</span>
                    <div className="sir-node tone-green">
                        <h4>R</h4>
                        <p>Recuperados</p>
                    </div>
                </article>
            </Reveal>

            <Reveal delay={0.1}>
                <article className="sir-live-card">
                    <header className="sir-live-header">
                        <div className="sir-live-title">
                            <Orbit size={18} />
                            <h3>Panel epidemiologico en vivo</h3>
                        </div>
                        <p>Ajusta parametros y mira de inmediato como cambian las curvas SIR.</p>
                    </header>

                    <div className="sir-live-grid">
                        <section className="sir-control-panel" aria-label="Controles epidemiologicos">
                            <div className="control-grid control-grid-2x2">
                                <label className="field field-slider">
                                    <div className="field-line">
                                        <span>Beta (transmision)</span>
                                        <strong>{fixed(beta, 2)}</strong>
                                    </div>
                                    <input
                                        className="range-input"
                                        type="range"
                                        min="0.05"
                                        max="0.8"
                                        step="0.01"
                                        value={beta}
                                        style={{
                                            "--fill": `${sliderProgress(beta, 0.05, 0.8)}%`,
                                            "--slider-color": "#2e62dc",
                                        }}
                                        onChange={(event) => setBeta(Number(event.target.value))}
                                    />
                                    <div className="range-hints">
                                        <small>0.05</small>
                                        <small>0.80</small>
                                    </div>
                                </label>

                                <label className="field field-slider">
                                    <div className="field-line">
                                        <span>Gamma (recuperacion)</span>
                                        <strong>{fixed(gamma, 2)}</strong>
                                    </div>
                                    <input
                                        className="range-input"
                                        type="range"
                                        min="0.02"
                                        max="0.5"
                                        step="0.01"
                                        value={gamma}
                                        style={{
                                            "--fill": `${sliderProgress(gamma, 0.02, 0.5)}%`,
                                            "--slider-color": "#d96437",
                                        }}
                                        onChange={(event) => setGamma(Number(event.target.value))}
                                    />
                                    <div className="range-hints">
                                        <small>0.02</small>
                                        <small>0.50</small>
                                    </div>
                                </label>

                                <label className="field field-slider">
                                    <div className="field-line">
                                        <span>Infectados iniciales</span>
                                        <strong>{infected0}</strong>
                                    </div>
                                    <input
                                        className="range-input"
                                        type="range"
                                        min="1"
                                        max="700"
                                        step="1"
                                        value={infected0}
                                        style={{
                                            "--fill": `${sliderProgress(infected0, 1, 700)}%`,
                                            "--slider-color": "#168b63",
                                        }}
                                        onChange={(event) => setInfected0(Number(event.target.value))}
                                    />
                                    <div className="range-hints">
                                        <small>1</small>
                                        <small>700</small>
                                    </div>
                                </label>

                                <label className="field field-slider">
                                    <div className="field-line">
                                        <span>Paso temporal (dias)</span>
                                        <strong>{fixed(step, 1)}</strong>
                                    </div>
                                    <input
                                        className="range-input"
                                        type="range"
                                        min="0.1"
                                        max="4"
                                        step="0.1"
                                        value={step}
                                        style={{
                                            "--fill": `${sliderProgress(step, 0.1, 4)}%`,
                                            "--slider-color": "#6856ba",
                                        }}
                                        onChange={(event) => setStep(Number(event.target.value))}
                                    />
                                    <div className="range-hints">
                                        <small>0.1</small>
                                        <small>4.0</small>
                                    </div>
                                </label>
                            </div>
                        </section>

                        <section className="sir-chart-panel" aria-label="Grafica SIR">
                            <header>
                                <Biohazard size={18} />
                                <h3>Curvas SIR (% de poblacion)</h3>
                            </header>
                            <div className="chart-wrap sir-chart-wrap">
                                <ResponsiveContainer width="100%" height="100%">
                                    <LineChart data={sirPoints} margin={{ top: 10, right: 18, left: -12, bottom: 6 }}>
                                        <CartesianGrid strokeDasharray="3 3" stroke="rgba(31, 43, 68, 0.1)" />
                                        <XAxis
                                            dataKey="day"
                                            tick={{ fill: "#5f6b7d", fontSize: 12 }}
                                            type="number"
                                            domain={["dataMin", "dataMax"]}
                                        />
                                        <YAxis tick={{ fill: "#5f6b7d", fontSize: 12 }} unit="%" />
                                        <Tooltip
                                            contentStyle={{
                                                borderRadius: 12,
                                                border: "1px solid #dce2f2",
                                                boxShadow: "0 16px 42px rgba(24, 35, 58, 0.12)",
                                            }}
                                            formatter={(value) => `${fixed(Number(value), 2)}%`}
                                        />
                                        <Legend />
                                        <Line
                                            type="monotone"
                                            dataKey="susceptiblePct"
                                            stroke="#3069f0"
                                            strokeWidth={2.4}
                                            dot={false}
                                            name="Susceptibles"
                                        />
                                        <Line
                                            type="monotone"
                                            dataKey="infectedPct"
                                            stroke="#dd6b3f"
                                            strokeWidth={2.6}
                                            dot={false}
                                            name="Infectados"
                                        />
                                        <Line
                                            type="monotone"
                                            dataKey="recoveredPct"
                                            stroke="#17976a"
                                            strokeWidth={2.4}
                                            dot={false}
                                            name="Recuperados"
                                        />
                                    </LineChart>
                                </ResponsiveContainer>
                            </div>
                        </section>
                    </div>
                </article>
            </Reveal>

            <Reveal delay={0.14}>
                <article className="story-card">
                    <header>
                        <Activity size={18} />
                        <h3>Como se simula SIR con RK4</h3>
                    </header>

                    <div className="sir-calc-grid">
                        <div className="sir-calc-panel">
                            <h4>Sistema de ecuaciones</h4>
                            <p className="mono-row">dS/dt = -beta·S·I/N</p>
                            <p className="mono-row">dI/dt = beta·S·I/N - gamma·I</p>
                            <p className="mono-row">dR/dt = gamma·I</p>

                            <h4>Integracion RK4 para sistemas</h4>
                            <p className="mono-row">k1S = fS(S_n, I_n), k1I = fI(S_n, I_n), k1R = fR(I_n)</p>
                            <p className="mono-row">k2* usa estado medio: (S_n + h*k1S/2, I_n + h*k1I/2)</p>
                            <p className="mono-row">k3* usa otro estado medio corregido</p>
                            <p className="mono-row">k4* usa estado final estimado</p>
                            <p className="mono-row">S_(n+1) = S_n + (h/6)(k1S + 2k2S + 2k3S + k4S)</p>
                            <p className="mono-row">I_(n+1) = I_n + (h/6)(k1I + 2k2I + 2k3I + k4I)</p>
                            <p className="mono-row">R_(n+1) = R_n + (h/6)(k1R + 2k2R + 2k3R + k4R)</p>
                        </div>

                        <div className="sir-calc-panel tone-blue">
                            <h4>Reglas de interpretacion sin valores fijos</h4>
                            <p className="mono-row">Si beta aumenta, la transferencia S a I se acelera.</p>
                            <p className="mono-row">Si gamma aumenta, la transferencia I a R se acelera.</p>
                            <p className="mono-row">R0 = beta/gamma resume el riesgo inicial del brote.</p>
                            <p className="mono-row">El pico ocurre cuando la curva I(t) deja de crecer.</p>
                            <p className="mono-row emphasis-blue">Conservacion: S(t) + I(t) + R(t) = N</p>
                        </div>
                    </div>
                </article>
            </Reveal>

            <Reveal delay={0.16}>
                <article className="story-card">
                    <header>
                        <FileCode2 size={18} />
                        <h3>Seccion especial: implementacion en Python (SIR)</h3>
                    </header>
                    <p>
                        Asi se ve, en Python, la estructura esencial de nuestro codigo para
                        simular epidemiologia con RK4.
                    </p>

                    <div className="python-grid python-grid-single">
                        <div className="python-snippet">
                            <h4>Modelo SIR + paso RK4</h4>
                            <NotebookCodeBlock code={`def sir_derivatives(S, I, R, beta, gamma, N):
    dS = -beta * S * I / N
    dI =  beta * S * I / N - gamma * I
    dR =  gamma * I
    return dS, dI, dR

def rk4_step_sir(S, I, R, h, beta, gamma, N):
    k1S, k1I, k1R = sir_derivatives(S, I, R, beta, gamma, N)

    k2S, k2I, k2R = sir_derivatives(
        S + h*k1S/2,
        I + h*k1I/2,
        R + h*k1R/2,
        beta, gamma, N
    )

    k3S, k3I, k3R = sir_derivatives(
        S + h*k2S/2,
        I + h*k2I/2,
        R + h*k2R/2,
        beta, gamma, N
    )

    k4S, k4I, k4R = sir_derivatives(
        S + h*k3S,
        I + h*k3I,
        R + h*k3R,
        beta, gamma, N
    )

    S_next = S + (h/6) * (k1S + 2*k2S + 2*k3S + k4S)
    I_next = I + (h/6) * (k1I + 2*k2I + 2*k3I + k4I)
    R_next = R + (h/6) * (k1R + 2*k2R + 2*k3R + k4R)

    return S_next, I_next, R_next`} />
                        </div>
                    </div>
                </article>
            </Reveal>

            <Reveal delay={0.2}>
                <div className="stat-grid">
                    {statCards.map((card) => (
                        <StatTile
                            key={card.label}
                            label={card.label}
                            value={card.value}
                            tone={card.tone}
                            hint={card.hint}
                        />
                    ))}
                </div>
            </Reveal>

            <Reveal delay={0.24}>
                <article className="process-card">
                    <header>
                        <Activity size={18} />
                        <h3>Como analizamos el escenario epidemiologico</h3>
                    </header>

                    <div className="analysis-grid">
                        <div className="analysis-step">
                            <h4>1) Riesgo de expansion</h4>
                            <p className="analysis-emphasis">R0 = {fixed(stats.r0, 2)}</p>
                            <p>
                                Si R0 supera 1, la curva de infectados suele crecer. Si cae por debajo
                                de 1, la epidemia tiende a controlarse.
                            </p>
                        </div>

                        <div className="analysis-step">
                            <h4>2) Velocidad inicial</h4>
                            <p className="analysis-emphasis">Crecimiento: {growthLabel}</p>
                            <p className="analysis-emphasis">Duplicacion: {doublingLabel}</p>
                            <p>
                                Esta lectura temprana te dice cuan rapido se acelera el brote en los
                                primeros dias.
                            </p>
                        </div>

                        <div className="analysis-step">
                            <h4>3) Presion maxima</h4>
                            <p className="analysis-emphasis">
                                Pico: dia {Math.round(stats.peakDay)} con {fixed(stats.peakInfectedPct, 1)}%
                            </p>
                            <p className="analysis-emphasis">Re en el pico: {fixed(stats.reAtPeak, 2)}</p>
                            <p>
                                Cuando Re se acerca a 1 cerca del pico, el sistema empieza a perder
                                fuerza de propagacion.
                            </p>
                        </div>

                        <div className="analysis-step">
                            <h4>4) Duracion e impacto total</h4>
                            <p className="analysis-emphasis">Ventana critica: {criticalWindowLabel}</p>
                            <p className="analysis-emphasis">
                                Afectados acumulados: {fixed(stats.totalAffectedPct, 1)}%
                            </p>
                            <p>
                                Aqui evaluamos cuantos dias la incidencia se mantiene alta y que fraccion
                                total de la poblacion termino afectada.
                            </p>
                        </div>
                    </div>
                </article>
            </Reveal>

            <Reveal delay={0.32}>
                <article className="table-card">
                    <header>
                        <Activity size={18} />
                        <h3>Primeros 20 dias (resumen)</h3>
                    </header>

                    <div className="table-wrap">
                        <table>
                            <thead>
                                <tr>
                                    <th>Dia</th>
                                    <th>S</th>
                                    <th>I</th>
                                    <th>R</th>
                                    <th>Total</th>
                                </tr>
                            </thead>
                            <tbody>
                                {tableRows.map((point) => (
                                    <motion.tr
                                        key={point.day}
                                        initial={{ opacity: 0, y: 8 }}
                                        animate={{ opacity: 1, y: 0 }}
                                        transition={{ duration: 0.22 }}
                                    >
                                        <td>{fixed(point.day, 1)}</td>
                                        <td>{Math.round(point.S).toLocaleString("es-MX")}</td>
                                        <td className="tone-text-orange">{Math.round(point.I).toLocaleString("es-MX")}</td>
                                        <td className="tone-text-green">{Math.round(point.R).toLocaleString("es-MX")}</td>
                                        <td>{Math.round(point.S + point.I + point.R).toLocaleString("es-MX")}</td>
                                    </motion.tr>
                                ))}
                            </tbody>
                        </table>
                    </div>
                </article>
            </Reveal>

            <Reveal delay={0.36}>
                <article className="story-card">
                    <header>
                        <ShieldCheck size={18} />
                        <h3>Lectura ejecutiva del escenario</h3>
                    </header>
                    <p>
                        Si bajas beta o subes gamma, reduces el pico y retrasas la presion
                        sobre el sistema de salud. Este panel te ayuda a probar estrategias
                        y explicar impactos con lenguaje de datos.
                    </p>
                </article>
            </Reveal>
        </div>
    );
}
