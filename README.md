# Driven.t API 🎫
Projeto _back-end_ para construção de uma aplicação de gerenciamento de eventos. Com funcionalidades de inscrição, compra de ingressos (presencial ou online) e reserva de hotéis.

## Requisitos Obrigatórios ⚠️

### Geral:
- **Deploy do projeto back-end e do banco de dados na nuvem**.
- Utilização do banco de dados PostgreSQL em conjunto com Prisma.
- Arquiteturar o projeto em _controllers_, _routers_, _middlewares_, _schemas_, _services_, e _respository_.
- Validação de dados utilizando a dependência _joi_.
- Realizar testes automatizados utilizando a ferramenta _Jest_.
- Seguir as regras de arquitetura e de sintaxe (_eslint_).

### Armazenamento dos Dados:

- Formato geral dos dados:

``` prisma
model User {
  id         Int          @id @default(autoincrement())
  email      String       @unique @db.VarChar(255)
  password   String       @db.VarChar(255)
  createdAt  DateTime     @default(now())
  updatedAt  DateTime     @updatedAt
  Session    Session[]
  Enrollment Enrollment[]
  Booking    Booking[]
}

model Session {
  id        Int      @id @default(autoincrement())
  userId    Int
  User      User     @relation(fields: [userId], references: [id])
  token     String
  createdAt DateTime @default(now())
  updatedAt DateTime @updatedAt
}

model Event {
  id                 Int      @id @default(autoincrement())
  title              String   @db.VarChar(255)
  backgroundImageUrl String   @db.VarChar(255)
  logoImageUrl       String   @db.VarChar(255)
  startsAt           DateTime
  endsAt             DateTime
  createdAt          DateTime @default(now())
  updatedAt          DateTime @updatedAt
}

model Enrollment {
  id        Int       @id @default(autoincrement())
  name      String    @db.VarChar(255)
  cpf       String    @db.VarChar(255)
  birthday  DateTime
  phone     String    @db.VarChar(255)
  userId    Int       @unique
  User      User      @relation(fields: [userId], references: [id])
  Address   Address[]
  createdAt DateTime  @default(now())
  updatedAt DateTime  @updatedAt
  Ticket    Ticket?
}

model Address {
  id            Int        @id @default(autoincrement())
  cep           String     @db.VarChar(255)
  street        String     @db.VarChar(255)
  city          String     @db.VarChar(255)
  state         String     @db.VarChar(255)
  number        String     @db.VarChar(255)
  neighborhood  String     @db.VarChar(255)
  addressDetail String?    @db.VarChar(255)
  enrollmentId  Int        @unique
  Enrollment    Enrollment @relation(fields: [enrollmentId], references: [id])
  createdAt     DateTime   @default(now())
  updatedAt     DateTime   @updatedAt
}

model TicketType {
  id            Int      @id @default(autoincrement())
  name          String   @db.VarChar(255)
  price         Int
  isRemote      Boolean
  includesHotel Boolean
  createdAt     DateTime @default(now())
  updatedAt     DateTime @updatedAt
  Ticket        Ticket[]
}

model Ticket {
  id           Int          @id @default(autoincrement())
  ticketTypeId Int
  TicketType   TicketType   @relation(fields: [ticketTypeId], references: [id])
  enrollmentId Int          @unique
  Enrollment   Enrollment   @relation(fields: [enrollmentId], references: [id])
  status       TicketStatus
  createdAt    DateTime     @default(now())
  updatedAt    DateTime     @updatedAt
  Payment      Payment?
}

enum TicketStatus {
  RESERVED
  PAID
}

model Payment {
  id             Int      @id @default(autoincrement())
  ticketId       Int      @unique
  Ticket         Ticket   @relation(fields: [ticketId], references: [id])
  value          Int
  cardIssuer     String
  cardLastDigits String
  createdAt      DateTime @default(now())
  updatedAt      DateTime @updatedAt
}

model Hotel {
  id        Int      @id @default(autoincrement())
  name      String
  image     String
  Rooms     Room[]
  createdAt DateTime @default(now())
  updatedAt DateTime @updatedAt
}

model Room {
  id        Int       @id @default(autoincrement())
  name      String
  capacity  Int
  hotelId   Int
  Hotel     Hotel     @relation(fields: [hotelId], references: [id])
  Booking   Booking[]
  createdAt DateTime  @default(now())
  updatedAt DateTime  @updatedAt
}

model Booking {
  id        Int      @id @default(autoincrement())
  User      User     @relation(fields: [userId], references: [id])
  userId    Int
  Room      Room     @relation(fields: [roomId], references: [id])
  roomId    Int
  createdAt DateTime @default(now())
  updatedAt DateTime @updatedAt
}
```

