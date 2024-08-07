import { ProductModel } from "../models/product.model.js";
import { CustomError } from "./errors/custom-error.js";
import { EErrors } from "./errors/enum.js";
import { getErrorInfo } from "./errors/info.js";
import configObject from "../config/config.js";

const { server } = configObject;

class ProductService {
    async deleteProduct(pid) {
        try {
            const deletedProduct = await ProductModel.findByIdAndDelete(pid);

            if(!deletedProduct){
                throw CustomError.createError({
                    name: "Producto no encontrado",
                    source: getErrorInfo({title: "unkown", _id: pid}, 3),
                    message: "Error al eliminar un producto",
                    code: EErrors.NOT_FOUND
                });
            }

            return deletedProduct;
        } catch (error) {
            throw error;
        }
    }

    async updateProduct(pid, newProduct) {
        try {
            const productUpdate = await ProductModel.findByIdAndUpdate(pid, newProduct);

            if(!productUpdate){
                throw CustomError.createError({
                    name: "Producto no encontrado",
                    source: getErrorInfo({title: newProduct.title, _id: pid}, 3),
                    message: "Error al actualizar un producto",
                    code: EErrors.NOT_FOUND
                });
            }

            return productUpdate;
        } catch (error) {
            throw error;
        }
    }

    async getProducts({limit = 10, page = 1, sort, query} = {}) {
        try {
            const skip = (page -1) * limit;
            
            let queryOptions = {};
            let prevLink, nextLink;

            const sortOptions = {};

            if(sort){
                if(sort === "asc" || sort === "desc"){
                    sortOptions.price = sort === "asc" ? 1 : -1;
                }

                if(query){
                    queryOptions = {category: query};
                    prevLink = `${server}/products?page=${page - 1}&limit=${limit}&sort=${sort}&query=${query}`;
                    nextLink = `${server}/products?page=${page + 1}&limit=${limit}&sort=${sort}&query=${query}`;
                }else{
                    prevLink = `${server}/products?page=${page - 1}&limit=${limit}&sort=${sort}`;
                    nextLink = `${server}/products?page=${page + 1}&limit=${limit}&sort=${sort}`;
                }
            }else{
                if(query){
                    queryOptions = {category: query};
                    prevLink = `${server}/products?page=${page - 1}&limit=${limit}&query=${query}`;
                    nextLink = `${server}/products?page=${page + 1}&limit=${limit}&query=${query}`;
                }else{
                    prevLink = `${server}/products?page=${page - 1}&limit=${limit}`;
                    nextLink = `${server}/products?page=${page + 1}&limit=${limit}`;
                }
            }

            const products = await ProductModel.find(queryOptions).sort(sortOptions).skip(skip).limit(limit);

            if(!products){
                throw CustomError.createError({
                    name: "No se pudieron obtener productos",
                    source: getErrorInfo({}, 5),
                    message: "Error al obtener los producto",
                    code: EErrors.DB_ERROR
                });
            }

            const totalProducts = await ProductModel.countDocuments(queryOptions);

            const totalPages = Math.ceil(totalProducts / limit);
            const hasPrevPage = page > 1;
            const hasNextPage = page < totalPages;

            return {
                docs: products,
                totalPages,
                prevPage: hasPrevPage ? page - 1 : null,
                page,
                hasPrevPage,
                hasNextPage,
                prevPage: hasPrevPage ? prevLink : null,
                nextPage: hasNextPage ? nextLink : null
            };
        } catch (error) {
            throw error;
        }
    }

    async addProduct({title, description, category, price, thumbnail, code, stock, owner}) {
        try {
            let status = true;

            if(stock < 1) status = false;

            if(!title || !description || !category || !price || !code){
                throw CustomError.createError({
                    name: "Todos los campos son requeridos",
                    source: getErrorInfo({title, description, category, price, code}, 2),
                    message: "Error al crear un producto",
                    code: EErrors.MISSING_FIELDS
                });
            }

            const validateCode = await ProductModel.findOne({code});

            if(validateCode){
                throw CustomError.createError({
                    name: "Codigo ya utilizado",
                    source: getErrorInfo({code}, 4),
                    message: "Error al crear un producto",
                    code: EErrors.INVALID_CODE
                });
            }

            let newProduct = new ProductModel ({
                title,
                description,
                category,
                price,
                thumbnail: thumbnail || [],
                code,
                stock,
                status,
                owner
            });

            await newProduct.save();
            
            return newProduct;
        } catch (error) {
            throw error;
        }
    }

    async getProductById(pid) {
        try {
            const product = await ProductModel.findById(pid);

            if(product) return product
            else{
                throw CustomError.createError({
                    name: "Producto no encontrado",
                    source: getErrorInfo({title: "", _id: pid}, 3),
                    message: "Producto no encontrado",
                    code: EErrors.NOT_FOUND
                });
            }
        } catch (error) {
            throw error;
        }
    }

    async getProductsByOwner(owner) {
        try {
            const products = await ProductModel.find({owner});
            return products;
        } catch (error) {
            next(error);
        }
    }
}

export default ProductService;