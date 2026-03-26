# 1) login
TOKEN=$(curl -s -X POST "http://localhost:8085/api/auth/login" \
  -H "Content-Type: application/json" \
  -d '{"email":"bill.dillingson@gmail.com","password":"123Pass"}' | jq -r '.token')

# 2) get the real authenticated user id
USER_ID=$(curl -s "http://localhost:8085/api/auth/me" \
  -H "Authorization: Bearer $TOKEN" | jq -r '.id')

echo "USER_ID=$USER_ID"

# 3) reserve using matching userId
curl -i -X POST "http://localhost:8085/reservation/new" \
  -H "Authorization: Bearer $TOKEN" \
  -H "Content-Type: application/json" \
  -d "{
    \"userId\":\"$USER_ID\",
    \"spaceId\":\"space143\",
    \"date\":\"2026-03-28\",
    \"startTime\":\"08:00:00\",
    \"durationInHours\":2
  }"
