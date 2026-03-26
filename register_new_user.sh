curl -i -X POST http://localhost:8085/api/auth/register \
-H "Content-Type: application/json" \
-d '{"name":"Becky Doe","email":"becky@example.com","password":"secret123","role":"CITIZEN","licensePlate":"DO-PK-1234"}'
