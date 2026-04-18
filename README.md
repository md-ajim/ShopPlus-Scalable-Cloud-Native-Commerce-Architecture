# 🛒 ShopPlus – Enterprise Full-Stack E-Commerce Platform

ShopPlus is a production-ready, highly scalable enterprise e-commerce solution. This project demonstrates a robust architecture integrating a high-performance **Next.js** frontend with a secure **Django REST Framework** backend, fully containerized and deployed on **AWS** cloud infrastructure.

## 🌟 Key Technical Highlights

* **Advanced Authentication Architecture:** Engineered a secure, seamless login system integrating `social-django` and `NextAuth.js`. Supported **Google OAuth 2.0** and **JWT-based session handling** to ensure a modern and secure user experience.
* **Security & Identity Management:** Developed a custom **OTP (One-Time Password)** system for email verification. Utilized **Django Cache** for optimized temporary data storage and automated templated emails for user onboarding.
* **Cloud Database Engineering:** Configured and managed **AWS RDS (MySQL)** for production environments. Designed complex relational schemas, optimized SQL queries, and implemented live monitoring to maintain 100% data integrity.
* **Infrastructure & DevOps:** Containerized the entire application environment using **Docker** and **Docker Compose**. Deployed on **AWS EC2** with **Nginx** configured as a reverse proxy for secure routing, SSL termination, and traffic management.
* **CI/CD & Automation:** Implemented **CI/CD pipelines** to automate testing and deployment workflows, ensuring rapid delivery and high reliability of new features.
* **Modern UI/UX Implementation:** Crafted a responsive, high-fidelity interface using **Shadcn/ui**, **Framer Motion**, and **Tailwind CSS**, focusing on performance and accessibility.
* **Payment Integration:** Integrated **Stripe** for secure, enterprise-grade payment processing.

## 🛠️ Tech Stack

**Frontend:**
* Next.js (App Router)
* TypeScript & React.js
* Next-Auth
* Shadcn/ui & Tailwind CSS
* Framer Motion

**Backend:**
* Python & Django
* Django REST Framework (DRF)
* Simple JWT & social-django
* Redis (Caching & OTP)

**Cloud & DevOps:**
* AWS (EC2, RDS, S3)
* Docker & Docker Compose
* Nginx (Reverse Proxy)
* CI/CD Pipelines
* Ubuntu Linux

## ⚙️ Installation & Setup

Ensure you have **Docker** and **Docker Compose** installed.

1.  **Clone the repository:**
    ```bash
    git clone https://github.com/md-ajim/ShopPlus-Scalable-Cloud-Native-Commerce-Architecture.git
    cd ShopPlus-Scalable-Cloud-Native-Commerce-Architecture
    ```

2.  **Environment Setup:**
    Configure `.env` files in both `/backend` and `/frontend` directories based on the provided `.env.example` templates.

3.  **Run with Docker:**
    ```bash
    docker-compose up --build
    ```

4.  **Access points:**
    * Frontend: `http://localhost:3000`
    * API Documentation: `http://localhost:8000/api/`

## 👨‍💻 Author

**MD AJIM**
* **Role:** Full Stack Developer
* **Experience:** 2+ Years Professional | 5+ Years Coding
* **Portfolio:** [MD AJIM](https://md-ajim.vercel.app/)
* **GitHub:** [@md-ajim](https://github.com/md-ajim)
* **LinkedIn:** [MD AJIM](https://www.linkedin.com/in/md-ajim/)
