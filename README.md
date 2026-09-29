This project contains the admin and student where each student get the smart ID card and when the admin scan the QR of ID card the will mark the present or absent and student can view the update job and apply for the job where admin can see the applicaton update status like select or shorlisted 

# Placement Portal – Full-Stack DevOps & CI/CD Project

## 1. Project Overview

Placement Portal is a full-stack college placement management application with separate Admin and Student portals, a Node.js/Express backend, and MongoDB Atlas.

The project also demonstrates an end-to-end DevOps workflow:

Developer
↓
GitLab
↓
GitLab Webhook
↓
Jenkins
↓
Build / Test
↓
SonarQube
↓
Trivy
↓
Docker Build
↓
Amazon ECR
↓
Kubernetes / k3s
↓
AWS EC2
↓
Running Application

---

## 2. Application Architecture

Admin Portal ──┐
               ├──> Node.js + Express Backend ──> MongoDB Atlas
Student Portal ┘

### Student Portal

Students can:

- Log in
- View placement/job information
- View job details
- Apply for opportunities
- Upload resumes

### Admin Portal

Administrators can:

- Log in
- Manage students
- Manage placement/job information
- View applications
- Manage placement activities

### Backend

The backend provides APIs for:

- Authentication and authorization
- Student management
- Job/placement APIs
- Application processing
- Resume uploads
- Email functionality
- Database operations

---

## 3. Technology Stack

### Application

| Component | Technology |
|---|---|
| Student Portal | React + Vite |
| Admin Portal | React + Vite |
| Backend | Node.js + Express |
| Database | MongoDB Atlas |
| Authentication | JWT |
| Password Hashing | bcryptjs |
| File Upload | Multer |
| Email | Nodemailer |
| Styling | Tailwind CSS |
| Security | Helmet, CORS |

### DevOps / Cloud

| Technology | Purpose |
|---|---|
| Git | Version control |
| GitLab | Source repository |
| GitLab Webhook | Jenkins trigger |
| Jenkins | CI/CD automation |
| SonarQube | Code-quality analysis |
| Trivy | Vulnerability scanning |
| Docker | Containerization |
| Docker Compose | Image build configuration |
| Terraform | Infrastructure as Code |
| AWS EC2 | Cloud server |
| AWS IAM | AWS permissions |
| Amazon ECR | Docker image registry |
| Kubernetes | Container orchestration |
| k3s | Lightweight Kubernetes |
| Traefik | Ingress controller |

---

## 4. Complete CI/CD Pipeline

Developer
   |
   | git push
   v
GitLab
   |
   | Webhook
   v
Jenkins
   |
   +--> Build / Test
   |
   +--> SonarQube Analysis
   |
   +--> Trivy Filesystem Scan
   |
   +--> Docker Build
   |
   +--> Trivy Docker Image Scan
   |
   +--> Push Images to Amazon ECR
   |
   +--> Kubernetes Rollout
            |
            v
       k3s on AWS EC2
            |
     +------+-------+
     |      |       |
   Admin Student Backend
    Pods   Pods    Pods
            |
            v
       MongoDB Atlas

---

## 5. GitLab

GitLab is used for source-code management.

Example workflow:

git add .
git commit -m "Update placement portal"
git push

GitLab receives the new code and sends a webhook request to Jenkins.

---

## 6. GitLab Webhook

The webhook connects:

GitLab → Jenkins

The flow is:

git push
   ↓
GitLab
   ↓
Webhook
   ↓
Jenkins

The webhook automatically triggers the Jenkins pipeline whenever new code is pushed.

---

## 7. Jenkins

Jenkins is the CI/CD automation server.

The pipeline contains:

1. Build Test
2. SonarQube Analysis
3. Trivy Filesystem Scan
4. Docker Build
5. Trivy Docker Image Scan
6. Push Images to ECR
7. Kubernetes Rollout

The pipeline is stored in:

Jenkinsfile

---

## 8. SonarQube

SonarQube performs static source-code analysis.

It helps identify:

- Bugs
- Code smells
- Maintainability issues
- Duplicated code
- Security-related code issues

Project key:

placement-portal

Simple explanation:

SonarQube checks the quality of the source code before deployment.

---

## 9. Trivy

Trivy is used for vulnerability scanning.

### Filesystem Scan

