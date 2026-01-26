"use strict";
/*
 * ATTENTION: An "eval-source-map" devtool has been used.
 * This devtool is neither made for production nor for readable output files.
 * It uses "eval()" calls to create a separate source file with attached SourceMaps in the browser devtools.
 * If you are trying to read the output file, select a different devtool (https://webpack.js.org/configuration/devtool/)
 * or disable the default devtool with "devtool: false".
 * If you are looking for production-ready output files, see mode: "production" (https://webpack.js.org/configuration/mode/).
 */
(() => {
var exports = {};
exports.id = "app/api/admin/gastos/route";
exports.ids = ["app/api/admin/gastos/route"];
exports.modules = {

/***/ "../../client/components/action-async-storage.external":
/*!*******************************************************************************!*\
  !*** external "next/dist/client/components/action-async-storage.external.js" ***!
  \*******************************************************************************/
/***/ ((module) => {

module.exports = require("next/dist/client/components/action-async-storage.external.js");

/***/ }),

/***/ "../../client/components/request-async-storage.external":
/*!********************************************************************************!*\
  !*** external "next/dist/client/components/request-async-storage.external.js" ***!
  \********************************************************************************/
/***/ ((module) => {

module.exports = require("next/dist/client/components/request-async-storage.external.js");

/***/ }),

/***/ "../../client/components/static-generation-async-storage.external":
/*!******************************************************************************************!*\
  !*** external "next/dist/client/components/static-generation-async-storage.external.js" ***!
  \******************************************************************************************/
/***/ ((module) => {

module.exports = require("next/dist/client/components/static-generation-async-storage.external.js");

/***/ }),

/***/ "next/dist/compiled/next-server/app-page.runtime.dev.js":
/*!*************************************************************************!*\
  !*** external "next/dist/compiled/next-server/app-page.runtime.dev.js" ***!
  \*************************************************************************/
/***/ ((module) => {

module.exports = require("next/dist/compiled/next-server/app-page.runtime.dev.js");

/***/ }),

/***/ "next/dist/compiled/next-server/app-route.runtime.dev.js":
/*!**************************************************************************!*\
  !*** external "next/dist/compiled/next-server/app-route.runtime.dev.js" ***!
  \**************************************************************************/
/***/ ((module) => {

module.exports = require("next/dist/compiled/next-server/app-route.runtime.dev.js");

/***/ }),

/***/ "pg":
/*!*********************!*\
  !*** external "pg" ***!
  \*********************/
/***/ ((module) => {

module.exports = require("pg");

/***/ }),

/***/ "buffer":
/*!*************************!*\
  !*** external "buffer" ***!
  \*************************/
/***/ ((module) => {

module.exports = require("buffer");

/***/ }),

/***/ "crypto":
/*!*************************!*\
  !*** external "crypto" ***!
  \*************************/
/***/ ((module) => {

module.exports = require("crypto");

/***/ }),

/***/ "stream":
/*!*************************!*\
  !*** external "stream" ***!
  \*************************/
/***/ ((module) => {

module.exports = require("stream");

/***/ }),

/***/ "util":
/*!***********************!*\
  !*** external "util" ***!
  \***********************/
/***/ ((module) => {

module.exports = require("util");

/***/ }),

/***/ "(rsc)/./node_modules/next/dist/build/webpack/loaders/next-app-loader.js?name=app%2Fapi%2Fadmin%2Fgastos%2Froute&page=%2Fapi%2Fadmin%2Fgastos%2Froute&appPaths=&pagePath=private-next-app-dir%2Fapi%2Fadmin%2Fgastos%2Froute.ts&appDir=%2FUsers%2Ffernandotrejo%2FDeveloper%2Fcursos-brooklyn%2Fapp&pageExtensions=tsx&pageExtensions=ts&pageExtensions=jsx&pageExtensions=js&rootDir=%2FUsers%2Ffernandotrejo%2FDeveloper%2Fcursos-brooklyn&isDev=true&tsconfigPath=tsconfig.json&basePath=&assetPrefix=&nextConfigOutput=&preferredRegion=&middlewareConfig=e30%3D!":
/*!**********************************************************************************************************************************************************************************************************************************************************************************************************************************************************************************************************************************************************************************************************************************************************************!*\
  !*** ./node_modules/next/dist/build/webpack/loaders/next-app-loader.js?name=app%2Fapi%2Fadmin%2Fgastos%2Froute&page=%2Fapi%2Fadmin%2Fgastos%2Froute&appPaths=&pagePath=private-next-app-dir%2Fapi%2Fadmin%2Fgastos%2Froute.ts&appDir=%2FUsers%2Ffernandotrejo%2FDeveloper%2Fcursos-brooklyn%2Fapp&pageExtensions=tsx&pageExtensions=ts&pageExtensions=jsx&pageExtensions=js&rootDir=%2FUsers%2Ffernandotrejo%2FDeveloper%2Fcursos-brooklyn&isDev=true&tsconfigPath=tsconfig.json&basePath=&assetPrefix=&nextConfigOutput=&preferredRegion=&middlewareConfig=e30%3D! ***!
  \**********************************************************************************************************************************************************************************************************************************************************************************************************************************************************************************************************************************************************************************************************************************************************************/
/***/ ((__unused_webpack_module, __webpack_exports__, __webpack_require__) => {

eval("__webpack_require__.r(__webpack_exports__);\n/* harmony export */ __webpack_require__.d(__webpack_exports__, {\n/* harmony export */   originalPathname: () => (/* binding */ originalPathname),\n/* harmony export */   patchFetch: () => (/* binding */ patchFetch),\n/* harmony export */   requestAsyncStorage: () => (/* binding */ requestAsyncStorage),\n/* harmony export */   routeModule: () => (/* binding */ routeModule),\n/* harmony export */   serverHooks: () => (/* binding */ serverHooks),\n/* harmony export */   staticGenerationAsyncStorage: () => (/* binding */ staticGenerationAsyncStorage)\n/* harmony export */ });\n/* harmony import */ var next_dist_server_future_route_modules_app_route_module_compiled__WEBPACK_IMPORTED_MODULE_0__ = __webpack_require__(/*! next/dist/server/future/route-modules/app-route/module.compiled */ \"(rsc)/./node_modules/next/dist/server/future/route-modules/app-route/module.compiled.js\");\n/* harmony import */ var next_dist_server_future_route_modules_app_route_module_compiled__WEBPACK_IMPORTED_MODULE_0___default = /*#__PURE__*/__webpack_require__.n(next_dist_server_future_route_modules_app_route_module_compiled__WEBPACK_IMPORTED_MODULE_0__);\n/* harmony import */ var next_dist_server_future_route_kind__WEBPACK_IMPORTED_MODULE_1__ = __webpack_require__(/*! next/dist/server/future/route-kind */ \"(rsc)/./node_modules/next/dist/server/future/route-kind.js\");\n/* harmony import */ var next_dist_server_lib_patch_fetch__WEBPACK_IMPORTED_MODULE_2__ = __webpack_require__(/*! next/dist/server/lib/patch-fetch */ \"(rsc)/./node_modules/next/dist/server/lib/patch-fetch.js\");\n/* harmony import */ var next_dist_server_lib_patch_fetch__WEBPACK_IMPORTED_MODULE_2___default = /*#__PURE__*/__webpack_require__.n(next_dist_server_lib_patch_fetch__WEBPACK_IMPORTED_MODULE_2__);\n/* harmony import */ var _Users_fernandotrejo_Developer_cursos_brooklyn_app_api_admin_gastos_route_ts__WEBPACK_IMPORTED_MODULE_3__ = __webpack_require__(/*! ./app/api/admin/gastos/route.ts */ \"(rsc)/./app/api/admin/gastos/route.ts\");\n\n\n\n\n// We inject the nextConfigOutput here so that we can use them in the route\n// module.\nconst nextConfigOutput = \"\"\nconst routeModule = new next_dist_server_future_route_modules_app_route_module_compiled__WEBPACK_IMPORTED_MODULE_0__.AppRouteRouteModule({\n    definition: {\n        kind: next_dist_server_future_route_kind__WEBPACK_IMPORTED_MODULE_1__.RouteKind.APP_ROUTE,\n        page: \"/api/admin/gastos/route\",\n        pathname: \"/api/admin/gastos\",\n        filename: \"route\",\n        bundlePath: \"app/api/admin/gastos/route\"\n    },\n    resolvedPagePath: \"/Users/fernandotrejo/Developer/cursos-brooklyn/app/api/admin/gastos/route.ts\",\n    nextConfigOutput,\n    userland: _Users_fernandotrejo_Developer_cursos_brooklyn_app_api_admin_gastos_route_ts__WEBPACK_IMPORTED_MODULE_3__\n});\n// Pull out the exports that we need to expose from the module. This should\n// be eliminated when we've moved the other routes to the new format. These\n// are used to hook into the route.\nconst { requestAsyncStorage, staticGenerationAsyncStorage, serverHooks } = routeModule;\nconst originalPathname = \"/api/admin/gastos/route\";\nfunction patchFetch() {\n    return (0,next_dist_server_lib_patch_fetch__WEBPACK_IMPORTED_MODULE_2__.patchFetch)({\n        serverHooks,\n        staticGenerationAsyncStorage\n    });\n}\n\n\n//# sourceMappingURL=app-route.js.map//# sourceURL=[module]\n//# sourceMappingURL=data:application/json;charset=utf-8;base64,eyJ2ZXJzaW9uIjozLCJmaWxlIjoiKHJzYykvLi9ub2RlX21vZHVsZXMvbmV4dC9kaXN0L2J1aWxkL3dlYnBhY2svbG9hZGVycy9uZXh0LWFwcC1sb2FkZXIuanM/bmFtZT1hcHAlMkZhcGklMkZhZG1pbiUyRmdhc3RvcyUyRnJvdXRlJnBhZ2U9JTJGYXBpJTJGYWRtaW4lMkZnYXN0b3MlMkZyb3V0ZSZhcHBQYXRocz0mcGFnZVBhdGg9cHJpdmF0ZS1uZXh0LWFwcC1kaXIlMkZhcGklMkZhZG1pbiUyRmdhc3RvcyUyRnJvdXRlLnRzJmFwcERpcj0lMkZVc2VycyUyRmZlcm5hbmRvdHJlam8lMkZEZXZlbG9wZXIlMkZjdXJzb3MtYnJvb2tseW4lMkZhcHAmcGFnZUV4dGVuc2lvbnM9dHN4JnBhZ2VFeHRlbnNpb25zPXRzJnBhZ2VFeHRlbnNpb25zPWpzeCZwYWdlRXh0ZW5zaW9ucz1qcyZyb290RGlyPSUyRlVzZXJzJTJGZmVybmFuZG90cmVqbyUyRkRldmVsb3BlciUyRmN1cnNvcy1icm9va2x5biZpc0Rldj10cnVlJnRzY29uZmlnUGF0aD10c2NvbmZpZy5qc29uJmJhc2VQYXRoPSZhc3NldFByZWZpeD0mbmV4dENvbmZpZ091dHB1dD0mcHJlZmVycmVkUmVnaW9uPSZtaWRkbGV3YXJlQ29uZmlnPWUzMCUzRCEiLCJtYXBwaW5ncyI6Ijs7Ozs7Ozs7Ozs7Ozs7O0FBQXNHO0FBQ3ZDO0FBQ2M7QUFDNEI7QUFDekc7QUFDQTtBQUNBO0FBQ0Esd0JBQXdCLGdIQUFtQjtBQUMzQztBQUNBLGNBQWMseUVBQVM7QUFDdkI7QUFDQTtBQUNBO0FBQ0E7QUFDQSxLQUFLO0FBQ0w7QUFDQTtBQUNBLFlBQVk7QUFDWixDQUFDO0FBQ0Q7QUFDQTtBQUNBO0FBQ0EsUUFBUSxpRUFBaUU7QUFDekU7QUFDQTtBQUNBLFdBQVcsNEVBQVc7QUFDdEI7QUFDQTtBQUNBLEtBQUs7QUFDTDtBQUN1SDs7QUFFdkgiLCJzb3VyY2VzIjpbIndlYnBhY2s6Ly9jdXJzb3MtYnJvb2tseW4vPzRjZDkiXSwic291cmNlc0NvbnRlbnQiOlsiaW1wb3J0IHsgQXBwUm91dGVSb3V0ZU1vZHVsZSB9IGZyb20gXCJuZXh0L2Rpc3Qvc2VydmVyL2Z1dHVyZS9yb3V0ZS1tb2R1bGVzL2FwcC1yb3V0ZS9tb2R1bGUuY29tcGlsZWRcIjtcbmltcG9ydCB7IFJvdXRlS2luZCB9IGZyb20gXCJuZXh0L2Rpc3Qvc2VydmVyL2Z1dHVyZS9yb3V0ZS1raW5kXCI7XG5pbXBvcnQgeyBwYXRjaEZldGNoIGFzIF9wYXRjaEZldGNoIH0gZnJvbSBcIm5leHQvZGlzdC9zZXJ2ZXIvbGliL3BhdGNoLWZldGNoXCI7XG5pbXBvcnQgKiBhcyB1c2VybGFuZCBmcm9tIFwiL1VzZXJzL2Zlcm5hbmRvdHJlam8vRGV2ZWxvcGVyL2N1cnNvcy1icm9va2x5bi9hcHAvYXBpL2FkbWluL2dhc3Rvcy9yb3V0ZS50c1wiO1xuLy8gV2UgaW5qZWN0IHRoZSBuZXh0Q29uZmlnT3V0cHV0IGhlcmUgc28gdGhhdCB3ZSBjYW4gdXNlIHRoZW0gaW4gdGhlIHJvdXRlXG4vLyBtb2R1bGUuXG5jb25zdCBuZXh0Q29uZmlnT3V0cHV0ID0gXCJcIlxuY29uc3Qgcm91dGVNb2R1bGUgPSBuZXcgQXBwUm91dGVSb3V0ZU1vZHVsZSh7XG4gICAgZGVmaW5pdGlvbjoge1xuICAgICAgICBraW5kOiBSb3V0ZUtpbmQuQVBQX1JPVVRFLFxuICAgICAgICBwYWdlOiBcIi9hcGkvYWRtaW4vZ2FzdG9zL3JvdXRlXCIsXG4gICAgICAgIHBhdGhuYW1lOiBcIi9hcGkvYWRtaW4vZ2FzdG9zXCIsXG4gICAgICAgIGZpbGVuYW1lOiBcInJvdXRlXCIsXG4gICAgICAgIGJ1bmRsZVBhdGg6IFwiYXBwL2FwaS9hZG1pbi9nYXN0b3Mvcm91dGVcIlxuICAgIH0sXG4gICAgcmVzb2x2ZWRQYWdlUGF0aDogXCIvVXNlcnMvZmVybmFuZG90cmVqby9EZXZlbG9wZXIvY3Vyc29zLWJyb29rbHluL2FwcC9hcGkvYWRtaW4vZ2FzdG9zL3JvdXRlLnRzXCIsXG4gICAgbmV4dENvbmZpZ091dHB1dCxcbiAgICB1c2VybGFuZFxufSk7XG4vLyBQdWxsIG91dCB0aGUgZXhwb3J0cyB0aGF0IHdlIG5lZWQgdG8gZXhwb3NlIGZyb20gdGhlIG1vZHVsZS4gVGhpcyBzaG91bGRcbi8vIGJlIGVsaW1pbmF0ZWQgd2hlbiB3ZSd2ZSBtb3ZlZCB0aGUgb3RoZXIgcm91dGVzIHRvIHRoZSBuZXcgZm9ybWF0LiBUaGVzZVxuLy8gYXJlIHVzZWQgdG8gaG9vayBpbnRvIHRoZSByb3V0ZS5cbmNvbnN0IHsgcmVxdWVzdEFzeW5jU3RvcmFnZSwgc3RhdGljR2VuZXJhdGlvbkFzeW5jU3RvcmFnZSwgc2VydmVySG9va3MgfSA9IHJvdXRlTW9kdWxlO1xuY29uc3Qgb3JpZ2luYWxQYXRobmFtZSA9IFwiL2FwaS9hZG1pbi9nYXN0b3Mvcm91dGVcIjtcbmZ1bmN0aW9uIHBhdGNoRmV0Y2goKSB7XG4gICAgcmV0dXJuIF9wYXRjaEZldGNoKHtcbiAgICAgICAgc2VydmVySG9va3MsXG4gICAgICAgIHN0YXRpY0dlbmVyYXRpb25Bc3luY1N0b3JhZ2VcbiAgICB9KTtcbn1cbmV4cG9ydCB7IHJvdXRlTW9kdWxlLCByZXF1ZXN0QXN5bmNTdG9yYWdlLCBzdGF0aWNHZW5lcmF0aW9uQXN5bmNTdG9yYWdlLCBzZXJ2ZXJIb29rcywgb3JpZ2luYWxQYXRobmFtZSwgcGF0Y2hGZXRjaCwgIH07XG5cbi8vIyBzb3VyY2VNYXBwaW5nVVJMPWFwcC1yb3V0ZS5qcy5tYXAiXSwibmFtZXMiOltdLCJzb3VyY2VSb290IjoiIn0=\n//# sourceURL=webpack-internal:///(rsc)/./node_modules/next/dist/build/webpack/loaders/next-app-loader.js?name=app%2Fapi%2Fadmin%2Fgastos%2Froute&page=%2Fapi%2Fadmin%2Fgastos%2Froute&appPaths=&pagePath=private-next-app-dir%2Fapi%2Fadmin%2Fgastos%2Froute.ts&appDir=%2FUsers%2Ffernandotrejo%2FDeveloper%2Fcursos-brooklyn%2Fapp&pageExtensions=tsx&pageExtensions=ts&pageExtensions=jsx&pageExtensions=js&rootDir=%2FUsers%2Ffernandotrejo%2FDeveloper%2Fcursos-brooklyn&isDev=true&tsconfigPath=tsconfig.json&basePath=&assetPrefix=&nextConfigOutput=&preferredRegion=&middlewareConfig=e30%3D!\n");

/***/ }),

/***/ "(rsc)/./app/api/admin/gastos/route.ts":
/*!***************************************!*\
  !*** ./app/api/admin/gastos/route.ts ***!
  \***************************************/
/***/ ((__unused_webpack_module, __webpack_exports__, __webpack_require__) => {

eval("__webpack_require__.r(__webpack_exports__);\n/* harmony export */ __webpack_require__.d(__webpack_exports__, {\n/* harmony export */   GET: () => (/* binding */ GET),\n/* harmony export */   POST: () => (/* binding */ POST)\n/* harmony export */ });\n/* harmony import */ var next_server__WEBPACK_IMPORTED_MODULE_0__ = __webpack_require__(/*! next/server */ \"(rsc)/./node_modules/next/dist/api/server.js\");\n/* harmony import */ var _lib_db__WEBPACK_IMPORTED_MODULE_1__ = __webpack_require__(/*! @/lib/db */ \"(rsc)/./lib/db.ts\");\n/* harmony import */ var _lib_auth__WEBPACK_IMPORTED_MODULE_2__ = __webpack_require__(/*! @/lib/auth */ \"(rsc)/./lib/auth.ts\");\n\n\n\nasync function GET(request) {\n    const usuario = await (0,_lib_auth__WEBPACK_IMPORTED_MODULE_2__.getUsuarioFromRequest)(request);\n    if (!usuario || usuario.rol !== \"admin\") {\n        return next_server__WEBPACK_IMPORTED_MODULE_0__.NextResponse.json({\n            error: \"No autorizado\"\n        }, {\n            status: 403\n        });\n    }\n    try {\n        const { searchParams } = new URL(request.url);\n        const tipo = searchParams.get(\"tipo\");\n        const mes = searchParams.get(\"mes\");\n        let query = `\n      SELECT g.*, u.nombre as registrado_por_nombre\n      FROM gastos g\n      LEFT JOIN usuarios u ON g.registrado_por = u.id\n      WHERE 1=1\n    `;\n        const params = [];\n        let paramIndex = 1;\n        if (tipo) {\n            query += ` AND g.tipo = $${paramIndex}`;\n            params.push(tipo);\n            paramIndex++;\n        }\n        if (mes) {\n            query += ` AND EXTRACT(MONTH FROM g.fecha) = $${paramIndex}`;\n            params.push(parseInt(mes));\n            paramIndex++;\n        }\n        query += ` ORDER BY g.fecha DESC, g.id DESC`;\n        const result = await _lib_db__WEBPACK_IMPORTED_MODULE_1__[\"default\"].query(query, params);\n        return next_server__WEBPACK_IMPORTED_MODULE_0__.NextResponse.json(result.rows);\n    } catch (error) {\n        console.error(\"Error al obtener gastos:\", error);\n        return next_server__WEBPACK_IMPORTED_MODULE_0__.NextResponse.json({\n            error: \"Error al obtener gastos\"\n        }, {\n            status: 500\n        });\n    }\n}\nasync function POST(request) {\n    const usuario = await (0,_lib_auth__WEBPACK_IMPORTED_MODULE_2__.getUsuarioFromRequest)(request);\n    if (!usuario || usuario.rol !== \"admin\") {\n        return next_server__WEBPACK_IMPORTED_MODULE_0__.NextResponse.json({\n            error: \"No autorizado\"\n        }, {\n            status: 403\n        });\n    }\n    try {\n        const body = await request.json();\n        const { tipo, descripcion, monto, fecha } = body;\n        if (!tipo || !monto) {\n            return next_server__WEBPACK_IMPORTED_MODULE_0__.NextResponse.json({\n                error: \"tipo y monto son requeridos\"\n            }, {\n                status: 400\n            });\n        }\n        const result = await _lib_db__WEBPACK_IMPORTED_MODULE_1__[\"default\"].query(`INSERT INTO gastos (tipo, descripcion, monto, fecha, registrado_por)\n       VALUES ($1, $2, $3, $4, $5)\n       RETURNING *`, [\n            tipo,\n            descripcion || \"\",\n            monto,\n            fecha || new Date().toISOString(),\n            usuario.id\n        ]);\n        return next_server__WEBPACK_IMPORTED_MODULE_0__.NextResponse.json(result.rows[0], {\n            status: 201\n        });\n    } catch (error) {\n        console.error(\"Error al crear gasto:\", error);\n        return next_server__WEBPACK_IMPORTED_MODULE_0__.NextResponse.json({\n            error: \"Error al crear gasto\"\n        }, {\n            status: 500\n        });\n    }\n}\n//# sourceURL=[module]\n//# sourceMappingURL=data:application/json;charset=utf-8;base64,eyJ2ZXJzaW9uIjozLCJmaWxlIjoiKHJzYykvLi9hcHAvYXBpL2FkbWluL2dhc3Rvcy9yb3V0ZS50cyIsIm1hcHBpbmdzIjoiOzs7Ozs7OztBQUEyQztBQUNmO0FBQ3VCO0FBRTVDLGVBQWVHLElBQUlDLE9BQWdCO0lBQ3hDLE1BQU1DLFVBQVUsTUFBTUgsZ0VBQXFCQSxDQUFDRTtJQUU1QyxJQUFJLENBQUNDLFdBQVdBLFFBQVFDLEdBQUcsS0FBSyxTQUFTO1FBQ3ZDLE9BQU9OLHFEQUFZQSxDQUFDTyxJQUFJLENBQUM7WUFBRUMsT0FBTztRQUFnQixHQUFHO1lBQUVDLFFBQVE7UUFBSTtJQUNyRTtJQUVBLElBQUk7UUFDRixNQUFNLEVBQUVDLFlBQVksRUFBRSxHQUFHLElBQUlDLElBQUlQLFFBQVFRLEdBQUc7UUFDNUMsTUFBTUMsT0FBT0gsYUFBYUksR0FBRyxDQUFDO1FBQzlCLE1BQU1DLE1BQU1MLGFBQWFJLEdBQUcsQ0FBQztRQUU3QixJQUFJRSxRQUFRLENBQUM7Ozs7O0lBS2IsQ0FBQztRQUNELE1BQU1DLFNBQThCLEVBQUU7UUFDdEMsSUFBSUMsYUFBYTtRQUVqQixJQUFJTCxNQUFNO1lBQ1JHLFNBQVMsQ0FBQyxlQUFlLEVBQUVFLFdBQVcsQ0FBQztZQUN2Q0QsT0FBT0UsSUFBSSxDQUFDTjtZQUNaSztRQUNGO1FBRUEsSUFBSUgsS0FBSztZQUNQQyxTQUFTLENBQUMsb0NBQW9DLEVBQUVFLFdBQVcsQ0FBQztZQUM1REQsT0FBT0UsSUFBSSxDQUFDQyxTQUFTTDtZQUNyQkc7UUFDRjtRQUVBRixTQUFTLENBQUMsaUNBQWlDLENBQUM7UUFFNUMsTUFBTUssU0FBUyxNQUFNcEIsK0NBQUlBLENBQUNlLEtBQUssQ0FBQ0EsT0FBT0M7UUFDdkMsT0FBT2pCLHFEQUFZQSxDQUFDTyxJQUFJLENBQUNjLE9BQU9DLElBQUk7SUFDdEMsRUFBRSxPQUFPZCxPQUFPO1FBQ2RlLFFBQVFmLEtBQUssQ0FBQyw0QkFBNEJBO1FBQzFDLE9BQU9SLHFEQUFZQSxDQUFDTyxJQUFJLENBQUM7WUFBRUMsT0FBTztRQUEwQixHQUFHO1lBQUVDLFFBQVE7UUFBSTtJQUMvRTtBQUNGO0FBRU8sZUFBZWUsS0FBS3BCLE9BQWdCO0lBQ3pDLE1BQU1DLFVBQVUsTUFBTUgsZ0VBQXFCQSxDQUFDRTtJQUU1QyxJQUFJLENBQUNDLFdBQVdBLFFBQVFDLEdBQUcsS0FBSyxTQUFTO1FBQ3ZDLE9BQU9OLHFEQUFZQSxDQUFDTyxJQUFJLENBQUM7WUFBRUMsT0FBTztRQUFnQixHQUFHO1lBQUVDLFFBQVE7UUFBSTtJQUNyRTtJQUVBLElBQUk7UUFDRixNQUFNZ0IsT0FBTyxNQUFNckIsUUFBUUcsSUFBSTtRQUMvQixNQUFNLEVBQUVNLElBQUksRUFBRWEsV0FBVyxFQUFFQyxLQUFLLEVBQUVDLEtBQUssRUFBRSxHQUFHSDtRQUU1QyxJQUFJLENBQUNaLFFBQVEsQ0FBQ2MsT0FBTztZQUNuQixPQUFPM0IscURBQVlBLENBQUNPLElBQUksQ0FBQztnQkFBRUMsT0FBTztZQUE4QixHQUFHO2dCQUFFQyxRQUFRO1lBQUk7UUFDbkY7UUFFQSxNQUFNWSxTQUFTLE1BQU1wQiwrQ0FBSUEsQ0FBQ2UsS0FBSyxDQUM3QixDQUFDOztrQkFFVyxDQUFDLEVBQ2I7WUFBQ0g7WUFBTWEsZUFBZTtZQUFJQztZQUFPQyxTQUFTLElBQUlDLE9BQU9DLFdBQVc7WUFBSXpCLFFBQVEwQixFQUFFO1NBQUM7UUFHakYsT0FBTy9CLHFEQUFZQSxDQUFDTyxJQUFJLENBQUNjLE9BQU9DLElBQUksQ0FBQyxFQUFFLEVBQUU7WUFBRWIsUUFBUTtRQUFJO0lBQ3pELEVBQUUsT0FBT0QsT0FBTztRQUNkZSxRQUFRZixLQUFLLENBQUMseUJBQXlCQTtRQUN2QyxPQUFPUixxREFBWUEsQ0FBQ08sSUFBSSxDQUFDO1lBQUVDLE9BQU87UUFBdUIsR0FBRztZQUFFQyxRQUFRO1FBQUk7SUFDNUU7QUFDRiIsInNvdXJjZXMiOlsid2VicGFjazovL2N1cnNvcy1icm9va2x5bi8uL2FwcC9hcGkvYWRtaW4vZ2FzdG9zL3JvdXRlLnRzPzMzYmMiXSwic291cmNlc0NvbnRlbnQiOlsiaW1wb3J0IHsgTmV4dFJlc3BvbnNlIH0gZnJvbSAnbmV4dC9zZXJ2ZXInO1xuaW1wb3J0IHBvb2wgZnJvbSAnQC9saWIvZGInO1xuaW1wb3J0IHsgZ2V0VXN1YXJpb0Zyb21SZXF1ZXN0IH0gZnJvbSAnQC9saWIvYXV0aCc7XG5cbmV4cG9ydCBhc3luYyBmdW5jdGlvbiBHRVQocmVxdWVzdDogUmVxdWVzdCkge1xuICBjb25zdCB1c3VhcmlvID0gYXdhaXQgZ2V0VXN1YXJpb0Zyb21SZXF1ZXN0KHJlcXVlc3QpO1xuXG4gIGlmICghdXN1YXJpbyB8fCB1c3VhcmlvLnJvbCAhPT0gJ2FkbWluJykge1xuICAgIHJldHVybiBOZXh0UmVzcG9uc2UuanNvbih7IGVycm9yOiAnTm8gYXV0b3JpemFkbycgfSwgeyBzdGF0dXM6IDQwMyB9KTtcbiAgfVxuXG4gIHRyeSB7XG4gICAgY29uc3QgeyBzZWFyY2hQYXJhbXMgfSA9IG5ldyBVUkwocmVxdWVzdC51cmwpO1xuICAgIGNvbnN0IHRpcG8gPSBzZWFyY2hQYXJhbXMuZ2V0KCd0aXBvJyk7XG4gICAgY29uc3QgbWVzID0gc2VhcmNoUGFyYW1zLmdldCgnbWVzJyk7XG5cbiAgICBsZXQgcXVlcnkgPSBgXG4gICAgICBTRUxFQ1QgZy4qLCB1Lm5vbWJyZSBhcyByZWdpc3RyYWRvX3Bvcl9ub21icmVcbiAgICAgIEZST00gZ2FzdG9zIGdcbiAgICAgIExFRlQgSk9JTiB1c3VhcmlvcyB1IE9OIGcucmVnaXN0cmFkb19wb3IgPSB1LmlkXG4gICAgICBXSEVSRSAxPTFcbiAgICBgO1xuICAgIGNvbnN0IHBhcmFtczogKHN0cmluZyB8IG51bWJlcilbXSA9IFtdO1xuICAgIGxldCBwYXJhbUluZGV4ID0gMTtcblxuICAgIGlmICh0aXBvKSB7XG4gICAgICBxdWVyeSArPSBgIEFORCBnLnRpcG8gPSAkJHtwYXJhbUluZGV4fWA7XG4gICAgICBwYXJhbXMucHVzaCh0aXBvKTtcbiAgICAgIHBhcmFtSW5kZXgrKztcbiAgICB9XG5cbiAgICBpZiAobWVzKSB7XG4gICAgICBxdWVyeSArPSBgIEFORCBFWFRSQUNUKE1PTlRIIEZST00gZy5mZWNoYSkgPSAkJHtwYXJhbUluZGV4fWA7XG4gICAgICBwYXJhbXMucHVzaChwYXJzZUludChtZXMpKTtcbiAgICAgIHBhcmFtSW5kZXgrKztcbiAgICB9XG5cbiAgICBxdWVyeSArPSBgIE9SREVSIEJZIGcuZmVjaGEgREVTQywgZy5pZCBERVNDYDtcblxuICAgIGNvbnN0IHJlc3VsdCA9IGF3YWl0IHBvb2wucXVlcnkocXVlcnksIHBhcmFtcyk7XG4gICAgcmV0dXJuIE5leHRSZXNwb25zZS5qc29uKHJlc3VsdC5yb3dzKTtcbiAgfSBjYXRjaCAoZXJyb3IpIHtcbiAgICBjb25zb2xlLmVycm9yKCdFcnJvciBhbCBvYnRlbmVyIGdhc3RvczonLCBlcnJvcik7XG4gICAgcmV0dXJuIE5leHRSZXNwb25zZS5qc29uKHsgZXJyb3I6ICdFcnJvciBhbCBvYnRlbmVyIGdhc3RvcycgfSwgeyBzdGF0dXM6IDUwMCB9KTtcbiAgfVxufVxuXG5leHBvcnQgYXN5bmMgZnVuY3Rpb24gUE9TVChyZXF1ZXN0OiBSZXF1ZXN0KSB7XG4gIGNvbnN0IHVzdWFyaW8gPSBhd2FpdCBnZXRVc3VhcmlvRnJvbVJlcXVlc3QocmVxdWVzdCk7XG5cbiAgaWYgKCF1c3VhcmlvIHx8IHVzdWFyaW8ucm9sICE9PSAnYWRtaW4nKSB7XG4gICAgcmV0dXJuIE5leHRSZXNwb25zZS5qc29uKHsgZXJyb3I6ICdObyBhdXRvcml6YWRvJyB9LCB7IHN0YXR1czogNDAzIH0pO1xuICB9XG5cbiAgdHJ5IHtcbiAgICBjb25zdCBib2R5ID0gYXdhaXQgcmVxdWVzdC5qc29uKCk7XG4gICAgY29uc3QgeyB0aXBvLCBkZXNjcmlwY2lvbiwgbW9udG8sIGZlY2hhIH0gPSBib2R5O1xuXG4gICAgaWYgKCF0aXBvIHx8ICFtb250bykge1xuICAgICAgcmV0dXJuIE5leHRSZXNwb25zZS5qc29uKHsgZXJyb3I6ICd0aXBvIHkgbW9udG8gc29uIHJlcXVlcmlkb3MnIH0sIHsgc3RhdHVzOiA0MDAgfSk7XG4gICAgfVxuXG4gICAgY29uc3QgcmVzdWx0ID0gYXdhaXQgcG9vbC5xdWVyeShcbiAgICAgIGBJTlNFUlQgSU5UTyBnYXN0b3MgKHRpcG8sIGRlc2NyaXBjaW9uLCBtb250bywgZmVjaGEsIHJlZ2lzdHJhZG9fcG9yKVxuICAgICAgIFZBTFVFUyAoJDEsICQyLCAkMywgJDQsICQ1KVxuICAgICAgIFJFVFVSTklORyAqYCxcbiAgICAgIFt0aXBvLCBkZXNjcmlwY2lvbiB8fCAnJywgbW9udG8sIGZlY2hhIHx8IG5ldyBEYXRlKCkudG9JU09TdHJpbmcoKSwgdXN1YXJpby5pZF1cbiAgICApO1xuXG4gICAgcmV0dXJuIE5leHRSZXNwb25zZS5qc29uKHJlc3VsdC5yb3dzWzBdLCB7IHN0YXR1czogMjAxIH0pO1xuICB9IGNhdGNoIChlcnJvcikge1xuICAgIGNvbnNvbGUuZXJyb3IoJ0Vycm9yIGFsIGNyZWFyIGdhc3RvOicsIGVycm9yKTtcbiAgICByZXR1cm4gTmV4dFJlc3BvbnNlLmpzb24oeyBlcnJvcjogJ0Vycm9yIGFsIGNyZWFyIGdhc3RvJyB9LCB7IHN0YXR1czogNTAwIH0pO1xuICB9XG59XG4iXSwibmFtZXMiOlsiTmV4dFJlc3BvbnNlIiwicG9vbCIsImdldFVzdWFyaW9Gcm9tUmVxdWVzdCIsIkdFVCIsInJlcXVlc3QiLCJ1c3VhcmlvIiwicm9sIiwianNvbiIsImVycm9yIiwic3RhdHVzIiwic2VhcmNoUGFyYW1zIiwiVVJMIiwidXJsIiwidGlwbyIsImdldCIsIm1lcyIsInF1ZXJ5IiwicGFyYW1zIiwicGFyYW1JbmRleCIsInB1c2giLCJwYXJzZUludCIsInJlc3VsdCIsInJvd3MiLCJjb25zb2xlIiwiUE9TVCIsImJvZHkiLCJkZXNjcmlwY2lvbiIsIm1vbnRvIiwiZmVjaGEiLCJEYXRlIiwidG9JU09TdHJpbmciLCJpZCJdLCJzb3VyY2VSb290IjoiIn0=\n//# sourceURL=webpack-internal:///(rsc)/./app/api/admin/gastos/route.ts\n");

/***/ }),

/***/ "(rsc)/./lib/auth.ts":
/*!*********************!*\
  !*** ./lib/auth.ts ***!
  \*********************/
/***/ ((__unused_webpack_module, __webpack_exports__, __webpack_require__) => {

eval("__webpack_require__.r(__webpack_exports__);\n/* harmony export */ __webpack_require__.d(__webpack_exports__, {\n/* harmony export */   clearTokenCookie: () => (/* binding */ clearTokenCookie),\n/* harmony export */   createToken: () => (/* binding */ createToken),\n/* harmony export */   getUsuarioFromRequest: () => (/* binding */ getUsuarioFromRequest),\n/* harmony export */   setTokenCookie: () => (/* binding */ setTokenCookie),\n/* harmony export */   verifyToken: () => (/* binding */ verifyToken)\n/* harmony export */ });\n/* harmony import */ var jsonwebtoken__WEBPACK_IMPORTED_MODULE_0__ = __webpack_require__(/*! jsonwebtoken */ \"(rsc)/./node_modules/jsonwebtoken/index.js\");\n/* harmony import */ var jsonwebtoken__WEBPACK_IMPORTED_MODULE_0___default = /*#__PURE__*/__webpack_require__.n(jsonwebtoken__WEBPACK_IMPORTED_MODULE_0__);\n/* harmony import */ var next_headers__WEBPACK_IMPORTED_MODULE_1__ = __webpack_require__(/*! next/headers */ \"(rsc)/./node_modules/next/dist/api/headers.js\");\n\n\nconst JWT_SECRET = process.env.JWT_SECRET || \"cursos_brooklyn_jwt_secret_2025\";\nfunction createToken(usuario) {\n    return jsonwebtoken__WEBPACK_IMPORTED_MODULE_0___default().sign(usuario, JWT_SECRET, {\n        expiresIn: \"24h\"\n    });\n}\nfunction verifyToken(token) {\n    try {\n        return jsonwebtoken__WEBPACK_IMPORTED_MODULE_0___default().verify(token, JWT_SECRET);\n    } catch  {\n        return null;\n    }\n}\nasync function getUsuarioFromRequest(request) {\n    // Intentar obtener token del header Authorization\n    const authHeader = request.headers.get(\"authorization\");\n    if (authHeader?.startsWith(\"Bearer \")) {\n        const token = authHeader.substring(7);\n        return verifyToken(token);\n    }\n    // Intentar obtener de las cookies\n    const cookieStore = await (0,next_headers__WEBPACK_IMPORTED_MODULE_1__.cookies)();\n    const token = cookieStore.get(\"token\")?.value;\n    if (token) {\n        return verifyToken(token);\n    }\n    return null;\n}\nfunction setTokenCookie(token) {\n    const isProduction = process.env.VERCEL === \"1\";\n    return `token=${token}; HttpOnly; ${isProduction ? \"Secure;\" : \"\"} SameSite=Lax; Max-Age=86400; Path=/`;\n}\nfunction clearTokenCookie() {\n    return \"token=; HttpOnly; SameSite=Lax; Max-Age=0; Path=/\";\n}\n//# sourceURL=[module]\n//# sourceMappingURL=data:application/json;charset=utf-8;base64,eyJ2ZXJzaW9uIjozLCJmaWxlIjoiKHJzYykvLi9saWIvYXV0aC50cyIsIm1hcHBpbmdzIjoiOzs7Ozs7Ozs7OztBQUErQjtBQUNRO0FBRXZDLE1BQU1FLGFBQWFDLFFBQVFDLEdBQUcsQ0FBQ0YsVUFBVSxJQUFJO0FBVXRDLFNBQVNHLFlBQVlDLE9BQWdCO0lBQzFDLE9BQU9OLHdEQUFRLENBQUNNLFNBQVNKLFlBQVk7UUFBRU0sV0FBVztJQUFNO0FBQzFEO0FBRU8sU0FBU0MsWUFBWUMsS0FBYTtJQUN2QyxJQUFJO1FBQ0YsT0FBT1YsMERBQVUsQ0FBQ1UsT0FBT1I7SUFDM0IsRUFBRSxPQUFNO1FBQ04sT0FBTztJQUNUO0FBQ0Y7QUFFTyxlQUFlVSxzQkFBc0JDLE9BQWdCO0lBQzFELGtEQUFrRDtJQUNsRCxNQUFNQyxhQUFhRCxRQUFRRSxPQUFPLENBQUNDLEdBQUcsQ0FBQztJQUN2QyxJQUFJRixZQUFZRyxXQUFXLFlBQVk7UUFDckMsTUFBTVAsUUFBUUksV0FBV0ksU0FBUyxDQUFDO1FBQ25DLE9BQU9ULFlBQVlDO0lBQ3JCO0lBRUEsa0NBQWtDO0lBQ2xDLE1BQU1TLGNBQWMsTUFBTWxCLHFEQUFPQTtJQUNqQyxNQUFNUyxRQUFRUyxZQUFZSCxHQUFHLENBQUMsVUFBVUk7SUFDeEMsSUFBSVYsT0FBTztRQUNULE9BQU9ELFlBQVlDO0lBQ3JCO0lBRUEsT0FBTztBQUNUO0FBRU8sU0FBU1csZUFBZVgsS0FBYTtJQUMxQyxNQUFNWSxlQUFlbkIsUUFBUUMsR0FBRyxDQUFDbUIsTUFBTSxLQUFLO0lBQzVDLE9BQU8sQ0FBQyxNQUFNLEVBQUViLE1BQU0sWUFBWSxFQUFFWSxlQUFlLFlBQVksR0FBRyxvQ0FBb0MsQ0FBQztBQUN6RztBQUVPLFNBQVNFO0lBQ2QsT0FBTztBQUNUIiwic291cmNlcyI6WyJ3ZWJwYWNrOi8vY3Vyc29zLWJyb29rbHluLy4vbGliL2F1dGgudHM/YmY3ZSJdLCJzb3VyY2VzQ29udGVudCI6WyJpbXBvcnQgand0IGZyb20gJ2pzb253ZWJ0b2tlbic7XG5pbXBvcnQgeyBjb29raWVzIH0gZnJvbSAnbmV4dC9oZWFkZXJzJztcblxuY29uc3QgSldUX1NFQ1JFVCA9IHByb2Nlc3MuZW52LkpXVF9TRUNSRVQgfHwgJ2N1cnNvc19icm9va2x5bl9qd3Rfc2VjcmV0XzIwMjUnO1xuXG5leHBvcnQgaW50ZXJmYWNlIFVzdWFyaW8ge1xuICBpZDogbnVtYmVyO1xuICBub21icmU6IHN0cmluZztcbiAgY2VsdWxhcjogc3RyaW5nO1xuICBlbWFpbDogc3RyaW5nIHwgbnVsbDtcbiAgcm9sOiBzdHJpbmc7XG59XG5cbmV4cG9ydCBmdW5jdGlvbiBjcmVhdGVUb2tlbih1c3VhcmlvOiBVc3VhcmlvKTogc3RyaW5nIHtcbiAgcmV0dXJuIGp3dC5zaWduKHVzdWFyaW8sIEpXVF9TRUNSRVQsIHsgZXhwaXJlc0luOiAnMjRoJyB9KTtcbn1cblxuZXhwb3J0IGZ1bmN0aW9uIHZlcmlmeVRva2VuKHRva2VuOiBzdHJpbmcpOiBVc3VhcmlvIHwgbnVsbCB7XG4gIHRyeSB7XG4gICAgcmV0dXJuIGp3dC52ZXJpZnkodG9rZW4sIEpXVF9TRUNSRVQpIGFzIFVzdWFyaW87XG4gIH0gY2F0Y2gge1xuICAgIHJldHVybiBudWxsO1xuICB9XG59XG5cbmV4cG9ydCBhc3luYyBmdW5jdGlvbiBnZXRVc3VhcmlvRnJvbVJlcXVlc3QocmVxdWVzdDogUmVxdWVzdCk6IFByb21pc2U8VXN1YXJpbyB8IG51bGw+IHtcbiAgLy8gSW50ZW50YXIgb2J0ZW5lciB0b2tlbiBkZWwgaGVhZGVyIEF1dGhvcml6YXRpb25cbiAgY29uc3QgYXV0aEhlYWRlciA9IHJlcXVlc3QuaGVhZGVycy5nZXQoJ2F1dGhvcml6YXRpb24nKTtcbiAgaWYgKGF1dGhIZWFkZXI/LnN0YXJ0c1dpdGgoJ0JlYXJlciAnKSkge1xuICAgIGNvbnN0IHRva2VuID0gYXV0aEhlYWRlci5zdWJzdHJpbmcoNyk7XG4gICAgcmV0dXJuIHZlcmlmeVRva2VuKHRva2VuKTtcbiAgfVxuXG4gIC8vIEludGVudGFyIG9idGVuZXIgZGUgbGFzIGNvb2tpZXNcbiAgY29uc3QgY29va2llU3RvcmUgPSBhd2FpdCBjb29raWVzKCk7XG4gIGNvbnN0IHRva2VuID0gY29va2llU3RvcmUuZ2V0KCd0b2tlbicpPy52YWx1ZTtcbiAgaWYgKHRva2VuKSB7XG4gICAgcmV0dXJuIHZlcmlmeVRva2VuKHRva2VuKTtcbiAgfVxuXG4gIHJldHVybiBudWxsO1xufVxuXG5leHBvcnQgZnVuY3Rpb24gc2V0VG9rZW5Db29raWUodG9rZW46IHN0cmluZyk6IHN0cmluZyB7XG4gIGNvbnN0IGlzUHJvZHVjdGlvbiA9IHByb2Nlc3MuZW52LlZFUkNFTCA9PT0gJzEnO1xuICByZXR1cm4gYHRva2VuPSR7dG9rZW59OyBIdHRwT25seTsgJHtpc1Byb2R1Y3Rpb24gPyAnU2VjdXJlOycgOiAnJ30gU2FtZVNpdGU9TGF4OyBNYXgtQWdlPTg2NDAwOyBQYXRoPS9gO1xufVxuXG5leHBvcnQgZnVuY3Rpb24gY2xlYXJUb2tlbkNvb2tpZSgpOiBzdHJpbmcge1xuICByZXR1cm4gJ3Rva2VuPTsgSHR0cE9ubHk7IFNhbWVTaXRlPUxheDsgTWF4LUFnZT0wOyBQYXRoPS8nO1xufVxuIl0sIm5hbWVzIjpbImp3dCIsImNvb2tpZXMiLCJKV1RfU0VDUkVUIiwicHJvY2VzcyIsImVudiIsImNyZWF0ZVRva2VuIiwidXN1YXJpbyIsInNpZ24iLCJleHBpcmVzSW4iLCJ2ZXJpZnlUb2tlbiIsInRva2VuIiwidmVyaWZ5IiwiZ2V0VXN1YXJpb0Zyb21SZXF1ZXN0IiwicmVxdWVzdCIsImF1dGhIZWFkZXIiLCJoZWFkZXJzIiwiZ2V0Iiwic3RhcnRzV2l0aCIsInN1YnN0cmluZyIsImNvb2tpZVN0b3JlIiwidmFsdWUiLCJzZXRUb2tlbkNvb2tpZSIsImlzUHJvZHVjdGlvbiIsIlZFUkNFTCIsImNsZWFyVG9rZW5Db29raWUiXSwic291cmNlUm9vdCI6IiJ9\n//# sourceURL=webpack-internal:///(rsc)/./lib/auth.ts\n");

/***/ }),

/***/ "(rsc)/./lib/db.ts":
/*!*******************!*\
  !*** ./lib/db.ts ***!
  \*******************/
/***/ ((__unused_webpack_module, __webpack_exports__, __webpack_require__) => {

eval("__webpack_require__.r(__webpack_exports__);\n/* harmony export */ __webpack_require__.d(__webpack_exports__, {\n/* harmony export */   \"default\": () => (__WEBPACK_DEFAULT_EXPORT__)\n/* harmony export */ });\n/* harmony import */ var pg__WEBPACK_IMPORTED_MODULE_0__ = __webpack_require__(/*! pg */ \"pg\");\n/* harmony import */ var pg__WEBPACK_IMPORTED_MODULE_0___default = /*#__PURE__*/__webpack_require__.n(pg__WEBPACK_IMPORTED_MODULE_0__);\n\nconst pool = new pg__WEBPACK_IMPORTED_MODULE_0__.Pool({\n    connectionString: process.env.DATABASE_URL,\n    ssl: {\n        rejectUnauthorized: false\n    }\n});\n/* harmony default export */ const __WEBPACK_DEFAULT_EXPORT__ = (pool);\n//# sourceURL=[module]\n//# sourceMappingURL=data:application/json;charset=utf-8;base64,eyJ2ZXJzaW9uIjozLCJmaWxlIjoiKHJzYykvLi9saWIvZGIudHMiLCJtYXBwaW5ncyI6Ijs7Ozs7O0FBQTBCO0FBRTFCLE1BQU1DLE9BQU8sSUFBSUQsb0NBQUlBLENBQUM7SUFDcEJFLGtCQUFrQkMsUUFBUUMsR0FBRyxDQUFDQyxZQUFZO0lBQzFDQyxLQUFLO1FBQUVDLG9CQUFvQjtJQUFNO0FBQ25DO0FBRUEsaUVBQWVOLElBQUlBLEVBQUMiLCJzb3VyY2VzIjpbIndlYnBhY2s6Ly9jdXJzb3MtYnJvb2tseW4vLi9saWIvZGIudHM/MWRmMCJdLCJzb3VyY2VzQ29udGVudCI6WyJpbXBvcnQgeyBQb29sIH0gZnJvbSAncGcnO1xuXG5jb25zdCBwb29sID0gbmV3IFBvb2woe1xuICBjb25uZWN0aW9uU3RyaW5nOiBwcm9jZXNzLmVudi5EQVRBQkFTRV9VUkwsXG4gIHNzbDogeyByZWplY3RVbmF1dGhvcml6ZWQ6IGZhbHNlIH1cbn0pO1xuXG5leHBvcnQgZGVmYXVsdCBwb29sO1xuIl0sIm5hbWVzIjpbIlBvb2wiLCJwb29sIiwiY29ubmVjdGlvblN0cmluZyIsInByb2Nlc3MiLCJlbnYiLCJEQVRBQkFTRV9VUkwiLCJzc2wiLCJyZWplY3RVbmF1dGhvcml6ZWQiXSwic291cmNlUm9vdCI6IiJ9\n//# sourceURL=webpack-internal:///(rsc)/./lib/db.ts\n");

/***/ })

};
;

// load runtime
var __webpack_require__ = require("../../../../webpack-runtime.js");
__webpack_require__.C(exports);
var __webpack_exec__ = (moduleId) => (__webpack_require__(__webpack_require__.s = moduleId))
var __webpack_exports__ = __webpack_require__.X(0, ["vendor-chunks/next","vendor-chunks/semver","vendor-chunks/jsonwebtoken","vendor-chunks/lodash.includes","vendor-chunks/jws","vendor-chunks/lodash.once","vendor-chunks/jwa","vendor-chunks/lodash.isinteger","vendor-chunks/ecdsa-sig-formatter","vendor-chunks/lodash.isplainobject","vendor-chunks/lodash.isstring","vendor-chunks/lodash.isnumber","vendor-chunks/lodash.isboolean","vendor-chunks/safe-buffer","vendor-chunks/buffer-equal-constant-time"], () => (__webpack_exec__("(rsc)/./node_modules/next/dist/build/webpack/loaders/next-app-loader.js?name=app%2Fapi%2Fadmin%2Fgastos%2Froute&page=%2Fapi%2Fadmin%2Fgastos%2Froute&appPaths=&pagePath=private-next-app-dir%2Fapi%2Fadmin%2Fgastos%2Froute.ts&appDir=%2FUsers%2Ffernandotrejo%2FDeveloper%2Fcursos-brooklyn%2Fapp&pageExtensions=tsx&pageExtensions=ts&pageExtensions=jsx&pageExtensions=js&rootDir=%2FUsers%2Ffernandotrejo%2FDeveloper%2Fcursos-brooklyn&isDev=true&tsconfigPath=tsconfig.json&basePath=&assetPrefix=&nextConfigOutput=&preferredRegion=&middlewareConfig=e30%3D!")));
module.exports = __webpack_exports__;

})();