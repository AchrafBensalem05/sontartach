# Details

Date : 2024-06-25 18:57:02

Directory c:\\Users\\21365\\Desktop\\op\\server

Total : 82 files,  2873 codes, 310 comments, 502 blanks, all 3685 lines

[Summary](results.md) / Details / [Diff Summary](diff.md) / [Diff Details](diff-details.md)

## Files
| filename | language | code | comment | blank | total |
| :--- | :--- | ---: | ---: | ---: | ---: |
| [server/.env](/server/.env) | Properties | 1 | 0 | 0 | 1 |
| [server/README.md](/server/README.md) | Markdown | 44 | 0 | 31 | 75 |
| [server/app/config/auth.config.js](/server/app/config/auth.config.js) | JavaScript | 3 | 0 | 1 | 4 |
| [server/app/config/db.config.js](/server/app/config/db.config.js) | JavaScript | 5 | 0 | 0 | 5 |
| [server/app/controllers/auth.controller.js](/server/app/controllers/auth.controller.js) | JavaScript | 82 | 0 | 9 | 91 |
| [server/app/controllers/data.js](/server/app/controllers/data.js) | JavaScript | 0 | 0 | 1 | 1 |
| [server/app/controllers/epnote.controller.js](/server/app/controllers/epnote.controller.js) | JavaScript | 45 | 9 | 5 | 59 |
| [server/app/controllers/inspection.controller.js](/server/app/controllers/inspection.controller.js) | JavaScript | 22 | 3 | 5 | 30 |
| [server/app/controllers/inspectionDepReport.controller.js](/server/app/controllers/inspectionDepReport.controller.js) | JavaScript | 54 | 9 | 7 | 70 |
| [server/app/controllers/junction.controller.js](/server/app/controllers/junction.controller.js) | JavaScript | 167 | 22 | 16 | 205 |
| [server/app/controllers/manufold.controller.js](/server/app/controllers/manufold.controller.js) | JavaScript | 245 | 24 | 29 | 298 |
| [server/app/controllers/pipe.controller.js](/server/app/controllers/pipe.controller.js) | JavaScript | 402 | 71 | 52 | 525 |
| [server/app/controllers/pipelineOptimizer.js](/server/app/controllers/pipelineOptimizer.js) | JavaScript | 62 | 6 | 16 | 84 |
| [server/app/controllers/telemetry.controller.js](/server/app/controllers/telemetry.controller.js) | JavaScript | 45 | 2 | 8 | 55 |
| [server/app/controllers/user.controller.js](/server/app/controllers/user.controller.js) | JavaScript | 12 | 0 | 4 | 16 |
| [server/app/controllers/well.controller.js](/server/app/controllers/well.controller.js) | JavaScript | 304 | 36 | 27 | 367 |
| [server/app/middlewares/auth.js](/server/app/middlewares/auth.js) | JavaScript | 35 | 0 | 7 | 42 |
| [server/app/middlewares/authJwt.js](/server/app/middlewares/authJwt.js) | JavaScript | 54 | 1 | 10 | 65 |
| [server/app/middlewares/checkRole.js](/server/app/middlewares/checkRole.js) | JavaScript | 0 | 50 | 10 | 60 |
| [server/app/middlewares/index.js](/server/app/middlewares/index.js) | JavaScript | 6 | 0 | 2 | 8 |
| [server/app/middlewares/multer.js](/server/app/middlewares/multer.js) | JavaScript | 21 | 3 | 6 | 30 |
| [server/app/middlewares/upload.js](/server/app/middlewares/upload.js) | JavaScript | 19 | 3 | 5 | 27 |
| [server/app/middlewares/verifySignUp.js](/server/app/middlewares/verifySignUp.js) | JavaScript | 57 | 2 | 11 | 70 |
| [server/app/models/Ouvragetype.jsx](/server/app/models/Ouvragetype.jsx) | JavaScript JSX | 2 | 0 | 0 | 2 |
| [server/app/models/address.js](/server/app/models/address.js) | JavaScript | 9 | 0 | 5 | 14 |
| [server/app/models/connection.js](/server/app/models/connection.js) | JavaScript | 2 | 0 | 2 | 4 |
| [server/app/models/construction.js](/server/app/models/construction.js) | JavaScript | 9 | 0 | 4 | 13 |
| [server/app/models/constructionstatus.js](/server/app/models/constructionstatus.js) | JavaScript | 8 | 0 | 4 | 12 |
| [server/app/models/coord.js](/server/app/models/coord.js) | JavaScript | 9 | 0 | 4 | 13 |
| [server/app/models/epnote.js](/server/app/models/epnote.js) | JavaScript | 9 | 0 | 4 | 13 |
| [server/app/models/evaluation.js](/server/app/models/evaluation.js) | JavaScript | 10 | 0 | 4 | 14 |
| [server/app/models/index.js](/server/app/models/index.js) | JavaScript | 20 | 2 | 6 | 28 |
| [server/app/models/infrastracture.js](/server/app/models/infrastracture.js) | JavaScript | 5 | 0 | 2 | 7 |
| [server/app/models/inspection.js](/server/app/models/inspection.js) | JavaScript | 13 | 0 | 4 | 17 |
| [server/app/models/inspectionDepReport.js](/server/app/models/inspectionDepReport.js) | JavaScript | 9 | 0 | 4 | 13 |
| [server/app/models/junction.js](/server/app/models/junction.js) | JavaScript | 13 | 0 | 8 | 21 |
| [server/app/models/manufold.js](/server/app/models/manufold.js) | JavaScript | 19 | 0 | 5 | 24 |
| [server/app/models/nature.js](/server/app/models/nature.js) | JavaScript | 2 | 0 | 2 | 4 |
| [server/app/models/pipe.js](/server/app/models/pipe.js) | JavaScript | 16 | 0 | 4 | 20 |
| [server/app/models/pipeSegment.js](/server/app/models/pipeSegment.js) | JavaScript | 13 | 6 | 7 | 26 |
| [server/app/models/pipeStatus.js](/server/app/models/pipeStatus.js) | JavaScript | 8 | 0 | 4 | 12 |
| [server/app/models/role.model.js](/server/app/models/role.model.js) | JavaScript | 8 | 0 | 3 | 11 |
| [server/app/models/telemetry.js](/server/app/models/telemetry.js) | JavaScript | 12 | 0 | 4 | 16 |
| [server/app/models/type.js](/server/app/models/type.js) | JavaScript | 2 | 0 | 0 | 2 |
| [server/app/models/user.model.js](/server/app/models/user.model.js) | JavaScript | 14 | 0 | 3 | 17 |
| [server/app/models/well.js](/server/app/models/well.js) | JavaScript | 14 | 1 | 3 | 18 |
| [server/app/models/wellType.js](/server/app/models/wellType.js) | JavaScript | 8 | 0 | 4 | 12 |
| [server/app/routes/auth.routes.js](/server/app/routes/auth.routes.js) | JavaScript | 18 | 1 | 6 | 25 |
| [server/app/routes/epnote.routes.js](/server/app/routes/epnote.routes.js) | JavaScript | 7 | 3 | 4 | 14 |
| [server/app/routes/inpectionDepReport.routes.js](/server/app/routes/inpectionDepReport.routes.js) | JavaScript | 7 | 3 | 4 | 14 |
| [server/app/routes/inspection.routes.js](/server/app/routes/inspection.routes.js) | JavaScript | 6 | 3 | 5 | 14 |
| [server/app/routes/junction.routes.js](/server/app/routes/junction.routes.js) | JavaScript | 8 | 5 | 10 | 23 |
| [server/app/routes/manufold.routes.js](/server/app/routes/manufold.routes.js) | JavaScript | 10 | 5 | 12 | 27 |
| [server/app/routes/pipe.routes.js](/server/app/routes/pipe.routes.js) | JavaScript | 14 | 6 | 12 | 32 |
| [server/app/routes/telemetry.routes.js](/server/app/routes/telemetry.routes.js) | JavaScript | 6 | 1 | 3 | 10 |
| [server/app/routes/user.routes.js](/server/app/routes/user.routes.js) | JavaScript | 23 | 0 | 6 | 29 |
| [server/app/routes/well.routes.js](/server/app/routes/well.routes.js) | JavaScript | 11 | 7 | 8 | 26 |
| [server/draft.js](/server/draft.js) | JavaScript | 30 | 16 | 11 | 57 |
| [server/initroles.js](/server/initroles.js) | JavaScript | 26 | 0 | 5 | 31 |
| [server/package.json](/server/package.json) | JSON | 38 | 0 | 1 | 39 |
| [server/server.js](/server/server.js) | JavaScript | 125 | 10 | 33 | 168 |
| [server/uploads/1716044846140-file1.csv](/server/uploads/1716044846140-file1.csv) | CSV | 85 | 0 | 4 | 89 |
| [server/uploads/1716045012580-file1.csv](/server/uploads/1716045012580-file1.csv) | CSV | 85 | 0 | 4 | 89 |
| [server/uploads/1716045039939-file1.csv](/server/uploads/1716045039939-file1.csv) | CSV | 85 | 0 | 4 | 89 |
| [server/uploads/1716045660510-file.csv](/server/uploads/1716045660510-file.csv) | CSV | 31 | 0 | 1 | 32 |
| [server/uploads/1716045826528-file.csv](/server/uploads/1716045826528-file.csv) | CSV | 31 | 0 | 1 | 32 |
| [server/uploads/1716045945626-file.csv](/server/uploads/1716045945626-file.csv) | CSV | 31 | 0 | 1 | 32 |
| [server/uploads/1716046008138-file.csv](/server/uploads/1716046008138-file.csv) | CSV | 31 | 0 | 1 | 32 |
| [server/uploads/1716046187145-file.csv](/server/uploads/1716046187145-file.csv) | CSV | 31 | 0 | 1 | 32 |
| [server/uploads/1716046750472-file.csv](/server/uploads/1716046750472-file.csv) | CSV | 31 | 0 | 1 | 32 |
| [server/uploads/1716046829643-file.csv](/server/uploads/1716046829643-file.csv) | CSV | 31 | 0 | 1 | 32 |
| [server/uploads/1716397429888-file.csv](/server/uploads/1716397429888-file.csv) | CSV | 11 | 0 | 1 | 12 |
| [server/uploads/1716397464013-file.csv](/server/uploads/1716397464013-file.csv) | CSV | 31 | 0 | 1 | 32 |
| [server/uploads/1716397505179-file.csv](/server/uploads/1716397505179-file.csv) | CSV | 31 | 0 | 1 | 32 |
| [server/uploads/1717065022965-file.csv](/server/uploads/1717065022965-file.csv) | CSV | 31 | 0 | 1 | 32 |
| [server/uploads/1717065086246-fiile.csv](/server/uploads/1717065086246-fiile.csv) | CSV | 3 | 0 | 1 | 4 |
| [server/uploads/1717065138135-fiile.csv](/server/uploads/1717065138135-fiile.csv) | CSV | 3 | 0 | 1 | 4 |
| [server/uploads/1717073985547-fiile.csv](/server/uploads/1717073985547-fiile.csv) | CSV | 3 | 0 | 1 | 4 |
| [server/uploads/1717074050837-fiile.csv](/server/uploads/1717074050837-fiile.csv) | CSV | 3 | 0 | 1 | 4 |
| [server/uploads/1717074249597-fiile.csv](/server/uploads/1717074249597-fiile.csv) | CSV | 3 | 0 | 1 | 4 |
| [server/uploads/fiile.csv](/server/uploads/fiile.csv) | CSV | 3 | 0 | 1 | 4 |
| [server/uploads/file.csv](/server/uploads/file.csv) | CSV | 31 | 0 | 1 | 32 |

[Summary](results.md) / Details / [Diff Summary](diff.md) / [Diff Details](diff-details.md)