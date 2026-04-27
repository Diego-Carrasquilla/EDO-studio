import { motion } from "framer-motion";

export default function StatTile({ label, value, tone = "blue", hint }) {
    return (
        <motion.article
            className={`stat-tile tone-${tone}`}
            whileHover={{ y: -4 }}
            transition={{ duration: 0.25 }}
        >
            <p className="stat-label">{label}</p>
            <p className="stat-value">{value}</p>
            {hint ? <p className="stat-hint">{hint}</p> : null}
        </motion.article>
    );
}