Source repository
       ↓
Trivy filesystem scan
       ↓
Vulnerability report

### Docker Image Scan

Docker image
       ↓
Trivy image scan
       ↓
Vulnerability report

The current demonstration pipeline uses:

--exit-code 0

Therefore vulnerabilities are reported in Jenkins logs but do not stop deployment.

For production, Trivy could be configured as a hard security gate.

---

## 10. Docker

The application is containerized into three images:

placement-backend
placement-admin
placement-student

Docker provides:

- Consistent environments
- Isolation
- Portability
- Easy deployment
- CI/CD integration

---

## 11. Docker Compose

Docker Compose defines the application images:

placement-backend:latest
placement-admin:latest
placement-student:latest

Jenkins runs:

docker compose build

---

## 12. Amazon ECR

Amazon Elastic Container Registry is the private Docker image registry.

The flow is:

Jenkins
   ↓
Docker Image
   ↓
Amazon ECR
   ↓
Kubernetes pulls image

Images:

- placement-backend
- placement-admin
- placement-student

AWS Region:

ap-south-1

---

## 13. AWS IAM

The EC2 instance uses an IAM role to access AWS services.

For example:

aws sts get-caller-identity
aws ecr get-login-password

This avoids storing permanent AWS access keys in the Git repository.

---

## 14. Terraform

Terraform is used as Infrastructure as Code.

Typical workflow:

Terraform configuration
        ↓
terraform init
        ↓
terraform plan
        ↓
terraform apply
        ↓
AWS resources

Terraform was used for AWS/ECR infrastructure management.

AWS Region:

ap-south-1

---

## 15. Kubernetes / k3s

The project uses k3s, a lightweight Kubernetes distribution, on AWS EC2.

k3s was selected instead of EKS because this was a college/portfolio demonstration and a lightweight Kubernetes cluster on the existing EC2 instance was sufficient.

---

## 16. Kubernetes Pod

A Pod is the smallest deployable Kubernetes unit.

Pod
└── Application container

Simple explanation:

A Pod is where the application container runs.

---

## 17. Kubernetes Deployment

A Deployment manages Pods.

Deployment
 ├── Pod
 ├── Pod
 └── Pod

It maintains the desired number of replicas and manages application updates.

---

## 18. Kubernetes Service

A Service provides a stable network endpoint for a group of Pods.

             Service
                |
        +-------+-------+
        ↓       ↓       ↓
      Pod 1   Pod 2   Pod 3

Example:

placement-backend:5000

Simple classroom definition:

Service = stable network address for Pods.

Pods can be recreated and their IP addresses can change, but the Service remains the stable endpoint.

---

## 19. Kubernetes Ingress

Ingress controls incoming HTTP/HTTPS traffic and routes requests to the correct Kubernetes Service.

                 Ingress
                    |
          +---------+---------+
          ↓                   ↓
    Admin Service       Student Service
          ↓                   ↓
      Admin Pods          Student Pods

Simple classroom definition:

Ingress = traffic controller for incoming web requests.

---

## 20. Service vs Ingress

| Component | Responsibility |
|---|---|
| Pod | Runs the application |
| Deployment | Manages Pods |
| Service | Provides stable access to Pods |
| Ingress | Routes HTTP/HTTPS traffic to Services |

Easy memory trick:

Pod = Application

Service = Stable address

Ingress = Traffic controller

---

## 21. Traefik

k3s provides Traefik as the Ingress controller.

The project used host-based routing.

Admin:

admin.15-252-161-150.nip.io
        ↓
Traefik Ingress
        ↓
placement-admin Service
        ↓
Admin Pod

Student:

student.15-252-161-150.nip.io
        ↓
Traefik Ingress
        ↓
placement-student Service
        ↓
Student Pod

---

## 22. nip.io

nip.io is a wildcard DNS service.

For example:

admin.15-252-161-150.nip.io

resolves to:

15.252.161.150

This allowed the project to demonstrate host-based Kubernetes routing without purchasing a separate domain.

---

## 23. Backend Service

The backend is exposed internally through:

placement-backend

Port:

5000

Conceptually:

Frontend
   ↓
Backend Service
   ↓
Backend Pod(s)
   ↓
MongoDB Atlas

---

## 24. Kubernetes Secrets

Sensitive backend configuration was stored in:

