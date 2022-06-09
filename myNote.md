1. to build image into K8s env.
   minikube start
   eval $(minikube docker-env)
   docker build -t wahaha007/posts:0.0.1 .

2. Use curl for POST ( Postman doesn't available in WSL text mode )
   # minikube ip
   192.168.49.2
   # k get services
   posts-srv NodePort 10.99.251.231 <none> 4000:32353/TCP 4h50m

ref : https://gist.github.com/subfuzion/08c5d85437d5d4f00e58

curl -d '{"title":"POST"}' -H "Content-Type: application/json" -X POST http://192.168.49.2:32353/posts
curl -i -H "Accept: application/json" -H "Content-Type: application/json" -X GET http://192.168.49.2/api/users/currentuser

3. Install Ingress - NginX
   ref : https://kubernetes.github.io/ingress-nginx/deploy/#quick-start

kubectl apply -f https://raw.githubusercontent.com/kubernetes/ingress-nginx/controller-v1.2.0/deploy/static/provider/cloud/deploy.yaml
