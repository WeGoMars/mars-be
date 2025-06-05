CREATE VIEW stock_latest_price_view AS
SELECT
    s.id AS stock_id,
    s.symbol,
    s.name,
    d.close AS daily_close,
    h.close AS hourly_close
FROM stock s
LEFT JOIN (
    SELECT o1.stock_id, o1.close
    FROM stock_ohlcv o1
    JOIN (
        SELECT stock_id, MAX(timestamp) AS latest
        FROM stock_ohlcv
        WHERE `INTERVAL` = '1day'
        GROUP BY stock_id
    ) latest_daily
    ON o1.stock_id = latest_daily.stock_id AND o1.timestamp = latest_daily.latest
    WHERE o1.interval = '1day'
) d ON s.id = d.stock_id
LEFT JOIN (
    SELECT o2.stock_id, o2.close
    FROM stock_ohlcv_today o2
    JOIN (
        SELECT stock_id, MAX(timestamp) AS latest
        FROM stock_ohlcv_today
        WHERE `INTERVAL` = '1h'
        GROUP BY stock_id
    ) latest_hourly
    ON o2.stock_id = latest_hourly.stock_id AND o2.timestamp = latest_hourly.latest
    WHERE o2.interval = '1h'
) h ON s.id = h.stock_id;
