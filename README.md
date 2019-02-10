# Typescript is based on:
https://blog.risingstack.com/building-a-node-js-app-with-typescript-tutorial/

# Docker
```
docker build -t coffee_state_firebase_forwarder .

docker run -it --rm coffee_state_firebase_forwarder:latest
```

# JSON Schema Validation

http://json-schema.org/latest/json-schema-validation.html

https://github.com/epoberezkin/ajv

```bash
npx json2ts \
  -i json_schema/coffeeStateSchema.json \
  -o src/schema/coffeeStateSchema.ts
npx json2ts \
  -i json_schema/firebaseMessagingSchema.json \
  -o src/schema/firebaseMessagingSchema.ts
```