import type { Request, Response } from 'express';
import DBPrismaService from '../services/dbServices.js'

class ProductController {

    public async createProduct(req: Request, res: Response) {
        try {
            const product = req.body
            await DBPrismaService.insertProduct(product)
            return res.status(201).json({ ok: true })
        } catch (error) {
            return res.status(500).json({
                success: false,
                message: "Internal Server Error"
            });
        }
    }

    public async getProducts(req: Request, res: Response) {
        try {

            const products = await DBPrismaService.getProducts();

            return res.status(200).json({ products: products });
        } catch (error) {
            console.log(error)
            return res.status(500).json({
                success: false,
                message: "Internal Server Error"
            });
        }
    }

    public async checkStok(req: Request, res: Response) {
        try {
            const { ids } = req.query
            if (!ids || typeof ids !== 'string') {
                return res.status(400).json({ message: 'product id is required' })
            }
            const idArray = ids.split(',').map((id) => parseInt(id))
            const products = await DBPrismaService.getSpecificProducts(idArray);
            return res.status(200).json({ products: products });

        } catch (error) {
            console.log(error)
            return res.status(500).json({
                success: false,
                message: "Internal Server Error"
            });
        }
    }

    public async getProduct(req: Request, res: Response) {
        try {
            const { id } = req.params
            const product = await DBPrismaService.getProduct(Number(id))
            return res.status(200).json({ product: product });
        } catch (error) {
            console.log(error)
            return res.status(500).json({
                success: false,
                message: "Internal Server Error"
            })
        }
    }

    public async manageInventory(req: Request, res: Response) {
        try {
            const { items } = req.body
            const transactionIds =  await DBPrismaService.manageInventory(items)
            if(transactionIds){
                return res.status(200).json({ data: transactionIds })
            }
            return res.status(200).json({ ok: true })
        } catch (error) {
            console.log(error)
            return res.status(500).json({
                success: false,
                message: "Internal Server Error"
            })
        }
    }

}

export default new ProductController();