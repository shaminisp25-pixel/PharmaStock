import { Router } from 'express';
import { authMiddleware } from '../middlewares/auth.middleware';
import { guard } from '../middlewares/rbac.middleware';
import { ApiResponse } from '../utils/ApiResponse';

const router = Router();

/**
 * @swagger
 * /reports/expiry:
 *   get:
 *     summary: Get expiry report
 *     tags:
 *       - Reports
 *     security:
 *       - BearerAuth: []
 *     responses:
 *       200:
 *         description: Expiry report in CSV format
 *         content:
 *           text/csv:
 *             schema:
 *               type: string
 *               format: binary
 */
router.get('/expiry', authMiddleware, guard('reports:read'), (req, res) => {
  res.setHeader('Content-Type', 'text/csv');
  res.setHeader('Content-Disposition', 'attachment; filename="expiry_report.csv"');
  res.send('Expiry report placeholder\n');
});

/**
 * @swagger
 * /reports/dispatch:
 *   get:
 *     summary: Get dispatch report
 *     tags:
 *       - Reports
 *     security:
 *       - BearerAuth: []
 *     responses:
 *       200:
 *         description: Dispatch report in CSV format
 *         content:
 *           text/csv:
 *             schema:
 *               type: string
 *               format: binary
 */
router.get('/dispatch', authMiddleware, guard('reports:read'), (req, res) => {
  res.setHeader('Content-Type', 'text/csv');
  res.setHeader('Content-Disposition', 'attachment; filename="dispatch_report.csv"');
  res.send('Dispatch report placeholder\n');
});

/**
 * @swagger
 * /reports/stock:
 *   get:
 *     summary: Get stock report
 *     tags:
 *       - Reports
 *     security:
 *       - BearerAuth: []
 *     responses:
 *       200:
 *         description: Stock report
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
router.get('/stock', authMiddleware, guard('reports:read'), (req, res) => {
  res.json(ApiResponse.ok('Stock report', {}).toJSON());
});

/**
 * @swagger
 * /reports/temperature-sensitive:
 *   get:
 *     summary: Get temperature-sensitive drugs report
 *     tags:
 *       - Reports
 *     security:
 *       - BearerAuth: []
 *     responses:
 *       200:
 *         description: Temperature-sensitive report
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
router.get('/temperature-sensitive', authMiddleware, guard('reports:read'), (req, res) => {
  res.json(ApiResponse.ok('Temperature-sensitive report', {}).toJSON());
});

export default router;
