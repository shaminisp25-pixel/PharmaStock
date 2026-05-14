import { Router } from 'express';
import { validate } from '../middlewares/validate.middleware';
import { authMiddleware } from '../middlewares/auth.middleware';
import { guard } from '../middlewares/rbac.middleware';
import { auditLog } from '../middlewares/audit.middleware';
import { WarehouseController } from '../controllers/resource.controller';
import {
  createWarehouseSchema,
  updateWarehouseSchema,
  paginationSchema,
} from '../utils/schemas';

const router = Router();

/**
 * @swagger
 * /warehouses:
 *   get:
 *     summary: Get all warehouses
 *     tags:
 *       - Warehouses
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
 *         description: List of warehouses
 *         content:
 *           application/json:
 *             schema:
 *               $ref: '#/components/schemas/PaginatedResponse'
 */
router.get(
  '/',
  authMiddleware,
  guard('warehouses:read'),
  validate(paginationSchema),
  WarehouseController.getAll,
);

/**
 * @swagger
 * /warehouses/{id}:
 *   get:
 *     summary: Get warehouse by ID
 *     tags:
 *       - Warehouses
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
 *         description: Warehouse details
 *         content:
 *           application/json:
 *             schema:
 *               type: object
 *               properties:
 *                 success:
 *                   type: boolean
 *                 data:
 *                   $ref: '#/components/schemas/Warehouse'
 */
router.get(
  '/:id',
  authMiddleware,
  guard('warehouses:read'),
  WarehouseController.getById,
);

/**
 * @swagger
 * /warehouses:
 *   post:
 *     summary: Create new warehouse
 *     tags:
 *       - Warehouses
 *     security:
 *       - BearerAuth: []
 *     requestBody:
 *       required: true
 *       content:
 *         application/json:
 *           schema:
 *             type: object
 *             required:
 *               - name
 *               - location
 *               - capacity
 *             properties:
 *               name:
 *                 type: string
 *               location:
 *                 type: string
 *               capacity:
 *                 type: integer
 *     responses:
 *       201:
 *         description: Warehouse created successfully
 *         content:
 *           application/json:
 *             schema:
 *               type: object
 *               properties:
 *                 success:
 *                   type: boolean
 *                 data:
 *                   $ref: '#/components/schemas/Warehouse'
 */
router.post(
  '/',
  authMiddleware,
  guard('warehouses:create'),
  validate(createWarehouseSchema),
  auditLog('Warehouse'),
  WarehouseController.create,
);

/**
 * @swagger
 * /warehouses/{id}:
 *   patch:
 *     summary: Update warehouse
 *     tags:
 *       - Warehouses
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
 *             properties:
 *               name:
 *                 type: string
 *               location:
 *                 type: string
 *               capacity:
 *                 type: integer
 *               isActive:
 *                 type: boolean
 *     responses:
 *       200:
 *         description: Warehouse updated successfully
 *         content:
 *           application/json:
 *             schema:
 *               type: object
 *               properties:
 *                 success:
 *                   type: boolean
 *                 data:
 *                   $ref: '#/components/schemas/Warehouse'
 */
router.patch(
  '/:id',
  authMiddleware,
  guard('warehouses:update'),
  validate(updateWarehouseSchema),
  auditLog('Warehouse'),
  WarehouseController.update,
);

/**
 * @swagger
 * /warehouses/{id}:
 *   delete:
 *     summary: Delete warehouse
 *     tags:
 *       - Warehouses
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
 *         description: Warehouse deleted successfully
 */
router.delete(
  '/:id',
  authMiddleware,
  guard('warehouses:delete'),
  auditLog('Warehouse'),
  WarehouseController.delete,
);

export default router;
