import { Router } from 'express';
import { validate } from '../middlewares/validate.middleware';
import { authMiddleware } from '../middlewares/auth.middleware';
import { guard } from '../middlewares/rbac.middleware';
import { AuditController } from '../controllers/batch.controller';
import { paginationSchema } from '../utils/schemas';

const router = Router();

/**
 * @swagger
 * /audit:
 *   get:
 *     summary: Get audit logs
 *     tags:
 *       - Audit
 *     security:
 *       - BearerAuth: []
 *     parameters:
 *       - in: query
 *         name: page
 *         schema:
 *           type: integer
 *           default: 1
 *       - in: query
 *         name: limit
 *         schema:
 *           type: integer
 *           default: 10
 *     responses:
 *       200:
 *         description: List of audit logs
 *         content:
 *           application/json:
 *             schema:
 *               type: object
 *               properties:
 *                 success:
 *                   type: boolean
 *                 data:
 *                   type: object
 *                   properties:
 *                     items:
 *                       type: array
 *                       items:
 *                         $ref: '#/components/schemas/AuditLog'
 *                     pagination:
 *                       type: object
 */
router.get(
  '/',
  authMiddleware,
  guard('audit:read'),
  validate(paginationSchema),
  AuditController.getAll,
);

export default router;
