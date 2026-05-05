import type { Request, Response, NextFunction } from 'express';
import { z } from 'zod';

export const zodValidate = (schema: z.ZodTypeAny) => {
    return async (req: Request, res: Response, next: NextFunction) => {
        try {
            const raw = req.body;
            const requestBody =
                raw == null || raw === ''
                    ? {}
                    : Buffer.isBuffer(raw)
                        ? JSON.parse(raw.toString('utf8'))
                        : typeof raw === 'string'
                            ? JSON.parse(raw)
                            : typeof raw === 'object'
                                ? raw
                                : {};
            const result = await schema.safeParseAsync(requestBody);
            if (!result.success) {
                return res.status(400).json({
                    success: false,
                    errors: result.error.message
                });
            }

            req.body = result.data;
            next();
        } catch (error) {
            console.log(error)
            return res.status(500).json({ success: false, message: "Internal Server Error" });
        }

    }
}