## Endpoints ⚙️
### 🚩 EventRouter
### ![](https://place-hold.it/80x20/26baec/ffffff?text=GET&fontsize=16) /event
Retorna o primeiro evento disponível no sistema.
<br><br>
⚠️ **ERROS** <br>
- **Not Found (404)**: Evento não encontrado.
<hr>

### 🚩 AuthenticationRouter
### ![](https://place-hold.it/80x20/26ec48/ffffff?text=POST&fontsize=16)  /auth/sign-in 
Recebe **email** e **password** pelo _body_ e realiza login do usuário.
<br><br>
⚠️ **ERROS** <br>
- **Bad Request (400)**: Recebimento de dados inválidos pelo _body_.
- **Unauthorized (401)**: Tentativa inválida de login.
<hr>

### 🚩 UserRouter
### ![](https://place-hold.it/80x20/26ec48/ffffff?text=POST&fontsize=16) /user
Recebe **email** e **password** pelo _body_ e realiza cadastro do usuário.
<br><br>
⚠️ **ERROS** <br>
- **Bad Request (400)**:
  - Recebimento de dados inválidos pelo _body_.
  - Tentativa de cadastro de usuário sem evento disponível.
- **Conflict (409)**: Tentativa de cadastro com e-mail já existente.<br>
<hr>

### 🚩 EnrollmentsRouter
### ![](https://place-hold.it/80x20/26baec/ffffff?text=GET&fontsize=16) /enrollments/cep
Retorna endereço via CEP recebido por _query_.
<br><br>
⚠️ **ERROS** <br>
- **Bad Request (400)**: CEP inválido.
<br><br>

### ![](https://place-hold.it/80x20/26baec/ffffff?text=GET&fontsize=16) /enrollments
Retorna inscrição de usuário de acordo com Id fornecido pelo _token_.
<br><br>
⚠️ **ERROS** <br>
- **Bad Request (400)**: Inscrição do usuário não encontrado.
<br><br>

### ![](https://place-hold.it/80x20/26ec48/ffffff?text=POST&fontsize=16) /enrollments
Recebe **name**, **cpf**, **birthday**, **phone** e **address** (objeto contendo: **cep**, **street**, **city**, **number**, **state**, **neighborhood** e **addressDetail**) e realiza a inscrição do usuário.
<br><br>
⚠️ **ERROS** <br>
- **Bad Request (400)**:
  - Recebimento de dados inválidos pelo _body_.
  - CEP inválido.
<hr>

### 🚩 TicketsRouter
### ![](https://place-hold.it/80x20/26baec/ffffff?text=GET&fontsize=16) /tickets
Retorna os ingressos do usuáio de acordo com Id fornecido pelo _token_.
<br><br>
⚠️ **ERROS** <br>
- **Not Found (404)**: Inscrição ou ingresso de usuário não encontrado.
<br><br>

### ![](https://place-hold.it/80x20/26baec/ffffff?text=GET&fontsize=16) /tickets/type
Retorna todos os ticketsType do sistema.
<br><br>

### ![](https://place-hold.it/80x20/26ec48/ffffff?text=POST&fontsize=16) /tickets
Recebe **ticketTypeId** e registra um novo ingresso no sistema.
<br><br>
⚠️ **ERROS** <br>
- **Bad Request (400)**: Recebimento de dados inválidos pelo _body_.
- **Not Found (404)**: TicketType ou inscrição de usuário não encontrado.
<hr>

