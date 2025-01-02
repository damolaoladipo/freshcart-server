import { Request, Response, NextFunction } from "express";
import Product from '../models/Product.model';
import { IResult } from '../utils/interface.util';

class SearchService {
  constructor() {}

  /**
   * @name searchProducts
   * @param req - The request object
   * @param res - The response object
   * @param next - The next middleware function
   * @returns { Promise<IResult> } - see IResult
   */
  public async searchProducts(req: Request, res: Response, next: NextFunction): Promise<IResult> {
    const result: IResult = { error: false, message: "", code: 200, data: {} };
    const { keyword, category, minPrice, maxPrice, sortBy, sortOrder } = req.query;

    try {
      let searchQuery: any = {};

      // Build the search query based on filters
      if (keyword) {
        searchQuery.$text = { $search: keyword };  // MongoDB full-text search (assuming we have a text index on name and description)
      }

      if (category) {
        searchQuery.category = category;
      }

      if (minPrice || maxPrice) {
        searchQuery.price = {};
        if (minPrice) {
          searchQuery.price.$gte = parseFloat(minPrice as string);
        }
        if (maxPrice) {
          searchQuery.price.$lte = parseFloat(maxPrice as string);
        }
      }

      // Apply sorting if required
      let sortQuery: any = {};
      if (sortBy) {
        const validSortFields = ['price', 'rating', 'popularity'];
        if (validSortFields.includes(sortBy as string)) {
          sortQuery[sortBy as string] = sortOrder === 'desc' ? -1 : 1;
        }
      }

      const products = await Product.find(searchQuery).sort(sortQuery);

      if (!products || products.length === 0) {
        result.error = true;
        result.message = "No products found matching your criteria";
        result.code = 404;
        return result;
      }

      result.error = false;
      result.message = "Products retrieved successfully";
      result.data = products;
      return result;
    } catch (error) {
      next(error);
    }
  }

  /**
   * @name filterAndSortProducts
   * @param req - The request object
   * @param res - The response object
   * @param next - The next middleware function
   * @returns { Promise<IResult> } - see IResult
   */
  public async filterAndSortProducts(req: Request, res: Response, next: NextFunction): Promise<IResult> {
    const result: IResult = { error: false, message: "", code: 200, data: {} };
    const { category, minPrice, maxPrice, sortBy, sortOrder } = req.query;

    try {
      let filterQuery: any = {};

      // Build the filter query based on filters
      if (category) {
        filterQuery.category = category;
      }

      if (minPrice || maxPrice) {
        filterQuery.price = {};
        if (minPrice) {
          filterQuery.price.$gte = parseFloat(minPrice as string);
        }
        if (maxPrice) {
          filterQuery.price.$lte = parseFloat(maxPrice as string);
        }
      }

      // Apply sorting if required
      let sortQuery: any = {};
      if (sortBy) {
        const validSortFields = ['price', 'rating', 'popularity'];
        if (validSortFields.includes(sortBy as string)) {
          sortQuery[sortBy as string] = sortOrder === 'desc' ? -1 : 1;
        }
      }

      const filteredAndSortedProducts = await Product.find(filterQuery).sort(sortQuery);

      if (!filteredAndSortedProducts || filteredAndSortedProducts.length === 0) {
        result.error = true;
        result.message = "No products found based on your filters";
        result.code = 404;
        return result;
      }

      result.error = false;
      result.message = "Filtered and sorted products retrieved successfully";
      result.data = filteredAndSortedProducts;
      return result;
    } catch (error) {
      next(error);
    }
  }
}

export default new SearchService();
