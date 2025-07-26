CREATE TABLE IF NOT EXISTS users (
user_id SERIAL PRIMARY KEY,
user_uuid UUID NOT NULL,
team_uuid UUID,
user_name VARCHAR(100) NOT NULL,
user_email VARCHAR(150) UNIQUE NOT NULL,
role VARCHAR(50) NOT NULL,
is_active BOOLEAN DEFAULT TRUE,
updated_date TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
updated_by UUID,
created_date TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
created_by UUID
);

CREATE TABLE clients (
client_id SERIAL PRIMARY KEY,
client_uuid UUID NOT NULL UNIQUE,
name TEXT NOT NULL,
contact_email TEXT,
contact_phone TEXT,
address TEXT,
is_active BOOLEAN DEFAULT TRUE,
created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP
);

CREATE TABLE drivers (
driver_id SERIAL PRIMARY KEY,
driver_uuid UUID NOT NULL UNIQUE,
name TEXT NOT NULL,
phone_number TEXT,
license_number TEXT,
is_active BOOLEAN DEFAULT TRUE,
created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP
);

CREATE TABLE trucks (
truck_id SERIAL PRIMARY KEY,
truck_uuid UUID NOT NULL UNIQUE,
name TEXT NOT NULL,
type TEXT,
capacity INTEGER,
is_active BOOLEAN DEFAULT TRUE,
created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP
);

CREATE TABLE trips (
trip_id SERIAL PRIMARY KEY,
trip_uuid UUID NOT NULL UNIQUE,
truck_id INTEGER REFERENCES trucks(truck_id) ON DELETE CASCADE,
driver_id INTEGER REFERENCES drivers(driver_id) ON DELETE CASCADE,
client_id INTEGER REFERENCES clients(client_id) ON DELETE CASCADE,
trip_date DATE NOT NULL,
start_location TEXT,
end_location TEXT,
revenue NUMERIC(10, 2),
expenses NUMERIC(10, 2),
notes TEXT,
is_active BOOLEAN DEFAULT TRUE,
created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP
);

CREATE TABLE trip_expenses (
expense_id SERIAL PRIMARY KEY,
trip_id INTEGER REFERENCES trips(trip_id) ON DELETE CASCADE,
description TEXT,
amount NUMERIC(10, 2),
created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP
);

INSERT INTO users (
user_uuid,
team_uuid,
user_name,
user_email,
role,
is_active,
created_by,
updated_by
)
VALUES
(
gen_random_uuid(),
gen_random_uuid(),
'Alice Admin',
'alice@fleetapp.com',
'Admin',
TRUE,
gen_random_uuid(),
gen_random_uuid()
),
(
gen_random_uuid(),
gen_random_uuid(),
'Bob Driver',
'bob@fleetapp.com',
'Driver',
TRUE,
gen_random_uuid(),
gen_random_uuid()
),
(
gen_random_uuid(),
gen_random_uuid(),
'Charlie Staff',
'charlie@fleetapp.com',
'Staff',
TRUE,
gen_random_uuid(),
gen_random_uuid()
),
(
gen_random_uuid(),
gen_random_uuid(),
'Dave Viewer',
'dave@fleetapp.com',
'Viewer',
TRUE,
gen_random_uuid(),
gen_random_uuid()
);

INSERT INTO clients (
client_uuid, name, contact_email, contact_phone, address, is_active, created_at
) VALUES
('10000000-0000-0000-0000-000000000001', 'Acme Corp', 'contact@acme.com', '9876543210', 'Mumbai', TRUE, NOW()),
('10000000-0000-0000-0000-000000000002', 'Logistics Ltd', 'info@logistics.com', '9123456789', 'Delhi', TRUE, NOW()),
('10000000-0000-0000-0000-000000000003', 'TransIndia', 'hello@transindia.com', '9988776655', 'Chennai', TRUE, NOW()),
('10000000-0000-0000-0000-000000000004', 'ShipFast', 'support@shipfast.com', '9001122334', 'Hyderabad', TRUE, NOW()),
('10000000-0000-0000-0000-000000000005', 'QuickMove', 'quick@move.com', '9800112233', 'Bangalore', TRUE, NOW()),
('10000000-0000-0000-0000-000000000006', 'CargoPoint', 'contact@cargopoint.com', '9700567890', 'Pune', TRUE, NOW()),
('10000000-0000-0000-0000-000000000007', 'FreightMax', 'freight@max.com', '9600456123', 'Kolkata', TRUE, NOW()),
('10000000-0000-0000-0000-000000000008', 'Moverly', 'info@moverly.com', '9500789345', 'Ahmedabad', TRUE, NOW()),
('10000000-0000-0000-0000-000000000009', 'HaulPro', 'hauls@pro.com', '9400667788', 'Surat', TRUE, NOW()),
('10000000-0000-0000-0000-000000000010', 'CargoConnect', 'connect@cargo.com', '9300233445', 'Jaipur', TRUE, NOW());

