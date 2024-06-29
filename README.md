Hướng dẫn cài đặt hệ thống
# I. Triển khai lên AKS
## Tải mã nguồn về và giải nén.
## Đăng nhập vào azure bằng azure cli
az login --use-device-code

## Tạo resouce group với khu vực
az group create --name finalGroup --location eastasia

## Tạo ssh-keygen 
ssh-keygen

## Tạo cụm AKS
az aks create -g finalGroup -n finalAKSCluster --enable-managed-identity --node-count 1 --enable-addons monitoring --enable-msi-auth-for-monitoring  --generate-ssh-keys

## Cập nhật ~/.kube/config
az aks get-credentials --resource-group finalGroup --name finalAKSCluster

## Thêm một NGINX Ingress Controller
### Tạo 1 K8s namespace cho ingress resources
kubectl create namespace ingress-basic

### Tạo  ingress-nginx repository 
helm repo add ingress-nginx https://kubernetes.github.io/ingress-nginx  

### Dùng Helm để triển khai 1 NGINX ingress controller 
helm install nginx-ingress ingress-nginx/ingress-nginx --namespace ingress-basic --set controller.replicaCount=2 --set controller.nodeSelector."beta\.kubernetes\.io/os"=linux --set defaultBackend.nodeSelector."beta\.kubernetes\.io/os"=linux

## Triển khai app
kubectl apply -f ./app.yaml --namespace ingress-basic

## Triển khai Ingress
kubectl apply -f ./ingress.yaml

## Lấy đường IP Công khai để có thể bắt đầu truy câp vào hệ thống
kubectl --namespace ingress-basic get services -o wide -w nginx-ingress-ingress-nginx-controller
# II. Triển khai ở máy cục bộ có kết nối mạng
## Tải mã nguồn về và giải nén.
## Truy cập vào thư mục backend và chạy lần lượt các lệnh sau
#### npm install

#### npm run start:dev

## Truy cập vào thư mục frontend và chạy lần lượt các lệnh sau
#### npm install pnpm

#### pnpm add

#### pnpm dev
