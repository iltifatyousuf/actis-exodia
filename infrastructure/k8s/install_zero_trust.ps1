helm repo add istio https://istio-release.storage.googleapis.com/charts
helm repo add gatekeeper https://open-policy-agent.github.io/gatekeeper/charts
helm repo update

echo "[Exodia K8s] Installing Istio Service Mesh..."
helm upgrade --install istio-base istio/base -n istio-system --create-namespace
helm upgrade --install istiod istio/istiod -n istio-system --wait

echo "[Exodia K8s] Enforcing Istio strict mTLS globally..."
kubectl apply -f - <<EOF
apiVersion: security.istio.io/v1beta1
kind: PeerAuthentication
metadata:
  name: default
  namespace: istio-system
spec:
  mtls:
    mode: STRICT
EOF

echo "[Exodia K8s] Installing Open Policy Agent (OPA Gatekeeper)..."
helm upgrade --install gatekeeper gatekeeper/gatekeeper -n gatekeeper-system --create-namespace

echo "Zero-Trust Security Layer Successfully Deployed!"
