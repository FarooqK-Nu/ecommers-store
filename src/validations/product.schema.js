import * as z from 'zod';

export const productSchema = z.object({
    name: z.string()
        .trim()
        .min(3, "Product name must be at least 3 characters")
        .max(120, "Product name must be less than or equal to 120 characters"),

    description: z.string()
        .trim()
        .min(1, "Product must have a description"),

    price: z.number()
        .min(0, "Price must be greater than or equal to 0"),

    discount: z.number()
        .min(0, "Discount cannot be negative")
        .default(0),
    // .refine((value, { parent }) => value < parent.price, {
    //     message: "Discount must be less than the product price",
    //     path: ["discount"]
    // }),

    category: z.string().regex(/^[0-9a-fA-F]{24}$/, "Invalid category id"),

    brand: z.string()
        .trim()
        .min(1, "Product must have a Brand"),

    images: z.array(z.string()).default([]),

    ratings: z.number()
        .min(0, "Rating must be greater than or equal to 0")
        .max(5, "Rating must be less than or equal to 5")
        .transform(val => Math.round(val * 10) / 10)
        .default(0),

    reviews: z.number()
        .default(0),


    stockQuantity: z.number()
        .min(0, "Stock quantity must be greater than or equal to 0")
        .default(0),

    variants: z.object({
        sizes: z.array(
            z.enum(['S', 'M', 'L', 'XL', 'XXL'])
        )
            .optional(),
        colors: z.array(
            z.string()
        ).optional(),
        storage: z.array(
            z.enum(['64GB', '128GB', '256GB', '512GB', '1TB'])
        )
            .optional()
    }).optional(),

}).superRefine((data, ctx) => {

    if (data.discount >= data.price) {

        ctx.addIssue({
            code: z.ZodIssueCode.custom,
            path: ['discount'],
            message: 'Discount must be less than the product price'
        });

    }

});

export default productSchema;