backend-env

The project also used:

ecr-secret

for pulling private images from Amazon ECR.

Secrets keep sensitive configuration outside normal source-code files.

---

## 25. ECR Image Pull

Kubernetes needs permission to pull private ECR images.

The project created:

ecr-secret

Type:

kubernetes.io/dockerconfigjson

Deployments reference it using:

imagePullSecrets:
  - name: ecr-secret

---

## 26. Kubernetes Rollout

After Jenkins pushes updated images to ECR, it performs:

kubectl rollout restart deployment/placement-backend
kubectl rollout restart deployment/placement-admin
kubectl rollout restart deployment/placement-student

Then Jenkins waits for the rollout to finish.

The process is:

New image in ECR
      ↓
Deployment restart
      ↓
New Pods
      ↓
Pods pull latest image
      ↓
Pods become Ready
      ↓
Old Pods replaced

Because the project uses the latest tag, a rollout restart is used to force new Pods to pull the current image.

For production, immutable tags such as Git commit SHA tags are preferable.

---

## 27. Actual Kubernetes Architecture

                    INTERNET
                        |
                        v
                Traefik Ingress
                        |
             +----------+----------+
             |                     |
             v                     v
      Admin Service         Student Service
             |                     |
             v                     v
        Admin Pod(s)         Student Pod(s)
             |                     |
             +----------+----------+
                        |
                        v
                Backend Service
                        |
                        v
                  Backend Pod(s)
                        |
                        v
                  MongoDB Atlas

---

## 28. EKS Equivalent

The actual project used:

k3s + Traefik

If the same application were deployed using Amazon EKS, a common architecture would be:

Internet
   ↓
AWS Application Load Balancer
   ↓
AWS Load Balancer Controller
   ↓
Kubernetes Ingress
   ↓
Kubernetes Service
   ↓
Pods

Remember:

AWS Load Balancer = external AWS entry point

Ingress = HTTP/HTTPS routing

Service = stable access to Pods

Pod = runs application

---

## 29. Security

### Application Security

- JWT authentication
- bcrypt password hashing
- Role-based authorization
- Helmet
- CORS

### DevOps Security

- SonarQube
- Trivy filesystem scanning
- Trivy Docker image scanning
- GitLab webhook secret
- AWS IAM role
- Kubernetes Secrets
- Private ECR registry

---

## 30. Jenkins Kubernetes Access

Jenkins needs permission to perform the Kubernetes rollout.

A restricted sudoers rule was configured:

jenkins ALL=(ALL) NOPASSWD: /usr/local/bin/k3s

Jenkins uses:

sudo -n /usr/local/bin/k3s kubectl

This gives Jenkins the required k3s access without giving it unrestricted sudo permissions.

---

## 31. Complete Change-to-Deployment Flow

Suppose the developer changes the Student Portal.

### Step 1 – Modify the Code

Developer modifies the application.

### Step 2 – Push the Change

git add .
git commit -m "Update student portal"
git push

### Step 3 – GitLab

GitLab receives the new code.

### Step 4 – Webhook

The GitLab webhook triggers Jenkins.

### Step 5 – Jenkins Pipeline

Jenkins runs:

Build/Test
   ↓
SonarQube
   ↓
Trivy Filesystem
   ↓
Docker Build
   ↓
Trivy Image Scan
   ↓
ECR Push
   ↓
Kubernetes Rollout

### Step 6 – Kubernetes

Kubernetes creates new Pods.

### Step 7 – Updated Application

The updated application becomes available.

Therefore:

One Git push can trigger the complete CI/CD deployment process.

---

## 32. Why Each Tool?

| Tool | Responsibility |
|---|---|
| GitLab | Source control |
| GitLab Webhook | Pipeline trigger |
| Jenkins | CI/CD automation |
| SonarQube | Code-quality analysis |
| Trivy | Vulnerability scanning |
| Docker | Containerization |
| Amazon ECR | Docker image storage |
| Terraform | Infrastructure as Code |
| AWS EC2 | Cloud server |
| k3s | Kubernetes cluster |
| Kubernetes | Container orchestration |
| Traefik | Ingress controller |
| MongoDB Atlas | Database |
| IAM | AWS permissions |

---

## 33. Classroom Demonstration Script

