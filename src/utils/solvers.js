const EPSILON = 1e-10;
const MAX_STEPS = 6000;

function round6(value) {
    return Number(value.toFixed(6));
}

export function eulerSolve(model, h) {
    let x = model.x0;
    let y = model.y0;
    const points = [{ x, y }];

    for (let n = 0; n < MAX_STEPS && x < model.xEnd - EPSILON; n += 1) {
        const step = Math.min(h, model.xEnd - x);
        y = y + step * model.derivative(x, y);
        x = x + step;
        points.push({ x: round6(x), y: round6(y) });
    }

    return points;
}

export function rk4Solve(model, h) {
    let x = model.x0;
    let y = model.y0;
    const points = [{ x, y }];

    for (let n = 0; n < MAX_STEPS && x < model.xEnd - EPSILON; n += 1) {
        const step = Math.min(h, model.xEnd - x);

        const k1 = model.derivative(x, y);
        const k2 = model.derivative(x + step / 2, y + (step * k1) / 2);
        const k3 = model.derivative(x + step / 2, y + (step * k2) / 2);
        const k4 = model.derivative(x + step, y + step * k3);

        y = y + (step / 6) * (k1 + 2 * k2 + 2 * k3 + k4);
        x = x + step;

        points.push({ x: round6(x), y: round6(y) });
    }

    return points;
}

export function sampleExact(model, h) {
    const minStep = Math.max(0.02, h / 6);
    const points = [];

    for (
        let x = model.x0;
        x <= model.xEnd + EPSILON;
        x = Math.min(x + minStep, model.xEnd)
    ) {
        const y = model.exact(x);
        if (Number.isFinite(y)) {
            points.push({ x: round6(x), y: round6(y) });
        }
        if (Math.abs(x - model.xEnd) < EPSILON) {
            break;
        }
    }

    return points;
}

export function summarizeOde(model, h) {
    const euler = eulerSolve(model, h);
    const rk4 = rk4Solve(model, h);

    let maxEulerError = 0;
    let maxRk4Error = 0;

    const rows = euler.map((point, index) => {
        const exact = model.exact(point.x);
        const eulerError = Math.abs(exact - point.y);
        const rkPoint = rk4[index] ?? rk4[rk4.length - 1];
        const rk4Error = Math.abs(exact - rkPoint.y);

        maxEulerError = Math.max(maxEulerError, eulerError);
        maxRk4Error = Math.max(maxRk4Error, rk4Error);

        return {
            x: point.x,
            exact,
            euler: point.y,
            eulerError,
            rk4: rkPoint.y,
            rk4Error,
        };
    });

    return {
        euler,
        rk4,
        exact: sampleExact(model, h),
        rows,
        maxEulerError,
        maxRk4Error,
        improvement: maxRk4Error > 0 ? maxEulerError / maxRk4Error : Number.POSITIVE_INFINITY,
    };
}

export function rk4Sir({
    population,
    beta,
    gamma,
    infected0,
    recovered0 = 0,
    step,
    days,
}) {
    let t = 0;
    let s = population - infected0 - recovered0;
    let i = infected0;
    let r = recovered0;

    const points = [];

    function addSnapshot(time, susceptible, infected, recovered) {
        points.push({
            day: round6(time),
            S: round6(susceptible),
            I: round6(infected),
            R: round6(recovered),
            susceptiblePct: round6((100 * susceptible) / population),
            infectedPct: round6((100 * infected) / population),
            recoveredPct: round6((100 * recovered) / population),
        });
    }

    function dS(susceptible, infected) {
        return (-beta * susceptible * infected) / population;
    }

    function dI(susceptible, infected) {
        return (beta * susceptible * infected) / population - gamma * infected;
    }

    function dR(infected) {
        return gamma * infected;
    }

    addSnapshot(t, s, i, r);

    for (let n = 0; n < MAX_STEPS && t < days - EPSILON; n += 1) {
        const dt = Math.min(step, days - t);

        const k1S = dS(s, i);
        const k1I = dI(s, i);
        const k1R = dR(i);

        const s2 = s + (dt * k1S) / 2;
        const i2 = i + (dt * k1I) / 2;
        const k2S = dS(s2, i2);
        const k2I = dI(s2, i2);
        const k2R = dR(i2);

        const s3 = s + (dt * k2S) / 2;
        const i3 = i + (dt * k2I) / 2;
        const k3S = dS(s3, i3);
        const k3I = dI(s3, i3);
        const k3R = dR(i3);

        const s4 = s + dt * k3S;
        const i4 = i + dt * k3I;
        const k4S = dS(s4, i4);
        const k4I = dI(s4, i4);
        const k4R = dR(i4);

        s = s + (dt / 6) * (k1S + 2 * k2S + 2 * k3S + k4S);
        i = i + (dt / 6) * (k1I + 2 * k2I + 2 * k3I + k4I);
        r = r + (dt / 6) * (k1R + 2 * k2R + 2 * k3R + k4R);
        t = t + dt;

        addSnapshot(t, s, i, r);
    }

    return points;
}

export function summarizeSir(points, beta, gamma) {
    const peak = points.reduce((acc, item) => (item.I > acc.I ? item : acc), points[0]);
    const first = points[0];
    const second = points[1] ?? points[0];
    const last = points[points.length - 1];
    const r0 = beta / gamma;
    const dt = Math.max(EPSILON, second.day - first.day);
    const initialGrowthRate = first.I > EPSILON ? (second.I - first.I) / (first.I * dt) : 0;
    const doublingDays = initialGrowthRate > EPSILON ? Math.log(2) / initialGrowthRate : Number.POSITIVE_INFINITY;

    let dayOverOnePct = null;
    for (const point of points) {
        if (point.infectedPct >= 1) {
            dayOverOnePct = point.day;
            break;
        }
    }

    let dayBackBelowOnePct = null;
    for (const point of points) {
        if (point.day > peak.day && point.infectedPct <= 1) {
            dayBackBelowOnePct = point.day;
            break;
        }
    }

    const criticalWindowDays =
        dayOverOnePct !== null && dayBackBelowOnePct !== null
            ? round6(dayBackBelowOnePct - dayOverOnePct)
            : null;

    return {
        r0,
        peakDay: peak.day,
        peakInfected: peak.I,
        peakInfectedPct: peak.infectedPct,
        recoveredPctFinal: last.recoveredPct,
        activePctFinal: last.infectedPct,
        herdThresholdPct: r0 > 1 ? round6((1 - 1 / r0) * 100) : 0,
        reAtPeak: round6(r0 * (peak.susceptiblePct / 100)),
        initialGrowthRate,
        doublingDays,
        dayOverOnePct,
        dayBackBelowOnePct,
        criticalWindowDays,
        totalAffectedPct: round6(last.infectedPct + last.recoveredPct),
    };
}
