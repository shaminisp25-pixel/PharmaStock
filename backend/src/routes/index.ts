import { Router } from 'express';
import authRoutes from './auth.routes';
import userRoutes from './user.routes';
import warehouseRoutes from './warehouse.routes';
import drugRoutes from './drug.routes';
import batchRoutes from './batch.routes';
import alertRoutes from './alert.routes';
import auditRoutes from './audit.routes';
import importRoutes from './import.routes';
import reportRoutes from './report.routes';
import integrationRoutes from './integration.routes';
import systemRoutes from './system.routes';
import dispatchRoutes from './dispatch.routes';

const router = Router();

router.use('/auth', authRoutes);
router.use('/users', userRoutes);
router.use('/warehouses', warehouseRoutes);
router.use('/drugs', drugRoutes);
router.use('/batches', batchRoutes);
router.use('/alerts', alertRoutes);
router.use('/audit', auditRoutes);
router.use('/import', importRoutes);
router.use('/reports', reportRoutes);
router.use('/integration', integrationRoutes);
router.use('/system', systemRoutes);
router.use('/dispatch', dispatchRoutes);

export default router;
