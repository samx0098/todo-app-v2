import { Injectable, HttpStatus } from '@nestjs/common';
import { Response } from 'express';
import { serialize } from './serialize';

@Injectable()
export class ResponseHandlerService {
  async handleResponse(
    res: Response,
    {
      status = HttpStatus.OK, // Default status 200
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
}
