import { Router } from 'express';
import { authMiddleware } from '../middlewares/auth.middleware';
import { guard } from '../middlewares/rbac.middleware';
import { importLimiter } from '../middlewares/rateLimit.middleware';
import { ImportController } from '../controllers/batch.controller';
import { paginationSchema } from '../utils/schemas';
import { validate } from '../middlewares/validate.middleware';

const router = Router();

/**
 * @swagger
 * /import/logs:
 *   get:
 *     summary: Get import logs
 *     tags:
 *       - Import
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
 *         description: List of import logs
 *         content:
 *           application/json:
 *             schema:
 *               $ref: '#/components/schemas/PaginatedResponse'
 */
router.get(
  '/logs',
  authMiddleware,
  guard('import:logs'),
  validate(paginationSchema),
  ImportController.getLogs,
);

/**
 * @swagger
 * /import/logs/{id}:
 *   get:
 *     summary: Get import log by ID
 *     tags:
 *       - Import
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
 *         description: Import log details
 */
router.get(
  '/logs/:id',
  authMiddleware,
  guard('import:logs'),
  ImportController.getLogById,
);

/**
 * @swagger
 * /import/template:
 *   get:
 *     summary: Download CSV import template
 *     tags:
 *       - Import
 *     security:
 *       - BearerAuth: []
 *     responses:
 *       200:
 *         description: CSV template file
 *         content:
 *           text/csv:
 *             schema:
 *               type: string
 *               format: binary
 */
router.get(
  '/template',
  authMiddleware,
  guard('import:upload'),
  (req, res) => {
    res.setHeader('Content-Type', 'text/csv');
    res.setHeader('Content-Disposition', 'attachment; filename="drug_import_template.csv"');
    res.send('drugName,manufacturer,composition,category,expiryDate,quantity,tempMin,tempMax,storageNotes\n');
  },
);

/**
 * @swagger
 * /import/drugs/upload:
 *   post:
 *     summary: Upload drugs from CSV file
 *     tags:
 *       - Import
 *     security:
 *       - BearerAuth: []
 *     requestBody:
 *       required: true
 *       content:
 *         multipart/form-data:
 *           schema:
 *             type: object
 *             properties:
 *               file:
 *                 type: string
 *                 format: binary
 *     responses:
 *       200:
 *         description: Drugs imported successfully
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
 *                     imported:
 *                       type: integer
 *                     failed:
 *                       type: integer
 */
router.post(
  '/drugs/upload',
  authMiddleware,
  guard('import:upload'),
  importLimiter,
  ImportController.uploadDrugs,
);

export default router;
