-- ZONES
INSERT INTO zones (id, name, city, description, latitude, longitude, capacity)
VALUES (1, 'Zone A - Central', 'Berlin', 'Main downtown parking zone', 52.5200, 13.4050, 5);

INSERT INTO zones (id, name, city, description, latitude, longitude, capacity)
VALUES (2, 'Zone B - East', 'Berlin', 'East side parking area', 52.5150, 13.4100, 3);

INSERT INTO zones (id, name, city, description, latitude, longitude, capacity)
VALUES (3, 'Zone C - West', 'Berlin', 'West side parking area', 52.5180, 13.3950, 4);

-- SPACES
INSERT INTO spaces (id, name, zone_id, status, latitude, longitude, price_per_hour)
VALUES (1, 'A-01', 1, 'FREE', 52.5201, 13.4051, 2.50);

INSERT INTO spaces (id, name, zone_id, status, latitude, longitude, price_per_hour)
VALUES (2, 'A-02', 1, 'OCCUPIED', 52.5202, 13.4052, 2.50);

INSERT INTO spaces (id, name, zone_id, status, latitude, longitude, price_per_hour)
VALUES (3, 'A-03', 1, 'RESERVED', 52.5203, 13.4053, 3.00);

INSERT INTO spaces (id, name, zone_id, status, latitude, longitude, price_per_hour)
VALUES (4, 'B-01', 2, 'FREE', 52.5151, 13.4101, 2.00);

INSERT INTO spaces (id, name, zone_id, status, latitude, longitude, price_per_hour)
VALUES (5, 'B-02', 2, 'FREE', 52.5152, 13.4102, 2.00);

INSERT INTO spaces (id, name, zone_id, status, latitude, longitude, price_per_hour)
VALUES (6, 'C-01', 3, 'OCCUPIED', 52.5181, 13.3951, 1.80);