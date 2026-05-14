import { Router } from 'express';
import { apiKeyGuard } from '../middlewares/apiKey.middleware';
import { ApiResponse } from '../utils/ApiResponse';

const router = Router();

/**
 * @swagger
 * /integration/erp/sync:
 *   post:
 *     summary: Sync with ERP system
 *     tags:
 *       - Integration
 *     security:
 *       - ApiKeyAuth: []
 *     requestBody:
 *       required: true
 *       content:
 *         application/json:
 *           schema:
 *             type: object
 *             properties:
 *               syncType:
 *                 type: string
 *                 enum: [INVENTORY, ORDERS, BATCHES]
 *               data:
 *                 type: object
 *     responses:
 *       200:
 *         description: ERP sync initiated successfully
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
 *                     syncId:
 *                       type: string
 *                     status:
 *                       type: string
 */
router.post('/erp/sync', apiKeyGuard, (req, res) => {
  res.json(ApiResponse.ok('ERP sync initiated', {}).toJSON());
});

/**
 * @swagger
 * /integration/prescription/lookup:
 *   post:
 *     summary: Lookup prescription from external system
 *     tags:
 *       - Integration
 *     security:
 *       - ApiKeyAuth: []
 *     requestBody:
 *       required: true
 *       content:
 *         application/json:
 *           schema:
 *             type: object
 *             required:
 *               - prescriptionId
 *             properties:
 *               prescriptionId:
 *                 type: string
 *               patientId:
 *                 type: string
 *     responses:
 *       200:
 *         description: Prescription lookup result
 *         content:
 *           application/json:
 *             schema:
 *               type: object
 *               properties:
 *                 success:
 *                   type: boolean
 *                 data:
 *                   type: object
 */
router.post('/prescription/lookup', apiKeyGuard, (req, res) => {
  res.json(ApiResponse.ok('Prescription lookup result', {}).toJSON());
});

export default router;
