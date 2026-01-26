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
exports.id = "app/api/login/route";
exports.ids = ["app/api/login/route"];
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

/***/ "(rsc)/./node_modules/next/dist/build/webpack/loaders/next-app-loader.js?name=app%2Fapi%2Flogin%2Froute&page=%2Fapi%2Flogin%2Froute&appPaths=&pagePath=private-next-app-dir%2Fapi%2Flogin%2Froute.ts&appDir=%2FUsers%2Ffernandotrejo%2FDeveloper%2Fcursos-brooklyn%2Fapp&pageExtensions=tsx&pageExtensions=ts&pageExtensions=jsx&pageExtensions=js&rootDir=%2FUsers%2Ffernandotrejo%2FDeveloper%2Fcursos-brooklyn&isDev=true&tsconfigPath=tsconfig.json&basePath=&assetPrefix=&nextConfigOutput=&preferredRegion=&middlewareConfig=e30%3D!":
/*!*******************************************************************************************************************************************************************************************************************************************************************************************************************************************************************************************************************************************************************************************************************************************!*\
  !*** ./node_modules/next/dist/build/webpack/loaders/next-app-loader.js?name=app%2Fapi%2Flogin%2Froute&page=%2Fapi%2Flogin%2Froute&appPaths=&pagePath=private-next-app-dir%2Fapi%2Flogin%2Froute.ts&appDir=%2FUsers%2Ffernandotrejo%2FDeveloper%2Fcursos-brooklyn%2Fapp&pageExtensions=tsx&pageExtensions=ts&pageExtensions=jsx&pageExtensions=js&rootDir=%2FUsers%2Ffernandotrejo%2FDeveloper%2Fcursos-brooklyn&isDev=true&tsconfigPath=tsconfig.json&basePath=&assetPrefix=&nextConfigOutput=&preferredRegion=&middlewareConfig=e30%3D! ***!
  \*******************************************************************************************************************************************************************************************************************************************************************************************************************************************************************************************************************************************************************************************************************************************/
