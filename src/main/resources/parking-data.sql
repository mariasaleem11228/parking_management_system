-- Clear parking seed data first
DELETE FROM spaces;
DELETE FROM zones;

-- Optional but recommended for H2 identity tables
ALTER TABLE spaces ALTER COLUMN id RESTART WITH 1;
ALTER TABLE zones ALTER COLUMN id RESTART WITH 1;

-- ZONES
INSERT INTO zones (name, city, description, latitude, longitude, capacity)
VALUES
  ('Zone A - Central', 'Dortmund', 'Main downtown parking zone', 51.5136, 7.4653, 5),
  ('Zone B - East', 'Dortmund', 'East side parking area', 51.5158, 7.4765, 4),
  ('Zone C - West', 'Dortmund', 'West side parking area', 51.5112, 7.4528, 4),
  ('Zone D - North', 'Dortmund', 'North station parking area', 51.5215, 7.4608, 6),
  ('Zone E - South', 'Dortmund', 'South side parking area', 51.5058, 7.4695, 5);

-- SPACES
INSERT INTO spaces (name, zone_id, status, latitude, longitude, price_per_hour)
VALUES
  ('A-01', 1, 'FREE',     51.5137, 7.4654, 2.50),
  ('A-02', 1, 'OCCUPIED', 51.5138, 7.4655, 2.50),
  ('A-03', 1, 'RESERVED', 51.5135, 7.4651, 3.00),
  ('A-04', 1, 'FREE',     51.5134, 7.4656, 2.50),

  ('B-01', 2, 'FREE',     51.5159, 7.4766, 2.00),
  ('B-02', 2, 'FREE',     51.5160, 7.4764, 2.00),
  ('B-03', 2, 'OCCUPIED', 51.5157, 7.4767, 2.20),
  ('B-04', 2, 'RESERVED', 51.5156, 7.4763, 2.20),

  ('C-01', 3, 'OCCUPIED', 51.5113, 7.4529, 1.80),
  ('C-02', 3, 'FREE',     51.5111, 7.4527, 1.80),
  ('C-03', 3, 'FREE',     51.5114, 7.4526, 1.90),
  ('C-04', 3, 'RESERVED', 51.5110, 7.4530, 2.00),

  ('D-01', 4, 'FREE',     51.5216, 7.4609, 2.70),
  ('D-02', 4, 'FREE',     51.5214, 7.4607, 2.70),
  ('D-03', 4, 'OCCUPIED', 51.5217, 7.4610, 2.90),
  ('D-04', 4, 'RESERVED', 51.5213, 7.4606, 3.10),
  ('D-05', 4, 'FREE',     51.5218, 7.4605, 2.70),

  ('E-01', 5, 'FREE',     51.5059, 7.4696, 2.10),
  ('E-02', 5, 'OCCUPIED', 51.5057, 7.4694, 2.10),
  ('E-03', 5, 'FREE',     51.5056, 7.4697, 2.20),
  ('E-04', 5, 'RESERVED', 51.5060, 7.4693, 2.30);