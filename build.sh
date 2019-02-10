#!/bin/bash
docker build -t registry.fh.guelland.eu:8082/coffee_state_firebase_forwarder .
docker push registry.fh.guelland.eu:8082/coffee_state_firebase_forwarder