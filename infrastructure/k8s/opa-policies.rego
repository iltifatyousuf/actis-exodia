package envoy.authz

import input.attributes.request.http as http_request

default allow = false

# Exodia Zero-Trust Policy:
# Only allow traffic to the LangGraph AI Engine if it comes from the Apache Flink Service Account.
# This prevents unauthorized microservices or external actors from triggering AI inference.
allow {
    http_request.method == "POST"
    input.parsed_path[0] == "api"
    input.parsed_path[1] == "v1"
    input.parsed_path[2] == "threat-inference"
    
    # Extract the SPIFFE ID from the mTLS certificate provided by Istio Envoy
    source_spiffe_id := input.attributes.source.principal
    source_spiffe_id == "cluster.local/ns/exodia-prod/sa/flink-processor"
}

# Allow Prometheus to scrape metrics endpoints
allow {
    http_request.method == "GET"
    input.parsed_path[0] == "metrics"
    
    source_spiffe_id := input.attributes.source.principal
    source_spiffe_id == "cluster.local/ns/observability/sa/prometheus"
}
