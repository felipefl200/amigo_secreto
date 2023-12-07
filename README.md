## Api REST - Amigo Secreto

### Technologies

![NoDE](https://img.shields.io/badge/Node.js-43853D?style=for-the-badge&logo=node.js&logoColor=white)![Typescript](https://img.shields.io/badge/TypeScript-007ACC?style=for-the-badge&logo=typescript&logoColor=white)![PrismaORM](https://img.shields.io/badge/Prisma-3982CE?style=for-the-badge&logo=Prisma&logoColor=white)![Zod](https://img.shields.io/badge/Zod-3E67B1.svg?style=for-the-badge&logo=Zod&logoColor=white)

### Routes

- POST /admin/login

- EVENTS

  - GET /admin/events
  - GET /admin/event/:id
  - POST /admin/events
  - PUT /admin/events/:id
  - DELETE /admin/events/:id

- GROUPS

  - GET /admin/events/:id_event/groups
  - GET /admin/events/:id_event/groups/:id
  - POST /admin/events/:id_event/groups
  - PUT /admin/events/:id_event/groups/:id
  - DELETE /admin/events/:id_event/groups/:id

- PERSONS
  - GET /admin/events/:id_event/groups/:id_group/people
  - GET /admin/events/:id_event/groups/:id_group/people/:id
  - POST /admin/events/:id_event/groups/:id_group/people
  - PUT /admin/events/:id_event/groups/:id_group/people/:id
  - DELETE /admin/events/:id_event/groups/:id_group/people/:id
