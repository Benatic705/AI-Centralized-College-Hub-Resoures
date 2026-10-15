"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
const express_1 = require("express");
const auth_controller_1 = require("../controllers/auth.controller");
const auth_middleware_1 = require("../middleware/auth.middleware");
const router = (0, express_1.Router)();
router.post('/register', (req, res, next) => auth_controller_1.authController.register(req, res, next));
router.post('/login', (req, res, next) => auth_controller_1.authController.login(req, res, next));
router.post('/refresh', (req, res, next) => auth_controller_1.authController.refreshToken(req, res, next));
router.post('/logout', auth_middleware_1.requireAuth, (req, res, next) => auth_controller_1.authController.logout(req, res, next));
router.get('/me', auth_middleware_1.requireAuth, (req, res, next) => auth_controller_1.authController.me(req, res, next));
exports.default = router;
//# sourceMappingURL=auth.routes.js.map