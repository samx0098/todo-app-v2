import { HttpStatus, Injectable } from "@nestjs/common"
import { Response } from "express"
import { serialize } from "./serialize"

@Injectable()
export class ResponseHandlerService {
    async handleResponse(
        res: Response,
        {
            status = HttpStatus.OK,
            results = undefined,
            message = undefined,
            error = undefined,
            stack = undefined,
            headers = undefined,
            revalidate = undefined,
            token = undefined,
            pagination = undefined,
        }: {
            status?: number
            results?: Record<string, any> | Record<string, any>[]
            message?: string
            error?: string
            stack?: string
            headers?: Record<string, string>
            revalidate?: number
            token?: string
            pagination?: Record<string, any>
        },
    ) {
        // Define cache control headers
        const cacheControl = `public, max-age=${revalidate ?? 0}, stale-while-revalidate=${revalidate ?? 0}`
        res.setHeader("Cache-Control", cacheControl)

        // Set optional headers
        if (headers) {
            Object.keys(headers).forEach((key) => {
                res.setHeader(key, headers[key])
            })
        }

        // Send the JSON response
        return res.status(status).json({
            status,
            ...(results ? { results: serialize(results) } : {}),
            ...(message ? { message } : {}),
            ...(error ? { error } : {}),
            ...(stack ? { stack } : {}),
            ...(token ? { token } : {}),
            ...(pagination ? { pagination } : {}),
        })
    }

    // Wrapper method
    async wrap(
        res: Response,
        handler: () => Promise<Record<string, any> | Array<any> | null>,
        options: {
            errorStatus?: number
            successStatus?: number
            successMessage?: string
            errorMessage?: string
            revalidate?: number
            pagination?: {
                currentPage: number
                pageSize: number
            }
        } = {},
    ) {
        const {
            errorStatus = HttpStatus.INTERNAL_SERVER_ERROR,
            successStatus = HttpStatus.OK,
            successMessage,
            errorMessage = "An error occurred",
            revalidate,
            pagination: paginationOptions,
        } = options

        try {
            let results = await handler()
            let pagination = undefined
            let token = undefined

            // Check for token in results
            if (results && typeof results === "object" && "token" in results) {
                token = results.token
                results = null // Remove token from results
            }

            // Pagination logic
            if (paginationOptions && results && "items" in results && "totalCount" in results) {
                const { items, totalCount } = results as { items: any[]; totalCount: number }
                pagination = {
                    currentPage: paginationOptions.currentPage,
                    pageSize: paginationOptions.pageSize,
                    totalCount,
                    totalPages: Math.ceil(totalCount / paginationOptions.pageSize),
                    hasNextPage:
                        paginationOptions.currentPage <
                        Math.ceil(totalCount / paginationOptions.pageSize),
                    hasPrevPage: paginationOptions.currentPage > 1,
                }
                results = items // Simplify `results` to only include items
            }

            // Response options
            const responseOptions: Parameters<typeof this.handleResponse>["1"] = {
                status: successStatus,
                ...(results ? { results } : {}),
                ...(successMessage ? { message: successMessage } : {}),
                ...(revalidate ? { revalidate } : {}),
                ...(pagination ? { pagination } : {}),
                ...(token ? { token } : {}),
            }

            return this.handleResponse(res, responseOptions)
        } catch (error) {
            return this.handleResponse(res, {
                status: errorStatus,
                message: errorMessage,
                error: error instanceof Error ? error.message : "Unknown error",
                stack: error instanceof Error ? error.stack : undefined,
            })
        }
    }
}
