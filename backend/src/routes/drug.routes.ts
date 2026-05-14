import { Router } from 'express';
import { validate } from '../middlewares/validate.middleware';
import { authMiddleware } from '../middlewares/auth.middleware';
import { guard } from '../middlewares/rbac.middleware';
import { auditLog } from '../middlewares/audit.middleware';
import { DrugController } from '../controllers/resource.controller';
import {
  createDrugSchema,
  updateDrugSchema,
  paginationSchema,
} from '../utils/schemas';

const router = Router();

/**
 * @swagger
 * /drugs:
 *   get:
 *     summary: Get all drugs
 *     tags:
 *       - Drugs
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
 *         description: List of drugs
 *         content:
 *           application/json:
 *             schema:
 *               $ref: '#/components/schemas/PaginatedResponse'
 */
router.get(
  '/',
  authMiddleware,
  guard('drugs:read'),
  validate(paginationSchema),
  DrugController.getAll,
);

/**
 * @swagger
 * /drugs/{id}:
 *   get:
 *     summary: Get drug by ID
 *     tags:
 *       - Drugs
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
 *         description: Drug details
 *         content:
 *           application/json:
 *             schema:
 *               type: object
 *               properties:
 *                 success:
 *                   type: boolean
 *                 data:
 *                   $ref: '#/components/schemas/Drug'
 */
router.get(
  '/:id',
  authMiddleware,
  guard('drugs:read'),
  DrugController.getById,
);

/**
 * @swagger
 * /drugs:
 *   post:
 *     summary: Create new drug
 *     tags:
 *       - Drugs
 *     security:
 *       - BearerAuth: []
 *     requestBody:
 *       required: true
 *       content:
 *         application/json:
 *           schema:
 *             type: object
 *             required:
 *               - drugName
 *               - manufacturer
 *               - composition
 *               - category
 *             properties:
 *               drugName:
 *                 type: string
 *               manufacturer:
 *                 type: string
 *               composition:
 *                 type: string
 *               category:
 *                 type: string
 *     responses:
 *       201:
 *         description: Drug created successfully
 *         content:
 *           application/json:
 *             schema:
 *               type: object
 *               properties:
 *                 success:
 *                   type: boolean
 *                 data:
 *                   $ref: '#/components/schemas/Drug'
 */
router.post(
  '/',
  authMiddleware,
  guard('drugs:create'),
  validate(createDrugSchema),
  auditLog('Drug'),
  DrugController.create,
);

/**
 * @swagger
 * /drugs/{id}:
 *   patch:
 *     summary: Update drug
 *     tags:
 *       - Drugs
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
 *               drugName:
 *                 type: string
 *               manufacturer:
 *                 type: string
 *               composition:
 *                 type: string
 *               category:
 *                 type: string
 *     responses:
 *       200:
 *         description: Drug updated successfully
 *         content:
 *           application/json:
 *             schema:
 *               type: object
 *               properties:
 *                 success:
 *                   type: boolean
 *                 data:
 *                   $ref: '#/components/schemas/Drug'
 */
router.patch(
  '/:id',
  authMiddleware,
  guard('drugs:update'),
  validate(updateDrugSchema),
  auditLog('Drug'),
  DrugController.update,
);

/**
 * @swagger
 * /drugs/{id}:
 *   delete:
 *     summary: Delete drug
 *     tags:
 *       - Drugs
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
 *         description: Drug deleted successfully
 */
router.delete(
  '/:id',
  authMiddleware,
  guard('drugs:delete'),
  auditLog('Drug'),
  DrugController.delete,
);

export default router;
