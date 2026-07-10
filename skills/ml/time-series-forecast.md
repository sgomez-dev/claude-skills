---
description: Forecast time series — naive baselines, seasonality, backtesting, intervals
permissions:
  reads: ["**/*.py", "**/*.ipynb", "**/*.csv", "**/*.parquet", "**/*.json", "requirements.txt", "pyproject.toml"]
  writes: ["**/*.py", "**/*.ipynb", "data/**", "models/**", "reports/**", "**/*.md"]
  commands: ["python", "pip"]
  network: false
  destructive: false
---

Build a time-series forecast the honest way: naive baselines that are shockingly hard to beat,
strict temporal hygiene (no future data, ever), evaluation by backtesting instead of a single
split, and prediction intervals — a point forecast without uncertainty is half an answer.

Steps:

1. **Frame the forecasting problem** (`$ARGUMENTS`)
   - Detect the Python env and installed libs (statsmodels, sktime, statsforecast/nixtla, prophet, darts, lightgbm) — build with what's there, suggest at most one lightweight addition
   - Pin down: target series, frequency (hourly/daily/weekly), **forecast horizon** (how far ahead), **one series or many** (per store/SKU?), and which decision the forecast feeds — the horizon and decision drive everything else
   - Ask which future information is legitimately known in advance (holidays, prices, promotions) — these are usable covariates; anything else must be lagged

2. **Explore the series before modeling**
   - Plot the raw series, plus seasonal decomposition (STL) and ACF/PACF; identify trend, seasonality period(s), holiday effects, and structural breaks (policy changes, COVID-like shocks)
   - Audit data quality: missing timestamps (reindex to a complete calendar), zeros vs missing, outliers, and whether history before a structural break is still representative — sometimes truncating is better than modeling the break
   - For many series: check intermittency (lots of zeros → different methods, e.g., Croston) and whether series are long enough for the seasonality you hope to model

3. **Set up backtesting first — it's the eval harness for everything after**
   - Rolling/expanding-origin evaluation: multiple folds, each training on data up to a cutoff and forecasting the next horizon; never a single random split, never shuffled CV
   - Choose the metric to match the decision: MAE/RMSE for symmetric cost, MAPE only if no near-zero values, WAPE for aggregating across series of different scales, pinball loss if quantiles are the product
   - Evaluate **at the horizon that matters** (error at step 12 ≠ error at step 1) and report per-step degradation

4. **Run the naive baselines — the ones that usually win**
   - Naive (last value), seasonal naive (value from one season ago), moving average, and drift — score all in the backtest
   - These are the numbers every model must beat; in messy business data, seasonal naive frequently ties or beats sophisticated models
   - Report skill scores (improvement over seasonal naive) from here on, not raw errors

5. **Escalate model complexity only while the backtest rewards it**
   - Classical: ETS / ARIMA (auto-selected via statsforecast or pmdarima) — strong on single, regular series
   - ML approach: gradient boosting on engineered features — lags, rolling means/stds, calendar features (day-of-week, month, holiday flags), known-future covariates; **all features must use only information available at the forecast origin** (lag ≥ horizon or use recursive/direct strategy explicitly)
   - Many related series → global model (one GBM/statsforecast across series with series ID as a feature) usually beats per-series models
   - Prophet/deep models (N-BEATS etc.) only if the simpler ladder plateaus and data volume justifies them
   - Same backtest for every candidate; pick the simplest model within noise of the best

6. **Produce prediction intervals, not just points**
   - Generate intervals: native (ETS/ARIMA), quantile regression objectives (GBM), or conformal prediction on backtest residuals (works for any model)
   - Validate coverage in the backtest: a nominal 80% interval should contain ~80% of actuals — report actual coverage, recalibrate if off
   - Present forecasts as point + interval, and translate for the decision ("stock for the 90th percentile to hit target service level")

7. **Deliver and plan the refresh**
   - Save the forecast script (refit + predict from latest data, fixed seeds), backtest report with baseline comparison per horizon step, and forecast plots with intervals to `reports/`
   - Define the retraining cadence (typically every refresh for classical models — they're cheap) and monitoring: track live forecast error vs backtest expectation; sustained degradation = revisit (see /ml--model-deployment, /ml--mlops-pipeline)
   - If accuracy is insufficient, say so and rank remedies: better covariates (promotions, weather), hierarchy reconciliation, or accepting wider intervals

**Notes:**
- The cardinal sin is future leakage: any feature, scaler, or imputation fit on data past the forecast origin invalidates the backtest — audit features by asking "was this knowable at the cutoff?"
- Don't detrend/deseasonalize with statistics computed over the full series — fit transforms per training window
- Beware evaluating over a period with a structural break — report error before/after separately
- A forecast that can't beat seasonal naive is still useful information: it says the series is near-unpredictable, so the business should plan with buffers, not better models
- For hierarchies (SKU→store→region), forecast at the level with signal and reconcile; don't independently forecast every level and let them contradict

$ARGUMENTS
