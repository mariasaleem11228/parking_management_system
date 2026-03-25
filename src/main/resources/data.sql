-- ZONES
-- INSERT INTO zones (id, name, city, description, latitude, longitude, capacity)
-- VALUES (1, 'Zone A - Central', 'Berlin', 'Main downtown parking zone', 52.5200, 13.4050, 5);

-- INSERT INTO zones (id, name, city, description, latitude, longitude, capacity)
-- VALUES (2, 'Zone B - East', 'Berlin', 'East side parking area', 52.5150, 13.4100, 3);

-- INSERT INTO zones (id, name, city, description, latitude, longitude, capacity)
-- VALUES (3, 'Zone C - West', 'Berlin', 'West side parking area', 52.5180, 13.3950, 4);

-- ZONES
INSERT INTO zones (id, name, city, description, latitude, longitude, capacity)
VALUES
  (1, 'Zone A - Central', 'Dortmund', 'Main downtown parking zone', 51.5136, 7.4653, 5),
  (2, 'Zone B - East', 'Dortmund', 'East side parking area', 51.5158, 7.4765, 4),
  (3, 'Zone C - West', 'Dortmund', 'West side parking area', 51.5112, 7.4528, 4),
  (4, 'Zone D - North', 'Dortmund', 'North station parking area', 51.5215, 7.4608, 6),
  (5, 'Zone E - South', 'Dortmund', 'South side parking area', 51.5058, 7.4695, 5);

-- SPACES
-- SPACES
INSERT INTO spaces (id, name, zone_id, status, latitude, longitude, price_per_hour)
VALUES
  (1,  'A-01', 1, 'FREE',     51.5137, 7.4654, 2.50),
  (2,  'A-02', 1, 'OCCUPIED', 51.5138, 7.4655, 2.50),
  (3,  'A-03', 1, 'RESERVED', 51.5135, 7.4651, 3.00),
  (4,  'A-04', 1, 'FREE',     51.5134, 7.4656, 2.50),

  (5,  'B-01', 2, 'FREE',     51.5159, 7.4766, 2.00),
  (6,  'B-02', 2, 'FREE',     51.5160, 7.4764, 2.00),
  (7,  'B-03', 2, 'OCCUPIED', 51.5157, 7.4767, 2.20),
  (8,  'B-04', 2, 'RESERVED', 51.5156, 7.4763, 2.20),

  (9,  'C-01', 3, 'OCCUPIED', 51.5113, 7.4529, 1.80),
  (10, 'C-02', 3, 'FREE',     51.5111, 7.4527, 1.80),
  (11, 'C-03', 3, 'FREE',     51.5114, 7.4526, 1.90),
  (12, 'C-04', 3, 'RESERVED', 51.5110, 7.4530, 2.00),

  (13, 'D-01', 4, 'FREE',     51.5216, 7.4609, 2.70),
  (14, 'D-02', 4, 'FREE',     51.5214, 7.4607, 2.70),
  (15, 'D-03', 4, 'OCCUPIED', 51.5217, 7.4610, 2.90),
  (16, 'D-04', 4, 'RESERVED', 51.5213, 7.4606, 3.10),
  (17, 'D-05', 4, 'FREE',     51.5218, 7.4605, 2.70),

  (18, 'E-01', 5, 'FREE',     51.5059, 7.4696, 2.10),
  (19, 'E-02', 5, 'OCCUPIED', 51.5057, 7.4694, 2.10),
  (20, 'E-03', 5, 'FREE',     51.5056, 7.4697, 2.20),
  (21, 'E-04', 5, 'RESERVED', 51.5060, 7.4693, 2.30);