/***/ ((__unused_webpack_module, __webpack_exports__, __webpack_require__) => {

eval("__webpack_require__.r(__webpack_exports__);\n/* harmony export */ __webpack_require__.d(__webpack_exports__, {\n/* harmony export */   originalPathname: () => (/* binding */ originalPathname),\n/* harmony export */   patchFetch: () => (/* binding */ patchFetch),\n/* harmony export */   requestAsyncStorage: () => (/* binding */ requestAsyncStorage),\n/* harmony export */   routeModule: () => (/* binding */ routeModule),\n/* harmony export */   serverHooks: () => (/* binding */ serverHooks),\n/* harmony export */   staticGenerationAsyncStorage: () => (/* binding */ staticGenerationAsyncStorage)\n/* harmony export */ });\n/* harmony import */ var next_dist_server_future_route_modules_app_route_module_compiled__WEBPACK_IMPORTED_MODULE_0__ = __webpack_require__(/*! next/dist/server/future/route-modules/app-route/module.compiled */ \"(rsc)/./node_modules/next/dist/server/future/route-modules/app-route/module.compiled.js\");\n/* harmony import */ var next_dist_server_future_route_modules_app_route_module_compiled__WEBPACK_IMPORTED_MODULE_0___default = /*#__PURE__*/__webpack_require__.n(next_dist_server_future_route_modules_app_route_module_compiled__WEBPACK_IMPORTED_MODULE_0__);\n/* harmony import */ var next_dist_server_future_route_kind__WEBPACK_IMPORTED_MODULE_1__ = __webpack_require__(/*! next/dist/server/future/route-kind */ \"(rsc)/./node_modules/next/dist/server/future/route-kind.js\");\n/* harmony import */ var next_dist_server_lib_patch_fetch__WEBPACK_IMPORTED_MODULE_2__ = __webpack_require__(/*! next/dist/server/lib/patch-fetch */ \"(rsc)/./node_modules/next/dist/server/lib/patch-fetch.js\");\n/* harmony import */ var next_dist_server_lib_patch_fetch__WEBPACK_IMPORTED_MODULE_2___default = /*#__PURE__*/__webpack_require__.n(next_dist_server_lib_patch_fetch__WEBPACK_IMPORTED_MODULE_2__);\n/* harmony import */ var _Users_fernandotrejo_Developer_cursos_brooklyn_app_api_login_route_ts__WEBPACK_IMPORTED_MODULE_3__ = __webpack_require__(/*! ./app/api/login/route.ts */ \"(rsc)/./app/api/login/route.ts\");\n\n\n\n\n// We inject the nextConfigOutput here so that we can use them in the route\n// module.\nconst nextConfigOutput = \"\"\nconst routeModule = new next_dist_server_future_route_modules_app_route_module_compiled__WEBPACK_IMPORTED_MODULE_0__.AppRouteRouteModule({\n    definition: {\n        kind: next_dist_server_future_route_kind__WEBPACK_IMPORTED_MODULE_1__.RouteKind.APP_ROUTE,\n        page: \"/api/login/route\",\n        pathname: \"/api/login\",\n        filename: \"route\",\n        bundlePath: \"app/api/login/route\"\n    },\n    resolvedPagePath: \"/Users/fernandotrejo/Developer/cursos-brooklyn/app/api/login/route.ts\",\n    nextConfigOutput,\n    userland: _Users_fernandotrejo_Developer_cursos_brooklyn_app_api_login_route_ts__WEBPACK_IMPORTED_MODULE_3__\n});\n// Pull out the exports that we need to expose from the module. This should\n// be eliminated when we've moved the other routes to the new format. These\n// are used to hook into the route.\nconst { requestAsyncStorage, staticGenerationAsyncStorage, serverHooks } = routeModule;\nconst originalPathname = \"/api/login/route\";\nfunction patchFetch() {\n    return (0,next_dist_server_lib_patch_fetch__WEBPACK_IMPORTED_MODULE_2__.patchFetch)({\n        serverHooks,\n        staticGenerationAsyncStorage\n    });\n}\n\n\n//# sourceMappingURL=app-route.js.map//# sourceURL=[module]\n//# sourceMappingURL=data:application/json;charset=utf-8;base64,eyJ2ZXJzaW9uIjozLCJmaWxlIjoiKHJzYykvLi9ub2RlX21vZHVsZXMvbmV4dC9kaXN0L2J1aWxkL3dlYnBhY2svbG9hZGVycy9uZXh0LWFwcC1sb2FkZXIuanM/bmFtZT1hcHAlMkZhcGklMkZsb2dpbiUyRnJvdXRlJnBhZ2U9JTJGYXBpJTJGbG9naW4lMkZyb3V0ZSZhcHBQYXRocz0mcGFnZVBhdGg9cHJpdmF0ZS1uZXh0LWFwcC1kaXIlMkZhcGklMkZsb2dpbiUyRnJvdXRlLnRzJmFwcERpcj0lMkZVc2VycyUyRmZlcm5hbmRvdHJlam8lMkZEZXZlbG9wZXIlMkZjdXJzb3MtYnJvb2tseW4lMkZhcHAmcGFnZUV4dGVuc2lvbnM9dHN4JnBhZ2VFeHRlbnNpb25zPXRzJnBhZ2VFeHRlbnNpb25zPWpzeCZwYWdlRXh0ZW5zaW9ucz1qcyZyb290RGlyPSUyRlVzZXJzJTJGZmVybmFuZG90cmVqbyUyRkRldmVsb3BlciUyRmN1cnNvcy1icm9va2x5biZpc0Rldj10cnVlJnRzY29uZmlnUGF0aD10c2NvbmZpZy5qc29uJmJhc2VQYXRoPSZhc3NldFByZWZpeD0mbmV4dENvbmZpZ091dHB1dD0mcHJlZmVycmVkUmVnaW9uPSZtaWRkbGV3YXJlQ29uZmlnPWUzMCUzRCEiLCJtYXBwaW5ncyI6Ijs7Ozs7Ozs7Ozs7Ozs7O0FBQXNHO0FBQ3ZDO0FBQ2M7QUFDcUI7QUFDbEc7QUFDQTtBQUNBO0FBQ0Esd0JBQXdCLGdIQUFtQjtBQUMzQztBQUNBLGNBQWMseUVBQVM7QUFDdkI7QUFDQTtBQUNBO0FBQ0E7QUFDQSxLQUFLO0FBQ0w7QUFDQTtBQUNBLFlBQVk7QUFDWixDQUFDO0FBQ0Q7QUFDQTtBQUNBO0FBQ0EsUUFBUSxpRUFBaUU7QUFDekU7QUFDQTtBQUNBLFdBQVcsNEVBQVc7QUFDdEI7QUFDQTtBQUNBLEtBQUs7QUFDTDtBQUN1SDs7QUFFdkgiLCJzb3VyY2VzIjpbIndlYnBhY2s6Ly9jdXJzb3MtYnJvb2tseW4vPzU4YzYiXSwic291cmNlc0NvbnRlbnQiOlsiaW1wb3J0IHsgQXBwUm91dGVSb3V0ZU1vZHVsZSB9IGZyb20gXCJuZXh0L2Rpc3Qvc2VydmVyL2Z1dHVyZS9yb3V0ZS1tb2R1bGVzL2FwcC1yb3V0ZS9tb2R1bGUuY29tcGlsZWRcIjtcbmltcG9ydCB7IFJvdXRlS2luZCB9IGZyb20gXCJuZXh0L2Rpc3Qvc2VydmVyL2Z1dHVyZS9yb3V0ZS1raW5kXCI7XG5pbXBvcnQgeyBwYXRjaEZldGNoIGFzIF9wYXRjaEZldGNoIH0gZnJvbSBcIm5leHQvZGlzdC9zZXJ2ZXIvbGliL3BhdGNoLWZldGNoXCI7XG5pbXBvcnQgKiBhcyB1c2VybGFuZCBmcm9tIFwiL1VzZXJzL2Zlcm5hbmRvdHJlam8vRGV2ZWxvcGVyL2N1cnNvcy1icm9va2x5bi9hcHAvYXBpL2xvZ2luL3JvdXRlLnRzXCI7XG4vLyBXZSBpbmplY3QgdGhlIG5leHRDb25maWdPdXRwdXQgaGVyZSBzbyB0aGF0IHdlIGNhbiB1c2UgdGhlbSBpbiB0aGUgcm91dGVcbi8vIG1vZHVsZS5cbmNvbnN0IG5leHRDb25maWdPdXRwdXQgPSBcIlwiXG5jb25zdCByb3V0ZU1vZHVsZSA9IG5ldyBBcHBSb3V0ZVJvdXRlTW9kdWxlKHtcbiAgICBkZWZpbml0aW9uOiB7XG4gICAgICAgIGtpbmQ6IFJvdXRlS2luZC5BUFBfUk9VVEUsXG4gICAgICAgIHBhZ2U6IFwiL2FwaS9sb2dpbi9yb3V0ZVwiLFxuICAgICAgICBwYXRobmFtZTogXCIvYXBpL2xvZ2luXCIsXG4gICAgICAgIGZpbGVuYW1lOiBcInJvdXRlXCIsXG4gICAgICAgIGJ1bmRsZVBhdGg6IFwiYXBwL2FwaS9sb2dpbi9yb3V0ZVwiXG4gICAgfSxcbiAgICByZXNvbHZlZFBhZ2VQYXRoOiBcIi9Vc2Vycy9mZXJuYW5kb3RyZWpvL0RldmVsb3Blci9jdXJzb3MtYnJvb2tseW4vYXBwL2FwaS9sb2dpbi9yb3V0ZS50c1wiLFxuICAgIG5leHRDb25maWdPdXRwdXQsXG4gICAgdXNlcmxhbmRcbn0pO1xuLy8gUHVsbCBvdXQgdGhlIGV4cG9ydHMgdGhhdCB3ZSBuZWVkIHRvIGV4cG9zZSBmcm9tIHRoZSBtb2R1bGUuIFRoaXMgc2hvdWxkXG4vLyBiZSBlbGltaW5hdGVkIHdoZW4gd2UndmUgbW92ZWQgdGhlIG90aGVyIHJvdXRlcyB0byB0aGUgbmV3IGZvcm1hdC4gVGhlc2Vcbi8vIGFyZSB1c2VkIHRvIGhvb2sgaW50byB0aGUgcm91dGUuXG5jb25zdCB7IHJlcXVlc3RBc3luY1N0b3JhZ2UsIHN0YXRpY0dlbmVyYXRpb25Bc3luY1N0b3JhZ2UsIHNlcnZlckhvb2tzIH0gPSByb3V0ZU1vZHVsZTtcbmNvbnN0IG9yaWdpbmFsUGF0aG5hbWUgPSBcIi9hcGkvbG9naW4vcm91dGVcIjtcbmZ1bmN0aW9uIHBhdGNoRmV0Y2goKSB7XG4gICAgcmV0dXJuIF9wYXRjaEZldGNoKHtcbiAgICAgICAgc2VydmVySG9va3MsXG4gICAgICAgIHN0YXRpY0dlbmVyYXRpb25Bc3luY1N0b3JhZ2VcbiAgICB9KTtcbn1cbmV4cG9ydCB7IHJvdXRlTW9kdWxlLCByZXF1ZXN0QXN5bmNTdG9yYWdlLCBzdGF0aWNHZW5lcmF0aW9uQXN5bmNTdG9yYWdlLCBzZXJ2ZXJIb29rcywgb3JpZ2luYWxQYXRobmFtZSwgcGF0Y2hGZXRjaCwgIH07XG5cbi8vIyBzb3VyY2VNYXBwaW5nVVJMPWFwcC1yb3V0ZS5qcy5tYXAiXSwibmFtZXMiOltdLCJzb3VyY2VSb290IjoiIn0=\n//# sourceURL=webpack-internal:///(rsc)/./node_modules/next/dist/build/webpack/loaders/next-app-loader.js?name=app%2Fapi%2Flogin%2Froute&page=%2Fapi%2Flogin%2Froute&appPaths=&pagePath=private-next-app-dir%2Fapi%2Flogin%2Froute.ts&appDir=%2FUsers%2Ffernandotrejo%2FDeveloper%2Fcursos-brooklyn%2Fapp&pageExtensions=tsx&pageExtensions=ts&pageExtensions=jsx&pageExtensions=js&rootDir=%2FUsers%2Ffernandotrejo%2FDeveloper%2Fcursos-brooklyn&isDev=true&tsconfigPath=tsconfig.json&basePath=&assetPrefix=&nextConfigOutput=&preferredRegion=&middlewareConfig=e30%3D!\n");

/***/ }),

