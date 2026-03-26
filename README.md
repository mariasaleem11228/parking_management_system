# 🚗 Parking Management System

This application is built with **Spring Modulith** and **Java 21**. It is designed to run either as a native process on your host or fully containerized within **Docker**.

---

## Prerequisites

- Java 21
- Maven 3.9+
- Node.js 18+ and npm
- (Optional) Docker + Docker Compose

## Project Structure

- Backend: current folder (Spring Boot, port 8085)
- Frontend: `parking-ui/` (React dev server, port 3000)

## 🛠 Running Locally (Without Docker)

Use these commands for the fastest development loop. When running locally, your database files are persisted in the `./data` folder.

| Command | What it does | Python Equivalent (Roughly) |
| :--- | :--- | :--- |
| `mvn clean` | Deletes the `target/` folder | `rm -rf __pycache__` |
| `mvn compile` | Checks for syntax errors & creates `.class` files | (No direct equivalent) |
| `mvn test` | Runs all your unit tests | `pytest` |
| `mvn package` | Runs tests and creates the `.jar` file | `pip install .` or `build` |
| `mvn install` | Puts your JAR in a local cache for other projects | `pip install -e .` |
| `mvn clean install` | Deletes `target/`, compiles, and installs | `rm -rf build && pip install -e .` |
| **`mvn spring-boot:run`** | **Runs the Spring Boot application** | `python main.py` |
| `mvn clean test` | Clean build and run all tests | `rm -rf .pytest_cache && pytest` |

### 1. Start backend

From project root:

```bash
mvn -q -DskipTests compile && echo BUILD_OK
mvn spring-boot:run
```

Backend runs at:

- `http://localhost:8085`

### 2. Start frontend

In a new terminal:

```bash
cd parking-ui
npm install
npm start
```

Frontend runs at:

- `http://localhost:3000`

---

## 🐳 Running with Docker

Use Docker to test the containerized environment. Data is persisted in the `./docker-h2-data` folder on your host machine.

### 1. The "Start from Scratch" Command
Run this at the beginning or whenever you change your Java code to ensure the container uses the latest version:

```bash
mvn clean package -DskipTests && docker-compose up --build
```
* `-DskipTests`: Speeds up the build by skipping the Maven test phase (assuming you already ran them locally).
* `--build`: Forces Docker to ignore cached layers and reconstruct the image using your newly generated .jar file.

### 🏃 Running Commands Inside the Container
If the container is already running (e.g., in the background or another terminal), use exec to run commands inside the environment:

To run tests inside the container:
```bash
docker-compose exec app mvn test
```

To open a shell inside the container (to inspect files):
```bash
docker-compose exec app sh
```

### 🧪 Testing & Verification
Architecture Health Check:
Spring Modulith enforces strict module boundaries. If user_module tries to access private code in the catalog module, this test will fail:

```bash
mvn test -Dtest=ArchitectureTest
```

Running all tests:
```bash
mvn clean test
```

## 🗄️ Database Access (H2 Console)

The H2 Console is a web-based interface to manage your database. 

### 1. Access the UI
Open your browser and navigate to: [http://localhost:8085/h2-console](http://localhost:8085/h2-console)

### 2. Login Credentials
Ensure the fields in the login screen match these settings exactly:

| Field | Value |
| :--- | :--- |
| **Driver Class** | `org.h2.Driver` |
| **JDBC URL (Local)** | `jdbc:h2:file:./data/modulith_db` |
| **JDBC URL (Docker)** | `jdbc:h2:file:/opt/h2-data/modulith_db` |
| **User Name** | `sa` |
| **Password** | *(Leave Empty)* |

> **Note:** If you are running locally, the JDBC URL must point to your project's `./data` folder. If you are running in Docker, use the `/opt/h2-data` path.

## How To Promote a User to ADMIN (H2)

Use this to access `/admin/*` routes in the UI.

### 1. Open H2 Console

Go to:

- `http://localhost:8085/h2-console`

### 2. Use these connection settings

- Driver Class: `org.h2.Driver`
- JDBC URL (local): `jdbc:h2:file:./data/modulith_db`
- User Name: `sa`
- Password: leave empty

If you are running via Docker, use:

- JDBC URL (docker): `jdbc:h2:file:/opt/h2-data/modulith_db`

### 3. Promote the user

Run SQL:

```sql
UPDATE users
SET role = 'ADMIN'
WHERE email = 'your-email@example.com';
```

Verify:

```sql
SELECT id, name, email, role, enabled
FROM users;
```

### 4. Logout and login again

The frontend stores role in local storage at login time, so you must login again after role change.

## Useful Commands

From project root:

```bash
mvn -q -DskipTests compile && echo BUILD_OK
mvn clean test
mvn -q -DskipTests package && echo PACKAGE_OK
```

From `parking-ui/`:

```bash
npm start
npm run build
```

## API Smoke Checks (Optional)

Get token:

```bash
TOKEN=$(curl -s -X POST "http://localhost:8085/api/auth/login" \
	-H "Content-Type: application/json" \
	-d '{"email":"your-email@example.com","password":"your-password"}' | jq -r '.token')
```

Check current user:

```bash
curl -i "http://localhost:8085/api/auth/me" -H "Authorization: Bearer $TOKEN"
```

Check admin users endpoint (requires ADMIN role):

```bash
curl -i "http://localhost:8085/api/users" -H "Authorization: Bearer $TOKEN"
```