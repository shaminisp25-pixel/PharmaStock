import { Request, Response, NextFunction } from 'express';
import { AuthRequest } from '../middlewares/auth.middleware';
import { UserService } from '../services/user.service';
import { WarehouseService } from '../services/warehouse.service';
import { DrugService } from '../services/drug.service';
import { ApiResponse } from '../utils/ApiResponse';

export class UserController {
  static async getAll(req: Request, res: Response, next: NextFunction) {
    try {
      const page = parseInt(req.query.page as string) || 1;
      const limit = parseInt(req.query.limit as string) || 20;
      const role = req.query.role as string | undefined;
      const warehouseId = req.query.warehouseId as string | undefined;

      const result = await UserService.getAllUsers(page, limit, role, warehouseId);

      res.json(
        ApiResponse.ok('Users fetched successfully', result.data, {
          total: result.total,
          page: result.page,
          limit: result.limit,
          totalPages: result.totalPages,
        }).toJSON(),
      );
    } catch (error) {
      next(error);
    }
  }

  static async getById(req: Request, res: Response, next: NextFunction) {
    try {
      const user = await UserService.getUserById(req.params.id);
      res.json(ApiResponse.ok('User fetched successfully', user).toJSON());
    } catch (error) {
      next(error);
    }
  }

  static async create(req: Request, res: Response, next: NextFunction) {
    try {
      const { name, email, password, role, warehouseId } = req.body;
      const user = await UserService.createUser(name, email, password, role, warehouseId);
      res.status(201).json(ApiResponse.ok('User created successfully', user).toJSON());
    } catch (error) {
      next(error);
    }
  }

  static async update(req: Request, res: Response, next: NextFunction) {
    try {
      const user = await UserService.updateUser(req.params.id, req.body);
      res.json(ApiResponse.ok('User updated successfully', user).toJSON());
    } catch (error) {
      next(error);
    }
  }

  static async delete(req: Request, res: Response, next: NextFunction) {
    try {
      const result = await UserService.deleteUser(req.params.id);
      res.json(ApiResponse.ok(result.message).toJSON());
    } catch (error) {
      next(error);
    }
  }
}

export class WarehouseController {
  static async getAll(req: Request, res: Response, next: NextFunction) {
    try {
      const page = parseInt(req.query.page as string) || 1;
      const limit = parseInt(req.query.limit as string) || 20;

      const result = await WarehouseService.getAllWarehouses(page, limit);

      res.json(
        ApiResponse.ok('Warehouses fetched successfully', result.data, {
          total: result.total,
          page: result.page,
          limit: result.limit,
          totalPages: result.totalPages,
        }).toJSON(),
      );
    } catch (error) {
      next(error);
    }
  }

  static async getById(req: Request, res: Response, next: NextFunction) {
    try {
      const warehouse = await WarehouseService.getWarehouseById(req.params.id);
      res.json(ApiResponse.ok('Warehouse fetched successfully', warehouse).toJSON());
    } catch (error) {
      next(error);
    }
  }

  static async create(req: Request, res: Response, next: NextFunction) {
    try {
      const { name, location, tempMin, tempMax } = req.body;
      const warehouse = await WarehouseService.createWarehouse(name, location, tempMin, tempMax);
      res.status(201).json(ApiResponse.ok('Warehouse created successfully', warehouse).toJSON());
    } catch (error) {
      next(error);
    }
  }

  static async update(req: Request, res: Response, next: NextFunction) {
    try {
      const warehouse = await WarehouseService.updateWarehouse(req.params.id, req.body);
      res.json(ApiResponse.ok('Warehouse updated successfully', warehouse).toJSON());
    } catch (error) {
      next(error);
    }
  }

  static async delete(req: Request, res: Response, next: NextFunction) {
    try {
      const result = await WarehouseService.deleteWarehouse(req.params.id);
      res.json(ApiResponse.ok(result.message).toJSON());
    } catch (error) {
      next(error);
    }
  }
}

export class DrugController {
  static async getAll(req: Request, res: Response, next: NextFunction) {
    try {
      const page = parseInt(req.query.page as string) || 1;
      const limit = parseInt(req.query.limit as string) || 20;
      const search = req.query.search as string | undefined;
      const category = req.query.category as string | undefined;
      const manufacturer = req.query.manufacturer as string | undefined;

      const result = await DrugService.getAllDrugs(page, limit, search, category, manufacturer);

      res.json(
        ApiResponse.ok('Drugs fetched successfully', result.data, {
          total: result.total,
          page: result.page,
          limit: result.limit,
          totalPages: result.totalPages,
        }).toJSON(),
      );
    } catch (error) {
      next(error);
    }
  }

  static async getById(req: Request, res: Response, next: NextFunction) {
    try {
      const drug = await DrugService.getDrugById(req.params.id);
      res.json(ApiResponse.ok('Drug fetched successfully', drug).toJSON());
    } catch (error) {
      next(error);
    }
  }

  static async create(req: Request, res: Response, next: NextFunction) {
    try {
      const { name, manufacturer, tempMin, tempMax, composition, category, storageNotes } = req.body;
      const drug = await DrugService.createDrug(name, manufacturer, tempMin, tempMax, composition, category, storageNotes);
      res.status(201).json(ApiResponse.ok('Drug created successfully', drug).toJSON());
    } catch (error) {
      next(error);
    }
  }

  static async update(req: Request, res: Response, next: NextFunction) {
    try {
      const drug = await DrugService.updateDrug(req.params.id, req.body);
      res.json(ApiResponse.ok('Drug updated successfully', drug).toJSON());
    } catch (error) {
      next(error);
    }
  }

  static async delete(req: Request, res: Response, next: NextFunction) {
    try {
      const result = await DrugService.deleteDrug(req.params.id);
      res.json(ApiResponse.ok(result.message).toJSON());
    } catch (error) {
      next(error);
    }
  }
}