### 🚩 PaymentsRouter
### ![](https://place-hold.it/80x20/26baec/ffffff?text=GET&fontsize=16) /payments
Retorna detalhes do pagamento efetuado pelo usuário via Id fornecido pelo _token_ e **ticketId** recebido por _query_.
<br><br>
⚠️ **ERROS** <br>
- **Unauthorized (401)**: Ingresso fornecido não é do usuário.
- **Not Found (404)**: Ingresso não encontrado.
<br><br>

### ![](https://place-hold.it/80x20/26ec48/ffffff?text=POST&fontsize=16) /payments/process
Recebe **tickedId** e **cardData** (objeto contendo: **issuer**, **number**, **name**, **expirationDate** e **cvv**) e realiza pagamento de um ticket.
<br><br>
⚠️ **ERROS** <br>
- **Bad Request (400)**: Recebimento de dados inválidos pelo _body_.
- **Unauthorized (401)**: Ingresso fornecido não é do usuário.
- **Not Found (404)**: Ticket ou TicketType não encontrado.
<hr>

### 🚩 HotelsRouter
### ![](https://place-hold.it/80x20/26baec/ffffff?text=GET&fontsize=16) /hotels
Retorna lista de hotéis para o usuário, Id é fornecido por _token_.
<br><br>
⚠️ **ERROS** <br>
- **Payment Required (402)**:
  - Usuário ainda não fez pagamento do ticket.
  - Ingresso de usuário não inclui hotel (ingresso do tipo online). 
- **Not Found (404)**:
  - Usuário ainda não fez inscrição.
  - Ingresso não encontrado.
  - Não há hotéis disponíveis no sistema.
<br><br>

### ![](https://place-hold.it/80x20/26baec/ffffff?text=GET&fontsize=16) /hotels/:hotelId
Retorna lista de salas de um hotel via **hotelId** recebido por _params_.
<br><br>
⚠️ **ERROS** <br>
- **Payment Required (402)**:
  - Usuário ainda não fez pagamento do ticket.
  - Ingresso de usuário não inclui hotel (ingresso do tipo online). 
- **Not Found (404)**:
  - Hotel inexistente.
  - Usuário ainda não fez inscrição.
  - Ingresso não encontrado.
<hr>

### 🚩 BookingRouter
### ![](https://place-hold.it/80x20/26baec/ffffff?text=GET&fontsize=16) /booking
Retorna reserva feita pelo usuário via Id fornecido pelo _token_.
<br><br>
⚠️ **ERROS** <br>
- **Not Found (404)**: Reserva não encontrada.
<br><br>

### ![](https://place-hold.it/80x20/26ec48/ffffff?text=POST&fontsize=16) /booking
Recebe **roomId** pelo _body_ e realiza reserva de uma sala de hotel.
<br><br>
⚠️ **ERROS** <br>
- **Bad Request (400)**: Recebimento de dados inválidos pelo _body_.
- **Forbidden (403)**:
  - Usuário ainda não fez inscrição.
  - Ingresso não encontrado.
  - Usuário ainda não fez pagamento de ingresso.
  - Ingresso de usuário não inclui hotel.
  - Capacidade máxima da sala excedida.
  - Usuário já possui reserva na sala.
- **Not Found (404)**: Sala de hotel não encontrada.
<br><br>

### ![](https://place-hold.it/80x20/ec7926/ffffff?text=PUT&fontsize=16) /booking/:bookingId
Recebe **roomId** pelo _body_ e **bookingId** por _query_.
<br><br>
⚠️ **ERROS** <br>
- **Bad Request (400)**: Recebimento de dados inválidos pelo _body_.
- **Forbidden (403)**:
  - Reserva não encontrada.
  - A reserva solicitada não é do usuario.
  - A reserva de sala solicitada é da mesma reserva antiga do usuário.
  - Capacidade máxima da sala excedida.
- **Not Found (404)**: Sala de hotel não encontrada.
<hr>

### Testes Automatizados 🧪

- Rodar as migrações do prisma configurando o arquivo `.env` seguindo `.env.example`:

```bash
npm run dev:migration:run
```

- Rodar seeds do banco de dados:

```bash
npm run dev:seed
```

- Comando para rodar os testes:

```bash
npm run test
```
