import * as z from 'zod';

export const categorySchema = z.object({

    name: z.string()
        .trim()
        .min(3, "Category name must be more than or equal to 3 characters")
        .max(50, "Category name must be less than or equal to 50 characters"),

    description: z.string()
        .trim()
        .optional()

});

export default categorySchema;