My project is a full-stack Placement Portal with separate Admin and Student portals, a Node.js and Express backend, and MongoDB Atlas. I containerized the three application components using Docker. The source code is maintained in GitLab, and a GitLab webhook automatically triggers Jenkins whenever code is pushed. Jenkins performs the build and test stage, SonarQube code-quality analysis, and Trivy security scanning. It then builds the Docker images, scans the images, and pushes them to Amazon ECR. Kubernetes, using k3s on AWS EC2, manages the deployed containers. Kubernetes Deployments manage the Pods, Services provide stable networking, and Traefik Ingress routes incoming web traffic to the correct Service. Terraform is used as Infrastructure as Code for AWS infrastructure management, and an IAM role provides AWS access without hard-coded credentials. Therefore, a Git push can move the application from source control through quality analysis, security scanning, containerization, image storage, and Kubernetes deployment automatically.

---

## 34. Common Viva Questions

### What is CI/CD?

CI means Continuous Integration, where code changes are automatically built and checked.

CD means Continuous Delivery/Deployment, where validated changes are automatically prepared or deployed.

### Why Jenkins?

Jenkins automates the CI/CD workflow and integrates GitLab, SonarQube, Trivy, Docker, AWS, and Kubernetes.

### Docker vs Kubernetes?

Docker packages applications into containers.

Kubernetes manages those containers at deployment time, including networking, rollouts, scaling, and recovery.

### Terraform vs Kubernetes?

Terraform manages infrastructure.

Kubernetes manages applications running inside the infrastructure.

### Service vs Ingress?

A Service provides a stable endpoint for Pods.

Ingress routes incoming HTTP/HTTPS requests to the appropriate Service.

### Why ECR?

ECR is AWS's private container registry. Jenkins pushes images there and Kubernetes pulls them for deployment.

### Why IAM roles?

IAM roles provide AWS permissions without storing permanent AWS access keys in source code.

### Why k3s?

k3s is lightweight and suitable for a small college/demo environment.

### What happens after git push?

git push
 ↓
GitLab
 ↓
Webhook
 ↓
Jenkins
 ↓
Build/Test
 ↓
SonarQube
 ↓
Trivy
 ↓
Docker Build
 ↓
Trivy Image Scan
 ↓
ECR Push
 ↓
Kubernetes Rollout
 ↓
New Pods
 ↓
Updated Application

---

## 35. Project Structure

placement-portal/
├── admin-portal/
├── student-portal/
├── backend/
├── docker-compose.yml
├── Jenkinsfile
├── terraform/
└── README.md

---

## 36. Final Architecture

Developer
   ↓
GitLab
   ↓ Webhook
Jenkins
   ↓
Build → SonarQube → Trivy → Docker → Trivy Image Scan
   ↓
Amazon ECR
   ↓
Kubernetes / k3s
   ├── Admin Pods
   ├── Student Pods
   └── Backend Pods
          ↓
     MongoDB Atlas

---

## 37. Project Outcome

The project demonstrates an end-to-end DevOps workflow:

Source Code
    ↓
GitLab
    ↓
Webhook
    ↓
Jenkins
    ↓
Quality Analysis
    ↓
Security Scanning
    ↓
Docker
    ↓
Amazon ECR
    ↓
Kubernetes / k3s
    ↓
AWS EC2
    ↓
Deployed Application

The project demonstrates:

- Full-stack web development
- Git-based source control
- Automated CI/CD
- Static code analysis
- Security vulnerability scanning
- Docker containerization
- Container image management
- Infrastructure as Code
- AWS cloud deployment
- Kubernetes orchestration
- Kubernetes networking
- Ingress routing
- Automated application rollout

The temporary AWS infrastructure was cleaned up after the demonstration to avoid unnecessary cloud costs.

---

## 38. Future Improvements

Possible production improvements:

- HTTPS with a real domain
- AWS Application Load Balancer
- Amazon EKS
- Immutable Docker image tags
- Trivy security gates
- AWS Secrets Manager
- Private networking
- Monitoring and alerting
- Autoscaling
- High availability
- Automated backups
- Production observability

---

# Author

Raiyan

Computer Science Graduate

Project: Placement Portal – Full-Stack DevOps & CI/CD

Focus: Full-Stack Development, DevOps, Cloud, CI/CD, Docker and Kubernetes
