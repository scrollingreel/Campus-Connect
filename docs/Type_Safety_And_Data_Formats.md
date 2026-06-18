# Type Safety & Database Representation (TODO 11 & Data Management Requirements)

This document outlines the standardized data models, type definitions, and structural mapping between SQL and NoSQL databases for the **CampusConnect** platform.

---

## 1. Type Safety & Expected Formats

Standardizing structures ensures consistency across frontend and backend, preventing data corruption and reducing runtime exceptions.

### User Data Structure
| Field | JS/TS Type | Mongoose Validator | Description |
|---|---|---|---|
| `_id` / `id` | `String` | Auto-generated ObjectId | Unique identifier |
| `name` | `String` | Required, Min 2, Max 100 characters | Full name of the user |
| `email` | `String` | Required, Regex validation (unique, lowercase) | Contact email address |
| `password` | `String` | Required, Min 8 characters (hashed on storage) | Secured password credentials |
| `role` | `String` | Default: `'student'` (enum: `'student' \| 'faculty' \| 'admin'`) | Access level control |
| `registrationDate`| `Date` | Default: `Date.now` | Registration timestamp |

### Task Data Structure
| Field | JS/TS Type | Mongoose Validator | Description |
|---|---|---|---|
| `_id` / `id` | `String` | Auto-generated ObjectId | Unique identifier |
| `title` | `String` | Required, Min 3, Max 150 characters | Name of the task |
| `description` | `String` | Max 1000 characters | Extra details |
| `status` | `String` | Default: `'pending'` (enum: `'pending' \| 'in-progress' \| 'completed'`) | Task completion status |
| `assignedUser` | `String` / `Object`| Ref: `'User'` (ObjectId reference) | Assigned student/user |
| `createdAt` | `Date` | Managed by Mongoose | Creation timestamp |
| `updatedAt` | `Date` | Managed by Mongoose | Update timestamp |

---

## 2. SQL vs. NoSQL Representation

Understanding how these schemas translate to relational (SQL) vs. non-relational (NoSQL) formats is critical for modern database design.

### A. NoSQL Document Model (MongoDB - Current)
MongoDB stores users and tasks as independent documents within collections. Relationships are typically referenced via ObjectIds.

#### **Users Collection**
```json
{
  "_id": "603f9e984f1a2c3d5e6f8a91",
  "name": "Jane Doe",
  "email": "jane.doe@university.edu",
  "password": "$2b$10$xyzhashedpasswordhere...",
  "role": "student",
  "registrationDate": "2026-06-16T18:12:13.000Z",
  "createdAt": "2026-06-16T18:12:13.000Z",
  "updatedAt": "2026-06-16T18:12:13.000Z"
}
```

#### **Tasks Collection**
```json
{
  "_id": "603f9e984f1a2c3d5e6f8b99",
  "title": "Complete FSD Lab",
  "description": "Implement authentication and filtering",
  "status": "in-progress",
  "assignedUser": "603f9e984f1a2c3d5e6f8a91",
  "createdAt": "2026-06-17T12:00:00.000Z",
  "updatedAt": "2026-06-17T12:30:00.000Z"
}
```

### B. Relational SQL Model (PostgreSQL / MySQL)
In a relational database, schemas are strict, tables have fixed columns, and relationships are enforced using foreign key constraints.

#### **`users` Table**
```sql
CREATE TABLE users (
    id VARCHAR(36) PRIMARY KEY,
    name VARCHAR(100) NOT NULL,
    email VARCHAR(255) UNIQUE NOT NULL,
    password VARCHAR(255) NOT NULL,
    role VARCHAR(20) DEFAULT 'student' CHECK (role IN ('student', 'faculty', 'admin')),
    registration_date TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
    created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
    updated_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP ON UPDATE CURRENT_TIMESTAMP
);
```

#### **`tasks` Table**
```sql
CREATE TABLE tasks (
    id VARCHAR(36) PRIMARY KEY,
    title VARCHAR(150) NOT NULL,
    description TEXT,
    status VARCHAR(20) DEFAULT 'pending' CHECK (status IN ('pending', 'in-progress', 'completed')),
    assigned_user_id VARCHAR(36),
    created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
    updated_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP ON UPDATE CURRENT_TIMESTAMP,
    FOREIGN KEY (assigned_user_id) REFERENCES users(id) ON DELETE SET NULL
);
```

### Key Architectural Differences

1. **Flexibility**: NoSQL allows for schema-less documents (e.g., adding dynamic profile details or varying sub-tasks directly inside the task document). SQL requires a database migration to alter table structures.
2. **Relationships**: MongoDB links users and tasks via manual references or DBRefs, which are resolved in application code using Mongoose `.populate()`. SQL uses relational database engine queries with `JOIN` clauses.
3. **Transactions**: SQL databases guarantee ACID compliance natively across multiple tables. MongoDB handles transaction logic on single document writes natively, with multi-document transactions supported starting from MongoDB 4.0+.
