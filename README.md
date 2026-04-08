# SUNASS Regulatorio

Plataforma digital para la gestión y evaluación territorial de prestadores de servicios de agua (EP y JASS). Este sistema centraliza, organiza y procesa grandes volúmenes de información, implementando una arquitectura diseñada para operar siguiendo la geografía real y las operaciones multisectoriales de SUNASS (Fiscalización, Usuarios, Caracterización y Cuota Familiar).

## 🚀 Características Principales

*   **Modelo de Datos Realista:** Organización de la información en base a la relación **Prestador + Localidad + Módulo**. Un prestador puede operar en múltiples localidades, y viceversa.
*   **Formularios Dinámicos por Módulo:** Flexibilidad para incorporar múltiples áreas (Fiscalización, Usuarios, etc.) con sus propias lógicas e históricos estructurados.
*   **Geolocalización In-Situ:** Captura de coordenadas precisas (`lat`, `lng`) durante la evaluación en campo, asegurando la veracidad de la visita.
*   **Integridad de Evidencia Fotográfica:** Captura de evidencia validada con metadatos y firmas `SHA-256` para trazabilidad completa.
*   **Operación Offline-first:** Arquitectura diseñada estructuralmente para soportar trabajo de campo en zonas con conectividad limitada, gestionando colas de sincronización (`SyncStatus`).

---

## 🛠️ Tecnologías Utilizadas

### Backend
*   **Lenguaje:** Java 17
*   **Framework:** Spring Boot 3.4.x
*   **Persistencia:** Spring Data JPA (Hibernate)
*   **Seguridad:** Spring Security
*   **Base de Datos:** PostgreSQL 15+
*   **Documentación de API:** OpenAPI / Swagger UI
*   **Integraciones Adicionales:** Spring WebFlux (cliente asíncrono para interacciones IA - Gemini)

---

## ⚙️ Requisitos Previos

Asegúrate de tener instalado en tu entorno local:
1. [Java JDK 17](https://adoptium.net/es/) o superior.
2. [PostgreSQL](https://www.postgresql.org/download/) operando en el puerto `5432`.
3. Variables de entorno listas (O ajustadas en el archivo `application.properties`).

---

## 🏎️ Instalación y Ejecución Local

1. **Clonar el repositorio y entrar al backend**
    ```bash
    cd backend
    ```

2. **Preparar la Base de Datos**
    Asegúrate de que exista una base de datos en PostgreSQL llamada:
    ```sql
    CREATE DATABASE sunass_regulatorio;
    ```
   *Nota: Por defecto el usuario configurado en application.properties es `postgres`. Modifícalo según tus credenciales locales.*

3. **Ejecutar la aplicación**
   Usando el wrapper de Maven que viene incluido:

   *Para Windows:*
   ```cmd
   mvnw spring-boot:run
   ```
   *Para Linux/Mac:*
   ```bash
   ./mvnw spring-boot:run
   ```

4. **Verificar que el servicio levantó existosamente**
   Abre un navegador y dirígete a Swagger UI para encontrar toda la documentación de las APIs disponibles:
   👉 **http://localhost:8080/swagger-ui.html**

---

## 📖 Documentación Adicional

Para entender a fondo las entidades, diagramas asumidos, procesos de mantenimiento técnico y el estado de la deuda técnica (seguridad y migraciones), revisa la documentación ampliada en este mismo repositorio:

👉 **[technical_documentation.md](./technical_documentation.md)**