/***/ "(rsc)/./app/api/login/route.ts":
/*!********************************!*\
  !*** ./app/api/login/route.ts ***!
  \********************************/
/***/ ((__unused_webpack_module, __webpack_exports__, __webpack_require__) => {

eval("__webpack_require__.r(__webpack_exports__);\n/* harmony export */ __webpack_require__.d(__webpack_exports__, {\n/* harmony export */   POST: () => (/* binding */ POST)\n/* harmony export */ });\n/* harmony import */ var next_server__WEBPACK_IMPORTED_MODULE_0__ = __webpack_require__(/*! next/server */ \"(rsc)/./node_modules/next/dist/api/server.js\");\n/* harmony import */ var bcryptjs__WEBPACK_IMPORTED_MODULE_1__ = __webpack_require__(/*! bcryptjs */ \"(rsc)/./node_modules/bcryptjs/index.js\");\n/* harmony import */ var bcryptjs__WEBPACK_IMPORTED_MODULE_1___default = /*#__PURE__*/__webpack_require__.n(bcryptjs__WEBPACK_IMPORTED_MODULE_1__);\n/* harmony import */ var _lib_db__WEBPACK_IMPORTED_MODULE_2__ = __webpack_require__(/*! @/lib/db */ \"(rsc)/./lib/db.ts\");\n/* harmony import */ var _lib_auth__WEBPACK_IMPORTED_MODULE_3__ = __webpack_require__(/*! @/lib/auth */ \"(rsc)/./lib/auth.ts\");\n\n\n\n\nasync function POST(request) {\n    try {\n        const { celular, password } = await request.json();\n        const result = await _lib_db__WEBPACK_IMPORTED_MODULE_2__[\"default\"].query(\"SELECT * FROM usuarios WHERE celular = $1\", [\n            celular\n        ]);\n        if (result.rows.length === 0) {\n            return next_server__WEBPACK_IMPORTED_MODULE_0__.NextResponse.json({\n                error: \"Usuario no encontrado\"\n            }, {\n                status: 401\n            });\n        }\n        const usuario = result.rows[0];\n        if (usuario.password) {\n            if (!password) {\n                return next_server__WEBPACK_IMPORTED_MODULE_0__.NextResponse.json({\n                    error: \"Contrase\\xf1a requerida\"\n                }, {\n                    status: 401\n                });\n            }\n            const validPassword = await bcryptjs__WEBPACK_IMPORTED_MODULE_1___default().compare(password, usuario.password);\n            if (!validPassword) {\n                return next_server__WEBPACK_IMPORTED_MODULE_0__.NextResponse.json({\n                    error: \"Contrase\\xf1a incorrecta\"\n                }, {\n                    status: 401\n                });\n            }\n        }\n        const token = (0,_lib_auth__WEBPACK_IMPORTED_MODULE_3__.createToken)({\n            id: usuario.id,\n            nombre: usuario.nombre,\n            celular: usuario.celular,\n            email: usuario.email,\n            rol: usuario.rol\n        });\n        const response = next_server__WEBPACK_IMPORTED_MODULE_0__.NextResponse.json({\n            success: true,\n            token: token,\n            usuario: {\n                id: usuario.id,\n                nombre: usuario.nombre,\n                celular: usuario.celular,\n                email: usuario.email,\n                rol: usuario.rol\n            },\n            redirect: usuario.rol === \"admin\" ? \"/admin\" : \"/alumno\"\n        });\n        response.headers.set(\"Set-Cookie\", (0,_lib_auth__WEBPACK_IMPORTED_MODULE_3__.setTokenCookie)(token));\n        return response;\n    } catch (error) {\n        console.error(\"Error en login:\", error);\n        return next_server__WEBPACK_IMPORTED_MODULE_0__.NextResponse.json({\n            error: \"Error al iniciar sesion\"\n        }, {\n            status: 500\n        });\n    }\n}\n//# sourceURL=[module]\n//# sourceMappingURL=data:application/json;charset=utf-8;base64,eyJ2ZXJzaW9uIjozLCJmaWxlIjoiKHJzYykvLi9hcHAvYXBpL2xvZ2luL3JvdXRlLnRzIiwibWFwcGluZ3MiOiI7Ozs7Ozs7OztBQUEyQztBQUNiO0FBQ0Y7QUFDNkI7QUFFbEQsZUFBZUssS0FBS0MsT0FBZ0I7SUFDekMsSUFBSTtRQUNGLE1BQU0sRUFBRUMsT0FBTyxFQUFFQyxRQUFRLEVBQUUsR0FBRyxNQUFNRixRQUFRRyxJQUFJO1FBRWhELE1BQU1DLFNBQVMsTUFBTVIsK0NBQUlBLENBQUNTLEtBQUssQ0FBQyw2Q0FBNkM7WUFBQ0o7U0FBUTtRQUV0RixJQUFJRyxPQUFPRSxJQUFJLENBQUNDLE1BQU0sS0FBSyxHQUFHO1lBQzVCLE9BQU9iLHFEQUFZQSxDQUFDUyxJQUFJLENBQUM7Z0JBQUVLLE9BQU87WUFBd0IsR0FBRztnQkFBRUMsUUFBUTtZQUFJO1FBQzdFO1FBRUEsTUFBTUMsVUFBVU4sT0FBT0UsSUFBSSxDQUFDLEVBQUU7UUFFOUIsSUFBSUksUUFBUVIsUUFBUSxFQUFFO1lBQ3BCLElBQUksQ0FBQ0EsVUFBVTtnQkFDYixPQUFPUixxREFBWUEsQ0FBQ1MsSUFBSSxDQUFDO29CQUFFSyxPQUFPO2dCQUF1QixHQUFHO29CQUFFQyxRQUFRO2dCQUFJO1lBQzVFO1lBQ0EsTUFBTUUsZ0JBQWdCLE1BQU1oQix1REFBYyxDQUFDTyxVQUFVUSxRQUFRUixRQUFRO1lBQ3JFLElBQUksQ0FBQ1MsZUFBZTtnQkFDbEIsT0FBT2pCLHFEQUFZQSxDQUFDUyxJQUFJLENBQUM7b0JBQUVLLE9BQU87Z0JBQXdCLEdBQUc7b0JBQUVDLFFBQVE7Z0JBQUk7WUFDN0U7UUFDRjtRQUVBLE1BQU1JLFFBQVFoQixzREFBV0EsQ0FBQztZQUN4QmlCLElBQUlKLFFBQVFJLEVBQUU7WUFDZEMsUUFBUUwsUUFBUUssTUFBTTtZQUN0QmQsU0FBU1MsUUFBUVQsT0FBTztZQUN4QmUsT0FBT04sUUFBUU0sS0FBSztZQUNwQkMsS0FBS1AsUUFBUU8sR0FBRztRQUNsQjtRQUVBLE1BQU1DLFdBQVd4QixxREFBWUEsQ0FBQ1MsSUFBSSxDQUFDO1lBQ2pDZ0IsU0FBUztZQUNUTixPQUFPQTtZQUNQSCxTQUFTO2dCQUNQSSxJQUFJSixRQUFRSSxFQUFFO2dCQUNkQyxRQUFRTCxRQUFRSyxNQUFNO2dCQUN0QmQsU0FBU1MsUUFBUVQsT0FBTztnQkFDeEJlLE9BQU9OLFFBQVFNLEtBQUs7Z0JBQ3BCQyxLQUFLUCxRQUFRTyxHQUFHO1lBQ2xCO1lBQ0FHLFVBQVVWLFFBQVFPLEdBQUcsS0FBSyxVQUFVLFdBQVc7UUFDakQ7UUFFQUMsU0FBU0csT0FBTyxDQUFDQyxHQUFHLENBQUMsY0FBY3hCLHlEQUFjQSxDQUFDZTtRQUVsRCxPQUFPSztJQUNULEVBQUUsT0FBT1YsT0FBTztRQUNkZSxRQUFRZixLQUFLLENBQUMsbUJBQW1CQTtRQUNqQyxPQUFPZCxxREFBWUEsQ0FBQ1MsSUFBSSxDQUFDO1lBQUVLLE9BQU87UUFBMEIsR0FBRztZQUFFQyxRQUFRO1FBQUk7SUFDL0U7QUFDRiIsInNvdXJjZXMiOlsid2VicGFjazovL2N1cnNvcy1icm9va2x5bi8uL2FwcC9hcGkvbG9naW4vcm91dGUudHM/NjAxZiJdLCJzb3VyY2VzQ29udGVudCI6WyJpbXBvcnQgeyBOZXh0UmVzcG9uc2UgfSBmcm9tICduZXh0L3NlcnZlcic7XG5pbXBvcnQgYmNyeXB0IGZyb20gJ2JjcnlwdGpzJztcbmltcG9ydCBwb29sIGZyb20gJ0AvbGliL2RiJztcbmltcG9ydCB7IGNyZWF0ZVRva2VuLCBzZXRUb2tlbkNvb2tpZSB9IGZyb20gJ0AvbGliL2F1dGgnO1xuXG5leHBvcnQgYXN5bmMgZnVuY3Rpb24gUE9TVChyZXF1ZXN0OiBSZXF1ZXN0KSB7XG4gIHRyeSB7XG4gICAgY29uc3QgeyBjZWx1bGFyLCBwYXNzd29yZCB9ID0gYXdhaXQgcmVxdWVzdC5qc29uKCk7XG5cbiAgICBjb25zdCByZXN1bHQgPSBhd2FpdCBwb29sLnF1ZXJ5KCdTRUxFQ1QgKiBGUk9NIHVzdWFyaW9zIFdIRVJFIGNlbHVsYXIgPSAkMScsIFtjZWx1bGFyXSk7XG5cbiAgICBpZiAocmVzdWx0LnJvd3MubGVuZ3RoID09PSAwKSB7XG4gICAgICByZXR1cm4gTmV4dFJlc3BvbnNlLmpzb24oeyBlcnJvcjogJ1VzdWFyaW8gbm8gZW5jb250cmFkbycgfSwgeyBzdGF0dXM6IDQwMSB9KTtcbiAgICB9XG5cbiAgICBjb25zdCB1c3VhcmlvID0gcmVzdWx0LnJvd3NbMF07XG5cbiAgICBpZiAodXN1YXJpby5wYXNzd29yZCkge1xuICAgICAgaWYgKCFwYXNzd29yZCkge1xuICAgICAgICByZXR1cm4gTmV4dFJlc3BvbnNlLmpzb24oeyBlcnJvcjogJ0NvbnRyYXNlw7FhIHJlcXVlcmlkYScgfSwgeyBzdGF0dXM6IDQwMSB9KTtcbiAgICAgIH1cbiAgICAgIGNvbnN0IHZhbGlkUGFzc3dvcmQgPSBhd2FpdCBiY3J5cHQuY29tcGFyZShwYXNzd29yZCwgdXN1YXJpby5wYXNzd29yZCk7XG4gICAgICBpZiAoIXZhbGlkUGFzc3dvcmQpIHtcbiAgICAgICAgcmV0dXJuIE5leHRSZXNwb25zZS5qc29uKHsgZXJyb3I6ICdDb250cmFzZcOxYSBpbmNvcnJlY3RhJyB9LCB7IHN0YXR1czogNDAxIH0pO1xuICAgICAgfVxuICAgIH1cblxuICAgIGNvbnN0IHRva2VuID0gY3JlYXRlVG9rZW4oe1xuICAgICAgaWQ6IHVzdWFyaW8uaWQsXG4gICAgICBub21icmU6IHVzdWFyaW8ubm9tYnJlLFxuICAgICAgY2VsdWxhcjogdXN1YXJpby5jZWx1bGFyLFxuICAgICAgZW1haWw6IHVzdWFyaW8uZW1haWwsXG4gICAgICByb2w6IHVzdWFyaW8ucm9sXG4gICAgfSk7XG5cbiAgICBjb25zdCByZXNwb25zZSA9IE5leHRSZXNwb25zZS5qc29uKHtcbiAgICAgIHN1Y2Nlc3M6IHRydWUsXG4gICAgICB0b2tlbjogdG9rZW4sXG4gICAgICB1c3VhcmlvOiB7XG4gICAgICAgIGlkOiB1c3VhcmlvLmlkLFxuICAgICAgICBub21icmU6IHVzdWFyaW8ubm9tYnJlLFxuICAgICAgICBjZWx1bGFyOiB1c3VhcmlvLmNlbHVsYXIsXG4gICAgICAgIGVtYWlsOiB1c3VhcmlvLmVtYWlsLFxuICAgICAgICByb2w6IHVzdWFyaW8ucm9sXG4gICAgICB9LFxuICAgICAgcmVkaXJlY3Q6IHVzdWFyaW8ucm9sID09PSAnYWRtaW4nID8gJy9hZG1pbicgOiAnL2FsdW1ubydcbiAgICB9KTtcblxuICAgIHJlc3BvbnNlLmhlYWRlcnMuc2V0KCdTZXQtQ29va2llJywgc2V0VG9rZW5Db29raWUodG9rZW4pKTtcblxuICAgIHJldHVybiByZXNwb25zZTtcbiAgfSBjYXRjaCAoZXJyb3IpIHtcbiAgICBjb25zb2xlLmVycm9yKCdFcnJvciBlbiBsb2dpbjonLCBlcnJvcik7XG4gICAgcmV0dXJuIE5leHRSZXNwb25zZS5qc29uKHsgZXJyb3I6ICdFcnJvciBhbCBpbmljaWFyIHNlc2lvbicgfSwgeyBzdGF0dXM6IDUwMCB9KTtcbiAgfVxufVxuIl0sIm5hbWVzIjpbIk5leHRSZXNwb25zZSIsImJjcnlwdCIsInBvb2wiLCJjcmVhdGVUb2tlbiIsInNldFRva2VuQ29va2llIiwiUE9TVCIsInJlcXVlc3QiLCJjZWx1bGFyIiwicGFzc3dvcmQiLCJqc29uIiwicmVzdWx0IiwicXVlcnkiLCJyb3dzIiwibGVuZ3RoIiwiZXJyb3IiLCJzdGF0dXMiLCJ1c3VhcmlvIiwidmFsaWRQYXNzd29yZCIsImNvbXBhcmUiLCJ0b2tlbiIsImlkIiwibm9tYnJlIiwiZW1haWwiLCJyb2wiLCJyZXNwb25zZSIsInN1Y2Nlc3MiLCJyZWRpcmVjdCIsImhlYWRlcnMiLCJzZXQiLCJjb25zb2xlIl0sInNvdXJjZVJvb3QiOiIifQ==\n//# sourceURL=webpack-internal:///(rsc)/./app/api/login/route.ts\n");

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
var __webpack_require__ = require("../../../webpack-runtime.js");
__webpack_require__.C(exports);
var __webpack_exec__ = (moduleId) => (__webpack_require__(__webpack_require__.s = moduleId))
var __webpack_exports__ = __webpack_require__.X(0, ["vendor-chunks/next","vendor-chunks/semver","vendor-chunks/jsonwebtoken","vendor-chunks/lodash.includes","vendor-chunks/jws","vendor-chunks/lodash.once","vendor-chunks/jwa","vendor-chunks/lodash.isinteger","vendor-chunks/ecdsa-sig-formatter","vendor-chunks/lodash.isplainobject","vendor-chunks/lodash.isstring","vendor-chunks/lodash.isnumber","vendor-chunks/lodash.isboolean","vendor-chunks/safe-buffer","vendor-chunks/buffer-equal-constant-time","vendor-chunks/bcryptjs"], () => (__webpack_exec__("(rsc)/./node_modules/next/dist/build/webpack/loaders/next-app-loader.js?name=app%2Fapi%2Flogin%2Froute&page=%2Fapi%2Flogin%2Froute&appPaths=&pagePath=private-next-app-dir%2Fapi%2Flogin%2Froute.ts&appDir=%2FUsers%2Ffernandotrejo%2FDeveloper%2Fcursos-brooklyn%2Fapp&pageExtensions=tsx&pageExtensions=ts&pageExtensions=jsx&pageExtensions=js&rootDir=%2FUsers%2Ffernandotrejo%2FDeveloper%2Fcursos-brooklyn&isDev=true&tsconfigPath=tsconfig.json&basePath=&assetPrefix=&nextConfigOutput=&preferredRegion=&middlewareConfig=e30%3D!")));
module.exports = __webpack_exports__;

})();