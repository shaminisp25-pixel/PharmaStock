import { Router } from 'express';
import { validate } from '../middlewares/validate.middleware';
import { authMiddleware } from '../middlewares/auth.middleware';
import { guard, warehouseScopeGuard } from '../middlewares/rbac.middleware';
import { auditLog } from '../middlewares/audit.middleware';
import { BatchController } from '../controllers/batch.controller';
import {
  createBatchSchema,
  updateBatchStatusSchema,
  dispatchBatchSchema,
  scanBatchSchema,
  paginationSchema,
} from '../utils/schemas';

const router = Router();

/**
 * @swagger
 * /batches:
 *   get:
 *     summary: Get all batches
 *     tags:
 *       - Batches
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
 *         description: List of batches
 *         content:
 *           application/json:
 *             schema:
 *               $ref: '#/components/schemas/PaginatedResponse'
 */
router.get(
  '/',
  authMiddleware,
  guard('batches:read'),
  validate(paginationSchema),
  BatchController.getAll,
);

/**
 * @swagger
 * /batches/{id}:
 *   get:
 *     summary: Get batch by ID
 *     tags:
 *       - Batches
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
 *         description: Batch details
 *         content:
 *           application/json:
 *             schema:
 *               type: object
 *               properties:
 *                 success:
 *                   type: boolean
 *                 data:
 *                   $ref: '#/components/schemas/Batch'
 */
router.get(
  '/:id',
  authMiddleware,
  guard('batches:read'),
  BatchController.getById,
);

/**
 * @swagger
 * /batches:
 *   post:
 *     summary: Create new batch
 *     tags:
 *       - Batches
 *     security:
 *       - BearerAuth: []
 *     requestBody:
 *       required: true
 *       content:
 *         application/json:
 *           schema:
 *             type: object
 *             required:
 *               - batchNumber
 *               - drugId
 *               - warehouseId
 *               - quantity
 *               - expiryDate
 *             properties:
 *               batchNumber:
 *                 type: string
 *               drugId:
 *                 type: string
 *                 format: uuid
 *               warehouseId:
 *                 type: string
 *                 format: uuid
 *               quantity:
 *                 type: integer
 *               expiryDate:
 *                 type: string
 *                 format: date
 *               tempMin:
 *                 type: number
 *               tempMax:
 *                 type: number
 *               storageNotes:
 *                 type: string
 *     responses:
 *       201:
 *         description: Batch created successfully
 *         content:
 *           application/json:
 *             schema:
 *               type: object
 *               properties:
 *                 success:
 *                   type: boolean
 *                 data:
 *                   $ref: '#/components/schemas/Batch'
 */
router.post(
  '/',
  authMiddleware,
  guard('batches:create'),
  validate(createBatchSchema),
  auditLog('Batch'),
  BatchController.create,
);

/**
 * @swagger
 * /batches/{id}/status:
 *   patch:
 *     summary: Update batch status
 *     tags:
 *       - Batches
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
 *               - status
 *             properties:
 *               status:
 *                 type: string
 *                 enum: [ACTIVE, LOW_STOCK, EXPIRING, EXPIRED, DISPATCHED]
 *     responses:
 *       200:
 *         description: Batch status updated successfully
 */
router.patch(
  '/:id/status',
  authMiddleware,
  guard('batches:update'),
  validate(updateBatchStatusSchema),
  auditLog('Batch'),
  BatchController.updateStatus,
);

/**
 * @swagger
 * /batches/{id}/dispatch:
 *   post:
 *     summary: Dispatch batch
 *     tags:
 *       - Batches
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
 *               - destinationWarehouse
 *               - quantity
 *             properties:
 *               destinationWarehouse:
 *                 type: string
 *               quantity:
 *                 type: integer
 *     responses:
 *       200:
 *         description: Batch dispatched successfully
 */
router.post(
  '/:id/dispatch',
  authMiddleware,
  guard('batches:dispatch'),
  validate(dispatchBatchSchema),
  auditLog('DispatchRecord'),
  BatchController.dispatch,
);

/**
 * @swagger
 * /batches/scan:
 *   post:
 *     summary: Scan batch for inventory tracking
 *     tags:
 *       - Batches
 *     security:
 *       - BearerAuth: []
 *     requestBody:
 *       required: true
 *       content:
 *         application/json:
 *           schema:
 *             type: object
 *             required:
 *               - batchNumber
 *             properties:
 *               batchNumber:
 *                 type: string
 *               location:
 *                 type: string
 *     responses:
 *       200:
 *         description: Batch scanned successfully
 */
router.post(
  '/scan',
  authMiddleware,
  guard('batches:scan'),
  validate(scanBatchSchema),
  BatchController.scan,
);

/**
 * @swagger
 * /batches/{id}:
 *   delete:
 *     summary: Delete batch
 *     tags:
 *       - Batches
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
 *         description: Batch deleted successfully
 */
router.delete(
  '/:id',
  authMiddleware,
  guard('batches:delete'),
  auditLog('Batch'),
  BatchController.delete,
);

export default router;
