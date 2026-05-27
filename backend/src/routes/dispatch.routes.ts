import { Router } from 'express';
import { validate } from '../middlewares/validate.middleware';
import { authMiddleware } from '../middlewares/auth.middleware';
import { guard } from '../middlewares/rbac.middleware';
import { auditLog } from '../middlewares/audit.middleware';
import { DispatchController } from '../controllers/dispatch.controller';
import { paginationSchema } from '../utils/schemas';
import { z } from 'zod';

const router = Router();

// Dispatch schemas
const createDispatchSchema = z.object({
  body: z.object({
    batchId: z.string().uuid('Invalid batch ID'),
    quantityDispatched: z.number().int().positive('Quantity must be greater than 0'),
    destination: z.string().min(1, 'Destination is required'),
    prescriptionRef: z.string().optional(),
  }),
});

/**
 * @swagger
 * /dispatch:
 *   get:
 *     summary: Get all dispatch records
 *     tags:
 *       - Dispatch
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
 *           default: 20
 *       - in: query
 *         name: batchId
 *         schema:
 *           type: string
 *           format: uuid
 *       - in: query
 *         name: warehouseId
 *         schema:
 *           type: string
 *           format: uuid
 *       - in: query
 *         name: destination
 *         schema:
 *           type: string
 *     responses:
 *       200:
 *         description: List of dispatch records
 */
router.get(
  '/',
  authMiddleware,
  guard('batches:read'),
  validate(paginationSchema),
  DispatchController.getAll,
);

/**
 * @swagger
 * /dispatch/{id}:
 *   get:
 *     summary: Get dispatch record by ID
 *     tags:
 *       - Dispatch
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
 *         description: Dispatch record details
 */
router.get(
  '/:id',
  authMiddleware,
  guard('batches:read'),
  DispatchController.getById,
);

/**
 * @swagger
 * /dispatch:
 *   post:
 *     summary: Create new dispatch record
 *     tags:
 *       - Dispatch
 *     security:
 *       - BearerAuth: []
 *     requestBody:
 *       required: true
 *       content:
 *         application/json:
 *           schema:
 *             type: object
 *             required:
 *               - batchId
 *               - quantityDispatched
 *               - destination
 *             properties:
 *               batchId:
 *                 type: string
 *                 format: uuid
 *               quantityDispatched:
 *                 type: number
 *               destination:
 *                 type: string
 *               prescriptionRef:
 *                 type: string
 *     responses:
 *       201:
 *         description: Dispatch record created
 */
router.post(
  '/',
  authMiddleware,
  guard('batches:dispatch'),
  validate(createDispatchSchema),
  auditLog('DispatchRecord'),
  DispatchController.create,
);

/**
 * @swagger
 * /dispatch/{id}:
 *   delete:
 *     summary: Delete dispatch record
 *     tags:
 *       - Dispatch
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
 *         description: Dispatch record deleted
 */
router.delete(
  '/:id',
  authMiddleware,
  guard('batches:delete'),
  auditLog('DispatchRecord'),
  DispatchController.delete,
);

export default router;
