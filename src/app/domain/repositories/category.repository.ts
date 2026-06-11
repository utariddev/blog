import { Observable } from 'rxjs';
import { Category } from '../models/category.model';

/**
 * This abstract class acts as a contract for fetching categories.
 * By depending on this contract instead of a concrete implementation,
 * the rest of the application remains agnostic to the data source (API, Local Storage, etc.).
 * (SOLID - Dependency Inversion Principle)
 */
export abstract class CategoryRepository {
  abstract getCategories(): Observable<Category[]>;
}