INSERT INTO drivers (
driver_uuid, name, phone_number, license_number, is_active, created_at
) VALUES
('20000000-0000-0000-0000-000000000001', 'Rajesh Kumar', '8888888881', 'DL1234561', TRUE, NOW()),
('20000000-0000-0000-0000-000000000002', 'Sunil Verma', '8888888882', 'MH9876542', TRUE, NOW()),
('20000000-0000-0000-0000-000000000003', 'Amit Singh', '8888888883', 'TN8765431', TRUE, NOW()),
('20000000-0000-0000-0000-000000000004', 'Ravi Mehra', '8888888884', 'KA6543210', TRUE, NOW()),
('20000000-0000-0000-0000-000000000005', 'Prakash Patil', '8888888885', 'AP1122334', TRUE, NOW()),
('20000000-0000-0000-0000-000000000006', 'Shyam Gupta', '8888888886', 'GJ2233445', TRUE, NOW()),
('20000000-0000-0000-0000-000000000007', 'Vikram Das', '8888888887', 'WB3344556', TRUE, NOW()),
('20000000-0000-0000-0000-000000000008', 'Naresh Reddy', '8888888888', 'TS4455667', TRUE, NOW()),
('20000000-0000-0000-0000-000000000009', 'Kiran Babu', '8888888889', 'RJ5566778', TRUE, NOW()),
('20000000-0000-0000-0000-000000000010', 'Anil Kaur', '8888888890', 'PB6677889', TRUE, NOW());

INSERT INTO trucks (
truck_uuid, name, type, capacity, is_active, created_at
) VALUES
('30000000-0000-0000-0000-000000000001', 'TATA 407', 'Mini', 1500, TRUE, NOW()),
('30000000-0000-0000-0000-000000000002', 'Eicher Pro', 'Medium', 3000, TRUE, NOW()),
('30000000-0000-0000-0000-000000000003', 'Ashok Leyland Boss', 'Heavy', 5000, TRUE, NOW()),
('30000000-0000-0000-0000-000000000004', 'Mahindra Furio', 'Mini', 2000, TRUE, NOW()),
('30000000-0000-0000-0000-000000000005', 'BharatBenz 1215R', 'Medium', 4000, TRUE, NOW()),
('30000000-0000-0000-0000-000000000006', 'TATA Ultra', 'Heavy', 5500, TRUE, NOW()),
('30000000-0000-0000-0000-000000000007', 'Eicher Skyline', 'Mini', 1000, TRUE, NOW()),
('30000000-0000-0000-0000-000000000008', 'Ashok Leyland Partner', 'Medium', 3500, TRUE, NOW()),
('30000000-0000-0000-0000-000000000009', 'Volvo FMX', 'Heavy', 8000, TRUE, NOW()),
('30000000-0000-0000-0000-000000000010', 'Force Traveller', 'Mini', 1200, TRUE, NOW());

INSERT INTO trips (
trip_uuid, truck_id, driver_id, client_id, trip_date, start_location, end_location, revenue, expenses, notes, is_active, created_at
) VALUES
('40000000-0000-0000-0000-000000000001', 1, 1, 1, '2025-07-01', 'Mumbai', 'Pune', 12000, 2000, 'Smooth ride', TRUE, NOW()),
('40000000-0000-0000-0000-000000000002', 2, 2, 2, '2025-07-02', 'Delhi', 'Agra', 15000, 2500, 'Rainy weather', TRUE, NOW()),
('40000000-0000-0000-0000-000000000003', 3, 3, 3, '2025-07-03', 'Chennai', 'Bangalore', 18000, 2200, 'Heavy traffic', TRUE, NOW()),
('40000000-0000-0000-0000-000000000004', 4, 4, 4, '2025-07-04', 'Hyderabad', 'Vijayawada', 10000, 1500, 'No issues', TRUE, NOW()),
('40000000-0000-0000-0000-000000000005', 5, 5, 5, '2025-07-05', 'Pune', 'Nagpur', 14000, 1800, 'Road work delays', TRUE, NOW()),
('40000000-0000-0000-0000-000000000006', 6, 6, 6, '2025-07-06', 'Kolkata', 'Patna', 16000, 2100, 'Night drive', TRUE, NOW()),
('40000000-0000-0000-0000-000000000007', 7, 7, 7, '2025-07-07', 'Ahmedabad', 'Surat', 13000, 1700, 'Fuel stop', TRUE, NOW()),
('40000000-0000-0000-0000-000000000008', 8, 8, 8, '2025-07-08', 'Surat', 'Nashik', 11000, 1600, 'Fast delivery', TRUE, NOW()),
('40000000-0000-0000-0000-000000000009', 9, 9, 9, '2025-07-09', 'Jaipur', 'Delhi', 19000, 2300, 'Long trip', TRUE, NOW()),
('40000000-0000-0000-0000-000000000010', 10, 10, 10, '2025-07-10', 'Mumbai', 'Goa', 20000, 3000, 'Weekend traffic', TRUE, NOW());

INSERT INTO trip_expenses (
trip_id, description, amount, created_at
) VALUES
(1, 'Fuel', 1500, NOW()),
(1, 'Toll', 500, NOW()),
(2, 'Fuel', 1800, NOW()),
(3, 'Repair', 800, NOW()),
(4, 'Food', 300, NOW()),
(5, 'Parking', 400, NOW()),
(6, 'Extra Toll', 600, NOW()),
(7, 'Lodging', 700, NOW()),
(8, 'Spare Tyre', 900, NOW()),
(9, 'Service', 1000, NOW());
