# Authentication Gaps Analysis (TODO 1)

This document details the security evaluation of the initial **CampusConnect** deployment, identifying core vulnerabilities and how they have been addressed.

---

## 1. Identified Security Gaps

### A. Unprotected APIs
* **Vulnerability**: Backend endpoints (e.g. `/api/tasks`, `/api/users`) were completely public. Anyone could query, modify, or delete student records and task details.
* **Risk**: High risk of data exposure, data deletion, and resource tampering.
* **Resolution**: Implemented the JWT-based `protect` middleware to ensure all sensitive endpoints reject requests without a valid, signature-verified Authorization token.

### B. Dashboard Access Vulnerabilities
* **Vulnerability**: The dashboard interface loaded administrative student lists and task statuses regardless of authentication state.
* **Risk**: Information disclosure of student rosters, email directories, and activity schedules.
* **Resolution**: React Router route-guards now verify the presence of active user sessions before rendering the `<Dashboard />` page. The dashboard also queries backend APIs that are fully secured with token auth.

### C. Password Storage Risks
* **Vulnerability**: Passwords were initially stored in plaintext format within MongoDB.
* **Risk**: If the database was compromised, all student passwords would be instantly exposed, leading to credential stuffing and complete account takeovers.
* **Resolution**: Integrated `bcrypt` to hash user passwords with 10 salt rounds during registration and profile updates. Raw passwords are never stored or logged.

### D. Unauthorized Access Scenarios
* **Vulnerability**: Any student could modify or delete tasks assigned to other students by crafting raw API requests to `/api/tasks/:id`.
* **Risk**: Cross-tenant data modification and integrity violations.
* **Resolution**: Implemented ownership validation. Tasks can only be updated/deleted by authorized users, and the interface enforces visual constraints so users primarily interact with their own data.
