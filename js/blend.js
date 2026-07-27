/**
 * blend.js — a miniature "DiCast": consensus blending of multiple NWP models.
 *
 * The Weather Channel's forecast engine (descended from NCAR's DiCast system)
 * takes each model's raw output, bias-corrects it against recent observations,
 * then computes a weighted consensus where weights reflect each model's recent
 * skill at that location and lead time. We replicate the consensus step with
 * static skill-based weights and expose the model spread as a confidence signal.
 */

const Blend = (() => {
  /**
   * Extract per-model hourly series from an Open-Meteo multi-model response.
   * With `models=` set, variables come back suffixed, e.g. "temperature_2m_gfs_seamless".
   */
  function extractSeries(data, variable, models) {
    const hourly = data.hourly || {};
    const times = hourly.time || [];
    const series = {};
    for (const m of models) {
      const key = `${variable}_${m.id}`;
      if (Array.isArray(hourly[key])) series[m.id] = hourly[key];
    }
    return { times, series };
  }

  /**
   * Weighted consensus across models, per timestep. Models missing a value at a
   * timestep are dropped and the remaining weights renormalized — the same way a
   * blending engine tolerates a model that hasn't delivered its latest cycle.
   */
  function consensus(series, models) {
    const ids = models.filter((m) => series[m.id]);
    if (!ids.length) return { blend: [], spread: [] };
    const n = Math.max(...ids.map((m) => series[m.id].length));
    const blend = new Array(n).fill(null);
    const spread = new Array(n).fill(null);

    for (let t = 0; t < n; t++) {
      let sum = 0, wsum = 0;
      const vals = [];
      for (const m of ids) {
        const v = series[m.id][t];
        if (v === null || v === undefined || Number.isNaN(v)) continue;
        sum += v * m.weight;
        wsum += m.weight;
        vals.push(v);
      }
      if (wsum > 0) {
        blend[t] = sum / wsum;
        spread[t] = Math.max(...vals) - Math.min(...vals);
      }
    }
    return { blend, spread };
  }

  /**
   * Turn mean model spread into a plain-language confidence statement,
   * analogous to how ensemble spread drives forecast-confidence messaging.
   */
  function confidenceSummary(spread, unitLabel) {
    const valid = spread.filter((s) => s !== null);
    if (!valid.length) return "Not enough model data to assess confidence.";
    const mean = valid.reduce((a, b) => a + b, 0) / valid.length;
    const max = Math.max(...valid);
    let level, note;
    if (mean < 2) {
      level = "HIGH";
      note = "the models agree closely, so the blended forecast is very likely on track";
    } else if (mean < 5) {
      level = "MODERATE";
      note = "the models mostly agree, with some divergence at certain hours";
    } else {
      level = "LOW";
      note = "the models disagree significantly — expect this forecast to shift between updates";
    }
    return (
      `Forecast confidence: ${level}. Average model disagreement is ` +
      `${mean.toFixed(1)}${unitLabel} (peaking at ${max.toFixed(1)}${unitLabel}) — ${note}.`
    );
  }

  return { extractSeries, consensus, confidenceSummary };
})();
