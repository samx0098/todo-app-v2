import { HttpStatus, Injectable } from '@nestjs/common';
import { Response } from 'express';
import { serialize } from './serialize';

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
    }: {
      status?: number;
      results?: Record<string, any> | Record<string, any>[];
      message?: string;
      error?: string;
      stack?: string;
      headers?: Record<string, string>;
      revalidate?: number;
    },
  ) {
    // Define cache control headers
    const cacheControl = `public, max-age=${revalidate ?? 0}, stale-while-revalidate=${revalidate ?? 0}`;

    // Set optional headers on the response
    if (headers) {
      Object.keys(headers).forEach((key) => {
        res.setHeader(key, headers[key]);
      });
    }

    // Set cache control header
    res.setHeader('Cache-Control', cacheControl);

    // Send the JSON response
    return res.status(status).json({
      status,
      ...(results ? { results: serialize(results) } : {}),
      ...(message ? { message } : {}),
      ...(error ? { error } : {}),
      ...(stack ? { stack } : {}),
    });
  }

  //wrapper method
  async wrap(
    res: Response,
    handler: () => Promise<Record<string, any> | Array<any> | null>,
    options: {
      errorStatus?: number;
      successStatus?: number;
      successMessage?: string;
      errorMessage?: string;
      revalidate?: number;
      pagination?: {
        currentPage: number;
        pageSize: number;
      };
    } = {},
  ) {
    const {
      errorStatus,
      successStatus = HttpStatus.OK,
      successMessage,
      errorMessage = 'An error occurred',
      revalidate,
      pagination: paginationOptions,
    } = options;
    try {
      const results = await handler();
      let pagination = undefined;

      const { items, totalCount } = results as {
        items: Array<any>;
        totalCount: number;
      };

      const isArray = items && Array.isArray(items);
      if (isArray) {
        const { currentPage, pageSize } = paginationOptions;
        const totalPages = Math.ceil(totalCount / pageSize);

        pagination = {
          currentPage,
          totalPages,
          totalCount,
          hasNextPage: currentPage < totalPages,
          hasPrevPage: currentPage > 1,
        };
      }

      return this.handleResponse(res, {
        status: successStatus,
        results: {
          ...(items ? { items } : { ...results }),
          pagination,
        },
        message: successMessage,
        revalidate,
      });
    } catch (error) {
      return this.handleResponse(res, {
        status: errorStatus || HttpStatus.INTERNAL_SERVER_ERROR,
        error: errorMessage,
        message: (error as Error).message,
        stack: (error as Error).stack,
      });
    }
  }
}
