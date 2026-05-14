import { Router } from 'express';
import { validate } from '../middlewares/validate.middleware';
import { authMiddleware } from '../middlewares/auth.middleware';
import { guard } from '../middlewares/rbac.middleware';
import { auditLog } from '../middlewares/audit.middleware';
import { AlertController } from '../controllers/batch.controller';
import {
  resolveAlertSchema,
  paginationSchema,
} from '../utils/schemas';

const router = Router();

/**
 * @swagger
 * /alerts:
 *   get:
 *     summary: Get all alerts
 *     tags:
 *       - Alerts
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
 *         description: List of alerts
 *         content:
 *           application/json:
 *             schema:
 *               $ref: '#/components/schemas/PaginatedResponse'
 */
router.get(
  '/',
  authMiddleware,
  guard('alerts:read'),
  validate(paginationSchema),
  AlertController.getAll,
);

/**
 * @swagger
 * /alerts/{id}:
 *   get:
 *     summary: Get alert by ID
 *     tags:
 *       - Alerts
 *     security:
 *       - BearerAuth: []
 *     parameters:
 *       - in: path
 *         name: id
 *         required: true
 *         schema:
 *           type: string
 *           format: uuid
 *     responses:
 *       200:
 *         description: Alert details
 *         content:
 *           application/json:
 *             schema:
 *               type: object
 *               properties:
 *                 success:
 *                   type: boolean
 *                 data:
 *                   $ref: '#/components/schemas/Alert'
 */
router.get(
  '/:id',
  authMiddleware,
  guard('alerts:read'),
  AlertController.getById,
);

/**
 * @swagger
 * /alerts/{id}/resolve:
 *   patch:
 *     summary: Resolve an alert
 *     tags:
 *       - Alerts
 *     security:
 *       - BearerAuth: []
 *     parameters:
 *       - in: path
 *         name: id
 *         required: true
 *         schema:
 *           type: string
 *           format: uuid
 *     requestBody:
 *       required: true
 *       content:
 *         application/json:
 *           schema:
 *             type: object
 *             required:
 *               - resolutionNotes
 *             properties:
 *               resolutionNotes:
 *                 type: string
 *     responses:
 *       200:
 *         description: Alert resolved successfully
 *         content:
 *           application/json:
 *             schema:
 *               type: object
 *               properties:
 *                 success:
 *                   type: boolean
 *                 data:
 *                   $ref: '#/components/schemas/Alert'
 */
router.patch(
  '/:id/resolve',
  authMiddleware,
  guard('alerts:resolve'),
  validate(resolveAlertSchema),
  auditLog('Alert'),
  AlertController.resolve,
);

export default router;
